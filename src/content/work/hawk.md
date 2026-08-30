---
title: HAWK
tagline: Where risk is seen coming.
summary: >-
  FEMSA ran its audits in Archer, a system that technically solved every problem but   failed as an experience. HAWK rebuilds the audit as a living case file.
order: 1
next: bloomwatch
accent: '#E8A33D'
aura: ['#F6D9A4', '#EFC58E', '#E8DCC4']
tags: ['enterprise', 'information architecture', '0→1']

meta:
  type: UX/UI · Web app
  client: FEMSA, corporate audit group
  year: '2026'
  team: 5 people
  role: ['Product designer', 'Front-end developer']
  tools: ['Figma', 'Notion', 'React']

problem:
  hmw: >-
    How might we help FEMSA’s audit group understand, manage and act on audit
    information without losing context across tools, files and approvals?
  thesis: Organizations don’t lose because they lack data. They lose because they see it late.
  questions:
    - Which audits need attention right now?
    - What evidence is still missing?
    - Who owns each open item?
    - Which findings are overdue or at risk?
    - What changed, and why?
    - What can be closed, and what needs approval?

research:
  methods:
    - label: FEMSA employees interviewed, from audit leads to the people uploading the evidence
      count: '5'
    - label: External audit employees I reached out to, so the picture wasn't just one company's habits
      count: '2'
    - label: Competitive benchmark of audit tools, plus the spreadsheet-and-email workaround everyone actually uses
      count: '6 tools'
    - label: Sat with the brief and the existing system until I could see the gaps.
  insights:
    - title: The information exists. It just isn’t designed to be consulted efficiently.
      body: >-
        Status, evidence and risk are all in there, just spread across enough
        screens that nobody assembles the whole picture unless they go through a thorough training period. The fix was hierarchy, not more data.
    - title: An audit is a case file, not a row in a table.
      body: >-
        Archer treated audits as records. People experience them as ongoing
        stories. Giving each one its own view, outside of a table, was the biggest change I made.
    - title: Evidence needs visible traceability.
      body: >-
        A file on its own says nothing. It has to show what it belongs to, who
        added it, and whether anyone has checked it.
    - title: Approvals live or die on status clarity.
      body: >-
        When you can’t see what state something is in, the gap fills with chase
        emails and unnecesary meetings. In hawk, requests and approval are visible from the start.
    - title: AI is only useful once it has context.
      body: >-
        A general assistant is noise. Tied to one audit and its documents, it can
        actually answer the question the end user has.

shifts:
  - before: No AI integration
    after: An assistant that already knows the file
    detail: >-
      Ask in plain language, get an answer grounded in that audit’s own
      documents, including inside the editors where the work happens.
    where: Process detail · Workspace
  - before: Interface people avoided
    after: Organization, a hierarchy where the next step is intuitive.
    detail: >-
      Every view leads with what needs action. Unfussy, high-contrast, built to
      stay readable through a long session.
    where: Everywhere
  - before: Reporting meant exporting
    after: Charts that live where the data lives
    detail: >-
      Charts live where the data lives. Export became something you can do, not
      something you must do to see your own numbers.
    where: Dashboard · Reports
  - before: Spreadsheets edited outside the system
    after: Editors embedded in the case file
    detail: >-
      Spreadsheets and documents edit in place, so evidence never leaves the
      audit it belongs to.
    where: Workspace

personas:
  - role: Audit lead
    tag: Primary
    initials: AL
    needs:
      - See the state of many audits at a glance.
      - Spot blockers, open items and things about to come due.
      - Review findings, evidence and approvals in one pass.
      - Produce a report without rebuilding the data by hand.
    pains:
      - Too much manual follow-up.
      - Information scattered across several tools.
      - Reports that require exporting and reconsolidating.
  - role: Auditor
    tag: Secondary
    initials: AU
    needs:
      - Know exactly which tasks are theirs.
      - Reach a process’s evidence without hunting.
      - Record findings in a structure that holds up.
      - Comment, update and attach without losing the thread.
    pains:
      - Unintuitive flow.
      - Too many steps to find a document.
      - No context on what changed.
  - role: Audited area
    tag: Secondary
    initials: EV
    needs:
      - Understand exactly what to hand over.
      - See the deadline, the reason and the comments.
      - Upload evidence without losing context.
      - Answer a request without living in email.
    pains:
      - Confusing or incomplete requests.
      - Follow-up that happens over email.
      - No idea whether the evidence was accepted.

