export interface Philosopher {
  id: string;
  name: string;
  shortName: string;
  era: string;
  origin: string;
  emoji: string;
  image: string;
  localImage: number;
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/400px-Nietzsche187a.jpg',
    localImage: require('../../assets/philosophers/nietzsche.jpg'),
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Immanuel_Kant_%28painted_portrait%29.jpg/400px-Immanuel_Kant_%28painted_portrait%29.jpg',
    localImage: require('../../assets/philosophers/kant.jpg'),
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/L.N.Tolstoy_Prokudin-Gorsky.jpg/400px-L.N.Tolstoy_Prokudin-Gorsky.jpg',
    localImage: require('../../assets/philosophers/tolstoy.jpg'),
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Socrate_du_Louvre.jpg/400px-Socrate_du_Louvre.jpg',
    localImage: require('../../assets/philosophers/socrates.jpg'),
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/400px-Aristotle_Altemps_Inv8575.jpg',
    localImage: require('../../assets/philosophers/aristotle.jpg'),
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg/400px-Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg',
    localImage: require('../../assets/philosophers/descartes.jpg'),
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
