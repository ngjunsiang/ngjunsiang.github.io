---
title: "The Layers of Difficulty"
tags: programming
layout: post
date: 2025-10-20
description: "Not all programming challenges are the same — and they require different kinds of thinking."
permalink: the-layers-of-difficulty
---

## The Spectrum of Difficulty

When we first start learning to program, everything feels impossibly fragile. Pressing Enter / Return without seeing an error feels like a distant dream.

Eventually, we overcome this [syntax hurdle](/the-grammar-of-operations). We can write tens of lines of code that actually run. Then we hit a new wall: our programs don't complete successfully. They crash with all kinds of errors.

- `IndexError`_—we tried to access `items[8]` in an 8-item list _again_; we forgot the first item is `items[0]` so the last is actually `items[7]`.
- `Unsupported operand type(s) for +: 'int' and 'str'`—we took input from the user, but forgot that it is passed as a (text) string and requires conversion to an integer before adding.
- `ValueError: invalid literal for int() with base 10: 'a'`—we assumed the user would enter a number, but they typed letters instead, and we forgot to handle that case gracefully.

## Debugging Is A Different Skill

The next few hundred hours will be spent doing what I like to call "bug collecting". Instead of pinning insects to foam boards, we'll be capturing and categorizing bugs we encounter in code. TypeError: the program expected one type of data but got another, NameError: we referenced a variable that hasn't been defined yet, ValueError: we passed a function an argument of the right type but an inappropriate value. Much of this happens subconsciously: most programmers don't memorize every error message, but by the time they've run into the same bug 50 times, they intuitively pattern-match and know what to look for when they see it again.

This is pattern recognition. It helps us debug faster, but it is not debugging. And as programmers, _we will have to debug_. An expert programmer is not one who writes perfect code all the time; instead, most problems are familiar to them and are easily fixed. With the remaining tricky problems, experts patiently and systematically investigate them, forming hypotheses, testing them, and narrowing down the root cause. This is a different skill from writing code, and it takes time and intentional practice to develop.

## Problems In Other Domains

As we work with other systems, libraries, and interfaces, we encounter new kinds of difficulty. We have to [learn the protocols and conventions of each domain](the-landscape-of-knowledge). An `HTTP 400 Bad Request error` means we formatted a web request incorrectly, like missing out a form field when submitting. A `sqlite3.IntegrityError` could mean we tried to re-insert a record with the same ID in our database. Each domain has its own vocabulary of errors, and we have to learn to interpret them and diagnose their causes correctly.

Mastering the programming language of choice helps a lot; a problem is harder to diagnose when we can't tell if it's because of language syntax, domain logic, or something else entirely. Once we've survived the jungle of other people's systems, we discover a new challenge: the chaos of our own.

## Code Organization and Architecture

It doesn't take long before we start to write code that's way out of our depth. Writing our first thousand-line program feels like climbing Everest; look, my first big program and it actually works!

Six months later, when we run into a bug or need to add a new feature, our feelings shift from pride to dread. Where do we even start? The code is a tangled mess: Enemy code tries to talk to a Player's HealthBar during an attack. Game.requirements is prematurely changed by DungeonKey. Enemy is repurposed as an Item so our player can pick up defeated foes. Our clever one-liners, initially inspiring a feeling of pride, now seem like a landmine we accidentally left for our future selves to step on.

Some of us learned programming because we like the thrill of solving problems; this thrill is sweetened by the fact that _we never have to revisit the solution again_. Problems are fun little mental puzzles that never hurt anybody! So the first time poorly-written code bites us back, it can feel like a rude awakening, perhaps even a betrayal—_you were supposed to be fun and easy, not a source of regret for the consequences of my past self's mistakes_!

> Everyone knows that debugging is twice as hard as writing a program in the first place. So if you’re as clever as you can be when you write it, how will you ever debug it?  
> — Brian Kernighan, 1974

Look: few people like tidying, but we all know that if we don't learn how to keep our living spaces sufficiently organized, we live with the consequences. There are many books written about [how to tidy our living spaces](https://www.goodreads.com/book/show/22318578-the-life-changing-magic-of-tidying-up), but there are probably even more books written about [how to organize code](https://en.wikipedia.org/wiki/Design_Patterns).

## Abstraction and Complexity

In our lives, we don’t think too hard about the inner workings of a smartphone or a car; we just trust they’ll respond when we tap the screen or press the Start button; we assume that as long as we tap in and out of public transit correctly, we will be billed correctly. In other words, we use **interfaces** without thinking about **implementation**. This is the essence of abstraction: we create layers of interfaces that hide the messy details of implementation, allowing us to apply our limited attention and cognitive resources to higher-level problems.

At some point in our programming journey, we (sometimes grudgingly) realize the importance of good abstraction. This is the point where we are no longer beginner programmers; we are intermediate programmers, looking to write our first 10,000-line codebase that won't make us want to burn it all down when we revisit it in six months. To survive a 10,000-line codebase, we need abstraction—compartments of complexity small enough to reason about.

This stage is harder to reach because it's rarely taught directly. Most of us learn it by osmosis — through good mentors, teammates, or long hours wrestling with our own tangled code. Many beginner programmers never reach this level of skill, and remain stuck in the weeds of syntax errors and bug-hunting for years.

## Conclusion

Programming is hard. But not all programming challenges are the same. As we grow in skill and experience, we will encounter different layers of difficulty that require different kinds of thinking. Each layer of difficulty teaches a new way of thinking — from the mechanical precision of syntax to the architectural patience of design. The good news is that difficulty is not a wall but a ladder: each rung gives us a better view of the whole system.
