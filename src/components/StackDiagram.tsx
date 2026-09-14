/**
 * A labelled stack for a case study. Each card renders its own component
 * names, so the three projects are told apart by content rather than by a
 * decorative drawing that was identical on every card.
 */
export default function StackDiagram({ layers, variant = 0 }: { layers: string[]; variant?: number }) {
  return (
    <div className={'stack-diagram stack-variant-' + variant}>
      <ol>
        {layers.map((layer, index) => (
          <li key={layer}>
            <span className="stack-tier">{['APP', 'DELIVERY', 'INFRA'][index] ?? 'LAYER'}</span>
            <span className="stack-label">{layer}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
