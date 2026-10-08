# frozen_string_literal: true

require 'webrick'
require 'json'
require 'yaml'
require 'net/http'
require 'fileutils'
require 'open3'
require 'securerandom'
require 'cgi'
require 'base64'

# Local-only HTTP server backing the drafting studio. Serves the SPA from
# _studio/public and a JSON API that reads/writes _drafts, _posts and images/
# inside the site repo. Binds to 127.0.0.1 only; there is no auth by design.
module DraftStudio
  class Server
    KINDS = { 'drafts' => '_drafts', 'posts' => '_posts' }.freeze
    KNOWN_FIELDS = %w[title tags layout date description permalink].freeze
    NAME_RE = /\A[a-z0-9][a-z0-9._-]*\z/i
    MAX_IMAGE_BYTES = 25 * 1024 * 1024

    MIME = {
      '.html' => 'text/html; charset=utf-8',
      '.css' => 'text/css; charset=utf-8',
      '.js' => 'text/javascript; charset=utf-8',
      '.mjs' => 'text/javascript; charset=utf-8',
      '.json' => 'application/json',
      '.svg' => 'image/svg+xml',
      '.png' => 'image/png',
      '.jpg' => 'image/jpeg',
      '.jpeg' => 'image/jpeg',
      '.gif' => 'image/gif',
      '.webp' => 'image/webp',
      '.woff' => 'font/woff',
      '.woff2' => 'font/woff2',
      '.ttf' => 'font/ttf',
      '.map' => 'application/json',
      '.ico' => 'image/x-icon',
    }.freeze

    attr_reader :root, :port, :jekyll_port

    def initialize(root:, port:, jekyll_port:)
      @root = File.expand_path(root)
      @port = port
      @jekyll_port = jekyll_port
      @public_dir = File.join(@root, '_studio', 'public')
      @git_mutex = Mutex.new
      @server = nil
    end

    def start
      @server = WEBrick::HTTPServer.new(
        Port: @port,
        BindAddress: '127.0.0.1',
        Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
        AccessLog: [],
        DoNotReverseLookup: true
      )
      @server.mount('/', Servlet, self)
      @server.start
    end

    def shutdown
      @server&.shutdown
    end

    # ------------------------------------------------------------------
    # Routing

    def route(req, res)
      path = req.path.sub(%r{/+\z}, '')
      case path
      when '/api/state' then json(res, state_payload)
      when '/api/posts' then json(res, posts_payload)
      when '/api/post'
        if req.request_method == 'DELETE'
          json(res, delete_post(req))
        else
          json(res, read_post(req))
        end
      when '/api/preview' then json(res, preview_status(req))
      when %r{\A/api/(save|create|publish|image|git/\w+|pr)\z}
        method_not_allowed(res) unless req.request_method == 'POST'
        json(res, send(:"handle_#{Regexp.last_match(1).tr('/', '_')}", body_json(req)))
      else
        return method_not_allowed(res) if path.start_with?('/api/')
        serve_static(req, res)
      end
    rescue ApiError => e
      json(res, { error: e.message }, e.status)
    rescue StandardError => e
      warn "draft-studio: #{e.class}: #{e.message}\n  #{e.backtrace&.first(3)&.join("\n  ")}"
      json(res, { error: "#{e.class}: #{e.message}" }, 500)
    end

    class ApiError < StandardError
      attr_reader :status

      def initialize(message, status = 400)
        super(message)
        @status = status
      end
    end

    class Servlet < WEBrick::HTTPServlet::AbstractServlet
      def initialize(server, studio)
        super(server)
        @studio = studio
      end

      def do_GET(req, res)
        @studio.route(req, res)
      end

      def do_POST(req, res)
        @studio.route(req, res)
      end

      def do_DELETE(req, res)
        @studio.route(req, res)
      end
    end

    private

    def body_json(req)
      raw = req.body.to_s
      return {} if raw.strip.empty?
      JSON.parse(raw)
    rescue JSON::ParserError
      raise ApiError, 'invalid JSON body'
    end

    def json(res, payload, status = 200)
      res.status = status
      res['Content-Type'] = 'application/json; charset=utf-8'
      res['Cache-Control'] = 'no-store'
      res.body = JSON.generate(payload)
    end

    def method_not_allowed(res)
      json(res, { error: 'method not allowed' }, 405)
    end

    # ------------------------------------------------------------------
    # Static files

    def serve_static(req, res)
      rel = CGI.unescape(req.path)
      raise ApiError.new('not found', 404) if rel.split('/').include?('..')
      rel = 'index.html' if rel == '/' || rel.empty?
      # Post images live in the repo; serving them here too lets the WYSIWYG
      # editor resolve the same relative URLs.
      file = find_under(@public_dir, rel)
      file ||= find_under(@root, rel) if rel.start_with?('images/')
      if file
        res['Content-Type'] = MIME[File.extname(file).downcase] || 'application/octet-stream'
        res['Cache-Control'] = 'no-store'
        res.body = File.binread(file)
      elsif %w[GET HEAD].include?(req.request_method)
        # Site pages and theme assets are proxied from jekyll so the preview
        # iframe is same-origin (needed for scripted scroll sync).
        proxy_to_jekyll(req, res)
      else
        raise ApiError.new('not found', 404)
      end
    end

    def find_under(base, rel)
      full = File.expand_path(rel.delete_prefix('/'), base)
      return nil unless File.file?(full) && full.start_with?(base + File::SEPARATOR)
      full
    end

    def proxy_to_jekyll(req, res)
      uri = URI("http://127.0.0.1:#{@jekyll_port}#{req.path}")
      uri.query = req.query_string unless req.query_string.to_s.empty?
      r = Net::HTTP.start(uri.host, uri.port, open_timeout: 2, read_timeout: 15) do |http|
        http.get(uri.request_uri, { 'Accept-Encoding' => 'identity' })
      end
      res.status = r.code.to_i
      res['Content-Type'] = r['Content-Type'] || 'text/html; charset=utf-8'
      res['Cache-Control'] = 'no-store'
      res.body = r.body.to_s
    rescue StandardError
      res.status = 502
      res['Content-Type'] = 'text/html; charset=utf-8'
      res.body = <<~HTML
        <!doctype html><html><body style="font-family: ui-monospace, monospace; padding: 3rem; color: #666">
        <h2>jekyll serve isn't responding</h2>
        <p>It starts automatically with <code>bin/draft</code> and can take a few seconds — then hit Retry in the toolbar.</p>
        </body></html>
      HTML
    end

    # ------------------------------------------------------------------
    # API payloads

    def state_payload
      {
        root: @root,
        site_title: site_title,
        jekyll_port: @jekyll_port,
        jekyll: jekyll_up? ? 'up' : 'down',
        branch: git(%w[rev-parse --abbrev-ref HEAD])[:out]&.strip,
        dirty: dirty_files,
        gh_available: command_available?('gh'),
      }
    end

    def site_title
      cfg = File.join(@root, '_config.yml')
      return nil unless File.file?(cfg)
      (YAML.safe_load(File.read(cfg)) || {})['title']
    rescue StandardError
      nil
    end

    def posts_payload
      drafts = dir_posts('_drafts').sort_by { |p| [p[:mtime] ? -p[:mtime].to_i : 0, p[:name]] }
      published = dir_posts('_posts').sort_by { |p| [p[:date].to_s, p[:name]] }.reverse
      { drafts: drafts, posts: published }
    end

    def dir_posts(dir)
      abs = File.join(@root, dir)
      return [] unless Dir.exist?(abs)
      Dir.children(abs).sort.filter_map do |name|
        next unless name.match?(/\.(md|markdown)\z/)
        parse_post(File.join(abs, name)).merge(dir: dir.delete_prefix('_'), name: name)
      end
    end

    # Returns {title, date, tags, description, permalink, layout, extra, body, mtime}
    def parse_post(path)
      text = File.read(path)
      m = text.match(/\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|\z)/m)
      data = {}
      body = text
      if m
        data = YAML.safe_load(m[1], permitted_classes: [Date, Time], aliases: true) || {}
        raise ApiError, "frontmatter of #{File.basename(path)} is not a mapping" unless data.is_a?(Hash)
        body = text[m.end(0)..].to_s
      end
      data = normalize_data(data)
      {
        title: data['title'],
        date: data['date'],
        tags: data['tags'],
        description: data['description'],
        permalink: data['permalink'],
        layout: data['layout'],
        extra: data['extra'],
        body: body,
        mtime: File.mtime(path),
      }
    end

    def normalize_data(data)
      {
        'title' => data['title'].to_s,
        'date' => data['date'].respond_to?(:strftime) ? data['date'].strftime('%Y-%m-%d') : data['date'].to_s,
        'tags' => Array(data['tags']).flat_map { |t| t.to_s.split(/\s+/) }.reject(&:empty?),
        'description' => data['description'].to_s,
        'permalink' => data['permalink'].to_s,
        'layout' => data['layout'].to_s,
        'extra' => data.reject { |k, _| KNOWN_FIELDS.include?(k.to_s) },
      }
    end

    def resolve_post(token, must_exist: true)
      kind, name = token.split('/', 2)
      dir = KINDS[kind]
      raise ApiError, 'path must be "drafts/<name>" or "posts/<name>"' unless dir && name
      raise ApiError, 'invalid file name' unless name.match?(NAME_RE)
      abs = File.join(@root, dir, name)
      raise ApiError.new('not found', 404) if must_exist && !File.file?(abs)
      [abs, kind, name]
    end

    # WEBrick parses the query string for GET but not for other verbs.
    def query_param(req, key)
      return req.query[key] if req.query.is_a?(Hash) && req.query[key]
      CGI.parse(req.request_uri.query.to_s)[key]&.first
    end

    def read_post(req)
      abs, kind, name = resolve_post(query_param(req, 'path').to_s)
      parsed = parse_post(abs)
      parsed.merge(dir: kind, name: name, path: "#{kind}/#{name}")
    end

    def delete_post(req)
      abs, _kind, name = resolve_post(query_param(req, 'path').to_s)
      raise ApiError, 'only drafts can be deleted here — use git to revert published posts' unless abs.start_with?(File.join(@root, '_drafts') + File::SEPARATOR)
      File.delete(abs)
      { ok: true, deleted: "drafts/#{name}" }
    end

    def handle_save(params)
      token = params['path'].to_s
      raise ApiError, 'missing path' if token.empty?
      abs, kind, name = resolve_post(token, must_exist: params['create'] != true)
      if params['create'] == true
        raise ApiError.new("already exists: #{token}", 409) if File.exist?(abs)
      end

      form = params['fields'].is_a?(Hash) ? params['fields'] : {}
      existing = File.exist?(abs) ? parse_post(abs) : nil
      merged = build_merged_fields(existing, form)
      content = build_frontmatter(merged) + params['body'].to_s
      File.write(abs, content)
      { ok: true, path: "#{kind}/#{name}", bytes: content.bytesize }
    end

    # Known fields come from the form; any pre-existing non-standard
    # frontmatter keys are carried through untouched.
    def build_merged_fields(existing, form)
      extras = (existing && existing['extra']) || {}
      merged = {}
      KNOWN_FIELDS.each do |k|
        next unless form.key?(k)
        v = form[k]
        v = v.to_s if %w[title date description permalink layout].include?(k)
        merged[k] = v
      end
      extras.each { |k, v| merged[k] = v }
      merged['layout'] = 'post' if merged['layout'].to_s.empty?
      merged
    end

    def build_frontmatter(fields)
      lines = []
      KNOWN_FIELDS.each do |k|
        v = fields[k]
        next if v.nil? || (v.respond_to?(:empty?) && v.empty?)
        lines << if k == 'tags'
                   "tags: [#{Array(v).map { |t| yaml_scalar(t.to_s) }.join(', ')}]"
                 elsif k == 'date' && v.to_s.match?(/\A\d{4}-\d{2}-\d{2}\z/)
                   "date: #{v}"
                 else
                   "#{k}: #{yaml_scalar(v.to_s)}"
                 end
      end
      (fields.keys - KNOWN_FIELDS).sort.each do |k|
        v = fields[k]
        lines << case v
                 when Array then "#{k}: [#{v.map { |t| yaml_scalar(t.to_s) }.join(', ')}]"
                 when Hash then "#{k}: #{YAML.dump(v).sub(/\A---\s*/, '').strip}"
                 else "#{k}: #{yaml_scalar(v.to_s)}"
                 end
      end
      "---\n#{lines.join("\n")}\n---\n\n"
    end

    def yaml_scalar(s)
      return '""' if s.empty?
      return %("#{s.gsub('\\', '\\\\\\\\').gsub('"', '\\"').gsub("\n", '\\n')}") if s.include?("\n")
      YAML.dump(s).sub(/\A---\s*/, '').strip
    end

    def handle_create(params)
      title = params['title'].to_s.strip
      raise ApiError, 'title is required' if title.empty?
      slug = params['slug'].to_s.strip
      slug = slugify(title) if slug.empty?
      raise ApiError, "invalid slug: #{slug}" unless slug.match?(NAME_RE)
      name = "#{slug}.md"
      date = params['date'].to_s.strip
      date = Time.now.strftime('%Y-%m-%d') unless date.match?(/\A\d{4}-\d{2}-\d{2}\z/)
      draft = File.join(@root, '_drafts', name)
      FileUtils.mkdir_p(File.dirname(draft))
      published = Dir.children(File.join(@root, '_posts')).any? { |f| f.match?(/\A\d{4}-\d{2}-\d{2}-#{Regexp.escape(slug)}\.(md|markdown)\z/) } if Dir.exist?(File.join(@root, '_posts'))
      raise ApiError.new("a post with slug #{slug} already exists", 409) if published
      if File.exist?(draft) && params['overwrite'] != true
        raise ApiError.new("draft already exists: #{name}", 409)
      end

      permalink = params['permalink'].to_s.strip
      fields = {
        'title' => title,
        'tags' => Array(params['tags']).map(&:to_s).reject(&:empty?),
        'layout' => 'post',
        'date' => date,
        'description' => params['description'].to_s,
        'permalink' => permalink.empty? ? slug : permalink,
      }
      File.write(draft, build_frontmatter(fields) + params['body'].to_s)
      { ok: true, path: "drafts/#{name}" }
    end

    def handle_publish(params)
      abs, _kind, name = resolve_post(params['path'].to_s)
      raise ApiError.new('only drafts can be published', 400) unless abs.start_with?(File.join(@root, '_drafts') + File::SEPARATOR)
      parsed = parse_post(abs)
      date = parsed[:date].to_s.match?(/\A\d{4}-\d{2}-\d{2}\z/) ? parsed[:date] : Time.now.strftime('%Y-%m-%d')
      target = File.join(@root, '_posts', "#{date}-#{name}")
      raise ApiError.new("target exists: _posts/#{date}-#{name}", 409) if File.exist?(target)
      FileUtils.mv(abs, target)
      { ok: true, path: "posts/#{date}-#{name}", previous: params['path'] }
    end

    def handle_image(params)
      name = File.basename(params['name'].to_s)
      raise ApiError, 'missing image name' if name.empty?
      date = params['date'].to_s.match?(/\A\d{4}-\d{2}-\d{2}\z/) ? params['date'] : Time.now.strftime('%Y-%m-%d')
      safe = name.gsub(/[^A-Za-z0-9._-]/, '_')
      dir = File.join(@root, 'images', date)
      FileUtils.mkdir_p(dir)
      target = File.join(dir, safe)
      if File.exist?(target)
        ext = File.extname(safe)
        base = File.basename(safe, '.*')
        n = 1
        n += 1 while File.exist?(File.join(dir, "#{base}-#{n}#{ext}"))
        target = File.join(dir, "#{base}-#{n}#{ext}")
        safe = "#{base}-#{n}#{ext}"
      end
      data = params['data'].to_s
      raise ApiError, 'missing image data' if data.empty?
      raw = Base64.strict_decode64(data)
      raise ApiError.new("image too large (>#{MAX_IMAGE_BYTES / (1024 * 1024)}MB)", 413) if raw.bytesize > MAX_IMAGE_BYTES
      File.binwrite(target, raw)
      { ok: true, url: "images/#{date}/#{safe}", bytes: raw.bytesize }
    rescue ArgumentError
      raise ApiError, 'image data is not valid base64'
    end

    def preview_status(req)
      path = query_param(req, 'path').to_s
      path = '/' if path.empty?
      uri = URI("http://127.0.0.1:#{@jekyll_port}#{path}")
      res = Net::HTTP.start(uri.host, uri.port, open_timeout: 1.2, read_timeout: 3) { |http| http.get(uri.request_uri) }
      { status: res.code.to_i }
    rescue Errno::ECONNREFUSED, Net::OpenTimeout, SocketError, IOError, Timeout::Error, Errno::EHOSTUNREACH
      { status: 'down' }
    end

    # ------------------------------------------------------------------
    # Git operations

    def dirty_files
      out = git(%w[status --porcelain])[:out].to_s
      out.split("\n").map(&:strip).reject(&:empty?)
    end

    def git(args)
      @git_mutex.synchronize do
        out, err, st = Open3.capture3('git', *args, chdir: @root)
        { ok: st.success?, out: out, err: err, status: st.exitstatus }
      end
    end

    def gh(args)
      @git_mutex.synchronize do
        out, err, st = Open3.capture3('gh', *args, chdir: @root)
        { ok: st.success?, out: out, err: err, status: st.exitstatus }
      end
    end

    def command_available?(cmd)
      system(cmd, '--version', out: File::NULL, err: File::NULL)
    end

    def handle_git_status(_params)
      branch = git(%w[rev-parse --abbrev-ref HEAD])
      raise ApiError, "git: #{branch[:err]}" unless branch[:ok]
      { ok: true, branch: branch[:out].strip, dirty: dirty_files }
    end

    def handle_git_stage(params)
      paths = Array(params['paths'])
      raise ApiError, 'no paths to stage' if paths.empty?
      paths.each do |p|
        abs = File.expand_path(p, @root)
        raise ApiError, "refusing to stage outside repo: #{p}" unless abs.start_with?(@root + File::SEPARATOR)
      end
      r = git(['add', '--', *paths])
      r[:ok] ? { ok: true } : raise(ApiError, "git add failed: #{r[:err]}#{r[:out]}")
    end

    def handle_git_commit(params)
      msg = params['message'].to_s.strip
      raise ApiError, 'commit message is required' if msg.empty?
      r = git(['commit', '-m', msg])
      r[:ok] ? { ok: true, out: r[:out] } : raise(ApiError, "git commit failed: #{r[:err]}#{r[:out]}")
    end

    def handle_git_branch(params)
      name = params['name'].to_s.strip
      raise ApiError, 'branch name is required' if name.empty?
      create = params['create'] != false
      args = create ? %w[checkout -b] + [name] : %w[checkout] + [name]
      r = git(args)
      r[:ok] ? { ok: true, branch: name } : raise(ApiError, "git checkout failed: #{r[:err]}#{r[:out]}")
    end

    def handle_git_push(params)
      name = params['name'].to_s.strip
      raise ApiError, 'branch name is required' if name.empty?
      r = git(['push', '-u', 'origin', name])
      r[:ok] ? { ok: true, out: r[:out] } : raise(ApiError, "git push failed: #{r[:err]}#{r[:out]}")
    end

    def handle_pr(params)
      branch = git(%w[rev-parse --abbrev-ref HEAD])[:out].to_s.strip
      raise ApiError, 'cannot open a PR from main — create a branch first' if branch.empty? || branch == 'main'
      title = params['title'].to_s.strip
      raise ApiError, 'PR title is required' if title.empty?
      r = gh(['pr', 'create', '--title', title, '--body', params['body'].to_s, '--base', 'main', '--head', branch])
      r[:ok] ? { ok: true, out: r[:out] } : raise(ApiError, "gh pr create failed: #{r[:err]}#{r[:out]}")
    end

    def jekyll_up?
      Net::HTTP.start('127.0.0.1', @jekyll_port, open_timeout: 0.5, read_timeout: 1) do |http|
        http.get('/').is_a?(Net::HTTPSuccess)
      end
      true
    rescue StandardError
      false
    end

    def slugify(title)
      title.downcase.gsub(/[^a-z0-9]+/, '-').gsub(/\A-+|-+\z/, '').squeeze('-')
    end
  end
end
