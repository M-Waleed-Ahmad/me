import type { Metadata } from 'next';
import { selectedWork } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import Diagram from '@/components/figures/Diagram';
import { Container, TextLink } from '@/components/ui';
import { HardParts, KeyValues, NextProject, ProjectHero, SoftCard } from '@/components/project/ProjectPage';
import Questions from '@/components/project/Questions';

const item = selectedWork.find((w) => w.slug === 'budgetbuddy')!;

export const metadata: Metadata = pageMetadata({
  title: 'BudgetBuddy',
  description: item.summary,
  path: '/products/budgetbuddy',
});

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

/*
  Facts and figures come from the project README (github.com/M-Waleed-Ahmad/BudgetBuddy).
  It was a university team project, so the copy describes the system rather than
  claiming any one part of it.
*/
export default function BudgetBuddyProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        description="Personal and shared budgeting without the spreadsheet: plan a monthly budget, track every expense, and manage household money together through shared plans with roles and an approval workflow."
        facts={[
          { value: '3', label: 'shared-plan roles: admin, editor, viewer' },
          { value: '80%', label: 'of a category limit triggers an in-app alert' },
          { value: 'CI', label: 'backend integration tests and frontend build on every push' },
        ]}
      />

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SoftCard
          title="How a request is checked"
          lede="Every call passes security middleware, then an auth check, before a controller touches the database."
        >
          <div className="overflow-x-auto">
            <div className="min-w-[680px] lg:min-w-0">
              <Diagram
                idPrefix="budgetbuddy"
                title="BudgetBuddy request path: the React app sends a Bearer JWT to the Express API; requests pass helmet, CORS and rate limits, then requireAuth or requirePlanRole, before controllers query MongoDB scoped to the owner."
                width={760}
                height={290}
                nodes={[
                  { id: 'spa', x: 85, y: 80, label: 'React SPA', sub: 'fetch client', w: 150 },
                  { id: 'mw', x: 300, y: 80, label: 'Middleware', sub: 'helmet · CORS · limits', w: 180 },
                  { id: 'auth', x: 540, y: 80, label: 'Auth checks', sub: 'requireAuth · PlanRole', w: 190, emphasis: true },
                  { id: 'ctrl', x: 540, y: 220, label: 'Controllers', sub: 'budgets · expenses · family', w: 210 },
                  { id: 'db', x: 250, y: 220, label: 'MongoDB', sub: 'Mongoose 8', w: 150, external: true },
                ]}
                edges={[
                  { from: 'spa', to: 'mw', label: 'Bearer JWT' },
                  { from: 'mw', to: 'auth' },
                  { from: 'auth', to: 'ctrl' },
                  { from: 'ctrl', to: 'db', label: 'scoped to owner' },
                ]}
              />
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-3 lg:hidden">swipe the diagram sideways →</p>
        </SoftCard>
        <SoftCard title="At a glance">
          <KeyValues
            rows={[
              ['Type', 'University team project, FAST NUCES'],
              ['Frontend', 'React 19, React Router 7, Vite 6, Framer Motion, ECharts'],
              ['Backend', 'Node.js, Express 5, Mongoose 8 (MongoDB)'],
              ['Security', 'JWT, bcrypt, Helmet, rate limiting'],
              ['Testing', 'Jest, Supertest, in-memory MongoDB'],
              ['CI', 'GitHub Actions'],
            ]}
          />
        </SoftCard>
      </div>

      <div className="mt-14">
        <HardParts
          title="What it does"
          items={[
            'Monthly budgets with per-category limits whose progress bars turn amber at 80% and red when exceeded.',
            'Expense tracking with search, filters, sorting and CSV export, plus a six-month trend per category.',
            'Shared plans with admin, editor and viewer roles, email invitations and an optional approval workflow.',
            'Password reset by email with single-use links that expire after 30 minutes.',
          ]}
        />
      </div>

      <div className="mt-14">
        <Questions
          items={[
            {
              slug: 'request-checks',
              ask: 'How does a request get checked?',
              answer: (
                <div className={prose}>
                  <p>
                    The API issues a JWT on login or signup, and the React app sends it as a Bearer token. Requests pass
                    Helmet security headers, CORS restricted to the app&apos;s own origin, rate limits and a 100 kB body cap.
                    Then <code className="font-mono text-sm text-ink">requireAuth</code> verifies the token, and also rejects
                    tokens issued before the user&apos;s last password change.
                  </p>
                  <p>
                    If a token is invalid or expired the API answers 401, and the client signs the user out.
                  </p>
                </div>
              ),
            },
            {
              slug: 'isolation',
              ask: 'How is one user kept out of another’s data?',
              answer: (
                <div className={prose}>
                  <p>
                    Every personal resource is queried by both its id and the owner&apos;s id, so another user&apos;s record
                    simply comes back as 404. Shared-plan routes go through{' '}
                    <code className="font-mono text-sm text-ink">requirePlanRole</code>, which loads the plan and the
                    caller&apos;s membership and enforces their role. The plan owner can&apos;t be demoted or removed.
                  </p>
                  <p>These ownership and role rules are covered by integration tests.</p>
                </div>
              ),
            },
            {
              slug: 'approvals',
              ask: 'How do shared plans and approvals work?',
              answer: (
                <div className={prose}>
                  <p>
                    Admins manage settings and members, editors add and manage their own expenses, and viewers have
                    read-only access. Members are invited by email, and invitations expire after 7 days.
                  </p>
                  <p>
                    A plan can require an admin to approve expenses added by other members. Only approved expenses count
                    towards the plan&apos;s totals.
                  </p>
                </div>
              ),
            },
            {
              slug: 'testing',
              ask: 'What is tested?',
              answer: (
                <div className={prose}>
                  <p>
                    The backend has an integration suite (Jest and Supertest) that runs the real Express app against an
                    in-memory MongoDB. It covers signup, login, sessions and password reset; data isolation between users;
                    budgets, expenses, trends and alert thresholds; and shared-plan roles, invitations and approvals.
                  </p>
                  <p>GitHub Actions runs those tests, plus the frontend lint and production build, on every push and pull request.</p>
                </div>
              ),
            },
            {
              slug: 'source',
              ask: 'Where can I see the code?',
              answer: (
                <div className={prose}>
                  <p>
                    The repository is public, with setup steps, demo data and an API reference:{' '}
                    <TextLink href={item.source!} external>
                      github.com/M-Waleed-Ahmad/BudgetBuddy
                    </TextLink>
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      <NextProject slug={item.slug} />
    </Container>
  );
}
