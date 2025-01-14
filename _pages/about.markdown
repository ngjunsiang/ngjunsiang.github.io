---
layout: page
title: About
permalink: /about/
---

<div style="display: flex; align-items: flex-start;">
    <img src="https://placehold.co/100x100" alt="placeholder for profile picture" style="margin-right: 20px;">
    <div>
        Hi, I’m JS! In my job, I teach Computing at high school level in a junior college in Singapore. All the time, I’m exploring how we learn and know what we know, and how we teach it to others.
    </div>
</div>

### Things I’m working on

- [intro-to-python](https://github.com/nyjc-computing/intro-to-python), [programming-in-python](https://github.com/nyjc-computing/programming-in-python): self-guided courses for learning Python and programming patterns
- [open-dis-python](https://github.com/open-dis/open-dis-python): contributing to the Python implementation of the [DIS version 7](https://en.wikipedia.org/wiki/Distributed_Interactive_Simulation) (IEEE-1278.1) protocol [status: ongoing]
- TimelineBot (WIP): A telegram bot to help me automate my current ~~todo~~ done-list system
- Onboarding (working title): a digital onboarding process for Computing students to get set up before their first lesson
- Pseudo (working title): a code editor for (Cambridge 9618) pseudocode
- Scrollback (working title): an ORM for representing changes to a spreadsheet as an event stream, to enable time-aware search
- [Layman’s Guide to Computing](https://buttondown.com/laymansguide): a (dormant) newsletter introducing Computing concepts in layperson language; [archived version](/laymansguide/) [status: in maintenance]

### Current obsessions

- **Capstone projects:** how do we design and set up projects that allow learners to showcase their learning without being restricted by it?
- **Remote collaboration:** is this a teachable skill or a learnable perspective? Yes. How do we inculcate a collaborative mindset in learners
- **Increasing agency:** building systems that increase agency and autonomy in learners

### Reads

- [Why Tacit Knowledge is More Important Than Deliberate Practice](https://commoncog.com/tacit-knowledge-is-a-real-thing/), [Copying Better: How To Acquire The Tacit Knowledge of Experts](https://commoncog.com/how-to-learn-tacit-knowledge/)  
These two articles by Cedric Chin are part of the [Expertise Acceleration](https://commoncog.com/expertise/) series from Commoncog, and lay out a model for expert knowledge, and a process for extracting and transmitting it.

- [Teaching Tech Together](https://teachtogether.tech/en/index.html)  
  While ostensibly about teaching computing, in the process of doing so it lays out many cognitive models of learning and teaching that have influenced the way I design and implement my teaching modules.

### Highlights

If you don’t want to dig through the archives for the highlights, they are collated here.

{% for entry in site.data.highlights %}
{% include highlight.html entry=entry %}
{% endfor %}
