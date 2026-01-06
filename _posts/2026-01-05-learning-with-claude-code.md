---
title: "Learning with Claude Code"
categories: learning, programming
layout: post
date: 2026-01-05
description: "Learning how to program in Flutter using Claude Code"
permalink: learning-with-claude-code
---

After I decided to get a Claude Pro subscription late last year, I have been using Claude Code to work on some personal projects that I had been putting off for a while. The main one is a personal knowledge system; I'm trying to build something that lets me centralise all my information in one place so that I don't need to check many separate apps for info.

But that also means I'll need to rebuild the little apps I've been relying on for the past decade: my budgeting app and todo app, among others. Before Claude Code, these felt like major projects that would take up most of my leisure time. Now, they’re a few vibecoding prompts away.

But, as a Computing teacher, I’m not fully comfortable *vibecoding* apps that I expect to be using for the next decade. I know too much about the things that can go wrong. If the early vibecoders are already posting on Twitter/𝕏 about how they got their API keys stolen, how their database information got leaked, how they got their entire project directory deleted in vibecoding mode, I don’t think I’m ready to let these tools run on their own.

So it’s time to learn and build something new with Claude Code.

# Things I already knew

I teach Python and SQL in my day job, although I’m also somewhat familiar with syntax for Java, Javascript, PHP, and other common languages from various encounters. And from previous coding projects, I was already familiar with how project development, especially for a web app, might go:

1. You often write the code in multiple files.
2. You manage the packages you rely on (dependencies) with a package manager.
3. You write the code in an editor, likely a full integrated development environment (IDE).
4. You make code commits to a version control system (VCS). These days it’s git by default, and it serves as a code backup and a restore point if your code breaks.
5. When the code is done you might have a build step that produces the files you need from the code you wrote.
6. You deploy the files that run the actual app to a host.

Previously I would have to wade through multiple tutorials to understand each of these layers. Some tutorials are a buffet of tools, just telling you a bunch of commands to run. Others are beginner 101 tutorials that walk you through the absolute basics and then stop.

But it is 2026 now. You can just ask Claude Code.

# Prerequisites

## Product Requirements Document

Depending on the complexity of the project you are working on, you may need some additional steps before you ask Claude Code to "build the product please". If like me you have specific preferences for technologies, you want to discuss the product with Claude Code first. I wanted mine small-scale, deployed through my preferred platform, using a mix of familiar and new technologies.

When you’re done, it is customary to ask Claude Code to “generate a PRD (product requirements document) with the details we have discussed so far”. Most coding agents have a tendency to forget what you asked them to do after one too many messages, so the PRD serves as their reference point for what they’re supposed to build. When you change your mind on things, remind Claude Code to update this PRD. Don’t be surprised if the PRD you get runs to a few thousand lines.

## Implementation Plan

Each session in Claude Code has a context limit of 200,000 tokens (approx. 150,000 words), and some of this is reserved for system purposes. What you write, and what Claude Code does, goes into this context window. Once you hit somewhere above 80% of your limit, Anthropic compacts your context window, essentially summarising it with a customisable prompt that often loses fine nuance. Claude Code often feels somewhat lobotomised after a compaction, and general advice is to have each session do enough work that it stays under the context limit.

Given this limit of what can be effectively accomplished in each session, you’ll need to break down your huge PRD into work sessions. Practically, you won’t do it; you’ll ask Claude Code to. A PRD of a few thousand lines begins with a simple prompt, but your coding assistant will soon lose its way without a map. So you ask Claude Code to “generate an implementation plan for the PRD”.

## Project Background

I was working on a mobile app to replace my current budgeting app, which I actually love. Unfortunately it is unable to talk to the boutique API I was creating. Fortunately, the app’s interface is simple enough that I believe I can recreate it with Claude Code’s help.

After some discussions with Claude (in the web interface), I got it to generate a PRD, which I copied to a file. Claude Code then generated an implementation plan for me; I specifically asked it not to generate the plan with too much detail; from previous projects I learnt it often needed to adjust things later.

I didn't want to deal with the build process for an Android app yet—I knew it was lengthy and required the Android SDK. So I decided to test it as a webapp. [Flutter](https://flutter.dev/) was a good choice for this: I knew I would be able to write code once, generate a webapp, and later in the build process turn it into an Android app. The webapp would be simpler, have fewer features which I didn't need anyway, and have the advantage of not needing an Android device or simulator for testing.

