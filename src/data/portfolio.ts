import type { SkillCategory, Project, Education, Certificate, Stat, Theme, ThemeColors } from '../types'

export const profile = {
  name: 'Luvis Joston J',
  roles: ['DevOps Engineer', 'GitOps Practitioner', 'Cloud Architect', 'Kubernetes Engineer', 'Go Developer'],
  bio: 'DevOps Engineer building production-grade cloud infrastructure, GitOps pipelines, and full observability stacks on AWS & GCP. Turning complex systems into reliable, automated, and observable platforms.',
  location: 'Bengaluru, India',
  email: 'luvisjoston@gmail.com',
  phone: '+91 7338268238',
  github1: { label: 'luvis-joston-j', url: 'https://github.com/luvis-joston-j' },
  github2: { label: 'luzero-luvis',   url: 'https://github.com/luzero-luvis' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/luvis-joston-j-356806323' },
}

export const stats: Stat[] = [
  { number: '4+',  label: 'Projects Built' },
  { number: '3+',  label: 'Certifications' },
  { number: '25+', label: 'Tools Mastered' },
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
  { name: 'Cloud & Infrastructure',      icon: '☁️', theme: 'blue',   skills: ['AWS', 'GCP', 'Amazon EKS', 'Terraform', 'Ansible', 'Maven'] },
  { name: 'Containers & Orchestration',  icon: '🐳', theme: 'teal',   skills: ['Docker', 'Docker Swarm', 'Kubernetes'] },
  { name: 'CI/CD & GitOps',              icon: '⚡', theme: 'orange', skills: ['Jenkins', 'GitHub Actions', 'GitOps', 'FluxCD'] },
  { name: 'Monitoring & Observability',  icon: '📊', theme: 'purple', skills: ['Prometheus', 'Grafana', 'Loki', 'Grafana Alloy'] },
  { name: 'Version Control',             icon: '🔀', theme: 'green',  skills: ['Git', 'Git Bash', 'GitHub'] },
  { name: 'Programming & Scripting',     icon: '💻', theme: 'yellow', skills: ['Go', 'Python', 'Shell Scripting', 'HTML', 'CSS'] },
  { name: 'Databases',                   icon: '🗄️', theme: 'pink',   skills: ['MongoDB', 'PostgreSQL', 'SQL', 'Oracle Database'] },
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
]

export const education: Education[] = [
  {
    years: '2021 — 2024',
    school: 'Govt Home Science College, Hassan',
    detail: 'Bachelor of Computer Applications (BCA) · University of Mysore',
    score: 'CGPA: 8.5',
  },
  {
    years: '2019 — 2021',
    school: "St Joseph's PU College, Hassan",
    detail: 'Pre-University Course (PUC)',
    score: '77%',
  },
  {
    years: '2016 — 2019',
    school: "St Francis Xavier's High School, Hassan",
    detail: 'Secondary School Education (SSLC)',
    score: '89%',
  },
]

export const certificates: Certificate[] = [
  {
    issuer: 'StarAgile',
    name: 'DevOps Engineer Certificate',
    logo: '🛡️',
    logoBg: 'rgba(0,200,150,0.1)',
    links: [
      { label: 'View Certificate', url: 'https://github.com/luvis-joston-j/devops-certificate/blob/main/devops.png' },
    ],
  },
  {
    issuer: 'IBM',
    name: 'Docker, Kubernetes & DevOps Badges',
    logo: '🏅',
    logoBg: 'rgba(56,189,248,0.1)',
    links: [
      { label: 'Docker Certificate',    url: 'https://github.com/luvis-joston-j/devops-certificate/blob/main/DOCKER%20IBM%20CIRTIFICATE.pdf' },
      { label: 'Kubernetes Certificate', url: 'https://github.com/luvis-joston-j/devops-certificate/blob/main/KUBERNETES%20IBM%20CIRTIFICATE.pdf' },
      { label: 'DevOps Certificate',    url: 'https://github.com/luvis-joston-j/devops-certificate/blob/main/DEVOPS%20IBM%20CIRTIFICATE.pdf' },
      { label: 'Docker Essentials Badge', url: 'https://github.com/luvis-joston-j/devops-certificate/blob/main/docker-essentials-a-developerintroduction.png' },
    ],
  },
]

export const softSkills = [
  { icon: '🗣️', label: 'Communication' },
  { icon: '⏱️', label: 'Time Management' },
  { icon: '💡', label: 'Creativity' },
  { icon: '🤝', label: 'Collaboration' },
  { icon: '💪', label: 'Work Ethic' },
  { icon: '🔄', label: 'Adaptability' },
]
