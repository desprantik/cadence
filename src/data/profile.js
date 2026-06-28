import { catalog } from './catalog';

export const STORAGE_KEY = 'cadence.profile';

export const goalOptions = ['UX', 'Brand', 'Motion', 'UI', 'Research', 'Systems'];
export const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'];

export const defaultProfile = {
  role: 'Product Designer',
  experience: 'Intermediate',
  goals: ['UX', 'Brand'],
  topics: ['Figma', 'Design systems', 'Prototyping'],
};

export function loadProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultProfile };
    return { ...defaultProfile, ...JSON.parse(stored) };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getSuggestions(profile) {
  const terms = [
    profile.role,
    profile.experience,
    ...profile.goals,
    ...profile.topics,
  ]
    .join(' ')
    .toLowerCase();

  const scored = catalog
    .filter((item) => !item.subscribed || item.status === 'saved')
    .map((item) => {
      let score = 0;
      const haystack = `${item.title} ${item.topics.join(' ')} ${item.platform}`.toLowerCase();
      profile.goals.forEach((g) => {
        if (haystack.includes(g.toLowerCase())) score += 3;
      });
      profile.topics.forEach((t) => {
        if (haystack.includes(t.toLowerCase())) score += 2;
      });
      if (item.validated) score += 1;
      if (terms.includes('designer') && haystack.includes('design')) score += 1;
      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 6).map(({ item, score }) => ({
    ...item,
    reason: reasonFor(item, profile, score),
  }));
}

function reasonFor(item, profile, score) {
  const matchedGoal = profile.goals.find((g) =>
    item.topics.some((t) => t.toLowerCase().includes(g.toLowerCase()))
  );
  if (matchedGoal) return `Matches your ${matchedGoal} learning goal`;
  const matchedTopic = profile.topics.find((t) =>
    item.title.toLowerCase().includes(t.toLowerCase()) ||
    item.topics.some((tp) => tp.toLowerCase().includes(t.toLowerCase()))
  );
  if (matchedTopic) return `Builds on your interest in ${matchedTopic}`;
  if (score >= 4) return 'Highly relevant to your designer background';
  return 'Recommended based on your profile';
}
