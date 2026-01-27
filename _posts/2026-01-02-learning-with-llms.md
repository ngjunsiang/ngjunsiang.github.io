---
title: "Learning with LLMs"
tags: learning
layout: post
date: 2026-01-02
description: "How to make LLMs useful for learning"
permalink: learning-with-llms
---

For the past couple of years, I have been using LLMs to learn new things. I have also observed how students, without guided instruction, attempt to use ChatGPT (and similar LLM-powered chatbots) as a tutor, as an answer source, as a learning aid.

From the perspective of a teacher, AI tutors are a fascinating specimen: they know so much, and at the same time they have such a long way to go.

Let’s start with the limitations: the *nature* of LLMs, characteristics they can’t do anything about at this point.

# LLM Limitations

## Must wait for a request

Let’s start with the interface. A chat interface, once a student opens it, sits there waiting for them to enter their question. That assumes they already have a question in mind, or some idea of what to ask. Often, a student’s main hurdle is knowing what question to ask or how to ask it. If they don’t have that, they wouldn’t even have opened the chat interface in the first place. The AI assistant must wait for them to figure that out, or find a teacher who can get them started.

## Lack of learning context

If a student has a question about schoolwork, they can ask their teacher, who would know what they have been doing in school, which topic the question is going to be about, and what techniques they (are supposed to) have been taught. The response will be closely tailored to this context.

If they want a similar response from an AI assistant, they would have to give it that background context. This is such a major hurdle that those who use AI assistants write their project history into a file, or have it programmatically gathered from their documentation and injected before the prompt (the question). A student using a generic learning interface does not have this prepared for them, and so they receive generic, untailored answers.

Sometimes, that is what a student might want. At other times, it’s the only information readily available.

## Lack of tools

After the student asks their question, an AI assistant responds, then waits for their next message. That is the only thing it can do.

A human teacher, meeting you face-to-face or in an online call, has a variety of senses available to them but not to an AI assistant. They notice your facial expression, they notice if you’re looking unsure, they notice if you’ve been quiet for a whole 2 minutes after their response. You might have felt this difference yourself: a teacher who notices you’re stuck, versus typing into a text box that waits indefinitely.

These observations necessarily influence how they tutor, and shape the relationship between teacher and student. Most students wouldn’t ask a quick question and then abandon the conversation the way they would with an AI tutor. It’s an entirely different mode of learning.

Sometimes, this is to the AI assistant’s advantage. A session with an AI assistant doesn’t feel like such a big ask, a huge commitment; we don’t feel as bad asking “just one little question”. But we also feel less accountable to an AI tutor, and often that’s the difference between diligent practice and casual dabbling.

# What AI tutors do

