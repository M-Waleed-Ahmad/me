import type { Metadata } from 'next';
import MapHome from '@/components/home/MapHome';
import { profile } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: `${profile.name} · ${profile.role}`,
  description:
    'AI & full-stack developer in Lahore. Projects: DeepShield, Arabia Hills, WePsych, BudgetBuddy and ALFA Club, plus CI/CD and test automation at Axelliant, mapped to where they were built and what they run on.',
  path: '/',
  absolute: true,
});

export default function Home() {
  return <MapHome />;
}
