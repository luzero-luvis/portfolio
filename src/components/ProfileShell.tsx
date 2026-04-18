import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/portfolio'

type ShellEntry = {
  id: number
  type: 'command' | 'output' | 'error' | 'hint'
  lines: string[]
}

const ABOUT_LINES = [
  `Hello, I'm ${profile.name}, and I turn infrastructure into production reality.`,
  'I design, automate, and deploy systems that turn code into production-grade reality on AWS and GCP.',
  'My work spans GitOps pipelines, Kubernetes platforms, observability stacks, and Go-based backend services.',
  "I care about precision, repeatability, and systems that are automated and observable end-to-end.",
]

const SKILL_LINES = [
  'Cloud: AWS, GCP, Terraform, Ansible',
  'Containers: Docker, Docker Swarm, Kubernetes',
  'CI/CD: Jenkins, GitHub Actions, GitOps',
  'Observability: Prometheus, Grafana, Loki, Grafana Alloy',
]

const HELP_LINES = [
  'Available commands:',
  'whoami    show profile summary',
  'cat bio.txt    show detailed bio',
  'skills    list core technical areas',
  'pwd       print current path',
  'ls        list files',
  'clear     clear terminal output',
]

const INITIAL_HISTORY: ShellEntry[] = [
  {
    id: 1,
    type: 'hint',
    lines: ['Interactive profile shell ready. Type `whoami` or `help`.'],
  },
]

function createOutput(id: number, type: ShellEntry['type'], lines: string[]): ShellEntry {
  return { id, type, lines }
}

export default function ProfileShell() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<ShellEntry[]>(INITIAL_HISTORY)
  const [counter, setCounter] = useState(INITIAL_HISTORY.length + 1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [history])

  const commands = useMemo(() => ({
    help: HELP_LINES,
    whoami: ABOUT_LINES,
    'cat bio.txt': ABOUT_LINES,
    skills: SKILL_LINES,
    pwd: ['~/portfolio/about'],
    ls: ['bio.txt', 'skills.txt', 'projects/', 'certificates/'],
  }), [])

  function pushEntries(entries: ShellEntry[]) {
    setHistory(prev => [...prev, ...entries])
    setCounter(prev => prev + entries.length)
  }

  function handleCommand(raw: string) {
    const command = raw.trim()
    if (!command) return

    const normalized = command.toLowerCase()
    const nextId = counter

    if (normalized === 'clear') {
      setHistory([])
      setCounter(1)
      return
    }

    const commandEntry = createOutput(nextId, 'command', [command])
    const outputLines = commands[normalized as keyof typeof commands]
    const responseEntry = outputLines
      ? createOutput(nextId + 1, normalized === 'help' ? 'hint' : 'output', outputLines)
      : createOutput(nextId + 1, 'error', [`command not found: ${command}`, 'Type `help` to see available commands.'])

    pushEntries([commandEntry, responseEntry])
  }

  return (
    <div
      className="glass shadow-soft rounded-2xl overflow-hidden transition-all duration-300"
      style={{ border: '1px solid rgba(30,39,46,0.9)' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: '#000000', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-2 font-mono text-[0.68rem]" style={{ color: '#5A6873' }}>luvis@devops: ~/portfolio/about</span>
      </div>

      <div
        ref={scrollRef}
        className="p-7 min-h-[430px] max-h-[430px] overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, rgba(10,14,17,0.96), rgba(5,7,8,0.98))' }}
      >
        <div className="space-y-4">
          {history.map(entry => (
            <div key={entry.id}>
              {entry.type === 'command' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[0.82rem]" style={{ color: '#FFB800' }}>$</span>
                  <span className="font-mono text-[0.82rem]" style={{ color: '#00D9FF' }}>{entry.lines[0]}</span>
                </div>
              )}

              {entry.type !== 'command' && (
                <div className="space-y-2">
                  {entry.lines.map(line => (
                    <p
                      key={`${entry.id}-${line}`}
                      className="font-mono leading-[1.75] text-[0.82rem] whitespace-pre-wrap"
                      style={{
                        color:
                          entry.type === 'error'
                            ? '#FF6B35'
                            : entry.type === 'hint'
                              ? '#7A8894'
                              : '#C5CDD3',
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          <form
            onSubmit={e => {
              e.preventDefault()
              const value = input
              setInput('')
              handleCommand(value)
            }}
            className="flex items-center gap-2 pt-2"
          >
            <span className="font-mono text-[0.82rem]" style={{ color: '#FFB800' }}>$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none font-mono text-[0.82rem]"
              style={{ color: '#00FF41' }}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal command input"
              placeholder="type `whoami`"
            />
            <span className="animate-blink inline-block w-[8px] h-[1em]" style={{ background: '#00FF41' }} />
          </form>
        </div>
      </div>
    </div>
  )
}
