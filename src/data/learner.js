export const learner = {
  name: 'Prantik',
  streak: {
    current: 4,
    goal: 10,
    today: 3,
    totalHours: 36,
  },
  overallProgress: 78,
  progressNudge: 'Complete these to reach 100% in 2 months',
};

export const platformProgress = [
  { platform: 'Udemy', percent: 85, courses: 4, completed: 2, inProgress: 1 },
  { platform: 'Coursera', percent: 72, courses: 3, completed: 1, inProgress: 1 },
  { platform: 'Skillshare', percent: 61, courses: 3, completed: 1, inProgress: 1 },
  { platform: 'YouTube', percent: 45, courses: 2, completed: 0, inProgress: 0 },
];

export const platformColors = {
  Udemy: '#A435F0',
  Coursera: '#0056D2',
  Skillshare: '#00FF84',
  YouTube: '#FF0000',
};

export const inProgressCourses = [
  {
    id: 'ip-1',
    title: 'Figma Advanced Prototyping',
    platform: 'Udemy',
    instructor: 'Mizko',
    progress: 62,
    timeToComplete: '6h left',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'ip-2',
    title: 'Google UX Design Certificate',
    platform: 'Coursera',
    instructor: 'Google Career Certificates',
    progress: 45,
    timeToComplete: '12h left',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'ip-3',
    title: 'Logo Design & Brand Identity',
    platform: 'Skillshare',
    instructor: 'Aaron Draplin',
    progress: 28,
    timeToComplete: '4h left',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=480&h=280&fit=crop&q=80',
  },
];

export const recommendations = [
  {
    id: 'rec-1',
    title: 'Typography for Designers',
    platform: 'Skillshare',
    duration: '4h 20m',
    image:
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'rec-2',
    title: '3D for UI Designers — Blender Basics',
    platform: 'YouTube',
    duration: '2h 15m',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'rec-3',
    title: 'Design Systems in Figma',
    platform: 'Coursera',
    duration: '6 weeks',
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=480&h=280&fit=crop&q=80',
  },
];

export const completedCourses = [
  {
    id: 'done-1',
    title: 'UI Design Bootcamp',
    platform: 'Udemy',
    completedDate: 'Mar 12, 2026',
    timeToComplete: '18h total',
    image:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'done-2',
    title: 'Design Thinking Specialization',
    platform: 'Coursera',
    completedDate: 'Feb 28, 2026',
    timeToComplete: '24h total',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'done-3',
    title: 'Adobe Illustrator Essentials',
    platform: 'Skillshare',
    completedDate: 'Jan 15, 2026',
    timeToComplete: '5h total',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=480&h=280&fit=crop&q=80',
  },
  {
    id: 'done-4',
    title: 'Color Theory for Digital Design',
    platform: 'YouTube',
    completedDate: 'Dec 8, 2025',
    timeToComplete: '2h total',
    image:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=480&h=280&fit=crop&q=80',
  },
];

export const aiSearchPlaceholders = [
  'What design course should I take next?',
  'Find me a free Figma prototyping alternative',
  'How close am I to finishing my UX stack?',
];

export const stats = {
  enrolled: 12,
  completed: 4,
  inProgress: 3,
};
