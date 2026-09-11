const icons: Record<string, { file?: string; label?: string; color: string }> = {
  AWS: { file: '/aws-logo.svg', color: '#ff9900' },
  GCP: { file: '/icons/googlecloud.svg', color: '#4285f4' },
  Hetzner: { file: '/icons/hetzner.svg', color: '#d50c2d' },
  Terraform: { file: '/icons/terraform.svg', color: '#844fba' },
  Ansible: { file: '/icons/ansible.svg', color: '#ee0000' },
  Docker: { file: '/icons/docker.svg', color: '#2496ed' },
  'Docker Swarm': { file: '/icons/docker.svg', color: '#2496ed' },
  Kubernetes: { file: '/icons/kubernetes.svg', color: '#326ce5' },
  Jenkins: { file: '/icons/jenkins.svg', color: '#d24939' },
  'GitHub Actions': { file: '/icons/githubactions.svg', color: '#2088ff' },
  GitOps: { label: 'GO', color: '#bb4929' },
  Prometheus: { file: '/icons/prometheus.svg', color: '#e6522c' },
  Grafana: { file: '/icons/grafana.svg', color: '#f58220' },
  Loki: { file: '/icons/grafana.svg', color: '#f58220' },
  'Grafana Alloy': { file: '/icons/grafana.svg', color: '#f58220' },
  Git: { file: '/icons/git.svg', color: '#f05032' },
  GitHub: { file: '/icons/github.svg', color: '#24292f' },
  Go: { file: '/icons/go.svg', color: '#00add8' },
  'Shell Scripting': { label: 'SH', color: '#4b6550' },
  MongoDB: { file: '/icons/mongodb.svg', color: '#47a248' },
  PostgreSQL: { file: '/icons/postgresql.svg', color: '#4169a1' },
  Linux: { file: '/icons/linux.svg', color: '#6d6436' },
  DevOps: { label: 'DO', color: '#617b1c' },
  Troubleshooting: { label: 'TS', color: '#526151' },
}

export default function SkillIcon({ name }: { name: string }) {
  const icon = icons[name]
  if (!icon) return null

  return (
    <span className="skill-icon" aria-hidden="true" style={{ backgroundColor: icon.color + '12', color: icon.color }}>
      {icon.file ? <img src={icon.file} width="20" height="20" alt="" loading="lazy" /> : icon.label}
    </span>
  )
}
