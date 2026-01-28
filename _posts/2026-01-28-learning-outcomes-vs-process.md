---
title: "Learning Outcomes vs Process"
tags: learning education programming
layout: post
date: 2026-01-28
description: "How do we measure the learning process and not just the outcomes?"
permalink: learning-outcomes-vs-process
---

Teachers, stop me if you've heard this one before: we want to know if our students have understood Object-Oriented Programming (OOP) correctly. Let's give them a test: they have to write code applying OOP principles. Some do well on the test, but later struggle to use those principles effectively in their class project. Some of them do poorly; they need much more help and we might have caught misunderstandings earlier, before they wasted the past two weeks.

## Measuring Learning Outcomes

What we were doing is measuring learning outcomes: did the students produce code that demonstrated their understanding of OOP? This is a common approach in education: we set learning objectives, then assess whether students meet them through tests, assignments, or projects.

But if we want to intervene earlier, we cannot wait until the end of a topic to see if students have mastered the material. By then, misconceptions may have taken root, and remediation becomes more difficult.

When driving a car, we don't wait for the half-yearly inspection to find out if the engine oil is too low, the tyres are worn or deflated, or the wiper fluid needs topping up. We have ways to check them regularly: we glance at the dashboard displays, make a quick visit to the tyre air point at the petrol station, and top up fluids as needed.

Likewise, we don't want to wait until the end of a programming course to find out if students are struggling with key concepts. We need ongoing, formative assessments that provide feedback during the learning process.

In software, this real-time monitoring is called "telemetry" — the dashboard that tells you oil pressure and engine temperature as you drive. Unlike analytics, which looks at aggregated data after the fact, telemetry is about live, granular signals that let you notice and fix problems while they're happening. What if we could bring that same capability to the classroom?

## Measuring Learning Outcomes (but more frequently)

This idea of "measure as you teach" is formally termed [assessment for learning](https://www.ebsco.com/research-starters/education/assessment-learning) (AfL). This is familiar ground for tech practitioners: metrics are already widely used in software development to monitor application performance and user behavior. They might find it surprising that education hasn't widely adopted this approach. But keep in mind that we don't attach sensors and monitors to students the way we do to software systems. In the classroom, we rely on more subtle cues: student questions, body language, engagement levels, and formative assessments.

Unfortunately, class sizes and time constraints often limit our ability to monitor all signals and provide individualized feedback.

## Measuring the Learning Process: is it possible?

What if we could "take a dipstick reading" of the learning process instead of waiting to quiz students? In a traditional classroom, we can use techniques like think-pair-share, quick polls, or exit tickets to gauge understanding during the lesson. But in programming lessons, when students are working on coding exercises, that would be disruptive.

In Singapore junior colleges, we teach introductory Python through coding exercises on online autograded platforms or interactive Jupyter notebooks. These platforms contain coding exercises interspersed with explanations and examples. Students read brief explanations, run code, modify them, and see the results immediately.

All this runs in the browser, with no installation required. The browser can also capture a second stream of data: how students interact with the exercises — the code they run, how many attempts they make, and how long they spend on each exercise. Can we use this data to better detect when students are struggling?

## Ethics: Consent and Privacy

Before implementing telemetry in educational settings, we must consider ethical implications. Students should be informed about what data is being collected, how it will be used, and who will have access to it. Consent is crucial. In the early stages, we can make telemetry optional, allowing students to opt-in. As we demonstrate the benefits of telemetry for learning support, more students may choose to participate.

For learning purposes we don't actually need to store detailed telemetry data long-term. Real-time monitoring can be done in-memory, with only summary statistics stored for analysis. This minimizes privacy risks while still providing valuable insights into the learning process. Since students are not graded on this data, it also does not need to be preserved or archived, reducing concerns about data retention.

## Extracting signals from noise

Detailed telemetry data can be overwhelming. We need to identify key signals that indicate when a student is struggling. For example, if a student repeatedly runs the same code cell without making changes, it may suggest confusion. If they spend an unusually long time on a particular exercise, it could indicate difficulty.

It will take time and experimentation to identify the most useful signals. We can start with simple heuristics and refine them based on feedback from instructors and students. While many EdTech practitioners might immediately see this as a machine learning problem, a simpler rule-based system would be more appropriate initially and easier to implement. It might even allow client-side processing in the browser, further reducing privacy concerns.

## Conclusion

This is an early peek at how we might measure the learning process in programming education, without waiting for end-of-topic assessments or tests. Improving our teaching tools begins with the data and ends with better support for teachers and learners.

Learning analytics typically looks at aggregate, retrospective data. Learning telemetry offers a complementary approach: granular, real-time signals during the learning process itself.

This isn't speculative: browsers already capture these signals today on webpages. We can use this data to provide real-time feedback to instructors, instead of only waiting for consolidation to happen.
