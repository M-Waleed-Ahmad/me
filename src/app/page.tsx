import type { Metadata } from 'next';
import MapHome from '@/components/home/MapHome';
import { profile } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: `${profile.name} · ${profile.role}`,
  description:
    'Software engineer in Lahore: full-stack and AI systems. Projects: DeepShield, WePsych, Axelliant CI/CD, Arabia Hills and ALFA Club, mapped to where they were built and what they run on.',
  path: '/',
  absolute: true,
});

export default function Home() {
  return <MapHome />;
}
