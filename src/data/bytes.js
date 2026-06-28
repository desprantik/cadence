import { loadProfile } from './profile';

export const bytes = [
  {
    id: 'byte-1',
    topic: 'UX',
    title: 'The 5-second rule for first impressions',
    duration: '1 min read',
    type: 'text',
    body: 'Users form an opinion about your interface in under five seconds. Lead with hierarchy: one clear headline, one primary action, and enough whitespace that the eye knows where to land.',
  },
  {
    id: 'byte-2',
    topic: 'Figma',
    title: 'Auto Layout in 60 seconds',
    duration: '1 min video',
    type: 'video',
    body: 'Stack frames vertically, add padding, and let Auto Layout resize with content—no more manual nudging when copy changes.',
    videoThumb:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop&q=80',
  },
  {
    id: 'byte-3',
    topic: 'UX',
    title: 'Quick check: usability heuristics',
    duration: '30 sec quiz',
    type: 'quiz',
    quiz: {
      question: 'Which Nielsen heuristic is about keeping users informed?',
      options: [
        'Visibility of system status',
        'Aesthetic and minimalist design',
        'Recognition rather than recall',
      ],
      correctIndex: 0,
    },
  },
  {
    id: 'byte-4',
    topic: 'Brand',
    title: 'Logo lockups that scale',
    duration: '1 min read',
    type: 'text',
    body: 'Define minimum clear space as a fraction of the mark height. Ship horizontal, stacked, and icon-only variants so partners never improvise spacing.',
  },
  {
    id: 'byte-5',
    topic: 'Typography',
    title: 'Pairing display + body type',
    duration: '1 min video',
    type: 'video',
    body: 'Contrast weight more than family: a bold grotesk headline with a neutral sans body reads intentional without feeling mismatched.',
    videoThumb:
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=640&h=360&fit=crop&q=80',
  },
  {
    id: 'byte-6',
    topic: 'UI',
    title: 'Spacing scale sanity check',
    duration: '30 sec quiz',
    type: 'quiz',
    quiz: {
      question: 'Why use a 4px or 8px spacing grid?',
      options: [
        'It aligns to common screen densities and keeps rhythm consistent',
        'It makes every layout identical',
        'Browsers only render multiples of four',
      ],
      correctIndex: 0,
    },
  },
  {
    id: 'byte-7',
    topic: 'Motion',
    title: 'Easing that feels natural',
    duration: '1 min read',
    type: 'text',
    body: 'Enter animations ease-out (fast start, soft land). Exits ease-in. Keep UI transitions between 150–250ms—long enough to read, short enough to ignore.',
  },
  {
    id: 'byte-8',
    topic: 'Design Systems',
    title: 'Tokens before components',
    duration: '1 min read',
    type: 'text',
    body: 'Color, type, and spacing tokens are the contract. Components are implementations. When tokens change, the system updates everywhere without hunting hex codes.',
  },
  {
    id: 'byte-9',
    topic: 'Accessibility',
    title: 'Focus states matter',
    duration: '30 sec quiz',
    type: 'quiz',
    quiz: {
      question: 'What is the minimum contrast for normal UI text (WCAG AA)?',
      options: ['3:1', '4.5:1', '7:1'],
      correctIndex: 1,
    },
  },
  {
    id: 'byte-10',
    topic: 'Figma',
    title: 'Component variants in practice',
    duration: '1 min video',
    type: 'video',
    body: 'One component set with variant properties (size, state) beats ten duplicate buttons. Designers swap states; devs map to props.',
    videoThumb:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=640&h=360&fit=crop&q=80',
  },
  {
    id: 'byte-11',
    topic: 'Research',
    title: 'Five users is often enough',
    duration: '1 min read',
    type: 'text',
    body: 'Nielsen’s research shows most usability issues surface with five participants. Run short rounds often instead of one giant study.',
  },
  {
    id: 'byte-12',
    topic: 'Color',
    title: 'Semantic color naming',
    duration: '30 sec quiz',
    type: 'quiz',
    quiz: {
      question: 'Better token name for a destructive button background?',
      options: ['red-500', 'color-danger-bg', 'button-red'],
      correctIndex: 1,
    },
  },
];

function scoreByte(byte, terms) {
  const haystack = `${byte.topic} ${byte.title}`.toLowerCase();
  let score = 0;
  terms.forEach((term) => {
    if (haystack.includes(term.toLowerCase())) score += 2;
  });
  return score;
}

function pickOne(pool, usedIds) {
  const available = pool.filter((b) => !usedIds.has(b.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function buildSessionStack(profile = loadProfile()) {
  const terms = [...(profile.goals ?? []), ...(profile.topics ?? [])];
  const scored = bytes
    .filter((b) => b.type !== 'quiz')
    .map((b) => ({ byte: b, score: scoreByte(b, terms) }))
    .sort((a, b) => b.score - a.score);

  const used = new Set();
  const stack = [];

  const textPool = scored.filter((s) => s.byte.type === 'text').map((s) => s.byte);
  const videoPool = scored.filter((s) => s.byte.type === 'video').map((s) => s.byte);
  const quizPool = bytes.filter((b) => b.type === 'quiz');

  const text = pickOne(textPool.length ? textPool : bytes.filter((b) => b.type === 'text'), used);
  if (text) {
    stack.push(text);
    used.add(text.id);
  }

  const video = pickOne(videoPool.length ? videoPool : bytes.filter((b) => b.type === 'video'), used);
  if (video) {
    stack.push(video);
    used.add(video.id);
  }

  const quizScored = quizPool
    .map((b) => ({ byte: b, score: scoreByte(b, terms) }))
    .sort((a, b) => b.score - a.score);
  const quiz = pickOne(
    quizScored.map((s) => s.byte),
    used
  );
  if (quiz) {
    stack.push(quiz);
    used.add(quiz.id);
  }

  while (stack.length < 3) {
    const extra = pickOne(bytes, used);
    if (!extra) break;
    stack.push(extra);
    used.add(extra.id);
  }

  return stack;
}
