import SiteLink from './SiteLink'

const signals = [
  {
    label: '01 / PLATFORM OPERATIONS',
    title: 'Operate the platform, not just the demo.',
    detail: 'Team contribution on WindVista: resource tuning, monitoring fixes, scaling configuration, and runbooks for a shared Hetzner cluster.',
    link: '/projects/hetzner-gitops-platform',
    linkLabel: 'View WindVista case study',
  },
  {
    label: '02 / INFRASTRUCTURE DESIGN',
    title: 'Make infrastructure explainable.',
    detail: 'Terraform foundations with explicit network boundaries, workload identity, private nodes, and documented operational trade-offs.',
    link: '/projects/aws-eks-foundation',
    linkLabel: 'View EKS case study',
  },
  {
    label: '03 / RELIABLE DELIVERY',
    title: 'Connect delivery to evidence.',
    detail: 'GitOps, metrics, logs, and Go tooling shaped into workflows that show what changed, what is running, and what needs approval.',
    link: '/projects/aws-gitops-platform',
    linkLabel: 'View GitOps case study',
  },
]

export default function ProofBand() {
  return <section className="proof-band" aria-labelledby="proof-title">
    <div className="container">
      <div className="proof-intro">
        <div><div className="eyebrow">HOW I WORK</div><h2 id="proof-title">Clear systems. Careful changes.</h2></div>
        <p>Three signals to help you understand the work behind the tools.</p>
      </div>
      <div className="proof-grid">
        {signals.map(signal => <article key={signal.label} className="proof-card">
          <div className="proof-label">{signal.label}</div>
          <h3>{signal.title}</h3>
          <p>{signal.detail}</p>
          <SiteLink className="text-link" href={signal.link}>{signal.linkLabel} <span aria-hidden="true">↗</span></SiteLink>
        </article>)}
      </div>
    </div>
  </section>
}
