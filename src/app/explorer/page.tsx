import type { Metadata } from 'next';
import { Container, PageIntro } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';
import ExplorerClient from './ExplorerClient';

export const metadata: Metadata = pageMetadata({
  title: 'Explorer',
  description: 'An interactive map of how my projects, roles, technologies and ideas connect.',
  path: '/explorer',
});

export default function ExplorerPage() {
  return (
    <Container>
      <PageIntro kicker="Explorer" title="Every skill, traced to where I actually used it.">
        A technology here is not a badge. Pick one and the graph re-settles around the projects, roles and ideas it
        connects to.
      </PageIntro>
      <ExplorerClient />
    </Container>
  );
}
