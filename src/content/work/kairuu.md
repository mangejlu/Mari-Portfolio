---
title: Kairuu
tagline: Teachers know what to teach. The tooling is what stops them.
summary: >-
  For an early-stage startup founded at my university. Turns a teacher's
  scattered files into structured, reusable learning material without taking
  the pen out of their hand.
order: 3
accent: '#5A5FCF'
aura: ['#C9CBEF', '#B9D9CB', '#DAD3F0']
tags: ['0→1', 'AI', 'research-led']

meta:
  type: UX/UI · Web app
  client: Kairuu, a startup founded at my university in Mexico
  year: '2026'
  team: Design, solo
  role: ['Product designer']
  tools: ['Figma', 'Notion']

stats:
  - value: '5'
    label: people interviewed
    note: Three educators, and two students nobody asked me to talk to.
    kind: measured
  - value: '6'
    label: tools in the competitive scan
    note: Learning platforms and content-creation tools.
    kind: measured
  - value: '3'
    label: usability sessions on the prototype
    note: Three issues found, three fixes shipped.
    kind: measured
  - value: '↓50%'
    label: target time to organise a set of materials
    note: A goal the design was aimed at, not a measured result.
    kind: target

problem:
  hmw: >-
    How might we help teachers, especially newer ones, turn what they know into
    good digital learning material without the technical work eating all their
    time?
  thesis: The gap is not knowledge. It is the distance between knowing something and making it presentable.
  questions:
    - Where do my materials even live right now?
    - Why does updating one slide mean updating everything?
    - How do I make this look like it was made by someone who knows what they are doing?
    - How do I reuse this for a different student next term?

researchHeading: What I asked, and what it told me

research:
  methods:
    - label: Semi-structured interviews with educators, 30 to 45 minutes each
      count: '3'
    - label: Student interviews on how they actually learn on their own
      count: '2'
    - label: Competitive scan across learning platforms and creation tools
      count: '6'
    - label: Moderated usability sessions on the prototype, watching people work
      count: '3'
  quotes:
    - I know what I want to teach, but making it presentable takes forever.
    - My files are everywhere. I remake things because I can’t find them.
    - If I update one slide, I have to update everything else too.
  insights:
    - title: File chaos costs more than anyone admits.
      body: >-
        Teachers rebuild things they already made, because finding the original
        takes longer than starting over.
    - title: Turning expertise into material is the expensive step.
      body: >-
        The knowledge is already there. The hours go into structuring and
        formatting it into something they are not embarrassed to hand out.
    - title: Updating is the real bottleneck.
      body: >-
        One small change means changing it in five places, so it does not
        happen and the material quietly goes stale.
    - title: Students need structure and feedback, not more material.
      body: >-
        Learning alone falls apart without milestones. I only found this because
        I interviewed students too, and it reframed the whole product.
    - title: AI where it saves time, never where it takes control.
      body: >-
        Teachers wanted the help and hated anything they could not edit. So
        every output is a draft they own, and nothing is filed without approval.

shifts:
  - before: Files scattered across five places
    after: Drop everything in, get sorted folders
    detail: >-
      Upload the whole pile and it sorts itself by subject or date, with the
      teacher free to rearrange before anything is confirmed.
    where: Drive
  - before: Hours turning knowledge into a lesson
    after: A guided creation flow
    detail: >-
      Who is it for, what kind of thing, what is the goal. Asking that up front
      is the difference between a usable draft and a generic one.
    where: Create
  - before: Output you cannot touch
    after: Drafts the educator owns
    detail: >-
      Everything generated is editable and versioned. The AI does the first
      pass, the teacher does the judgement.
    where: Library

personas:
  - role: New educator
    tag: Primary
    initials: NE
    needs:
      - Templates and structure to start from.
      - Quick creation without a production skillset.
      - Confidence that the result looks credible.
    pains:
      - Tooling complexity.
      - Time pressure.
      - Inconsistent structure across their own materials.
  - role: Independent tutor
    tag: Secondary
    initials: IT
    needs:
      - Reusable assets across different students.
      - Fast updates that carry everywhere.
      - Shareable outputs in more than one format.
    pains:
      - Versioning.
      - Repetitive formatting.
      - Scattered files.

principles:
  - title: Organise before you create
    body: Sort first, so creating starts from order instead of a pile.
  - title: Capture intent, not just input
    body: Ask who it is for before making anything for them.
  - title: The educator keeps the pen
    body: AI writes drafts. Teachers write finals.

screens:
  - title: Upload and organisation
    purpose: Kill the file-chaos problem before the teacher does anything else.
    notes:
      - Drop in anything, documents, slides, media.
      - It sorts itself, and you get the last word.
  - title: Resource generation
    purpose: Turn raw material into structured learning resources.
    notes:
      - Lesson plans, quizzes, flashcards, summaries, scripts.
      - Source folders, audience, type and goal captured up front.
  - title: Content library
    purpose: Make everything findable and re-editable later.
    notes:
      - Searchable, filterable, all in one place.
      - Every resource keeps its history.
  - title: Dashboard
    purpose: Get someone back to what they were doing in one click.
    notes:
      - What you touched last, right at the top.
      - Upload and create, one click away.

outcome:
  wentWell:
    - Testers walked the whole flow without being prompted once.
    - AI saved time without taking the pen out of anyone’s hand.
    - All three usability issues were fixable in the prototype, and got fixed.
  improve:
    - "“Update everywhere” for reused content. Loudest theme in the interviews, only half answered."
    - Something for the students. I interviewed them, then built only for teachers.
    - The first upload. That is where the product has to earn trust.
  next:
    - Measure the targets with real teachers instead of aiming at them.
    - Connect what gets made to how students do with it.

reflection: >-
  The most useful thing I did was interview students, even though we were only
  building for teachers. It changed what the product was: not a file organiser
  with AI bolted on, but an attempt to shorten the distance between what a
  teacher knows and what a student actually gets. That came from the two
  interviews nobody asked me to do.

links:
  - label: Try the prototype
    href: https://azul-mount-41363409.figma.site
    cursor: try it
---

Three teachers told me the same thing in three different ways. The problem was
never knowing what to teach. It was everything between knowing it and being
able to hand it to someone.
