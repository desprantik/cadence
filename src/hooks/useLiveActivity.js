import { useEffect, useState } from 'react';
import { getLiveActivity } from '../data/socialProof';

export function useLiveActivity(refreshMs = 45000) {
  const [activity, setActivity] = useState(getLiveActivity);

  useEffect(() => {
    const tick = () => setActivity(getLiveActivity());
    const id = setInterval(tick, refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  return activity;
}
