import {
  completedCourses,
  inProgressCourses,
  recommendations,
} from './learner';

export const courseTopicsMap = {
  'ip-1': [
    { id: 'ip-1-t1', title: 'Smart Animate fundamentals', duration: '14 min', status: 'completed' },
    { id: 'ip-1-t2', title: 'Overlay & dissolve transitions', duration: '18 min', status: 'completed' },
    { id: 'ip-1-t3', title: 'Spring physics & easing curves', duration: '22 min', status: 'completed' },
    { id: 'ip-1-t4', title: 'Interactive component variants', duration: '26 min', status: 'upcoming' },
    { id: 'ip-1-t5', title: 'Scroll-linked prototypes', duration: '20 min', status: 'upcoming' },
    { id: 'ip-1-t6', title: 'Handoff-ready motion specs', duration: '16 min', status: 'upcoming' },
  ],
  'ip-2': [
    { id: 'ip-2-t1', title: 'Foundations of UX design', duration: '45 min', status: 'completed' },
    { id: 'ip-2-t2', title: 'User research basics', duration: '1h 10m', status: 'completed' },
    { id: 'ip-2-t3', title: 'Wireframing & prototyping', duration: '55 min', status: 'upcoming' },
    { id: 'ip-2-t4', title: 'Usability testing', duration: '40 min', status: 'upcoming' },
    { id: 'ip-2-t5', title: 'Portfolio case study', duration: '1h 20m', status: 'upcoming' },
  ],
  'ip-3': [
    { id: 'ip-3-t1', title: 'Logo anatomy & geometry', duration: '22 min', status: 'completed' },
    { id: 'ip-3-t2', title: 'Color in brand systems', duration: '18 min', status: 'upcoming' },
    { id: 'ip-3-t3', title: 'Typography for identity', duration: '24 min', status: 'upcoming' },
    { id: 'ip-3-t4', title: 'Brand guidelines document', duration: '30 min', status: 'upcoming' },
    { id: 'ip-3-t5', title: 'Real-world identity rollout', duration: '28 min', status: 'upcoming' },
  ],
  'rec-1': [
    { id: 'rec-1-t1', title: 'Type hierarchy essentials', duration: '32 min', status: 'upcoming' },
    { id: 'rec-1-t2', title: 'Pairing display & body fonts', duration: '28 min', status: 'upcoming' },
    { id: 'rec-1-t3', title: 'Responsive type scales', duration: '24 min', status: 'upcoming' },
  ],
  'rec-2': [
    { id: 'rec-2-t1', title: 'Blender UI for designers', duration: '25 min', status: 'upcoming' },
    { id: 'rec-2-t2', title: 'Modeling simple 3D icons', duration: '35 min', status: 'upcoming' },
    { id: 'rec-2-t3', title: 'Lighting & rendering', duration: '30 min', status: 'upcoming' },
  ],
  'rec-3': [
    { id: 'rec-3-t1', title: 'Token architecture', duration: '40 min', status: 'upcoming' },
    { id: 'rec-3-t2', title: 'Component libraries in Figma', duration: '45 min', status: 'upcoming' },
    { id: 'rec-3-t3', title: 'Documentation & governance', duration: '35 min', status: 'upcoming' },
  ],
  'done-1': [
    { id: 'done-1-t1', title: 'Layout fundamentals', duration: '30 min', status: 'completed' },
    { id: 'done-1-t2', title: 'Component patterns', duration: '42 min', status: 'completed' },
    { id: 'done-1-t3', title: 'Capstone project', duration: '1h 15m', status: 'completed' },
  ],
  'done-2': [
    { id: 'done-2-t1', title: 'Empathize & define', duration: '50 min', status: 'completed' },
    { id: 'done-2-t2', title: 'Ideate & prototype', duration: '1h', status: 'completed' },
    { id: 'done-2-t3', title: 'Test & iterate', duration: '45 min', status: 'completed' },
  ],
  'done-3': [
    { id: 'done-3-t1', title: 'Pen tool mastery', duration: '38 min', status: 'completed' },
    { id: 'done-3-t2', title: 'Icon design workflow', duration: '44 min', status: 'completed' },
  ],
  'done-4': [
    { id: 'done-4-t1', title: 'Color wheel & harmony', duration: '20 min', status: 'completed' },
    { id: 'done-4-t2', title: 'Digital color application', duration: '25 min', status: 'completed' },
  ],
  'disc-1': [
    { id: 'disc-1-t1', title: 'WCAG principles overview', duration: '20 min', status: 'upcoming' },
    { id: 'disc-1-t2', title: 'Contrast & readability', duration: '25 min', status: 'upcoming' },
    { id: 'disc-1-t3', title: 'Accessible component patterns', duration: '30 min', status: 'upcoming' },
  ],
  'disc-2': [
    { id: 'disc-2-t1', title: 'Framer canvas basics', duration: '22 min', status: 'upcoming' },
    { id: 'disc-2-t2', title: 'Interactive transitions', duration: '28 min', status: 'upcoming' },
  ],
  'disc-3': [
    { id: 'disc-3-t1', title: 'What are design tokens?', duration: '18 min', status: 'upcoming' },
    { id: 'disc-3-t2', title: 'Token naming conventions', duration: '24 min', status: 'upcoming' },
  ],
  'disc-4': [
    { id: 'disc-4-t1', title: 'Auto layout deep dive', duration: '15 min', status: 'upcoming' },
    { id: 'disc-4-t2', title: 'Responsive constraints', duration: '20 min', status: 'upcoming' },
  ],
};

const allCourses = [
  ...inProgressCourses,
  ...recommendations,
  ...completedCourses,
];

export function getCourseById(id) {
  return allCourses.find((c) => c.id === id) ?? null;
}

export function getCourseTopics(courseId) {
  if (courseTopicsMap[courseId]) return courseTopicsMap[courseId];
  return [
    { id: `${courseId}-t1`, title: 'Getting started', duration: '15 min', status: 'upcoming' },
    { id: `${courseId}-t2`, title: 'Core concepts', duration: '22 min', status: 'upcoming' },
    { id: `${courseId}-t3`, title: 'Practice project', duration: '30 min', status: 'upcoming' },
  ];
}

export function splitTopicsByStatus(topics) {
  return {
    completed: topics.filter((t) => t.status === 'completed'),
    upcoming: topics.filter((t) => t.status === 'upcoming'),
  };
}
