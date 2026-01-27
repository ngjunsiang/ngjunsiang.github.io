---
title: "The Myth of Easy Programming"
tags: programming
layout: post
date: 2025-10-17
description: "Why programming looks simple but feels impossibly hard when you start."
permalink: the-myth-of-easy-programming
---

## Why doesn't my code work?

The most common question I get from beginners is "Why doesn't my code work?" A very understandable question! Before we started learning programming, we were speaking to people and writing for people to read. People have brains with 86 billion neuron cells, evolved over millions of years to understand context, infer meaning, and fill in gaps.

![Meme: STOP programming computers; Sand was never meant to think; this is very cruel to rocks](images/2025-10-17/sand-was-never-meant-to-think.webp)

Computers, on the other hand, are made of "electrified thinking sand", a technology not even a hundred years old yet.

A mere 30 years ago computers were still using text-based interfaces like MS-DOS, where you had to type exact commands to get anything done. No mouse, no graphics, no context. Just pure, unadulterated commands. Nobody was fooled into thinking computers were easy to use, or clever enough to understand context, infer meaning, and fill in gaps.

![Screenshot: MS-DOS text-based interface](images/2025-10-17/MS_DOS_command_prompt.webp)

Alas, 30 years later, computers can type long coherent essays back to us, talk to us, and even understand our speech (only if it is accented American English). If our only interactions were with ChatGPT and other webapps designed by companies with operational budgets in the millions, there would be nothing to snap us out of the illusion that computers are easy to use and clever enough to understand context, infer meaning, and fill in gaps.

## Writing for a computer

When you sit down at a terminal to write code, you are immediately reminded that computers are still just "electrified thinking sand". The code you write is not being sent to ChatGPT, it is being sent to a program written in approximately 100,000 lines of C code, which interprets it according to a strict set of rules, then translates it into 1s and 0s which comprise the machine instructions that the CPU can understand. 100,000 lines of C code sounds like a lot, but it is actually only about 5 megabytes of text, which compiles to a program about the same size. In contrast, the TikTok app on Android is 2.2 gigabytes (2,200 megabytes) when installed.

Understanding this intellectually does nothing to assuage the emotional frustration you feel, as a beginner, when encountering errors or unexpected behavior in your code. When you spend an hour hunting a bug in the code only to realise that it was caused by a one-character typo, it can feel like _Python is maliciously giggling behind your screen_.

But nothing could be further from the truth. Python isn't malicious, it's inflexible and literal. It does exactly what you tell it to do, no more and no less. If a human refused to follow written instructions because of a one-character typo, we would assume malice, because a human has 86 billion neurons and we expect them to be able to infer what we mean. Python, unfortunately, has exactly zero neurons; it can't even produce glee at your plight.

## The emotional difficulty of programming

Programming is an activity that can't help but make you aware of the flaws and gaps in your thinking. Just as a bicycle can't guess the direction you want to go, and a car can bear no responsibility for getting you into an accident, a code interpreter cannot infer your intent.

```python
wallet = "$5"
earnings = "$10"
total = wallet + earnings
print(total)
```
Result:
> $5$10

Each such mistake is a reminder that we don't understand what's going on, and that we have to learn more. Confronting one's own ignorance and limitations is emotionally difficult and humbling, but necessary for growth.

## Reading vs. Writing

When we read a coherent, well-organized essay or story, we are not aware of the immense effort that went into writing it. It is *so easy* to understand, because the author has done all the hard work of organizing their thoughts, structuring their arguments, and choosing their words. We are not aware of the hours of drafting, revising, and editing that went into producing the final product. We might even harbor the illusion that *we could write something like this too, if we just sat down and tried*.

And we can! But not without going through the same process of drafting, revising, and editing, learning from feedback and from the frustration of reading our own writing.

When we write, we are acutely aware of our own limitations. We struggle to find the right words, to organize our thoughts, to express ourselves clearly. Every sentence we write is a reminder of how poorly the words on screen reflect our intended meaning.

Reading a Python tutorial makes programming seem easy. Writing Python code makes programming seem impossibly hard. It is the act of writing code that reveals the gaps in our understanding, and helps us to improve.

## Shared meaning

When we converse with another person, the act of meaning-making is shared; we each bring our own experiences, contexts, and interpretations to the conversation. We can clarify misunderstandings, ask for elaboration, and adjust our language to suit the listener. Meaning is not only created by the speaker, it is also shaped and influenced by the listener.

But when we write code, we don't have another mind reflecting our meaning back to us. The code interpreter is not a person, it is _electrified thinking sand_. It cannot ask for clarification, it cannot adjust its understanding based on context, it cannot infer meaning from tone or body language; it can only reflect our own thinking back at us. The entire burden of meaning-making falls on the programmer.

This can feel lonely and isolating and many beginner programmers do find it helpful to have a mentor or a pair programmer to share the burden of meaning-making. But ultimately, the act of writing code is a solitary one, requiring the programmer to take full responsibility for the clarity and correctness of their code.

## Conclusion

Programming is hard because it requires precision, clarity, and a deep understanding of the concepts and tools involved. It is an activity that reveals our own limitations and gaps in understanding, and challenges us to grow and improve. But with practice, patience, and perseverance, we can develop the fluency and confidence to write code that works, and to solve problems that once seemed impossible.
