---
title: "Thinking Like A Programmer"
categories: programming
layout: post
date: 2025-10-21
description: "The mental transformations that make programming easier — and why they take so long."
permalink: thinking-like-a-programmer
---

Every year, as freshly enrolled students wander the hall on the first day of school pondering their subject choices, a few will come to me, sit at my booth, and ask: "I like programming. I've made an app. I've made a website. Will I enjoy learning Computing? Will I do well in it?"

## Self-taught Programmers

Many of these students are self-taught programmers. They've dabbled in coding, built small projects, and perhaps even contributed to open-source software. They enjoy programming as a hobby, and they see it as a fun and rewarding activity.

This mode of learning is characterized by exploration and fun-seeking: they try out new languages, frameworks, and tools; they build projects that interest them; they learn by doing. This is a great way to get started with programming, and it can lead to a lifelong passion for coding.

Yet at the same time, these students can find themselves struggling in a formal Computing curriculum. In their own apps they can lean on code snippets, [programming frameworks](the-landscape-of-knowledge), and [other people's abstractions](the-layers-of-dificulty). "If it works, it works!" they say.

## Formally Taught Programmers

A formal curriculum has a different focus: the learning of [programming syntax](the-grammar-of-operations) is a necessary foundation, but not the ultimate goal. Just as a literature student doesn't just learn to read and write words, but to analyze and interpret texts, _a Computing student must learn to think computationally_.

Consider: the earliest programming language still in use today is Fortran, released in 1957. But the concepts studied in computer science date back even further, to the 1930s and 1940s, with pioneers like Alan Turing and Alonzo Church laying the theoretical groundwork for what computation means. These ideas are rooted in even earlier ideas about computational operations and algorithms credited to pioneers like Charles Babbage and Ada Lovelace in the _early 19th century_. **The study of computational operations pre-dates the use of programming languages by more than a century.** This means that learning to program is not just about learning a language; it's about learning a way of thinking that has evolved over many decades.

## Building A Mental Model

Most self-taught programmers don't consciously think about how code works, because programming languages have so successfully abstracted away the inner workings of the computer. These programmers are like novice language learners, stringing together sentences and relying on the interpreter's experience to fill in the gaps for them. Human interpreters will gracefully handle simple requests for "may I know who can I discover the restroom?" but not an entire essay in non-fluent tourist-speak. "They understood what I meant!" the novice proudly proclaims, unaware of how much effort the listener had to expend to interpret their meaning.

Just as a successful manager must have a mental model of the business and its core operations, a successful programmer must have a mental model of **how code works**. Computational thinking is not about memorizing code — it’s about predicting how your instructions behave.

## From Code Writing to Computational Thinking

A beginner programmer thinks: "Given the name of an item, I need to look it up in this list and return its numerical position and price."

```python
target_name = input("Enter item name: ")
# Search the items list for an item with a matching name
for item in items:
    if item.name == target_name:
        # get the numerical position of the item in the items list
        item_position = items.index(item)
        # retrieve the item object from the items list by position
        item = items[item_position]
        print(f"{item_position}: {target_name} -- ${item.price}")
```

An experienced programmer, thinking computationally, would realize: "`items.index(item)` performs another search through the entire list, which is unnecessary. I can reduce the number of operations carried out by only searching the list once."

```python
target_name = input("Enter item name: ")
# Search the items list for an item with a matching name
for item_position in range(len(items)):
    item = items[item_position]
    if item.name == target_name:
        print(f"{item_position}: {target_name} -- ${item.price}")
```

Both programs achieve the same result in almost the same number of lines of code, but the second program avoids repeating the search. For a 10-item list, the first program will require 10 times more operations than the second in the worst case. The difference becomes stark with a 1,000-item list: the first program now requires 1,000 times more operations than the second.

To self-taught programmers, their code still works for their small projects. But for large systems, these inefficiencies grow into bottlenecks that can cripple performance; if you're going to build a business on this software, you want to be aware of these issues from the start.

## Thinking In Operations

Computational thinking extends beyond programming itself; the field of [operations research](https://en.wikipedia.org/wiki/Operations_research) has been applying computational thinking to optimize complex systems in logistics, supply chain management, and finance since the post-World War II era.

For example, an office worker may have gotten used to spending an entire afternoon manually reconciling two 10,000-row Excel spreadsheets every month. This is time-consuming because each row in the first spreadsheet has to be compared to up to 10,000 rows in the second spreadsheet, resulting in up to 100 million comparisons. A computational thinker might analyze the process, recognize that sorting both spreadsheets first would allow for a more efficient linear-time comparison within 20,000 operations, and implement a workflow that can complete the job in an hour or two even if performed manually.

While programming languages are a tool for communicating with computers, computational thinking is how we ensure the instructions we give are efficient, effective, and scalable. Once we can reason about operations efficiently, the next challenge is to reason about the reasoning itself — to structure our thinking so that our future code is safer, cleaner, and more adaptable.

## Thinking In Abstractions

Self-taught programmers often learn from online tutorials, which teach only the basics. When it comes to organizing data, that means using **lists**, which are numbered sequences of items where `items[4]` retrieves the fifth item, and **records** (alternatively called structs, objects, or dictionaries), which are collections of named fields where `item.price` or `item["price"]` retrieves the "price" field of an item.

Armed with these two abstract hammers, they apply them to every nail they encounter. Need to represent a deck of cards? A list of card objects will do. Need to represent a player's inventory? A list of item objects will do. Need to represent a mapping from item names to item details? A list of item objects will do.

Before long, their codebase is littered with `lst`, `dct`, `new_list`, `data`, and other generic names. Now their `enemies` list is missing an enemy and they can't trace why; it could have been modified by any of the 50 functions they created that can take a list.

> Civilization advances by extending the number of important operations which we can perform without thinking about them.  
> — Alfred North Whitehead, Introduction to Mathematics (1911)

It takes a different kind of laziness to think: "I've made this mistake 50 times. Instead of repeating it, is there a way to just avoid it altogether?" We can create an Iterator for safely iterating over collections, create an Action to represent the possible actions a player can take, design an InventorySystem where armor only goes in armor slots and items go in a Backpack.

Abstractions are our way of bottling experience. Every blueprint, function, or design pattern represents a lesson learned and reused, a mental shortcut encoded in code. For students not "blessed" with this kind of laziness, a formal Computing education takes them through the standard syllabus of data structures, design patterns, and software architecture, training them to think in terms of abstractions that can simplify complex problems and reduce cognitive load.

## Conclusion

The hardest part of programming isn’t syntax — it’s learning to think in a way that leaves no room for assumption. Our brains evolved to deal with fuzzy language and social context, not to describe the exact sequence of operations in a deterministic world. Computational thinking takes time precisely because it asks us to unlearn ambiguity and train our minds to predict outcomes deterministically — a skill we must carry into systems, teams, and processes.
