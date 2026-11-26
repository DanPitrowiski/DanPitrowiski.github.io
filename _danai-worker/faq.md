<!--
DanAI FAQ: Dan's own answers to common questions.

How to add one:
- Start each question with "## " on its own line.
- Write the answer on the lines under it.
- For a bulleted list, start each item on its own line with "- ".
  For a numbered list, use "1. ", "2. " and so on. Every other line shows as its own paragraph.
  No bold, links or headings: the chat shows plain text and lists only.
- DanAI shows your answer exactly as written, so write it the way you want it read.
  First person ("I...") shows as first person. These answers win over anything else on the site.
- Shorter reads better in the small chat panel.

After editing, run from the repo root:
    python3 _danai-worker/build-knowledge.py
    cd _danai-worker && npx wrangler deploy

Anything inside these comment marks is ignored.
-->

## Can I email you?
Yes. Email him at danpitrowiski@gmail.com, or download his resume for the full picture.


## Can you walk me through your design process?
Sure thing! This is my typical process:

1. Know the Problem: The first step is always understanding the full problem, know the business goals, technical constraints, and user research.
2. Ideas: With the team, developers, and/or stakeholders talk about potential solutions and lay them out.
3. Rapid Prototyping: Using tools like Cursor, Claude, Figma Make we can generate our ideas quickly.
4. Testing: Get the prototypes in front of people and start hearing feedback. Iterate fast.
5. Internal Feedback: Show the prototypes to the team and see if there are any last changes or concerns. It’s easier for people to give feedback the more concrete ideas are.
6. Hand-off: Get the design ready for hand-off to the developers.

This type of flow I find best to get an idea, to design, and to production with the best results.

## How do you approach product strategy?

My approach starts with building a strong understanding of the landscape. It's best to know the competitors, the user needs, the business goals, and current technical constraints. With that knowledge, then we can evaluate opportunities from different perspectives, and prioritize ideas that deliver meaningful value to users and drive business.

## How do you design AI people can trust?

There are (3) keys I learned from building an AI product for Wootric CXI.

1. Transparent Results - show users exactly how the AI did the work and what it changed or added.
2. User Controls - Give the user as many guardrails and controls as they need to make sure the AI is only working the way they want it to.
3. Case Study - Build a real-life use case with one customer at least, that can be an example for others. It's easier to trust you if one customer already vouches for you.


## What's your best example of AI product design?

CXInsights at Wootric. It was one of the first AI products in customer feedback. Our core product helped companies survey their customers across every channel (Web , Email, iOS, Android, SMS, etc.) The problem came when Enterprise customers needed a solution that scaled across millions of responses and a variety survey questions.

I was the solo designer on it for about ten years, from the first concept through launch and every version after.

Long story short, Wootric grew from roughly $1M to $3M ARR in about a year before InMoment acquired us. The long story is in my case studies.

## What kind of role are you looking for?

A senior or lead product design role where I own a real product area end to end. For most of my 16 years I've been the solo lead designer at a startup, so I'm used to being the one who sets up the system, ships the work, and then goes back and improves it.

Going forward I also want to lead and mentor a team. AI is changing teams fast, and I’d like to help people grow just as fast.

I'm based in California with my wife and 2 year old daughter, so I'm looking for something remote or in the SF Bay Area.

## What business impact has your design work had?

A few I can point to:

- Wootric grew from about $1M to $3M ARR while I was the lead designer, and the platform scaled quickly past $5M after the InMoment acquisition. After my products revenue was combined with InMoment and became harder to reliably quantify.
- CXInsights, the AI feedback product I designed, became the reason a lot of those customers picked us. DocuSign, Zoom, Foot Locker and Nissan were all on it.
- The Wootric surveys I designed have been seen over 2,147,483,647 times. I know that because our backend briefly broke a few years ago when we reached the limit of a 32-bit integer number.

## What business impact has your design work had?

A few I can point to:

- Wootric grew from about $1M to $3M ARR while I was the lead designer, and the platform scaled quickly past $5M after the InMoment acquisition. After that my product's revenue was combined with InMoment's and became harder to quantify reliably.
- CXInsights, the AI feedback product I designed, became the reason a lot of customers picked us. DocuSign, Zoom, Foot Locker and Nissan were all on it.
- The Wootric surveys I designed have been seen at least 2,147,483,647 times. I know the exact number because our backend briefly broke a few years ago when the count hit the limit of a 32-bit integer.

## What makes you different from other senior product designers?

Three things, honestly.

I've been the only designer for most of my career, so I've done the whole job: research, design systems, prototypes, specs, and the help docs and release notes after launch. No detail is too small, and there's no part of it I haven't done myself for years.

I've designed AI features since 2019, well before that was something every designer was doing. I know where AI products lose people, which is almost always trust and control rather than accuracy.

And I've been through three acquisitions with the same product, so I've designed for a scrappy startup and for an enterprise org with compliance and accessibility requirements, on the same codebase.

## How do you use AI in your own design work?

Constantly.

I prototype with Claude, Cursor, and Figma Make, which means I can put a working version in front of someone in a day instead of describing it.

I build real tools with it. There's an AI agent on this site that evaluates trades for my fantasy baseball league, and the chatbot you're talking to right now is one I built and trained on my own answers.

And I rebuilt this entire portfolio with AI as my pair, working from a design system I built in Figma. That's a decent stress test of what it's actually good at and where it still needs a designer.

## Tell me about a design that didn't work out.

Watchlists in CXI. The idea was that you could track a group of customers who mattered to you. One out-of-the-box group was customers whose scores were trending down, and you could build your own.

My original design had Watchlists running through the whole product. You could use one as a filter on any tab, and being on a watchlist was a flag attached to the customer and their feedback, so it followed them everywhere.

Engineering cleared the feature up front. When it came time to build it, it turned out to be much harder than we'd imagined.

Customers told us they wanted it, so we determined it was still worth building. But we had to massively pare it down to exist on it's own page and not integrated.

After release, Watchlists saw very little use. It became one of those subpages nobody bothered to click into.

Two things I took from it.

1. Get engineering into the design early, and walk them through the feature yourself. Help them see it the way you see it.
2. Don't silo. Users don't want to click away from the main page they work in unless they have to.