Prof. Pratschke [described the responses of tech companies responding to the needs of learners as being “pedagogically uninformed”](aife-2025#keynote-prof-mairéad-pratschke-mit-step-lab). What this means is that OpenAI, Anthropic, and other AI chat providers, when they add a “learning mode” to their chat offering, essentially give it a different system prompt—a different set of starting instructions.

In [Claude’s own words](https://claude.ai/share/2815b310-0441-485a-a54f-0dfa7f218390) (truncated for brevity):

> The implementation is primarily through the **style system**—it adds instructional text to the system prompt that shapes how I respond. I can actually show you this directly because I can see my current context. Right now, you have Learning Mode active, and I’m receiving a `<userStyle>` block with principles like:
>
> - Use leading questions rather than direct answers
> - Break down complex topics into clear steps  
> - Start by understanding the student’s current knowledge
> - Make learning collaborative with two-way dialogue
> - Adapt teaching methods based on responses
> - Regularly check understanding
> - Maintain an encouraging tone while challenging deeper thinking
>
> For Claude Code specifically, Learning mode leaves `TODO(human)` markers inside functions and prompts the user to implement parts themselves—turning it into a pair-programming experience rather than just code generation.

The assistant is told “when in learning mode, ask leading questions rather than giving direct answers”, or “break down complex topics into clear steps”. That does not automatically turn it into a teacher, but an interlocutor who withholds information—not the AI’s fault!

## What AI tutors don’t do (yet)

Because of the limitations mentioned above, the AI tutor cannot take the initiative to gather information about the student’s prior knowledge, to build up a concept map of the topic and gather diagnostic tools to assess the student’s understanding—little questions and examples that teachers intuitively use to gauge if the student is on the same page or has the same understanding. The AI tutor cannot gauge the student’s emotional state, motivation, or capacity to tackle the topic at hand. The AI tutor has not been taught pedagogical scaffolds, or if they are present in its training corpus, it has not been prompted to use them.

It is unclear whether the training material for learning mode was developed from transcripts of real-life tutoring sessions, tweaked by pedagogical experts, or includes extensive instructions on scaffolding and assessment. This means the AI tutor has little to go on: it likely does not evaluate the student’s [Zone of Proximal Development](https://en.wikipedia.org/wiki/Zone_of_proximal_development) (even if it is aware of the concept when asked), provide or build scaffolds for learning unless prompted, or check for understanding (["assessment for learning"](https://www.ebsco.com/research-starters/education/assessment-learning)) along the way before building on what has just been learned.

# Can an AI tutor be taught how to teach?

This is possible with current RLHF and other fine-tuning techniques. Even techniques like skill files, subagents, and tool use, which are already available to coding assistants like GitHub Copilot and Claude Code, can be adapted to learning contexts. For example, an AI tutor could be given access to a set of diagnostic questions, or a concept map builder, or a set of scaffolding techniques that it can call upon when needed.

But without these tools, even a human tutor is hamstrung: imagine what a teacher can accomplish if confined to a customer support chat window with a student, unable to see them or even to initiate a conversation unless the student first types something. Imagine what they can do if not given tools for knowing the context of the problem except from what the student types in.

Lastly, an AI tutor might be taught how to teach, but can it be taught to develop an ongoing teaching relationship with a student? Do they have access to memory blocks for storing things they know about the student, can they talk to people close to the student to understand their context, can they track how the student is doing over time? These remain open questions.

# Can a student be taught how to learn with an AI tutor?

This is where I see more potential. The difficulty of learning stems from the difficulty of bootstrapping: you can’t ask good questions until you know enough about a topic to know what to ask. Just as in a cave you must stumble to find a torch and light it, and with its limited light find the way forward and light other torches until the structure of the cave reveals itself, so too do students stumble, feel their way around the boundaries and axiomatic facts of a topic, and thereby orientate themselves sufficiently to ask more pointed questions.

Explore a few topic-caves and improve at this meta-cognitive skill: the skill of **knowing what you don’t know**. It will help you use an AI tutor more effectively. You can ask the AI tutor to explain basic concepts, to give you examples, to quiz you on what you have learned so far. You can use the AI tutor to generate practice problems, to simulate conversations, to role-play scenarios. Meta-cognition helps you know where your learning gap is, and you can then use the AI tutor to fill that gap.

The students who can do this are not the students I worry about; I think they’ll do fine academically. But I also know there are many students who feel stuck: their textbooks feel like a jumble of text that makes no sense, while others around them seem to understand what’s going on, and *they don’t know what to do next*: asking questions feels threatening, and writing memorised answers no longer works. If you recognise yourself here, an AI tutor alone is not the solution. What you need is permission to get things wrong.

And perhaps that's something AI assistants can do: they don't judge, criticise, or respond impatiently. And by not doing this, they implicitly give these students a place to pour their unasked questions into, and hopefully get good-enough answers to bootstrap their way out of darkness.

# What we can do

If you are a student, don’t let worried adults put you off from learning, with or without AI assistants. While these AI assistants carry great potential for harm if prompted maliciously, they can benefit you if you approach them with the intention to learn. Some key phrases go a long way when you use them with an AI assistant to try to cover your blind spots:

- “Tell me what I may have missed.”
  - “Could you explain that a different way?”
- “My understanding is: <...> Is that correct?”
- “Could you walk me through \<topic\>, one concept at a time?”
- “What should I ask myself to know if I have understood this correctly?”

If you are a teacher, you might have forgotten what it’s like to learn or try something new. That makes it difficult to teach students how to navigate topics that may be foreign to them: topics so familiar to us that we suffer the [curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge). We can’t teach students how to use AI assistants for learning if we haven’t done it ourselves—the advice would land flat.

Instead, recall the projects and experiments you once dreamt of, but set aside due to lack of time—dust them off and try them with an AI assistant. The past 5 years have brought a huge leap forward in the ways computers can help us, and many things we previously thought of as too difficult are now possible. This will also help you to inhabit the learner’s mindset again, and give you anecdotes to guide your students in the use of these AI-enabled learning tools.

If you are an edtech professional, seek out opportunities to talk with teachers or students and find out what they are struggling with. EdTech is in a position to do a lot more than just generate quiz questions or give feedback on student responses. The tools created by the world of web development and online advertising have been used for profit, but can be used for learning as well.

Advertising technology (adtech) has long had telemetry tools for tracking user behaviour to evaluate the effectiveness of ads at engaging the target audience. Now turn them towards students: not to get clicks and views for videos, but to evaluate if they are confused by a paragraph or video, if they are silently struggling with a topic, or if they’re just lost in the exercise.

Like in the adtech world, these tools are powerful and potentially dangerous. People are right to raise surveillance and privacy concerns. And yet, fearmongering and overcautiousness will get us nowhere. [At AIFE 2025, Dr Ho Jia Xuan presented his work on using process telemetry to evaluate the student writing process](https://ngjunsiang.github.io/aife-2025#parallel-session-process-telemetry-in-learning--dr-ho-jia-xuan-1), which is inspiring me to try something similar this year for coding. I’ll write more when I have something useful to share; if you are interested, please drop me an email!
