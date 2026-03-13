export interface Philosopher {
  id: string;
  name: string;
  shortName: string;
  era: string;
  origin: string;
  emoji: string;
  accentColor: string;
  secondaryColor: string;
  tagline: string;
  topics: string[];
  quote: string;
}

export const PHILOSOPHERS: Philosopher[] = [
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    shortName: 'Nietzsche',
    era: '1844–1900',
    origin: 'Germany',
    emoji: '⚡',
    accentColor: '#C0392B',
    secondaryColor: '#922B21',
    tagline: 'Beyond Good and Evil',
    topics: ['Will to Power', 'Übermensch', 'Eternal Recurrence', 'Nihilism'],
    quote: 'God is dead. God remains dead. And we have killed him.',
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    shortName: 'Kant',
    era: '1724–1804',
    origin: 'Prussia',
    emoji: '⚖️',
    accentColor: '#1A5276',
    secondaryColor: '#154360',
    tagline: 'Critique of Pure Reason',
    topics: ['Categorical Imperative', 'Pure Reason', 'Duty Ethics', 'Metaphysics'],
    quote: 'Act only according to that maxim by which you can at the same time will it to be universal law.',
  },
  {
    id: 'tolstoy',
    name: 'Leo Tolstoy',
    shortName: 'Tolstoy',
    era: '1828–1910',
    origin: 'Russia',
    emoji: '🌾',
    accentColor: '#1E8449',
    secondaryColor: '#196F3D',
    tagline: 'Truth. Love. Nonviolence.',
    topics: ['Christian Anarchism', 'Nonviolence', 'Simple Life', 'Moral Truth'],
    quote: 'Everyone thinks of changing the world, but no one thinks of changing himself.',
  },
  {
    id: 'socrates',
    name: 'Socrates',
    shortName: 'Socrates',
    era: '470–399 BC',
    origin: 'Athens',
    emoji: '🏛️',
    accentColor: '#7D6608',
    secondaryColor: '#6D5A07',
    tagline: 'I Know That I Know Nothing',
    topics: ['Socratic Method', 'Virtue', 'Justice', 'The Good Life'],
    quote: 'The unexamined life is not worth living.',
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    shortName: 'Aristotle',
    era: '384–322 BC',
    origin: 'Stagira, Greece',
    emoji: '🦉',
    accentColor: '#6C3483',
    secondaryColor: '#5B2C6F',
    tagline: 'The Golden Mean',
    topics: ['Eudaimonia', 'Virtue Ethics', 'Logic', 'Natural Philosophy'],
    quote: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.',
  },
  {
    id: 'descartes',
    name: 'René Descartes',
    shortName: 'Descartes',
    era: '1596–1650',
    origin: 'France',
    emoji: '🔭',
    accentColor: '#2E86C1',
    secondaryColor: '#2874A6',
    tagline: 'Cogito, Ergo Sum',
    topics: ['Methodical Doubt', 'Mind-Body Dualism', 'Rationalism', 'Mathematics'],
    quote: 'I think, therefore I am.',
  },
];

export const getPhilosopher = (id: string): Philosopher | undefined => {
  return PHILOSOPHERS.find(p => p.id === id);
};