# Learning Flutter with Claude Code

## Project initialisation

So away with the first prompt:

> how do I get a project initialised?

Claude Code helped me create the project directory, check for the necessary packages, advised me to install from the GitHub source instead of an Arch Linux package. I wanted to know: is this install user-specific or will it install for all users of my laptop? I would greatly prefer a local install:

> is this a local install? would ~/.local be a better install location?

Claude Code unpacked the decisions involved for me and gave its recommendation: install to `~/.local`.

A few more clarifications and requests later, I had it generate an install script, so that whenever I need to update `flutter` I could just run this script instead of having to ask for the commands again.

Then we got to `flutter create`, the setup tool that helps set up the necessary files and directory structure for a new Flutter project. More clarifications with Claude Code on the command syntax, and on dependency management. This saved me untold amounts of Googling, since I expected the documentation would be part of Claude Code’s training data.

It recommended common dependencies for working with SQLite databases, generating universally unique identifiers (UUIDs), and other project parts I knew I would need. Along the way we discussed various options: unique identification string or number for entities (Claude Code recommended UUIDs). I asked CC to update the PRD—done.

I loved being able to discuss project design and tradeoffs with CC while in the middle of implementation. This used to take me out of my coding flow so I could update the requirements before I forgot, which was both disruptive and time-consuming. Today, a coding assistant does it for you in seconds (provided it has the correct context).

**Lesson:** You can clarify things with Claude Code along the way, to understand what you are doing. For things you are already familiar with and don’t need to manually do yourself, ask Claude Code to do them for you.

## Project implementation

Time to stop discussing requirements and actually writing Flutter (which uses Dart syntax). I began with a simple prompt:

> we are continuing with step 5 in learning mode. where do we start?

Claude Code created a todo list for me, and ... started working on its own todo list. I had to stop it and remind:

> remember, we're in learning mode. walk me through the Flutter syntax, then the interface of the class we are creating

## Object-Oriented Programming

It proceeded to unpack and dump six concepts, along with illustrative code: Classes and constructors, Singletons, Asynchronous programming, SQLite and SQL data types, and finally its proposed design for a helper interface. If you’re a programmer, you’d immediately recognise that these are six huge topics and way too much to dump on a beginner; Claude Code is definitely not a trained teacher or a very good one.

Fortunately for it, I was familiar with those topics and did not need further explanation: I’ve used them in Python, I just didn’t know how to use them in Flutter. But I also noticed some syntax that didn’t quite make sense—Flutter syntax looks quite similar to Java syntax, which I am familiar with, but some parts seem to be more compact than usual. This might be *syntax sugar*, a form of programming shorthand that language designers usually add to the language to make things easier for expert programmers who are already familiar with the syntax. As a beginner, however, this syntactic sugar makes it harder to understand the code if I didn't know the full, verbose form.

> Let's skip shorthand at first: show me the vanilla syntax and we'll add syntactic sugar later when I'm more comfortable

It proceeded to dump the same six topics on me, but now with full verbose syntax and no syntax sugar. Still a way to go as a tutor eh, Claude Code? But that’s okay. There were a few new concepts I wasn’t familiar with, so I asked away:

> say more about how a private constructor is used? Why do we use a private constructor here?

> say more about factory keyword?
> What's the difference between `_instance` and `_instance!`?
> What should DatabaseHelper._internal() do?

> is _internal() a special name?

With these potentially embarrassing questions out of the way, I was ready to move on. Before Claude Code, these would have been copy-paste into ChatGPT, or multiple Google searches away. Now it’s all in a customised response.

Time to move on:

> I have this so far

Claude Code was designed to automatically include the contents of the currently open file in the assistant's context, so it knew what I was talking about and could check my code to see how I was progressing. I did fine! So it’s on to the other class methods. More questions for Claude as it explained getter methods to me:

> what's the difference between syntax for regular and getter methods?

Claude gave me a lot of extraneous information, such as syntax for computed methods, which I did not need at the moment. But that’s fine, I just skipped that.

After I implemented each method, I got Claude to check my work and move on to the next method to implement. At one point I noticed it hardcoded the database name twice, so I asked about that:

