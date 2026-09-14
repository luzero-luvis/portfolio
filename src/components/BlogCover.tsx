import SkillIcon from './SkillIcon'

const topics: Record<string, { tools: string[]; label: string; mark: string }> = {
  GitOps: { tools: ['Git', 'Kubernetes', 'AWS'], label: 'FROM GIT TO CLUSTER', mark: 'git → ship' },
  Infrastructure: { tools: ['Terraform', 'AWS'], label: 'FOLLOW THE PACKET', mark: '10.0.0.0/16' },
  Backend: { tools: ['Go', 'PostgreSQL'], label: 'SMALL SERVICES, CLEAR IDEAS', mark: 'Go services' },
  Security: { tools: ['Git', 'Linux'], label: 'SAFER BY DEFAULT', mark: 'pre-commit' },
}

export default function BlogCover({ category }: { category: string }) {
  const topic = topics[category] ?? topics.GitOps
  return <div className={'blog-cover cover-' + category.toLowerCase()} aria-hidden="true">
    <span className="cover-label">{topic.label}</span>
    <span className="cover-mark">{topic.mark}</span>
    <div className="cover-tools">{topic.tools.map(tool => <SkillIcon key={tool} name={tool} />)}</div>
  </div>
}
