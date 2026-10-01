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
  { id: 'products', label: 'Products', type: 'pillar', description: 'Production applications, ecommerce surfaces, and client-facing platforms.', url: '/products' },
  { id: 'systems', label: 'Systems', type: 'pillar', description: 'Automation, CI/CD, testing, and architecture work that makes delivery reliable.', url: '/journey/axelliant' },
  { id: 'intelligence', label: 'Intelligence', type: 'pillar', description: 'Applied AI work framed around evidence, uncertainty, skill composition, and evaluation.', url: '/products/deepshield' },

  { id: 'wepsych', label: 'WePsych', type: 'project', pillar: 'products', description: 'CPD compliance and peer-support platform for an Austrian psychiatric healthcare firm.', url: '/products/wepsych' },
  { id: 'arabia-hills', label: 'Arabia Hills', type: 'project', pillar: 'products', description: 'Real estate platform for a UAE client: live Dubai listings, agent CMS and automated bulk uploads.', url: '/products/arabia-hills' },
  { id: 'alfa-club', label: 'ALFA Club', type: 'project', pillar: 'products', description: 'React ecommerce storefront for alfaclub.ca: Lighthouse 90+, mobile checkout and Cloudinary media.', url: '/products/alfa-club' },

  { id: 'automation', label: 'Workflows & Automation', type: 'project', pillar: 'systems', description: 'Automation tooling and workflow thinking from client-facing and operations work.', url: '/products/arabia-hills' },
  { id: 'cicd', label: 'CI/CD Pipelines', type: 'project', pillar: 'systems', description: 'GitHub Actions pipelines, parallel builds, deployment reliability, and fast feedback loops.', url: '/journey/axelliant' },
  { id: 'testing', label: 'Automated Testing', type: 'project', pillar: 'systems', description: 'Playwright and Cypress automated testing integrated into CI.', url: '/journey/axelliant' },
  { id: 'architecture', label: 'System Architecture', type: 'project', pillar: 'systems', description: 'Architecture thinking around data ownership, boundaries, and operational visibility.', url: '/journey/axelliant' },

  { id: 'deepshield', label: 'DeepShield', type: 'project', pillar: 'intelligence', description: 'Deepfake detection with fused models, Grad-CAM++ evidence, confidence bands and on-chain result anchoring.', url: '/products/deepshield' },
  { id: 'robotics', label: 'Robotics Skill Architecture', type: 'project', pillar: 'intelligence', description: 'Skill-composition interface combining rule-based and learned ML behaviors.', url: '/products#robotics' },

  { id: 'react', label: 'React', type: 'technology' },
  { id: 'flutter', label: 'Flutter', type: 'technology' },
  { id: 'fastapi', label: 'FastAPI', type: 'technology' },
  { id: 'supabase', label: 'Supabase', type: 'technology' },
  { id: 'python', label: 'Python', type: 'technology' },
  { id: 'pytorch', label: 'PyTorch', type: 'technology' },
  { id: 'opencv', label: 'OpenCV', type: 'technology' },
  { id: 'postgresql', label: 'PostgreSQL', type: 'technology' },
  { id: 'github-actions', label: 'GitHub Actions', type: 'technology' },
  { id: 'playwright', label: 'Playwright', type: 'technology' },
  { id: 'cypress', label: 'Cypress', type: 'technology' },
  { id: 'makecom', label: 'Make.com', type: 'technology' },
  { id: 'laravel', label: 'Laravel', type: 'technology' },
  { id: 'cloudinary', label: 'Cloudinary', type: 'technology' },

  { id: 'system-design', label: 'System Design', type: 'concept' },
  { id: 'applied-ai', label: 'Applied AI', type: 'concept' },
  { id: 'automation-flows', label: 'Process Automation', type: 'concept' },
  { id: 'ux-craft', label: 'UX Craftsmanship', type: 'concept' },

  { id: 'gcl', label: 'Government College Lahore', type: 'experience', url: '/journey#gcl' },
  { id: 'fast', label: 'FAST NUCES', type: 'experience', url: '/journey#fast' },
  { id: 'arrivy', label: 'Arrivy', type: 'experience', url: '/journey#arrivy' },
  { id: 'ashtex', label: 'Ashtex Solutions', type: 'experience', url: '/journey#ashtex' },
  { id: 'axelliant', label: 'Axelliant', type: 'experience', url: '/journey#axelliant' },
];

export const workspaceEdges: WorkspaceEdge[] = [
  { source: 'products', target: 'wepsych' },
  { source: 'products', target: 'arabia-hills' },
  { source: 'products', target: 'alfa-club' },
  { source: 'systems', target: 'automation' },
  { source: 'systems', target: 'cicd' },
  { source: 'systems', target: 'testing' },
  { source: 'systems', target: 'architecture' },
  { source: 'intelligence', target: 'deepshield' },
  { source: 'intelligence', target: 'robotics' },

  { source: 'wepsych', target: 'flutter' },
  { source: 'wepsych', target: 'supabase' },
  { source: 'wepsych', target: 'postgresql' },
  { source: 'wepsych', target: 'system-design' },
  { source: 'arabia-hills', target: 'react' },
  { source: 'arabia-hills', target: 'supabase' },
  { source: 'arabia-hills', target: 'postgresql' },
  { source: 'arabia-hills', target: 'makecom' },
  { source: 'alfa-club', target: 'react' },
  { source: 'alfa-club', target: 'ux-craft' },
  { source: 'alfa-club', target: 'cloudinary' },

  { source: 'automation', target: 'makecom' },
  { source: 'automation', target: 'automation-flows' },
  { source: 'cicd', target: 'github-actions' },
  { source: 'testing', target: 'playwright' },
  { source: 'testing', target: 'cypress' },
  { source: 'testing', target: 'github-actions' },
  { source: 'architecture', target: 'system-design' },
  { source: 'architecture', target: 'postgresql' },

  { source: 'deepshield', target: 'python' },
  { source: 'deepshield', target: 'fastapi' },
  { source: 'deepshield', target: 'pytorch' },
  { source: 'deepshield', target: 'opencv' },
  { source: 'deepshield', target: 'supabase' },
  { source: 'deepshield', target: 'applied-ai' },
  { source: 'robotics', target: 'python' },
  { source: 'robotics', target: 'system-design' },
  { source: 'robotics', target: 'applied-ai' },

  { source: 'gcl', target: 'fast' },
  { source: 'fast', target: 'deepshield' },
  { source: 'fast', target: 'robotics' },
  { source: 'arrivy', target: 'testing' },
  { source: 'ashtex', target: 'react' },
  { source: 'ashtex', target: 'makecom' },
  { source: 'ashtex', target: 'laravel' },
  { source: 'ashtex', target: 'automation' },
  { source: 'axelliant', target: 'cicd' },
  { source: 'axelliant', target: 'testing' },
  { source: 'axelliant', target: 'github-actions' },
];

export interface WorkspaceGraph {
  nodes: WorkspaceNode[];
  edges: WorkspaceEdge[];
}

export const workspaceGraph: WorkspaceGraph = {
  nodes: workspaceNodes,
  edges: workspaceEdges,
};