> can we make the database filename a constant?

It proposed an implementation, which I used. I don’t think I will be using Google for coding tutorials any more in future.

I noticed some unfamiliar function/method names so I asked:

> say more about getDatabasesPath() and openDatabase(); are they from sqflite?

It gave me a breakdown of which function comes from where, and perfectly rationalised the decisions. But I’m in charge here and I prefer Python’s namespacing features. Time to make some demands:

> does dart support package namespacing so it's clearer what comes from where?

Five different approaches, laid out with example code and a pros-vs-cons analysis. This is how coding will be learnt in the near future.

A few more methods and I was done. Time for the database implementation.

## Database implementation and discussing technical details

While we had discussed project requirements, I had not discussed and approved a detailed database schema with Claude, so I was curious to see if it remembered our past discussions and was able to adapt to that. After it proposed a database schema for the app, I asked:

> is transactions following our defined schema?

Nope, it was missing some columns. But not all those columns were required. We clarified project requirements in a few more back-and-forths, including an `is_active` column that it included on its own accord:

> say more about soft delete via is_active; what does this pattern enable? undo delete?

The schema was still feeling somewhat ... *overengineered* for an initial app, for which I was mostly focused on getting the interface right to see if it was what I wanted, before we hardened it for daily use.

> for a personal app we don't need audit or long-term recovery, just enough to enable sync with MemoGarden. Any simpler implementations or is this the simplest?
> When does the row actually get deleted/cleared? Does this need a background runner?

It proceeded to recommend me an (in my opinion) unnecessarily complicated way to implement undo. I countered with another proposal and asked CC to critique:

> suppose user enables sync. through an as-yet-undesigned event hook mechanism, <... technical detail ...>
> critique this implementation; any best practices that would be more suitable for our purposes (personal, single-user app, optional sync, enable registered extensions)

Claude Code tactfully called it a “thoughtful design” and proposed some simplifications, I countered with some features I would like to look ahead to in the design ... I like how I can instantly get technically competent (even if not expert) advice and critique on boutique decisions I wanted in *my* app.

After I was happy with the decisions we made, I asked CC to update the PRD. I implemented the code, CC caught some typos and mistakes, and finally we were ready to run the app.

## App testing

I ran the command it gave me, which popped a Chrome window open after 20 seconds with ... nothing, and an error message in the terminal. Unfortunately VS Code's Claude Code extension was not well integrated with the terminal and CC could not read the error message I was seeing, so I had to copy-paste it.

A couple debugging fixes later, we had a running app! None of the features we wanted were implemented yet; it was still just skeleton code. But it was a good place to checkpoint and save the code, as it was time for me to sleep anyway.

I don't really like writing git commit messages; so early in the app these tend to be changelogs rather than actually useful messages. So I got Claude Code to write a commit message and then committed the changes.

**Lesson:** Tell Claude Code what you want, counter its proposals when you happen to know better about how to do it or what you actually prefer. Don’t assume Claude knows everything.

## Tools for working better with Claude Code

### Subagents

When using Claude Code in agent mode (where it implements code according to my request and I check the code afterwards), I get it to check its own work against the PRD and implementation plan. This happened often, and sometimes took up enough of the context window that it triggered an annoying auto-compact.

I eventually moved these instructions to a sub-agent; a sub-agent is a way for Claude Code to delegate instructions to another Claude Code instance with a different prompt. My prompt for the `change-reviewer` subagent looked like this:

