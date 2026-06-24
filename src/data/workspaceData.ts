export interface WorkspaceNode {
  id: string;
  label: string;
  type: 'pillar' | 'project' | 'technology' | 'concept' | 'experience';
  pillar?: 'products' | 'systems' | 'intelligence';
  description?: string;
  url?: string;
}

export interface WorkspaceEdge {
  source: string;
  target: string;
  label?: string;
}

export const workspaceNodes: WorkspaceNode[] = [
  // Pillars
  {
    id: 'products',
    label: 'Products',
    type: 'pillar',
    description: 'User-facing, production-grade applications that solve real-world problems.',
    url: '/products'
  },
  {
    id: 'systems',
    label: 'Systems',
    type: 'pillar',
    description: 'Scalable backends, automation pipelines, and infrastructure architecture.',
    url: '/systems'
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    type: 'pillar',
    description: 'Applied AI, computer vision, and cognitive systems research.',
    url: '/intelligence'
  },

  // Projects - Products
  {
    id: 'wepsych',
    label: 'WePsych',
    type: 'project',
    pillar: 'products',
    description: 'Flagship digital mental health platform serving international clients and real patients.',
    url: '/products/wepsych'
  },
  {
    id: 'arabia-hills',
    label: 'Arabia Hills',
    type: 'project',
    pillar: 'products',
    description: 'Real estate portal focused on high-performance property searches and complex data management.',
    url: '/products/arabia-hills'
  },
  {
    id: 'alfa-club',
    label: 'ALFA Club',
    type: 'project',
    pillar: 'products',
    description: 'High-craftsmanship web platform with smooth responsive UX and performance optimizations.',
    url: '/products/alfa-club'
  },

  // Projects - Systems
  {
    id: 'automation',
    label: 'Workflows & Automation',
    type: 'project',
    pillar: 'systems',
    description: 'No-code and custom API automation pipelines for enterprise process optimization.',
    url: '/systems#automation'
  },
  {
    id: 'cicd',
    label: 'CI/CD Pipelines',
    type: 'project',
    pillar: 'systems',
    description: 'Reliable and fast builds, tests, and auto-deployments using GitHub Actions and Docker.',
    url: '/systems#cicd'
  },
  {
    id: 'testing',
    label: 'Automated Testing',
    type: 'project',
    pillar: 'systems',
    description: 'Comprehensive test suites ensuring software reliability across backend and frontend stacks.',
    url: '/systems#cicd'
  },
  {
    id: 'architecture',
    label: 'System Architecture',
    type: 'project',
    pillar: 'systems',
    description: 'Scalable, multi-tenant system blueprints and robust API designs.',
    url: '/systems#architecture'
  },

  // Projects - Intelligence
  {
    id: 'deepshield',
    label: 'DeepShield',
    type: 'project',
    pillar: 'intelligence',
    description: 'Computer vision pipeline for deepfake detection using convolutional models and GradCAM++ heatmaps.',
    url: '/intelligence#deepshield'
  },
  {
    id: 'robotics',
    label: 'Robotics Skill Architecture',
    type: 'project',
    pillar: 'intelligence',
    description: 'Hierarchical and modular skill-composition framework for robotic action planning.',
    url: '/intelligence#robotics'
  },
  {
    id: 'red-teaming',
    label: 'Red Teaming Research',
    type: 'project',
    pillar: 'intelligence',
    description: 'Evaluating LLM safety, security vulnerabilities, and defensive prompt engineering.',
    url: '/intelligence#red-teaming'
  },

  // Technologies
  { id: 'nextjs', label: 'Next.js', type: 'technology' },
  { id: 'react', label: 'React', type: 'technology' },
  { id: 'flutter', label: 'Flutter', type: 'technology' },
  { id: 'fastapi', label: 'FastAPI', type: 'technology' },
  { id: 'supabase', label: 'Supabase', type: 'technology' },
  { id: 'nodejs', label: 'Node.js', type: 'technology' },
  { id: 'python', label: 'Python', type: 'technology' },
  { id: 'docker', label: 'Docker', type: 'technology' },
  { id: 'github-actions', label: 'GitHub Actions', type: 'technology' },
  { id: 'tensorflow', label: 'TensorFlow', type: 'technology' },
  { id: 'opencv', label: 'OpenCV', type: 'technology' },
  { id: 'postgresql', label: 'PostgreSQL', type: 'technology' },

  // Concepts / Skills
  { id: 'system-design', label: 'System Design', type: 'concept' },
  { id: 'applied-ai', label: 'Applied AI', type: 'concept' },
  { id: 'automation-flows', label: 'Process Automation', type: 'concept' },
  { id: 'ux-craft', label: 'UX Craftsmanship', type: 'concept' },
  {
    id: 'relationship-explorer',
    label: 'Relationship Explorer',
    type: 'concept',
    description: 'Interactive map for inspecting project, technology, concept, and experience relationships.',
    url: '/explorer'
  },

  // Experience Nodes (Journey)
  { id: 'fast', label: 'FAST-NUCES', type: 'experience', url: '/journey#fast' },
  { id: 'ashtex', label: 'Ashtex Solutions', type: 'experience', url: '/journey#ashtex' },
  { id: 'arrivy', label: 'Arrivy', type: 'experience', url: '/journey#arrivy' },
  { id: 'axelliant', label: 'Axelliant', type: 'experience', url: '/journey#axelliant' }
];

