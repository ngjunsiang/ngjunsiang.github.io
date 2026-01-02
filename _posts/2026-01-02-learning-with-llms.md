---
title: "Learning with LLMs"
categories: learning
layout: post
date: 2026-01-02
description: "How to make LLMs useful for learning"
permalink: learning-with-llms
---

By now, on and off, I have been using LLMs to learn new things. I have also observed how students, without guided instruction, attempt to use ChatGPT (and similar LLM-powered chatbots) as a tutor, as an answer source, as a learning aid.

From the perspective of a teacher, AI tutors are a fascinating specimen: they know so much, and at the same time they have such a long way to go.

Let’s start with the limitations: the *nature* of LLMs, characteristics they can’t do anything about at this point

# LLM Limitations

## Must wait for a request

Let’s start with the interface. A chat interface, once you open it, sits there waiting for you to enter your question. That assumes you already have a question in mind, or some idea of what to ask. Often, a learner’s main hurdle is knowing what question to ask or how to ask it. If you don’t have that, you wouldn’t even have opened the chat interface in the first place. The AI assistant must wait for you to figure that out, or find a teacher who can get you started.

## Lack of learning context

If you have a question about schoolwork, you can ask your teacher and they would know what you have been doing in school, which topic this is about, and what techniques you (are supposed to) have been taught. The response will be closely tailored to this context. 

If you want a similar response from an AI assistant, you would have to give it that background context. This is such a major hurdle that people who use AI assistants write their project history into a file, or have it programmatically gathered from their documentation and injected before the prompt (your question). As a learner using a generic learning interface, you do not have this prepared for you, and so you receive generic, untailored answers.

Sometimes, that is what you want. At other times, it’s the only information readily available.

## Lack of tools

After you ask your question, an AI assistant responds, then waits for your next message. That is the only thing it can do.

A human teacher, meeting you face to face or in an online call, has a variety of senses available to them but not to an AI assistant. They notice your facial expression, they notice if you’re looking unsure, they notice if you’ve been quiet for a whole 2 minutes after their response.

These observations necessarily influence how they tutor, and shape the relationship between teacher and student. You wouldn’t ask a quick question and then abandon the conversation the way you would with an AI tutor. It’s an entirely different mode of learning.

Sometimes, this is to the AI assistant’s advantage. A session with an AI tutor doesn’t feel like such a big ask, a huge commitment. We don’t feel as bad asking “just one little question”. But we also feel less accountable to an AI tutor, and often that’s the difference between diligent practice and casual dabbling.

# What AI tutors do

Prof. Pratschke [described the responses of tech companies responding to the needs of learners as being “pedagogically uninformed”](). What this means is that OpenAI, Anthropic, and other AI chat providers, when they add a “learning mode” to their chat offering, essentially give it a different system prompt—a different set of starting instructions.