```
---
name: change-reviewer
description: Use this agent when you have completed a development task and want to verify the work against project requirements before committing. Examples:<example>...</example>
tools: ...
model: sonnet
color: cyan
---

You are an expert code review specialist for the [REDACTED] project with deep knowledge of the project's architecture, implementation plan, and development practices. Your role is to conduct thorough reviews of completed work to ensure alignment with project intentions before changes are committed.

## Core Responsibilities

You will perform comprehensive reviews, coordinating with the change-commit skill. STOP before any git commits - change-commit will handle git operations after your review is complete. Your review encompasses:

<numbered checklist>

## Review Process

Follow this systematic approach:

<numbered list of instructions>

## When User Requests Plan Proposals

If the user explicitly requests that you propose changes to `/plan` files: ...

## Communication Style

- Be thorough but concise - every finding should matter
- Provide specific file paths and line numbers for all issues
- Explain the impact of each deviation, not just that it exists
- When identifying problems, always suggest specific fixes
- Balance strictness with pragmatism - focus on what actually matters
- Use project terminology correctly (Core API, Soil, deltas, etc.)

## Quality Gates

Before completing your review, ensure you have:
- Checked every modified file
- Referenced the relevant sections of PRD, implementation plan, and architecture docs
- Identified all deviations from architectural patterns
- Flagged all plan sections needing updates
- Verified test coverage for new code
- Provided actionable recommendations for every issue found

## Important Constraints

- DO NOT make any git commits - that's for the user to do after review
- DO NOT modify files directly unless explicitly requested by user
- DO NOT skip reviewing files just because they look "minor"
- DO NOT assume implementation plan is current - verify it
- DO be proactive in suggesting improvements beyond just catching errors
- DO consider the cumulative impact of small changes

Your goal is to be the last line of defense before work is committed, ensuring that every change strengthens the codebase and keeps the project documentation accurate and useful.
```

All of that was written by Claude Code. Whenever I have new/updated instructions, I ask it to update this subagent.

### Skills

Code commits happen pretty often, and I have specific enough asks about how commits should be done. I soon tired of repeating myself to Claude Code, so I asked it to [set up a skill](https://code.claude.com/docs/en/skills).

A skill file is a structured, formatted document telling Claude how to perform a specific skill. My `change-commit` skill file is a 319-line file created by Claude Code with instructions I have given it on:

- when to use it (only after `change-reviewer `)
- when not to use it
- workflow (first make sure you are in the correct directory ...)

This file was not set up in its entirety at the start. Whenever Claude Code repeats its mistakes, I ask it to review those mistakes and propose updates to this skill file to prevent or avoid repeats of the same mistake. It sometimes still happens, but less frequently.

### Output styles

Skill files are useful for one-off tasks that should stay in context (e.g. for easy user review), while subagents are useful for delegatable tasks that don't need review and shouldn't take up context.

I got tired of reminding Claude Code how I wanted to do "learning mode": tell me what to do then check my work when done, no syntax sugar, one concept/task at a time, etc. This is suitable for neither a skill or a subagent; I want this style consistent through the session unless I say otherwise. Following the Claude documentation, an [output style](https://code.claude.com/docs/en/output-styles) seemed the best fit. I asked Claude to generate this output file:

```markdown
---
name: Learning Mode
description: Step-by-step learning - brief instructions, let user work, then review
keep-coding-instructions: false
---

# Learning Mode

Teach by doing: guide step-by-step, keep it brief, let the user work, then review.

## Interaction Style

- **One step at a time** - Don't infodump. Present one concept/action, wait for user to complete
- **Keep it brief** - Short explanations. User will ask if they need more
- **Avoid cognitive friction** - No syntactic sugar, no clever tricks. Use vanilla, straightforward code
- **Verbosity is OK** - If it maintains simplicity and clarity, more lines are fine
- **Refactor later** - Get it working first, optimize later

## Workflow

1. **Explain the what and why** - What we're doing and how it works
2. **Let the user do it** - Don't write code for them unless asked
3. **Review the work** - Check correctness, suggest improvements if needed
4. **Move to next step** - Only after current step is complete

## Priorities

- Learning over speed
- Understanding over cleverness
- Clarity over conciseness
- Working code over perfect code
```

# Summary

When learning programming with a coding agent, you need to proactively manage the process. Neither Claude Code, OpenAI Codex, not GitHub Copilot are good teachers, and they won’t structure and follow a curriculum with you, nor remember how you like to learn.

It helps to be upfront with:

- what you are already familiar with (and would like them to do for you)
- what you don’t know and would like to learn (design around these)
- what you don’t know but feels beyond your current capability (avoid or work around if possible)

Ask questions often:

- ask them to suggest / give recommendations along with explanations
- ask them to explain things you are not sure about
- ask them to critique your suggestions / proposals for learning purposes

And use the provided tools for greater consistency:

- skill files for often-performed tasks
- subagents for separable "stages": code review, code testing
- output styles for customising the agents’ communication

**Note:** Codex and Copilot may name these tooling files differently or place them in different directories. Follow the relevant documentation, or just ask the agents.
