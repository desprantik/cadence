/** Progress status colors — green / yellow / red (not platform brands). */
export function getProgressColor(percent) {
  if (percent >= 70) return '#2A9D5C';
  if (percent >= 40) return '#C9A006';
  return '#D64545';
}

export function getProgressStatus(percent) {
  if (percent >= 70) return 'on-track';
  if (percent >= 40) return 'caution';
  return 'behind';
}
