import type { MediaName } from './media';

/**
 * About, as one continuous route rather than a grid of tiles.
 *
 * The tile version put places, paintings, clubs and books in identical boxes
 * with no relationship between them, so it read as scattered squares. Life
 * already has an order, so the page follows it: three places, then the things
 * that fill the time. Everything hangs off one spine, which is what turns a
 * pile of facts into something you can read top to bottom.
 */

export const bio = [
  `I started out in computer engineering. I still like the building part, but
   somewhere between a data structures class and my first user interview I
   worked out that I liked the part <em>before</em> the building a lot more.
   The pivot took a couple of semesters, but I have no regrets.`,
] as const;

/**
 * About, as a spread rather than a set of controls.
 *
 * Three attempts got here. A bento grid put unrelated things in identical
 * boxes and read as scattered squares. A spine implied a chronology only the
 * places actually have. Tabs fixed the ordering but made everything cost a
 * click and left the panel half empty.
 *
 * What is left is the obvious thing: show it all at once, and stop putting
 * text in boxes. Only the photographs are objects here. The words sit
 * directly on the page the way they would in a magazine, which is what stops
 * nine items reading as nine tiles.
 */
export type Piece =
  | {
      kind: 'photo';
      name: MediaName;
      alt: string;
      focus?: string;
      /** Portrait, landscape or square. Variety is what keeps it from gridding. */
      shape: 'tall' | 'wide' | 'square';
      label: string;
      note?: string;
    }
  | {
      kind: 'note';
      label: string;
      title: string;
      body?: string;
      places?: Array<{ place: string; note: string }>;
      books?: { now: string; forever: string };
    };

export const pieces: Piece[] = [
  {
    kind: 'note',
    label: 'Born, raised, living',
    title: 'Three places, so far',
    places: [
      { place: 'Maturín, Venezuela', note: 'where I was born' },
      { place: 'Ciudad del Carmen', note: 'grew up on a beautiful island south of Mexico' },
      { place: 'Monterrey', note: 'senior year, software engineering at Tec de Monterrey' },
    ],
    body: 'And a few places in between, which is where I picked up the love for learning languages and new cultures.',
  },
  {
    kind: 'photo',
    name: 'about-travel-1',
    alt: 'Me sitting on a boardwalk through a flooded forest carpeted in bright green.',
    focus: 'center 55%',
    shape: 'tall',
    label: 'Travelling',
    note: 'The hobby that keeps me curious and hungry for more.',
  },
  {
    kind: 'photo',
    name: 'about-theatre',
    alt: 'A musical theatre scene, six performers together under stage lights.',
    focus: 'center 84%',
    shape: 'wide',
    label: 'Musical theatre and dance',
    note: 'My favourite form of human connection.',
  },
  {
    kind: 'note',
    label: 'Reading',
    title: 'Mythology and the old classics',
    books: { now: 'The Divine Comedy', forever: 'The Odyssey' },
  },
  {
    kind: 'photo',
    name: 'about-painting-2',
    alt: 'An oil painting of a waterfall and a white winged figure, exhibited.',
    focus: 'center 42%',
    shape: 'square',
    label: 'Oil painting',
    note: 'Visualizing my thoughts and dreams. No undo button, which is good practice.',
  },
  {
    kind: 'note',
    label: 'Social service · ongoing',
    title: 'Geeky Minds',
    body: 'A programme with Engagement Foundation, getting girls from underdeveloped countries interested in the STEM careers nobody told them were an option.',
  },
  {
    kind: 'photo',
    name: 'about-nobel',
    alt: 'Me at the 19th World Summit of Nobel Peace Laureates in Monterrey, wearing a volunteer badge.',
    focus: 'center 38%',
    shape: 'tall',
    label: 'World Summit of Nobel Peace Laureates',
    note: 'A separate thing entirely: volunteer staff for the summit itself, Monterrey 2024.',
  },
  {
    kind: 'note',
    label: 'And more',
    title: 'Other volunteering',
    body: 'A handful of other outreach and community projects that did not fit on one page.',
  },
  {
    kind: 'note',
    label: 'Vice president',
    title: 'Swiftec',
    body: 'Tec de Monterrey’s innovation hub for Swift research, development and community.',
  },
];