principles:
  - title: Prioritize what needs action
    body: Open items and due dates outrank everything else on the screen.
  - title: Keep context attached
    body: Everything stays wired to its audit. Nobody reassembles the story.
  - title: Make status visible
    body: One status vocabulary, used the same way everywhere.
  - title: Reduce manual follow-up
    body: Requests and approvals happen in the product, not around it.
  - title: Design for trust
    body: In audit, the interface has to feel verifiable. Clarity over expression.

screens:
  - title: Dashboard / risk overview
    purpose: Cut search time and help someone decide where to act first.
    solves: UX · Native reporting
    notes:
      - Active processes, average progress, open findings, days to close.
      - Progress trend, findings by status, risks by criticality.
      - Critical tasks, the current audit plan, and notifications.
  - title: The process as a case file
    purpose: Turn each audit into something navigable instead of a table row.
    solves: UX · Traceability
    notes:
      - Header carries tracking ID, standard, owner, status and progress.
      - Tabs for summary, documentation, findings and risks.
      - "Findings read as complete stories: severity, plan, owner, history."
  - title: Contextual AI assistant
    purpose: Answer a question about the process without leaving it.
    solves: AI integration
    notes:
      - Anchored to one process and its documents.
      - Summarizes evidence, flags variance, surfaces risks with no plan.
      - Recommends the next step before period close.
  - title: Workspace with embedded editors
    purpose: Create and edit evidence without leaving the system.
    solves: Editing in-system
    notes:
      - Document grid with preview, type and visibility.
      - Spreadsheet and document editors with a formatting bar.
      - Every document can be bound to a process.
  - title: Request documentation
    purpose: Replace scattered email requests with one traceable flow.
    solves: Manual follow-up
    notes:
      - Pick a person or area, give a reason and a deadline.
      - Response state is visible to both sides.
      - Notification is automatic, not somebody’s reminder to themselves.
  - title: Planning and approvals
    purpose: Make it obvious what needs approving, who decides, and what they need first.
    solves: Status clarity
    notes:
      - Current plan with objective, scope, standards and audit team.
      - Approve or reject with a reason attached.
      - Annual programme as a Gantt with a “today” marker.

gallery:
  - name: hawk-dashboard
    alt: HAWK dashboard showing active audits, average progress, open findings, notifications and much more, with trend and risk charts.
    caption: The dashboard opens on what needs attention today, not on everything that exists. Built in Spanish, for the team who uses it.
  - name: hawk-request
    alt: A request-documentation dialog inside an audit, with fields for the person or area, the reason, comments and a deadline, over a list of documents that each have their own comment box.
    caption: Open communication between people and teams, all within the active process. Asking someone for evidence has a reason, a deadline and a trail, instead of living in an inbox.
  - name: hawk-findings
    alt: The findings tab of an audit, listing findings by ID, severity, owner and status, with each one expanded into a full record.
    caption: Every finding carries its own story. Severity, the standard it breaks, who owns it, and what happens next.
  - name: hawk-workspace
    alt: The workspace with an embedded spreadsheet editor and formatting toolbar.
    caption: Spreadsheets and documents edit in place, so evidence never leaves the audit it belongs to.

status:
  label: In development
  body: >-
    The design is done and I'm building the front end. There are no results to
    report yet, and I'd rather say that than dress up a prototype as a launch.
    Come back for the numbers.

reflection: >-
  Nobody needed more information. They needed it arranged so it could be acted
  on. The hard part was never the data. It was building something someone would
  trust enough to make a decision in.

links:
  - label: Open the prototype
    href: https://hawk-audit.figma.site
    cursor: try it

---

Before I could design anything, I had to learn what an audit actually is. I had
never worked in audit, so I studied the whole process end to end, from planning
through evidence gathering to findings and sign-off, until I understood it well
enough to see where it was losing traceability.

What I found was a system that stored things well but let nobody answer a simple
question quickly. In audit, a question answered late is the same as a question
never answered at all.
