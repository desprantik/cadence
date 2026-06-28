import {
  completedCourses,
  inProgressCourses,
} from '../data/learner';

export function getPlatformCourses(platform, status) {
  const inProgress = inProgressCourses.filter((c) => c.platform === platform);
  const completed = completedCourses.filter((c) => c.platform === platform);
  const enrolled = [...inProgress, ...completed];

  if (status === 'enrolled') return enrolled;
  if (status === 'in-progress') return inProgress;
  if (status === 'completed') return completed;
  return [];
}
