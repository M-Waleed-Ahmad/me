'use client';

import { useSyncExternalStore } from 'react';

const format = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Karachi' }).format(new Date());

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
};

/** Current time in Lahore, so visitors in other time zones know when to expect a reply. */
export default function LahoreClock() {
  const time = useSyncExternalStore(subscribe, format, () => '--:--');
  return <time className="text-ink">{time}</time>;
}