export const workspaceEdges: WorkspaceEdge[] = [
  // Pillar to Projects connections
  { source: 'products', target: 'wepsych' },
  { source: 'products', target: 'arabia-hills' },
  { source: 'products', target: 'alfa-club' },

  { source: 'systems', target: 'automation' },
  { source: 'systems', target: 'cicd' },
  { source: 'systems', target: 'testing' },
  { source: 'systems', target: 'architecture' },

  { source: 'intelligence', target: 'deepshield' },
  { source: 'intelligence', target: 'robotics' },
  { source: 'intelligence', target: 'red-teaming' },

  // Projects to Technologies
  { source: 'wepsych', target: 'fastapi' },
  { source: 'wepsych', target: 'react' },
  { source: 'wepsych', target: 'supabase' },
  { source: 'wepsych', target: 'postgresql' },

  { source: 'arabia-hills', target: 'nextjs' },
  { source: 'arabia-hills', target: 'supabase' },
  { source: 'arabia-hills', target: 'postgresql' },
  { source: 'arabia-hills', target: 'system-design' },

  { source: 'alfa-club', target: 'react' },
  { source: 'alfa-club', target: 'ux-craft' },

  { source: 'automation', target: 'fastapi' },
  { source: 'automation', target: 'automation-flows' },

  { source: 'cicd', target: 'github-actions' },
  { source: 'cicd', target: 'docker' },

  { source: 'testing', target: 'python' },
  { source: 'testing', target: 'github-actions' },

  { source: 'architecture', target: 'system-design' },
  { source: 'architecture', target: 'postgresql' },
  { source: 'architecture', target: 'docker' },

  { source: 'deepshield', target: 'python' },
  { source: 'deepshield', target: 'tensorflow' },
  { source: 'deepshield', target: 'opencv' },
  { source: 'deepshield', target: 'applied-ai' },

  { source: 'robotics', target: 'python' },
  { source: 'robotics', target: 'system-design' },
  { source: 'robotics', target: 'applied-ai' },

  { source: 'red-teaming', target: 'python' },
  { source: 'red-teaming', target: 'applied-ai' },

  // Experience connections (Career path links)
  { source: 'ashtex', target: 'wepsych' },
  { source: 'arrivy', target: 'alfa-club' },
  { source: 'axelliant', target: 'arabia-hills' },
  { source: 'axelliant', target: 'system-design' },

  // Global feature connections
  { source: 'relationship-explorer', target: 'products' },
  { source: 'relationship-explorer', target: 'systems' },
  { source: 'relationship-explorer', target: 'intelligence' },
  { source: 'relationship-explorer', target: 'system-design' }
];

export interface WorkspaceGraph {
  nodes: WorkspaceNode[];
  edges: WorkspaceEdge[];
}

export const workspaceGraph: WorkspaceGraph = {
  nodes: workspaceNodes,
  edges: workspaceEdges
};
