import { useState } from 'react'

const stages = [
  { name: 'Build', label: '01 / DECLARE THE FOUNDATION', command: 'terraform plan', detail: 'Infrastructure starts with a readable plan.', layers: ['Versioned configuration', 'Cloud infrastructure', 'Network foundation'] },
  { name: 'Ship', label: '02 / RECONCILE THE CHANGE', command: 'git push origin main', detail: 'Desired state in Git. Reconciled in the cluster.', layers: ['Git repository', 'GitOps reconciliation', 'Kubernetes workloads'] },
  { name: 'Observe', label: '03 / UNDERSTAND THE SYSTEM', command: 'kubectl get pods', detail: 'Connect metrics, logs, and cluster context.', layers: ['Metrics and logs', 'Diagnostic context', 'Human-approved action'] },
]

export default function Architecture({ compact = false, variant = 0 }: { compact?: boolean; variant?: number }) {
  const [selected, setSelected] = useState(variant)
  const stage = stages[selected]
  const gridId = 'grid-' + (compact ? variant : 'hero')
  return (
    <div className={'architecture ' + (compact ? 'architecture-compact' : '')}>
      <div className="architecture-top"><span>{compact ? ['HETZNER / GITOPS PLATFORM', 'SRE / INVESTIGATION FLOW', 'AWS / PLATFORM FOUNDATION'][variant] : 'A SYSTEMS MINDSET'}</span><span aria-hidden="true">↗</span></div>
      <svg className="architecture-drawing" viewBox="0 0 480 350" role="img" aria-label={compact ? ['A layered GitOps platform from configuration to cluster', 'An investigation workflow with a human approval boundary', 'A cloud platform built from the network up'][variant] : stage.layers.join(', then ')}>
        <defs><pattern id={gridId} width="32" height="18" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .5 -1 .5 240 10)"><path d="M 32 0 L 0 0 0 18" fill="none" stroke="#526580" strokeWidth=".6" /></pattern></defs>
        <rect width="480" height="350" fill={'url(#' + gridId + ')'} opacity=".35" />
        <path d="M105 150V248M375 150V248M240 218V317" stroke="#7790b0" strokeDasharray="4 5" opacity=".65" />
        {[228, 174, 120].map((position, index) => (
          <g key={position} className="architecture-layer">
            <path d={'M105 ' + position + ' L240 ' + (position + 68) + ' L375 ' + position + ' V' + (position + 14) + ' L240 ' + (position + 82) + ' L105 ' + (position + 14) + 'Z'} fill={index === selected ? '#194889' : '#17283d'} stroke={index === selected ? '#62a8ff' : '#52749b'} />
            <path d={'M105 ' + position + ' L240 ' + (position - 68) + ' L375 ' + position + ' L240 ' + (position + 68) + 'Z'} fill={index === selected ? '#438ded' : '#253f5e'} stroke={index === selected ? '#99ceff' : '#6e95bf'} />
            <path d={'M150 ' + position + ' L240 ' + (position - 45) + ' L330 ' + position + ' L240 ' + (position + 45) + 'Z'} fill="none" stroke={index === selected ? '#c2e5ff' : '#8bafd5'} opacity=".65" />
            <path d={'M195 ' + position + 'L240 ' + (position - 23) + 'L285 ' + position + 'L240 ' + (position + 23) + 'Z'} fill={index === selected ? '#c2e5ff' : '#a5c8ef'} opacity=".85" />
            <circle cx="124" cy={position + 14} r="2" fill="#87d6ef" /><circle cx="135" cy={position + 20} r="2" fill="#87d6ef" />
          </g>
        ))}
        <path d="M240 28V51M229 39H251" stroke="#438ded" /><circle cx="240" cy="39" r="17" fill="none" stroke="#438ded" opacity=".3" />
      </svg>
      {!compact && <>
        <div className="architecture-caption"><span>{stage.label}</span><p>{stage.detail}</p></div>
        <div className="architecture-tabs" role="group" aria-label="Explore the engineering workflow">{stages.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="architecture-command" aria-live="polite"><span aria-hidden="true">$</span> {stage.command}<span className="terminal-cursor" aria-hidden="true" /></div>
      </>}
    </div>
  )
}
