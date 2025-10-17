---
title: "Teaching and Learning Programming"
categories: programming
layout: post
date: 2025-10-24
description: "Reflections on pedagogy, common traps, and better metaphors for newcomers."
permalink: teaching-and-learning-programming
---

If programming were as easy to teach as to demonstrate, every tutorial would work. Instead, many learners find themselves staring at a blank screen, their minds equally blank despite hours of instruction. Why is there such a gulf between explanation and understanding?

The reason is simple but easy to overlook: **teaching programming is not transferring knowledge, but about designing experiences**. Each stage of learning — from writing your first line of code to collaborating on a full project — must be engineered so that students encounter just enough friction to grow without being crushed by complexity. That’s what this post is about: how I think about structuring those experiences.

## Tyranny of the Blank Page

Any budding writer, artist, or programmer knows the paralyzing effect of the blank page. After consuming tutorials and lectures, learners often find themselves unable to translate that knowledge into action. This phenomenon arises because comprehension does not equate to fluency. Understanding what a loop is does not mean one can effortlessly implement it in code.

This is why artists and writers often start with sketches or outlines. They spend hours practising in the style of masters, gaining fluency in the fundamentals before attempting their own creations.

Programmers need a similar approach. Instead of beginning coding from scratch, I like to start them off with crafting code snippets, then move on to modifying a few lines of code to achieve a different effect. I encourage them to play with existing code, modifying different parts to see how it changes the outcome. Break the code, understand what works and what doesn't, and gradually build up to more complex tasks.

In pedagogy, this is akin to "scaffolding"—providing learners with a structure to support their initial attempts, which can be gradually removed as they gain confidence and skill. The goal isn’t to eliminate that paralysis, but to structure it — to give learners something small and safe to break.”

## Tooling and Cognitive Load

Programming used to involve installing complex toolchains, configuring environments, and wrestling with arcane command-line interfaces. Even before code runs, the tools themselves can defeat a beginner. The first hour of setup can feel like a test of persistence rather than curiosity. Modern IDEs and package managers have alleviated much of this burden, but the cognitive load remains significant for beginners.

It is difficult for learners to focus on programming concepts when they are simultaneously grappling with unfamiliar tools. I try to mitigate this by abstracting away the tooling setup as much as possible, using online coding environments or pre-configured IDEs. They start off learning the language and concepts without the distraction of setup issues; those they can learn later.

The choice of first language is also a tricky one. While "strict" languages like Java enforce good practices, they can overwhelm beginners with boilerplate code:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

If I taught Java, I would have to preface many snippets of code with "ignore the boilerplate, focus on the core logic and I'll explain the rest later". That's a catch-22: sieving out the core logic from the boilerplate requires a level of fluency that beginners do not yet have.

```python
print("Hello, World!")
```

I like to think Python's simplicity allows learners to focus on the essence of programming without being bogged down by syntax. This reduces cognitive load and helps them build confidence. I teach the complexities of types and structures later, once they have a solid foundation.

## Abstract patterns vs Concrete examples

I see many online tutorials attempt to teach object-oriented programming with an example like:

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print("Woof!")
```

This draws on a familiar metaphor: dogs are real-world objects with properties (name) and behaviors (bark)—good! But then the student has to use this pattern in a program and they can't figure out how the `Dog` class gets applied to, say, a `Temperature` or `Vector` class—bad!. Abstractions are powerful only when they arise from something concrete.
`
Instead, I try to start with a few concrete examples of code that we can actually use:

```python
class ChessPiece:
    def __init__(self, name, color, symbol):
        self.name = name
        self.color = color
        self.symbol = symbol

    def description(self):
        return f"{self.color} {self.name} ({self.symbol})"
```

We build up this code into a chess game, adding more pieces, a board, and movement rules. The object-oriented concepts emerge naturally from the concrete task of building a chess game. Seeing how classes and objects work in this context helps them transfer that understanding to other domains. Once learners have built two or three real things, they can begin to see the invisible grammar behind all programs — and that’s when the abstractions finally stick.

Likewise, we don't start off learning three pages of Python rules. Instead, I start with code first:

```
Type the following expressions line by line in the code cell below and run them to see the result.

2 + 2
(3 + 4) * 2 (Python follows mathematical order of operations)
5 / 2 (Python returns the result of division operations as a float; see next section)
5 // 2 (Python can return an integer result by rounding down the result; this is called a floored quotient)
-5 // 2 (Floor-division is always rounded towards minus infinity)
...
```

Run the code, see what happens. Modify the code, see what happens. Data types, operators, expressions, functions, etc. are demonstrated as they are introduced, instead of being chunked upfront. A programming concept is not just a chunk of text, but a small experiment that the learner can run, modify, and observe.

## Assessments vs Projects

Assessments are often used to gauge a learner's understanding of specific concepts, typically through quizzes or coding challenges. While these can be effective for measuring knowledge, they are limited in their ability to foster deep learning and creativity.

In the early stages of learning programming, we use small, autograded assessment tasks for students to get quick feedback on specific skills: "Write a function that takes two numbers and returns their sum." We provide the tests, they write the function, and the system tells them if it passes or fails. This helps them build confidence in specific skills.

However, relying only on assessments results in students learning to "pass the test". They write code that "works" for the test cases, but fail in readability or rigor. They become adept at solving small, isolated problems, but struggle to integrate those skills into larger projects. And they become isolated, unable to collaborate or communicate their ideas effectively.

Instead, we believe programming is learned socially, even if written alone. We start students learning programming in group contexts as early as we can, once they have sufficient foundation to communicate their ideas. They begin learning algorithms with pair programming exercises, before we (deliberately) start them on a small group project without teaching them tools for collaboration. They struggle, they flounder, and they make mistakes, but they also understand the value of the tools we get them to use later—having _experienced the pain of not using them_, they are more willing to take the "medicine".

While these group projects help students to understand the need to write code for others to read, they don't run long enough for students to develop helpful collaboration processes. We follow up with a longer-term capstone project in Year 2, where students work in groups of more than 12 over most of a school term, building a full application from scratch. A project of this scale is large enough that they have to use version control, code reviews, issue tracking, and project management to succeed. They learn to communicate effectively, manage their time, and work collaboratively towards a common goal.

My graduated students often highlight this capstone project as the most valuable and meaningful part of their learning experience: the things they have learnt truly come together and demonstrate their worth, proving that these are not mere theoretical concepts but practical skills that can be applied in real-world scenarios.

## Conclusion

I think of teaching programming as guiding learners through a journey from novice to practitioner. It requires careful scaffolding, reducing cognitive load, using concrete examples, and fostering collaboration. By focusing on fluency and practical application rather than rote memorization, we can help learners develop the skills and confidence they need to succeed as programmers.

In the end, teaching programming is less about transferring knowledge than about engineering experiences — scaffolds, experiments, and collaborations — that turn understanding into fluency.
