/**
 * Single source for facts that appear in more than one place (header, footer,
 * contact page, metadata, résumé-derived timeline). Keep this in sync with the CV.
 */

export const profile = {
  name: 'Waleed Ahmad',
  role: 'Software Engineer',
  /** Matches the second half of the CV headline. */
  focus: 'Full-stack & AI systems',
  experience: '1.5+ years',
  location: 'Lahore, Pakistan',
  availability: 'Open to full-time roles and focused freelance builds · remote-friendly',
  email: 'waleed.ahmadmunir@gmail.com',
  linkedin: 'https://www.linkedin.com/in/waleed-ahmad-0bb087260/',
  github: 'https://github.com/M-Waleed-Ahmad',
  repo: 'https://github.com/M-Waleed-Ahmad/me',
  resume: '/Waleed_Ahmad_CV.pdf',
  education: 'BS Computer Science, FAST NUCES · 2026',
};

/**
 * Canonical site URL. On Vercel the production domain is injected automatically;
 * set NEXT_PUBLIC_SITE_URL to override (e.g. a custom domain).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export type Screenshot = { src: string; alt: string; width: number; height: number };

export type WorkItem = {
  slug: string;
  href: string;
  name: string;
  kind: string;
  role: string;
  summary: string;
  stack: string[];
  figure: { value: string; label: string };
  status: string;
  /** Live product URL, if public. */
  live?: string;
  /** Source repository, if public. */
  source?: string;
  /**
   * Product screenshots. Drop files into /public/work/<slug>/ and list them here;
   * until then, pages fall back to the drawn architecture figure.
   */
  screenshots: Screenshot[];
};

export const selectedWork: WorkItem[] = [
  {
    slug: 'deepshield',
    href: '/products/deepshield',
    name: 'DeepShield',
    kind: 'Final-year project',
    role: 'ML + backend',
    summary:
      'Deepfake detection that shows its evidence: two fused models, Grad-CAM++ heatmaps, four confidence bands, and results anchored on-chain so tampering is detectable.',
    stack: ['Python', 'FastAPI', 'PyTorch', 'OpenCV', 'Supabase'],
    figure: { value: '4', label: 'confidence bands, not a yes/no' },
    status: 'FYP · 2026',
    screenshots: [],
  },
  {
    slug: 'wepsych',
    href: '/products/wepsych',
    name: 'WePsych',
    kind: 'Compliance platform · Austrian client',
    role: 'Product engineer',
    summary:
      'CPD compliance and peer-support platform for an Austrian psychiatric healthcare firm: registration pathways, supervision and audit-ready export from one data model.',
    stack: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL'],
    figure: { value: '3', label: 'user groups on one account system' },
    status: 'In production',
    screenshots: [],
  },
  {
    slug: 'arabia-hills',
    href: '/products/arabia-hills',
    name: 'Arabia Hills',
    kind: 'Real estate platform · UAE client',
    role: 'Product engineer',
    summary:
      'Listings platform for a UAE client with live properties in Dubai: automated bulk uploads, an agent CMS and public search, all on one Supabase schema.',
    stack: ['React', 'Supabase', 'PostgreSQL', 'Make.com'],
    figure: { value: '1', label: 'schema shared by three surfaces' },
    status: 'In production',
    screenshots: [],
  },
  {
    slug: 'alfa-club',
    href: '/products/alfa-club',
    name: 'ALFA Club',
    kind: 'Ecommerce storefront',
    role: 'Frontend engineer',
    summary:
      'Responsive React storefront for alfaclub.ca: Lighthouse 90+, a mobile checkout that feels dependable, and media served through Cloudinary.',
    stack: ['React', 'Tailwind CSS', 'Cloudinary'],
    figure: { value: '90+', label: 'Lighthouse performance' },
    status: 'In production',
    live: 'https://alfaclub.ca',
    screenshots: [],
  },
];

/**
 * Deep-dives on a role rather than a standalone project. They use the project page
 * layout but live under Journey and stay out of the work list.
 */
export const roleDeepDives: WorkItem[] = [
  {
    slug: 'axelliant',
    href: '/journey/axelliant',
    name: 'Axelliant',
    kind: 'CI/CD & test automation',
    role: 'Automation & CI/CD Engineer',
    summary:
      'End-to-end Playwright and Cypress frameworks for hybrid systems, wired into parallel GitHub Actions pipelines. Full test cycles went from 2–3 days to about 2 hours.',
    stack: ['GitHub Actions', 'Playwright', 'Cypress'],
    figure: { value: '~2 h', label: 'full test cycle, down from 2–3 days' },
    status: 'May 2025 – Feb 2026',
    screenshots: [],
  },
];

export type Role = {
  id: string;
  org: string;
  title: string;
  start: string;
  end: string;
  place: string;
  points: string[];
  lesson: string;
  related: { label: string; href: string }[];
};

export const experience: Role[] = [
  {
    id: 'axelliant',
    org: 'Axelliant',
    title: 'Automation & CI/CD Engineer',
    start: 'May 2025',
    end: 'Feb 2026',
    place: 'Lahore',
    points: [
      'Built end-to-end Playwright and Cypress automation frameworks for hybrid systems, taking full testing cycles from 2–3 days to about 2 hours.',
      'Integrated the tests into GitHub Actions and parallelised execution to shorten feedback loops across development and release pipelines.',
      'Improved CI/CD reliability and deployment speed by streamlining test orchestration and cutting repetitive manual validation.',
    ],
    lesson:
      'A pipeline is a product for engineers. It has users, failure states and a trust problem, and it only helps if people believe its red and green.',
    related: [{ label: 'Deep-dive: CI/CD and test automation', href: '/journey/axelliant' }],
  },
  {
    id: 'ashtex',
    org: 'Ashtex Solutions',
    title: 'Software Engineer',
    start: 'Jun 2024',
    end: 'Oct 2024',
    place: 'Lahore',
    points: [
      'Developed and shipped client-facing web application features in React, plus supporting automation tooling, across several projects.',
      'Owned sprint planning and task tracking for the team, and kept documentation and release notes current for every deployment.',
      'Ran QA checks on each feature before release, catching regressions early and keeping delivery on the sprint timeline.',
    ],
    lesson:
      'Owning the sprint board taught me that shipping on time is mostly about seeing problems early, in the code and in the plan.',
    related: [],
  },
  {
    id: 'arrivy',
    org: 'Arrivy',
    title: 'Software Engineer Trainee',
    start: 'Jun 2023',
    end: 'Aug 2023',
    place: 'Pakistan',
    points: [
      'Led QA for an employee management system and an automation tool; both went on to active production use.',
      'Ran quality checks and tracked delivery schedules to support stable releases.',
      'Worked in a seven-person cross-functional intern team spanning development, testing and delivery.',
    ],
    lesson:
      'Testing teaches you where product assumptions break, before users find the breakage for you.',
    related: [],
  },
];

export const leadership = [
  {
    id: 'ieee',
    org: 'IEEE NUCES Lahore',
    title: 'Assistant Vice President',
    start: 'Feb 2025',
    end: 'May 2025',
    place: 'Lahore',
  },
];

export const certifications = ['Make Foundation'];

export const educationHistory = [
  {
    id: 'fast',
    org: 'FAST NUCES',
    title: 'BS Computer Science',
    start: 'Aug 2022',
    end: 'Jul 2026',
    place: 'Lahore',
    note: 'Final-year project: DeepShield. Also built a robotics skill-composition system.',
  },
];
