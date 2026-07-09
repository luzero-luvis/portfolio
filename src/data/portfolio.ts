import type { SkillCategory, Project, Stat, Theme, ThemeColors } from '../types'

export const profile = {
  name: 'Luvis Joston J',
  roles: ['DevOps Engineer', 'GitOps Practitioner', 'Kubernetes Engineer', 'Go Developer'],
  bio: 'DevOps Engineer working with cloud infrastructure, GitOps pipelines, CI/CD, and observability tooling on AWS, GCP & Hetzner.',
  location: 'Bengaluru, India',
  email: 'luvisjoston@gmail.com',
  phone: '+91 7338268238',
  github1: { label: 'luvis-joston-j', url: 'https://github.com/luvis-joston-j' },
  github2: { label: 'luzero-luvis',   url: 'https://github.com/luzero-luvis' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/luvis-joston-j-356806323' },
}

export const stats: Stat[] = [
  { number: '5+',  label: 'Projects Built' },
  { number: '3+',  label: 'Certifications' },
  { number: '25+', label: 'Tools Used' },
  { number: '8.5', label: 'CGPA (BCA)' },
]

export const themeColors: Record<Theme, ThemeColors> = {
  blue:   { border: '#38bdf8', bg: 'rgba(56,189,248,0.08)',   text: '#38bdf8' },
  teal:   { border: '#2dd4bf', bg: 'rgba(45,212,191,0.08)',   text: '#2dd4bf' },
  orange: { border: '#fb923c', bg: 'rgba(251,146,60,0.08)',   text: '#fb923c' },
  purple: { border: '#a78bfa', bg: 'rgba(167,139,250,0.08)',  text: '#a78bfa' },
  green:  { border: '#00c896', bg: 'rgba(0,200,150,0.08)',    text: '#00c896' },
  yellow: { border: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   text: '#fbbf24' },
  pink:   { border: '#f472b6', bg: 'rgba(244,114,182,0.08)',  text: '#f472b6' },
  gray:   { border: '#94a3b8', bg: 'rgba(148,163,184,0.08)', text: '#94a3b8' },
}

export const skillCategories: SkillCategory[] = [
  { name: 'Cloud & Infrastructure',      icon: '☁️', theme: 'blue',   skills: ['AWS', 'GCP', 'Hetzner', 'Terraform', 'Ansible'] },
  { name: 'Containers & Orchestration',  icon: '🐳', theme: 'teal',   skills: ['Docker', 'Docker Swarm', 'Kubernetes'] },
  { name: 'CI/CD & GitOps',              icon: '⚡', theme: 'orange', skills: ['Jenkins', 'GitHub Actions', 'GitOps'] },
  { name: 'Monitoring & Observability',  icon: '📊', theme: 'purple', skills: ['Prometheus', 'Grafana', 'Loki', 'Grafana Alloy'] },
  { name: 'Version Control',             icon: '🔀', theme: 'green',  skills: ['Git', 'GitHub'] },
  { name: 'Programming & Scripting',     icon: '💻', theme: 'yellow', skills: ['Go', 'Shell Scripting'] },
  { name: 'Databases',                   icon: '🗄️', theme: 'pink',   skills: ['MongoDB', 'PostgreSQL'] },
  { name: 'Other',                       icon: '🛠️', theme: 'gray',   skills: ['Linux', 'DevOps', 'Troubleshooting'] },
]

export const projects: Project[] = [
  {
    number: '01',
    badge: 'CI/CD',
    badgeTheme: 'green',
    accentColor: '#00c896',
    title: 'Automated CI/CD Pipeline with Infrastructure Provisioning & Monitoring',
    description: 'Terraform · Ansible · Jenkins · Maven · Docker · Prometheus · Grafana',
    points: [
      'Terraform automatically provisions clean AWS cloud infrastructure per deployment cycle.',
      'Ansible configures provisioned servers; Docker containerizes the application consistently.',
      'Jenkins pipeline pulls from Git, compiles with Maven, builds and deploys Docker container.',
      'Jenkins monitored end-to-end with Prometheus & Grafana dashboards.',
    ],
    tags: ['Terraform', 'Ansible', 'Jenkins', 'Docker', 'Maven', 'AWS', 'Prometheus', 'Grafana'],
    githubUrl: 'https://github.com/luvis-joston-j/project-1.git',
  },
  {
    number: '02',
    badge: 'Kubernetes',
    badgeTheme: 'blue',
    accentColor: '#38bdf8',
    title: 'End-to-End CI/CD Pipeline with Docker, Kubernetes, Terraform & Prometheus',
    description: 'Terraform · Ansible · Jenkins · Docker · Kubernetes · Prometheus · Grafana',
    points: [
      'Terraform provisions AWS infrastructure; Ansible automates deployment on test servers via Jenkins.',
      'Jenkins builds with Maven, then deploys to test servers (Ansible) and production (Kubernetes).',
      'Kubernetes Deployment Controller ensures high availability in production clusters.',
      'Full Kubernetes cluster monitoring with Prometheus & Grafana.',
    ],
    tags: ['Terraform', 'Ansible', 'Jenkins', 'Docker', 'Kubernetes', 'AWS', 'Prometheus', 'Grafana'],
    githubUrl: 'https://github.com/luvis-joston-j/project-2.git',
  },
  {
    number: '03',
    badge: 'GitOps',
    badgeTheme: 'purple',
    accentColor: '#a78bfa',
    title: 'Production GitOps Kubernetes on AWS with FluxCD',
    description: 'FluxCD · AWS EKS · Terraform · Istio · Longhorn · Vault · Prometheus · Loki',
    points: [
      'FluxCD Kustomizations manage cluster, infra, configs, monitoring, and app layers via GitOps.',
      'Istio service mesh with Gateway API; cert-manager for Let\'s Encrypt wildcard TLS on sirpify.com.',
      'External Secrets pulls from HashiCorp Vault; Velero backs up to S3; Longhorn for persistent storage.',
      'Full observability: kube-prometheus-stack, Loki log aggregation, and Grafana Alloy log pipeline.',
    ],
    tags: ['FluxCD', 'GitOps', 'AWS EKS', 'Terraform', 'Istio', 'Longhorn', 'Vault', 'Prometheus', 'Grafana', 'Loki'],
    githubUrl: 'https://github.com/luzero-luvis/aws-fluxcd',
  },
  {
    number: '04',
    badge: 'Go · API',
    badgeTheme: 'orange',
    accentColor: '#fb923c',
    title: 'Go Weather API — Production-Ready REST Service with Redis Caching',
    description: 'Go · Chi Router · Redis · Docker · GitHub Actions · Visual Crossing API',
    points: [
      'RESTful API in Go 1.25 using Chi router, wrapping Visual Crossing Weather API with structured slog logging.',
      'Redis caching with 6-hour TTL keyed by city name reduces external API calls dramatically.',
      'Multi-stage Docker build produces a minimal Alpine image running as a non-root user.',
      'GitHub Actions CI/CD auto-builds and pushes to Docker Hub with SBOM & provenance attestations.',
    ],
    tags: ['Go', 'Chi Router', 'Redis', 'Docker', 'GitHub Actions', 'REST API'],
    githubUrl: 'https://github.com/luzero-luvis/weather-api',
  },
  {
    number: '05',
    badge: 'Go · API',
    badgeTheme: 'orange',
    accentColor: '#fb923c',
    title: 'Blogging Platform API — Go CRUD Service with PostgreSQL',
    description: 'Go · Chi Router · PostgreSQL · Slog · Docker Compose',
    points: [
      'Built a layered Go REST API with separate handler, service, and repository packages for clean structure.',
      'Implements create, list, fetch-by-id, and update flows for blog posts backed by PostgreSQL.',
      'Health endpoint verifies API and database connectivity for faster operational checks.',
      'Dockerfile and Docker Compose setup make local startup and environment consistency straightforward.',
    ],
    tags: ['Go', 'Chi Router', 'PostgreSQL', 'Slog', 'Docker', 'Docker Compose', 'REST API'],
    githubUrl: 'https://github.com/luzero-luvis/blogging-platform-api',
  },
]

export const softSkills = [
  {
    label: 'Communication',
    blurb: 'Clear write-ups — design notes, PR descriptions, and incident summaries people can actually follow.',
  },
  {
    label: 'Collaboration',
    blurb: 'Comfortable working across dev, QA, and ops. Automation is a team sport.',
  },
  {
    label: 'Adaptability',
    blurb: 'New tools and shifting requirements are the job, not an interruption.',
  },
  {
    label: 'Ownership',
    blurb: 'If I ship it, I run it — monitoring, alerts, and follow-through included.',
  },
]
