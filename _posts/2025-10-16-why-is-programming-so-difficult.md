---
title: "Why is programming so difficult?"
categories: programming
layout: post
date: 2025-10-16
description: "Why programming looks simple but feels impossibly hard when you start."
permalink: why-is-programming-so-difficult
---

"Learn Python in 30 days!" "Build a web app in an afternoon!" "Create your first game with just 10 lines of code!" Many programming tutorials promise quick and easy results just by watching a YouTube video or following a blog post. But if you've ever tried to learn programming, you know it's not that simple.

Why is programming so difficult? I don't want to scare people away from programming, but after seeing many potential programmers give up after mismatched expectations, I think it's important to understand why it feels so difficult, so that you know how to temper your expectations and you have a mental map for where you are in the learning process.

This is going to be a series of posts, and we start with what programming is.

## The purpose of a language

A beginner's tutorial will show you the basic syntax (i.e. grammar) of a programming language, and then walk you through writing a simple program.

This program displays "Hello, World!" on the screen:
```python
print("Hello, World!")
```

This defines a function called `add` that takes two numbers and returns their sum. When you call `add(2, 3)`, it returns `5`, which is then printed to the screen.
```python
def add(a, b):
    return a + b

result = add(2, 3)
print(result)  # Outputs: 5
```

But this is not what people want to learn programming for. People want to build *real applications*, like a website, a mobile app, or a game. This is like wanting to learn a different language and then using it to write a novel, draft legal contracts, run a company, or negotiate peace treaties.

The first thing you might realize is that _those are separate skills_. For an English-speaking CEO, running a company in Swahili is not "just a matter of learning the vocabulary". A Mandarin-speaking student does not automatically have the skills to write a coherent essay or good novel.

Wanting to "learn programming" is like wanting to "learn a language". If you asked a friend to teach you a language, the first question they would ask is "What do you want to do with it?" Most online tutorials, books, and courses don't ask this question. They assume you want to learn the language for its own sake, and they teach you the basics of syntax and grammar before declaring "Congratulations, you know how to program! 🎉"

## The limitations of a body

While some programming languages are designed to be easy to learn, there is a limit to how much they can protect you from the harsh realities of being merely *a computer made of "thinking sand"*.

Your own body is probably the easiest thing you know how to operate. You can walk, run, jump, and pick things up without thinking about it. But there are also times when _something feels wrong_; you feel under the weather, your back is killing you, or you can't separate yourself from the porcelain throne. And sometimes you don't even know what caused it!

So imagine what it's like when you write a program for Python to execute, and it doesn't work correctly. Python tries its best to give you helpful information through error messages, but there are limits to how much it can help you. It can't tell you if you accidentally write a program that loops forever; it can't tell you why it's unable to open a file or connect to a database. Maybe it doesn't exist? Maybe you got the file path or database credentials wrong? Maybe the server is down? Maybe you don't have permission to access it?

When you learn programming, the onus is on you to understand some things about how computers work, and how to debug problems when they arise. It takes time and experience to develop this knowledge and skill. This is something you can learn separately from learning the syntax of a programming language. People who have a background in tinkering with computers often pick up a programming language quickly, because they already understand some of the problems they might encounter.

In short, you can't escape knowing about the limitations of the computer that runs your code.

## The constraints of a world

When you go to customer service, you first have to take a queue number, wait for your number to be called, explain the issue, show proof of receipt, and then the representative begins to help you. Miss a step or do them in the wrong order and you have to start over.

We live in a world run by systems, with their own rules and constraints. Before you can send an email, you must first have an email account. Before you can access government services, you might need to have a government ID. Before you receive goods from a supplier, you might need to have a purchase order or a contract in place. There are processes and protocols involved.

If you are writing a program of any complexity beyond a simple tutorial, you are likely to be interacting with other systems, such as databases, web servers, APIs, or third-party libraries. Each of these systems has its own rules and constraints that you need to understand and follow to get your program working correctly. There is no way around this.

If you are lucky, some of these steps might be automated for you. When you sign up for an email account, Google handles a lot of details for you; you only need to provide your desired email account name and a password. When learning programming, someone might have written some code (in the form of a library, package, or app) that abstracts away the complexity involved in interacting with a system, so that you can accomplish what you need with just a few lines of code. But that is not _a way around_ the rules and constraints, it means someone else is handling them for you. And it also means that when you encounter a problem, you can't fix it if you don't understand the underlying rules and constraints.

In short, you can't escape knowing about the world that your code operates in, and knowing about the constraints and processes that govern it.

## The rewards of thinking

Not all companies are run equally well. In some companies you do a lot of busywork that doesn't really add value; you get bounced around to five different departments just to have a simple question answered; work that is done gets thrown away after use and has to be redone. When you try to figure out why things are the way they are, you find that there is no organization, no documentation, and no one seems to know why things are the way they are.

Code can end up like that too. Information and processes don't naturally organize themselves. Someone has to take the time to organize things, document them, and make sure they are up to date. The reward of doing this well is efficiency and clarity (and hopefully sometimes also financial compensation). The penalty of doing this poorly is confusion, frustration, and wasted time.

While computer science as a discipline is only 60 years old, information theory and other disciplines that pre-date it have been around for much longer. There are well-established principles and best practices for organizing information and processes, and for designing systems that are efficient and effective. These principles and best practices are not the same as programming, but they can make you a better, more effective programmer capable of building better systems, and managing larger, more complex ones.

In short, your code will outgrow your ability to manage it if you don't learn how to think about information and processes in a systematic way.

---

This is post zero. The next few posts will explore each of these topics in more detail and open up a new domain of knowledge and skills that make you a better programmer.

1. [The Myth of Easy Programming](/the-myth-of-easy-programming)  
   Why programming looks simple but feels impossibly hard when you start.
2. [The Grammar of Operations](/the-grammar-of-operations)  
   Programming languages as rigid linguistic systems that require fluency
3. [The Landscape of Knowledge](/the-landscape-of-knowledge)  
   Programming doesn’t happen in a vacuum — it sits at the intersection of many domains.
4. [The Layers of Difficulty](/the-layers-of-difficulty)  
   Not all programming challenges are the same — and they require different kinds of thinking.
5. [Thinking Like A Programmer](/thinking-like-a-programmer)  
   The mental transformations that make programming easier — and why they take so long.
6. [The Software Ecosystem](/the-software-ecosystem)  
   Why collaboration, version control, and teamwork introduce a new dimension of difficulty.
7. [Teaching and Learning Programming](/teaching-and-learning-programming)  
   Reflections on pedagogy, common traps, and better metaphors for newcomers.
