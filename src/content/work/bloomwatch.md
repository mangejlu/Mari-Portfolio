---
title: BloomWatch
tagline: Twenty years of satellite data, pointed at one question. When should I stay inside?
summary: >-
  Built for the NASA Space Apps Challenge 2025. Turns NASA phenology data into
  a bloom forecast that tells allergy sufferers in Monterrey what's coming.
order: 2
next: kairuu
accent: '#6FB98F'
aura: ['#BFE0C4', '#DCE9B8', '#A9D3C4']
tags: ['data visualization', 'civic tech', '48-hour build']

meta:
  type: UX/UI · Data product
  client: NASA Space Apps Challenge 2025
  year: '2025'
  team: 2 people
  role: ['Interface design', 'Front-end development']
  tools: ['Figma', 'NASA Earthdata']

stats:
  - value: '4,149'
    label: satellite data points analysed
    note: Nine regions of Monterrey, one model each.
    kind: measured
  - value: '20 yrs'
    label: of observations, 2005–2024
    note: NASA’s flowering and vegetation records for the whole metro area.
    kind: measured
  - value: '2–3%'
    label: average error on the bloom forecast
    note: Close enough to plan a week around.
    kind: measured
  - value: '8.8x'
    label: more greenery in the leafiest district than the barest
    note: The same city, two completely different springs.
    kind: measured

problem:
  hmw: >-
    How might we turn two decades of satellite phenology data into something a
    person with allergies can act on this week?
  thesis: The data was public the whole time. Nobody had made it answer a human question.
  questions:
    - When does my neighbourhood actually bloom?
    - Is this week worse than last week?
    - Which part of the city should I avoid?
    - Is this year early, or am I imagining it?

researchHeading: What I read, and what it told me

research:
  methods:
    - label: NASA flowering and vegetation datasets
      count: '2'
    - label: Regions modelled independently across the metro area
      count: '9'
    - label: Seasons of historical observation per region
      count: '20'
    - label: Forecast approaches compared before picking one
      count: '3'
  insights:
    - title: A city is not one climate.
      body: >-
        One district has nearly nine times the greenery of another. A single
        city-wide pollen number would be wrong for almost everyone, so every
        view is regional first.
    - title: Bloom is a season, not a day.
      body: >-
        The peak lands in October, but what people need is the few days of
        warning before it. So the interface shows the curve rising, not today’s
        number.
    - title: The simplest forecast won, and that was a design decision.
      body: >-
        The plainest approach matched the fancy ones for accuracy. I picked it
        because it’s the one I can explain to the person relying on it.
    - title: We were the users.
      body: >-
        Both of us have allergies. That’s why it answers “should I go outside”
        instead of handing you a chart and wishing you luck.
  quotes:
    - We built the thing we personally needed in allergy season.

shifts:
  - before: A scientific vegetation index
    after: A bloom level for your neighbourhood
    detail: >-
      The raw number means nothing to a non-scientist. It became an intensity
      you read at a glance, with the real figure still there for anyone who
      wants to check the work.
    where: Dashboard
  - before: One number for the whole city
    after: Nine regions, mapped
    detail: >-
      Intensity is painted straight onto the map, so the gap between districts
      is something you see rather than something you’re told.
    where: Map view
  - before: A historical archive
    after: A forecast that admits its own error
    detail: >-
      Twenty years of history becomes a prediction for the season ahead, with
      the error rate printed next to it. A health tool that hides how sure it is
      doesn’t deserve to be trusted.
    where: Forecast

screens:
  - title: Regional bloom map
    purpose: Answer "where in this city is it bad right now" without reading a chart.
    notes:
      - Nine regions, painted by bloom intensity.
      - Tap one for its own curve and history.
  - title: Season dashboard
    purpose: Show the ramp, not just today's value.
    notes:
      - Twenty years of pattern, with this year traced over it.
      - The error rate sits on the chart, not in a footnote.
  - title: Health alerts
    purpose: Turn a rising curve into an actionable warning.
    notes:
      - Alerts per region, keyed to what’s predicted.
      - Written for someone deciding about tomorrow.

gallery:
  - name: bloom-map
    alt: The bloom map of Monterrey, with each of the nine regions marked and shaded by predicted intensity, and controls for zone and year.
    caption: Nine regions, each shaded by what is predicted there. The gap between the leafiest district and the barest is something you see rather than something you are told.
  - name: bloom-alerts
    alt: The alerts view, showing predicted allergen levels for a selected region.
    caption: The forecast turned into the only question that matters, which is whether to go outside this week.

demo:
  name: bloomwatch
  label: Watch the demo
  caption: The full walkthrough. Regional map, season curves, and the alerts built on top of them.

outcome:
  wentWell:
    - Shipped a complete, working product in a hackathon weekend.
    - The regional framing was the whole insight, and it came from the data.
    - Showing the error rate made it more trustworthy, not less.
  improve:
    - Check it against real pollen counts. Greenery predicts pollen; it isn’t pollen.
    - Test with allergy sufferers who weren't on the team.
    - Fix the map’s accessibility. Intensity leans on colour alone right now.
  next:
    - Take it beyond Monterrey.
    - Push notifications ahead of a predicted ramp.
    - Break it down by species, since not every bloom sets off every allergy.

reflection: >-
  The data had been public for twenty years. What was missing was a question
  worth pointing it at. Almost all the design work was translation: taking something built for
  researchers and turning it into an answer for someone at their front door,
  deciding whether to grab the antihistamines.

links:
  - label: See the project
    href: https://github.com/ficiency/NASA-Space-Challenge-2025
    cursor: open it
  - label: The challenge brief
    href: https://www.spaceappschallenge.org/2025/challenges/bloomwatch-an-earth-observation-application-for-global-flowering-phenology/
    cursor: visit

---

Two people with allergies, one weekend, and twenty years of NASA satellite
observations that nobody had pointed at the question we actually had.
