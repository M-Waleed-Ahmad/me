import Link from 'next/link';
import { Container, Kicker } from '@/components/ui';

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <Kicker>404</Kicker>
      <h1 className="mt-5 max-w-3xl font-serif text-6xl leading-none text-ink sm:text-7xl">
        This page isn&apos;t in the notebook.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-2">
        The link may be old, or the page moved. The case studies are a good place to start.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 text-ink">
        <Link href="/products" className="underline decoration-accent/60 underline-offset-4 hover:text-accent-ink">
          See the work
        </Link>
        <Link href="/" className="underline decoration-accent/60 underline-offset-4 hover:text-accent-ink">
          Home
        </Link>
      </div>
    </Container>
  );
}
