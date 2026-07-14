import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import * as CANNON from 'cannon-es'
import { PIXEL_FONT } from './PixelText'
import { projects, skillCategories } from '../data/portfolio'
import About from './About'
import SoftSkills from './SoftSkills'
import Skills from './Skills'
import Projects from './Projects'
import Blogs from './Blogs'
import Education from './Education'
import Certificates from './Certificates'
import Contact from './Contact'

/* ── palette ── */
const DAY_SKY = '#cfe3ef'
const NIGHT_SKY = '#0b0e1a'
const INKTEXT = '#1d1c19'
const ACCENTS = ['#4398cd', '#d82d17', '#edcb1f', '#298f1a']

const ISLAND_R = 100
const TRACK_HALF_W = 5.5 // asphalt half-width

/* ══════════════════════════════════════════════════════════
   THE CIRCUIT — closed spline with straights, a chicane,
   a hairpin-ish S and sweepers. Pure math at module scope so
   the headless test can replicate it exactly.
══════════════════════════════════════════════════════════ */
const TRACK_PTS: [number, number][] = [
  [0, 78],     // 0  start/finish straight (heading east)
  [35, 72],    // 1
  [62, 55],    // 2  sweep in
  [75, 20],    // 3  east straight-ish (CP1 · PROJECTS)
  [60, -8],    // 4  chicane in
  [72, -40],   // 5  chicane out
  [45, -68],   // 6  SE corner
  [8, -75],    // 7  south straight (CP2 · SKILLS)
  [-30, -62],  // 8
  [-52, -30],  // 9  hairpin entry
  [-38, -6],   // 10 hairpin apex (tight!)
  [-60, 20],   // 11 esses out (CP3 · ABOUT)
  [-45, 48],   // 12 NW sweeper
  [-18, 62],   // 13 onto the main straight
]
const SEG_SAMPLES = 14

function buildSamples() {
  const P = TRACK_PTS
  const n = P.length
  const pts: { x: number; z: number }[] = []
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n]
    for (let j = 0; j < SEG_SAMPLES; j++) {
      const s = j / SEG_SAMPLES
      const s2 = s * s, s3 = s2 * s
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3)
      pts.push({ x: cr(p0[0], p1[0], p2[0], p3[0]), z: cr(p0[1], p1[1], p2[1], p3[1]) })
    }
  }
  return pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length]
    const dx = q.x - p.x, dz = q.z - p.z
    const l = Math.hypot(dx, dz) || 1
    return { x: p.x, z: p.z, tx: dx / l, tz: dz / l }
  })
}
const SAMPLES = buildSamples()
const N_S = SAMPLES.length

function inPoly(x: number, z: number) {
  let c = false
  for (let i = 0, j = N_S - 1; i < N_S; j = i++) {
    const a = SAMPLES[i], b = SAMPLES[j]
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) c = !c
  }
  return c
}
/* outward unit normal per sample (points away from the loop interior) */
const OUTN = SAMPLES.map(s => {
  const rx = s.tz, rz = -s.tx // right of travel
  return inPoly(s.x + rx * 4, s.z + rz * 4) ? { x: -rx, z: -rz } : { x: rx, z: rz }
})
const rawStation = (idx: number, off: number, side = 1) => ({
  x: SAMPLES[idx].x + OUTN[idx].x * off * side,
  z: SAMPLES[idx].z + OUTN[idx].z * off * side,
})
/* where the track hugs the shore there is no room outside — flip that station to the infield */
const sideFor = (idx: number) => {
  const p = rawStation(idx, 13, 1)
  return Math.hypot(p.x, p.z) > ISLAND_R - 12 ? -1 : 1
}
const stationPos = (idx: number, off: number) => rawStation(idx, off, sideFor(idx))
export function distToTrack(x: number, z: number) {
  let d = Infinity
  for (const s of SAMPLES) d = Math.min(d, Math.hypot(x - s.x, z - s.z))
  return d
}

/* station sample indices around the lap */
const ST = { START: 0, CERT: 14, PROJ: 42, BLOGS: 70, SKILLS: 98, EDU: 126, ABOUT: 154, CONTACT: 168 }
const CP_IDX = [ST.PROJ, ST.SKILLS, ST.ABOUT]
/* themed buildings sit behind each station, shifted along the track */
const buildingSpot = (idx: number) => rawStation((idx + 7) % N_S, 22, sideFor(idx))
const BUILDING_IDX = [ST.PROJ, ST.SKILLS, ST.EDU, ST.ABOUT, ST.BLOGS, ST.CONTACT, ST.CERT]
const BUILDING_SPOTS = BUILDING_IDX.map(buildingSpot)

const ZONES = [
  { name: 'PROJECTS',     color: '#4398cd', ...stationPos(ST.PROJ, 13) },
  { name: 'SKILLS',       color: '#298f1a', ...stationPos(ST.SKILLS, 13) },
  { name: 'ABOUT',        color: '#edcb1f', ...stationPos(ST.ABOUT, 13) },
  { name: 'CONTACT',      color: '#d82d17', ...stationPos(ST.CONTACT, 13) },
  { name: 'BLOGS',        color: '#8a8378', ...stationPos(ST.BLOGS, 13) },
  { name: 'EDUCATION',    color: '#4398cd', ...stationPos(ST.EDU, 13) },
  { name: 'CERTIFICATES', color: '#edcb1f', ...stationPos(ST.CERT, 13) },
] as const
type ZoneName = typeof ZONES[number]['name']
const ZONE_RADIUS = 6

const PANELS: Record<ZoneName, () => JSX.Element> = {
  PROJECTS: () => <Projects />,
  SKILLS: () => <Skills />,
  ABOUT: () => <><About /><SoftSkills /></>,
  CONTACT: () => <Contact />,
  BLOGS: () => <Blogs />,
  EDUCATION: () => <Education />,
  CERTIFICATES: () => <Certificates />,
}

/* coins: a trail around the circuit + playground + ramp arc */
const COINS: [number, number, number][] = [
  ...Array.from({ length: 16 }, (_, i) => {
    const s = SAMPLES[(i * 12 + 6) % N_S]
    return [s.x, 1, s.z] as [number, number, number]
  }),
  [30, 5.5, 42], [30, 6, 48], // ramp jump arc — placed on the boosted launch trajectory
  [18, 1, 8], [-18, 1, 16], [25, 1, -10], [0, 1, -24],
]

/* ── procedural textures ── */
function pixelTexture(text: string, color: string, bg = 'transparent'): THREE.CanvasTexture {
  const b = 8, gap = 1
  const cols = text.length * 6 - 1
  const canvas = document.createElement('canvas')
  canvas.width = cols * b
  canvas.height = 7 * b
  const ctx = canvas.getContext('2d')!
  if (bg !== 'transparent') { ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height) }
  ctx.fillStyle = color
  let x = 0
  for (const ch of text.toUpperCase()) {
    const g = PIXEL_FONT[ch] ?? PIXEL_FONT[' ']
    g.forEach((row, ry) => {
      for (let rx = 0; rx < 5; rx++) {
        if (row[rx] === 'X') ctx.fillRect((x + rx) * b, ry * b, b - gap, b - gap)
      }
    })
    x += 6
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 4
  return tex
}

function groundTex(): THREE.CanvasTexture {
  /* grass — layered green speckle for a realistic meadow read */
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#a4c46a'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = ['#8fb058', '#b2cf7c', '#97ba60'][i % 3]
    ctx.fillRect((i * 37) % 256, (i * 89) % 256, 3, 3)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(40, 40)
  return tex
}

function houseTex(wall: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 64; c.height = 128
  const ctx = c.getContext('2d')!
  ctx.fillStyle = wall
  ctx.fillRect(0, 0, 64, 128)
  for (let y = 10; y < 118; y += 18) {
    for (let x = 8; x < 56; x += 15) {
      ctx.fillStyle = Math.random() < 0.25 ? '#ffe9a0' : '#3c4654'
      ctx.fillRect(x, y, 9, 11)
    }
  }
  return new THREE.CanvasTexture(c)
}

function waterTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#7ec3e8'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#a5d8f3'
  for (let i = 0; i < 30; i++) ctx.fillRect((i * 37) % 128, (i * 53) % 128, 12, 2)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(24, 24)
  return tex
}

/* clean rounded name card — replaces the chunky pixel label sprites */
function labelTexture(text: string, accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  const W = Math.max(200, text.length * 26 + 60), H = 72
  c.width = W; c.height = H
  const ctx = c.getContext('2d')!
  const r = 16
  ctx.fillStyle = 'rgba(29,28,25,0.25)'
  ctx.beginPath()
  ctx.roundRect(6, 8, W - 8, H - 12, r)
  ctx.fill()
  ctx.fillStyle = '#fdfbf5'
  ctx.beginPath()
  ctx.roundRect(2, 2, W - 8, H - 12, r)
  ctx.fill()
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.roundRect(2, 2, 12, H - 12, 6)
  ctx.fill()
  ctx.fillStyle = '#1d1c19'
  ctx.font = 'bold 34px "Space Mono", monospace'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 30, H / 2 - 4)
  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  return tex
}

function stripeTexBlue(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 64; c.height = 16
  const ctx = c.getContext('2d')!
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#f7f3ea' : '#4398cd'
    ctx.fillRect(i * 8, 0, 8, 16)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

function checkerTex(cells = 8): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = cells * 8; c.height = 16
  const ctx = c.getContext('2d')!
  for (let i = 0; i < cells; i++) for (let j = 0; j < 2; j++) {
    ctx.fillStyle = (i + j) % 2 ? '#1d1c19' : '#f7f3ea'
    ctx.fillRect(i * 8, j * 8, 8, 8)
  }
  return new THREE.CanvasTexture(c)
}

function projectCardTex(p: typeof projects[number]): THREE.CanvasTexture {
  const W = 512, H = 320
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#faf6ec'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = p.accentColor
  ctx.fillRect(0, 0, W, 54)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 26px "Space Mono", monospace'
  ctx.fillText(`${p.number} · ${p.badge}`, 18, 36)
  ctx.fillStyle = '#1d1c19'
  ctx.font = 'bold 24px "Space Mono", monospace'
  const words = p.title.split(' ')
  let line = '', y = 92
  for (const w of words) {
    if (ctx.measureText(line + w).width > W - 40) {
      ctx.fillText(line, 18, y)
      y += 30
      line = w + ' '
      if (y > 175) { line += '…'; break }
    } else line += w + ' '
  }
  ctx.fillText(line.trim(), 18, y)
  ctx.font = '17px "Space Mono", monospace'
  ctx.fillStyle = '#6b675c'
  ctx.fillText(p.tags.slice(0, 5).join(' · '), 18, 215)
  ctx.fillStyle = p.accentColor
  ctx.fillRect(18, 240, W - 36, 3)
  ctx.fillStyle = '#1d1c19'
  ctx.font = 'bold 18px "Space Mono", monospace'
  ctx.fillText('DRIVE UP + ENTER → OPEN ON GITHUB', 18, 280)
  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  return tex
}

interface Keys { up: boolean; down: boolean; left: boolean; right: boolean; brake: boolean; boost: boolean }

export default function World3D() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLCanvasElement>(null)
  const keysRef = useRef<Keys>({ up: false, down: false, left: false, right: false, brake: false, boost: false })
  const [zone, setZone] = useState<typeof ZONES[number] | null>(null)
  const zoneRef = useRef<typeof ZONES[number] | null>(null)
  const [panel, setPanel] = useState<ZoneName | null>(null)
  const panelRef = useRef<ZoneName | null>(null)
  const [screenPrompt, setScreenPrompt] = useState<{ title: string; url: string } | null>(null)
  const screenPromptRef = useRef<{ title: string; url: string } | null>(null)
  const [speed, setSpeed] = useState(0)
  const [coins, setCoins] = useState(0)
  const [visited, setVisited] = useState<string[]>([])
  const [race, setRace] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [muted, setMuted] = useState(false)
  const mutedRef = useRef(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => { mutedRef.current = muted }, [muted])
  useEffect(() => { panelRef.current = panel }, [panel])
  useEffect(() => { screenPromptRef.current = screenPrompt }, [screenPrompt])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(DAY_SKY)
    scene.fog = new THREE.Fog(DAY_SKY, 90, 240)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500)

    let dayT = 1
    let dayTarget = 1
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    const hemi = new THREE.HemisphereLight(0xbcdcff, 0xa4c46a, 0.7)
    const sun = new THREE.DirectionalLight(0xfff8ea, 1.6)
    sun.position.set(30, 55, -25)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    const sc = sun.shadow.camera
    sc.left = -75; sc.right = 75; sc.top = 75; sc.bottom = -75; sc.far = 190
    scene.add(ambient, hemi, sun, sun.target)

    const starGeo = new THREE.BufferGeometry()
    const starPos: number[] = []
    for (let i = 0; i < 420; i++) {
      const a = Math.random() * Math.PI * 2
      const e = Math.random() * Math.PI * 0.45 + 0.08
      const r = 180 + Math.random() * 80
      starPos.push(Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r)
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0, fog: false })
    scene.add(new THREE.Points(starGeo, starMat))
    const moonMat = new THREE.MeshBasicMaterial({ color: '#f2f0e8', fog: false, transparent: true, opacity: 0 })
    const moon = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 16), moonMat)
    moon.position.set(-90, 90, -140)
    scene.add(moon)

    const cloudMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, fog: false })
    const clouds: THREE.Group[] = []
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group()
      for (let j = 0; j < 4; j++) {
        const puff = new THREE.Mesh(new RoundedBoxGeometry(6 + j * 2, 2.6, 4, 2, 1), cloudMat)
        puff.position.set(j * 4 - 6, (j % 2) * 1.2, j % 3)
        g.add(puff)
      }
      const a = (i / 7) * Math.PI * 2
      g.position.set(Math.cos(a) * 120, 45 + (i % 3) * 8, Math.sin(a) * 120)
      scene.add(g)
      clouds.push(g)
    }

    /* ════ physics ════ */
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) })
    world.broadphase = new CANNON.SAPBroadphase(world)
    world.allowSleep = true
    const groundMat = new CANNON.Material('ground')
    const propMat = new CANNON.Material('prop')
    const chassisMat = new CANNON.Material('chassis')
    const ballMat = new CANNON.Material('ball')
    world.addContactMaterial(new CANNON.ContactMaterial(groundMat, propMat, { friction: 0.4, restitution: 0.25 }))
    world.addContactMaterial(new CANNON.ContactMaterial(chassisMat, propMat, { friction: 0.05, restitution: 0.5 }))
    world.addContactMaterial(new CANNON.ContactMaterial(groundMat, ballMat, { friction: 0.3, restitution: 0.7 }))
    world.addContactMaterial(new CANNON.ContactMaterial(chassisMat, ballMat, { friction: 0.05, restitution: 0.8 }))
    /* dominoes: slippery against each other (no lean-stall), grippy on the ground (pivot, don't slide) —
       probed headless: this combo gives a full 10/10 cascade */
    const dominoMat = new CANNON.Material('domino')
    world.addContactMaterial(new CANNON.ContactMaterial(dominoMat, dominoMat, { friction: 0, restitution: 0.05 }))
    world.addContactMaterial(new CANNON.ContactMaterial(dominoMat, groundMat, { friction: 0.8, restitution: 0 }))
    world.addContactMaterial(new CANNON.ContactMaterial(dominoMat, chassisMat, { friction: 0.05, restitution: 0.3 }))

    const groundBody = new CANNON.Body({ mass: 0, material: groundMat })
    groundBody.position.set(0, -3, 0)
    groundBody.addShape(new CANNON.Cylinder(ISLAND_R, ISLAND_R, 6, 24))
    groundBody.aabbNeedsUpdate = true
    world.addBody(groundBody)

    const islandTop = new THREE.Mesh(
      new THREE.CircleGeometry(ISLAND_R, 64),
      new THREE.MeshStandardMaterial({ map: groundTex(), roughness: 0.95 }),
    )
    islandTop.rotation.x = -Math.PI / 2
    islandTop.receiveShadow = true
    scene.add(islandTop)

    const cliff = new THREE.Mesh(
      new THREE.CylinderGeometry(ISLAND_R, ISLAND_R + 4, 7, 64, 1, true),
      new THREE.MeshStandardMaterial({ color: '#b08d5f', roughness: 1 }),
    )
    cliff.position.y = -3.5
    scene.add(cliff)

    const beach = new THREE.Mesh(
      new THREE.RingGeometry(ISLAND_R - 5, ISLAND_R, 64),
      new THREE.MeshStandardMaterial({ color: '#dcc891', roughness: 1 }),
    )
    beach.rotation.x = -Math.PI / 2
    beach.position.y = 0.01
    scene.add(beach)

    const seaTex = waterTex()
    const sea = new THREE.Mesh(
      new THREE.PlaneGeometry(900, 900),
      new THREE.MeshStandardMaterial({ map: seaTex, roughness: 0.35, metalness: 0.1 }),
    )
    sea.rotation.x = -Math.PI / 2
    sea.position.y = -4.5
    scene.add(sea)

    const ducks: { g: THREE.Group; a: number; r: number; sp: number; pop: number }[] = []
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group()
      const b = new THREE.Mesh(new RoundedBoxGeometry(1.6, 1, 1.9, 2, 0.3), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.6 }))
      const h = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.9, 0.9, 2, 0.2), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.6 }))
      h.position.set(0, 0.8, 0.7)
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), new THREE.MeshStandardMaterial({ color: '#edcb1f' }))
      beak.position.set(0, 0.7, 1.3)
      g.add(b, h, beak)
      scene.add(g)
      ducks.push({ g, a: (i / 4) * Math.PI * 2, r: ISLAND_R + 14 + i * 5, sp: 0.05 + i * 0.02, pop: 0 })
    }

    /* ── animated animals (decorative, no physics) ── */
    /* birds: flapping gulls circling above the island */
    const birds: { g: THREE.Group; wl: THREE.Mesh; wr: THREE.Mesh; a: number; r: number; h: number; sp: number; ph: number }[] = []
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.3, 1, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.6 }))
      const wingGeo = new THREE.BoxGeometry(1.4, 0.06, 0.5)
      const wingMat = new THREE.MeshStandardMaterial({ color: '#e8e2d5', roughness: 0.6 })
      const wl = new THREE.Mesh(wingGeo, wingMat)
      wl.position.set(-0.8, 0.05, 0)
      const wr = new THREE.Mesh(wingGeo, wingMat)
      wr.position.set(0.8, 0.05, 0)
      g.add(body, wl, wr)
      scene.add(g)
      birds.push({ g, wl, wr, a: (i / 4) * Math.PI * 2, r: 42 + i * 9, h: 20 + (i % 3) * 5, sp: 0.1 + i * 0.03, ph: i * 1.7 })
    }
    /* rabbits: hopping around the infield */
    const rabbits: { g: THREE.Group; home: [number, number]; a: number; sp: number; ph: number }[] = []
    ;[[12, 24], [-14, 30], [26, -4]].forEach(([hx, hz], i) => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.6, 0.9, 2, 0.2), new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.7 }))
      body.position.y = 0.4
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.5, 2, 0.15), new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.7 }))
      head.position.set(0, 0.8, 0.4)
      const earGeo = new THREE.BoxGeometry(0.12, 0.5, 0.08)
      const earMat = new THREE.MeshStandardMaterial({ color: '#e8d3c8', roughness: 0.7 })
      const earL = new THREE.Mesh(earGeo, earMat)
      earL.position.set(-0.12, 1.25, 0.35)
      const earR = new THREE.Mesh(earGeo, earMat)
      earR.position.set(0.12, 1.25, 0.35)
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), new THREE.MeshStandardMaterial({ color: '#fdfdf8' }))
      tail.position.set(0, 0.45, -0.5)
      g.add(body, head, earL, earR, tail)
      g.traverse(o => { o.castShadow = true })
      scene.add(g)
      rabbits.push({ g, home: [hx, hz], a: i * 2, sp: 0.25 + i * 0.08, ph: i * 2.1 })
    })
    /* butterflies fluttering near the cottages */
    const butterflies: { g: THREE.Group; wl: THREE.Mesh; wr: THREE.Mesh; home: [number, number]; ph: number }[] = []
    ;[[0, 36], [10, 41], [-8, 34], [20, 12]].forEach(([hx, hz], i) => {
      const g = new THREE.Group()
      const wingGeo = new THREE.PlaneGeometry(0.4, 0.3)
      const wingMat = new THREE.MeshBasicMaterial({ color: ACCENTS[i % 4], side: THREE.DoubleSide })
      const wl = new THREE.Mesh(wingGeo, wingMat)
      wl.position.x = -0.2
      const wr = new THREE.Mesh(wingGeo, wingMat)
      wr.position.x = 0.2
      g.add(wl, wr)
      scene.add(g)
      butterflies.push({ g, wl, wr, home: [hx, hz], ph: i * 1.9 })
    })
    /* sheep grazing in the meadows */
    const sheep: { g: THREE.Group; head: THREE.Mesh; home: [number, number]; a: number; sp: number; ph: number }[] = []
    ;[[26, 20], [30, 14], [-24, 22], [-30, 12], [10, -14]].forEach(([hx, hz], i) => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.9, 1.5, 2, 0.35), new THREE.MeshStandardMaterial({ color: '#f5f2e8', roughness: 0.9 }))
      body.position.y = 0.75
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.6, 2, 0.15), new THREE.MeshStandardMaterial({ color: '#2c2a26', roughness: 0.8 }))
      head.position.set(0, 0.95, 0.85)
      const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 6)
      const legMat = new THREE.MeshStandardMaterial({ color: '#2c2a26', roughness: 0.8 })
      ;[[-0.35, 0.5], [0.35, 0.5], [-0.35, -0.5], [0.35, -0.5]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, 0.25, lz)
        g.add(leg)
      })
      g.add(body, head)
      g.traverse(o => { o.castShadow = true })
      scene.add(g)
      sheep.push({ g, head, home: [hx, hz], a: i * 1.3, sp: 0.06 + (i % 3) * 0.02, ph: i * 2.4 })
    })
    /* deer wandering the south meadow */
    const deer: { g: THREE.Group; home: [number, number]; a: number; sp: number; ph: number }[] = []
    ;[[-12, -38], [16, -44]].forEach(([hx, hz], i) => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.9, 1.7, 2, 0.25), new THREE.MeshStandardMaterial({ color: '#a5713d', roughness: 0.8 }))
      body.position.y = 1.1
      const neck = new THREE.Mesh(new RoundedBoxGeometry(0.35, 0.9, 0.35, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#a5713d', roughness: 0.8 }))
      neck.position.set(0, 1.8, 0.75)
      neck.rotation.x = -0.3
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.4, 0.65, 2, 0.12), new THREE.MeshStandardMaterial({ color: '#b07d47', roughness: 0.8 }))
      head.position.set(0, 2.3, 1.05)
      const antGeo = new THREE.BoxGeometry(0.07, 0.6, 0.07)
      const antMat = new THREE.MeshStandardMaterial({ color: '#6f5238', roughness: 0.8 })
      ;[-0.15, 0.15].forEach(ax => {
        const ant = new THREE.Mesh(antGeo, antMat)
        ant.position.set(ax, 2.75, 0.95)
        ant.rotation.z = ax * 2
        g.add(ant)
      })
      const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 1.1, 6)
      const legMat = new THREE.MeshStandardMaterial({ color: '#8a5c30', roughness: 0.8 })
      ;[[-0.3, 0.6], [0.3, 0.6], [-0.3, -0.6], [0.3, -0.6]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, 0.55, lz)
        g.add(leg)
      })
      g.add(body, neck, head)
      g.traverse(o => { o.castShadow = true })
      scene.add(g)
      deer.push({ g, home: [hx, hz], a: i * 2.8, sp: 0.05 + i * 0.02, ph: i * 3.3 })
    })
    /* turtle crawling around the beach */
    const turtle = new THREE.Group()
    {
      const shell = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#298f1a', roughness: 0.7 }))
      shell.scale.set(1, 0.6, 1.2)
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.35, 0.5, 2, 0.12), new THREE.MeshStandardMaterial({ color: '#57c93f', roughness: 0.7 }))
      head.position.set(0, 0.25, 1.2)
      const finGeo = new THREE.BoxGeometry(0.5, 0.12, 0.3)
      const finMat = new THREE.MeshStandardMaterial({ color: '#57c93f', roughness: 0.7 })
      ;[[-0.8, 0.6], [0.8, 0.6], [-0.8, -0.6], [0.8, -0.6]].forEach(([fx, fz]) => {
        const fin = new THREE.Mesh(finGeo, finMat)
        fin.position.set(fx, 0.12, fz)
        turtle.add(fin)
      })
      turtle.add(shell, head)
      turtle.traverse(o => { o.castShadow = true })
    }
    scene.add(turtle)
    let turtleA = 0

    const staticBox = (half: [number, number, number], pos: [number, number, number], euler?: [number, number, number]) => {
      const body = new CANNON.Body({ mass: 0, material: groundMat })
      body.position.set(...pos)
      if (euler) body.quaternion.setFromEuler(...euler)
      body.addShape(new CANNON.Box(new CANNON.Vec3(...half)))
      body.aabbNeedsUpdate = true
      world.addBody(body)
    }
    const staticCylinder = (radius: number, height: number, pos: [number, number, number]) => {
      const body = new CANNON.Body({ mass: 0, material: groundMat })
      body.position.set(...pos)
      body.addShape(new CANNON.Cylinder(radius, radius, height, 8))
      body.aabbNeedsUpdate = true
      world.addBody(body)
    }

    /* ════ TRACK RIBBON ════ */
    {
      const pos: number[] = []
      const idxArr: number[] = []
      for (let i = 0; i < N_S; i++) {
        const s = SAMPLES[i]
        const nx = s.tz, nz = -s.tx
        pos.push(s.x + nx * TRACK_HALF_W, 0.025, s.z + nz * TRACK_HALF_W)
        pos.push(s.x - nx * TRACK_HALF_W, 0.025, s.z - nz * TRACK_HALF_W)
        const a = i * 2, b = i * 2 + 1, c = ((i + 1) % N_S) * 2, d = ((i + 1) % N_S) * 2 + 1
        idxArr.push(a, b, c, b, d, c)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      geo.setIndex(idxArr)
      geo.computeVertexNormals()
      const track = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#6b675c', roughness: 0.92 }))
      track.receiveShadow = true
      scene.add(track)
    }

    /* dashes + curbs along the spline */
    const dashMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.35, 0.02, 2.2),
      new THREE.MeshBasicMaterial({ color: '#f7f3ea' }),
      Math.floor(N_S / 3),
    )
    const curbMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.7, 0.1, 2.4),
      new THREE.MeshStandardMaterial({ roughness: 0.6 }),
      N_S, // both edges, every 2nd sample
    )
    {
      const m4 = new THREE.Matrix4()
      const q = new THREE.Quaternion()
      const up = new THREE.Vector3(0, 1, 0)
      let di = 0
      for (let i = 0; i < N_S; i += 3) {
        const s = SAMPLES[i]
        q.setFromAxisAngle(up, Math.atan2(s.tx, s.tz))
        m4.compose(new THREE.Vector3(s.x, 0.03, s.z), q, new THREE.Vector3(1, 1, 1))
        if (di < dashMesh.count) dashMesh.setMatrixAt(di++, m4)
      }
      let ci = 0
      for (let i = 0; i < N_S; i += 2) {
        const s = SAMPLES[i]
        q.setFromAxisAngle(up, Math.atan2(s.tx, s.tz))
        for (const side of [1, -1]) {
          const nx = s.tz * side, nz = -s.tx * side
          m4.compose(new THREE.Vector3(s.x + nx * (TRACK_HALF_W - 0.35), 0.04, s.z + nz * (TRACK_HALF_W - 0.35)), q, new THREE.Vector3(1, 1, 1))
          if (ci < curbMesh.count) {
            curbMesh.setMatrixAt(ci, m4)
            curbMesh.setColorAt(ci, new THREE.Color((i / 2) % 2 ? '#d82d17' : '#f7f3ea'))
            ci++
          }
        }
      }
    }
    scene.add(dashMesh, curbMesh)

    /* tire stacks on the outside of real corners (curvature-based) */
    const tireSpots: [number, number][] = []
    for (let i = 0; i < N_S; i += 4) {
      const a = SAMPLES[i], b = SAMPLES[(i + 4) % N_S]
      const cross = a.tz * b.tx - a.tx * b.tz
      if (Math.abs(cross) > 0.25) {
        // outside of the turn: opposite the turn direction
        const side = cross > 0 ? -1 : 1
        let ox = a.tz * side, oz = -a.tx * side
        let px = a.x + ox * 9, pz = a.z + oz * 9
        while (distToTrack(px, pz) < 8 && Math.hypot(px, pz) < ISLAND_R - 6) { px += ox * 1.5; pz += oz * 1.5 }
        // skip if too close to a station pad or a themed building
        if (ZONES.some(zn => (px - zn.x) ** 2 + (pz - zn.z) ** 2 < 100)) continue
        if (BUILDING_SPOTS.some(b => (px - b.x) ** 2 + (pz - b.z) ** 2 < 110)) continue
        if (Math.hypot(px, pz) < ISLAND_R - 6) tireSpots.push([px, pz])
      }
    }
    const tireMesh = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: '#2c2a26', roughness: 0.95 }),
      tireSpots.length * 2,
    )
    {
      const m4 = new THREE.Matrix4()
      tireSpots.forEach(([x, z], i) => {
        for (let s = 0; s < 2; s++) {
          m4.makeTranslation(x, 0.25 + s * 0.5, z)
          tireMesh.setMatrixAt(i * 2 + s, m4)
        }
        staticCylinder(0.7, 1.1, [x, 0.55, z])
      })
    }
    tireMesh.castShadow = true
    scene.add(tireMesh)

    /* start/finish gantry + checkered line + grandstand + flags */
    const s0 = SAMPLES[ST.START]
    const startYaw = Math.atan2(s0.tx, s0.tz)
    const gantryMat = new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.7 })
    for (const side of [1, -1]) {
      const nx = s0.tz * side, nz = -s0.tx * side
      const px = s0.x + nx * (TRACK_HALF_W + 1.6), pz = s0.z + nz * (TRACK_HALF_W + 1.6)
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 7, 10), gantryMat)
      pole.position.set(px, 3.5, pz)
      pole.castShadow = true
      scene.add(pole)
      staticCylinder(0.35, 7, [px, 3.5, pz])
    }
    /* beam spans ACROSS the track (long axis = local x → right vector), text faces the road */
    const beamTex = labelTexture('START · FINISH', '#d82d17')
    const beamLen = (TRACK_HALF_W + 1.6) * 2 + 1
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(beamLen, 1.4, 1.2),
      [null, null, null, null, null, null].map((_, i) =>
        i >= 4 ? new THREE.MeshStandardMaterial({ map: beamTex }) : new THREE.MeshStandardMaterial({ color: '#f2ede0' }),
      ),
    )
    beam.position.set(s0.x, 6.6, s0.z)
    beam.rotation.y = startYaw
    beam.castShadow = true
    scene.add(beam)
    /* checkered strip painted across the asphalt, aligned to the road */
    const finishLine = new THREE.Mesh(
      new THREE.BoxGeometry(TRACK_HALF_W * 2 - 0.6, 0.02, 2.4),
      new THREE.MeshBasicMaterial({ map: checkerTex(6) }),
    )
    finishLine.position.set(s0.x, 0.035, s0.z)
    finishLine.rotation.y = startYaw
    scene.add(finishLine)

    const standPos = stationPos(4, 17)
    const standGroup = new THREE.Group()
    ;[0, 1, 2].forEach(step => {
      const row = new THREE.Mesh(
        new RoundedBoxGeometry(12, 1.1, 2, 2, 0.08),
        new THREE.MeshStandardMaterial({ color: ['#4398cd', '#d82d17', '#edcb1f'][step], roughness: 0.6 }),
      )
      row.position.set(0, 0.55 + step * 1.1, step * 2)
      row.castShadow = row.receiveShadow = true
      standGroup.add(row)
    })
    standGroup.position.set(standPos.x, 0, standPos.z)
    standGroup.lookAt(SAMPLES[4].x, 0, SAMPLES[4].z)
    scene.add(standGroup)
    staticBox([6, 2, 3.4], [standPos.x, 2, standPos.z])

    const flags: { m: THREE.Mesh; phase: number; base: number }[] = []
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor((i / 12) * N_S)
      const s = SAMPLES[idx]
      const px = s.x - OUTN[idx].x * 8.5, pz = s.z - OUTN[idx].z * 8.5 // inner side
      if (distToTrack(px, pz) < 7.5) continue
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 6), new THREE.MeshStandardMaterial({ color: '#8f8672' }))
      pole.position.set(px, 1.7, pz)
      scene.add(pole)
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 0.7),
        new THREE.MeshStandardMaterial({ color: ACCENTS[i % 4], side: THREE.DoubleSide, roughness: 0.7 }),
      )
      flag.position.set(px, 3, pz)
      scene.add(flag)
      flags.push({ m: flag, phase: i * 1.3, base: Math.atan2(s.tx, s.tz) })
    }

    /* checkpoint rings on the track */
    const cpRings = CP_IDX.map(idx => {
      const s = SAMPLES[idx]
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.4, 0.28, 10, 32),
        // depthWrite off: no glassy "dome" artifact when the ring overlaps buildings
        new THREE.MeshStandardMaterial({ color: '#4398cd', emissive: '#4398cd', emissiveIntensity: 0.25, transparent: true, opacity: 0.3, depthWrite: false }),
      )
      ring.position.set(s.x, 3.4, s.z)
      ring.rotation.y = Math.atan2(s.tx, s.tz)
      scene.add(ring)
      return ring
    })
    const raceRef = { active: false, cp: 0, t0: 0, cool: 0, best: Number(localStorage.getItem('islandBest') || 0) }

    /* ════ stations ════ */
    /* PROJECTS: screens row along the outside at CP1 */
    /* screens in a clean straight row along the tangent (no bunching on curves) */
    const screens: { x: number; z: number; title: string; url: string }[] = []
    const scrSide = sideFor(ST.PROJ)
    const scrBase = rawStation(ST.PROJ, 16, scrSide)
    const scrTan = { x: SAMPLES[ST.PROJ].tx, z: SAMPLES[ST.PROJ].tz }
    const scrOut = { x: OUTN[ST.PROJ].x * scrSide, z: OUTN[ST.PROJ].z * scrSide }
    projects.forEach((p, i) => {
      const spot = {
        x: scrBase.x + scrTan.x * (i - (projects.length - 1) / 2) * 8,
        z: scrBase.z + scrTan.z * (i - (projects.length - 1) / 2) * 8,
      }
      const s = { x: spot.x - scrOut.x * 10, z: spot.z - scrOut.z * 10 } // face the track side
      const g = new THREE.Group()
      const frame = new THREE.Mesh(new RoundedBoxGeometry(6.6, 4.4, 0.4, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#1d1c19', roughness: 0.6 }))
      frame.position.y = 4
      frame.castShadow = true
      const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.75), new THREE.MeshBasicMaterial({ map: projectCardTex(p) }))
      screenMesh.position.set(0, 4, 0.22)
      ;[-2.6, 2.6].forEach(px => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 3.6, 8), new THREE.MeshStandardMaterial({ color: '#8f8672' }))
        leg.position.set(px, 1.4, 0)
        leg.castShadow = true
        g.add(leg)
      })
      g.add(frame, screenMesh)
      g.position.set(spot.x, 0, spot.z)
      g.lookAt(s.x, 4, s.z)
      scene.add(g)
      staticBox([3.3, 3, 0.4], [spot.x, 3, spot.z], [0, Math.atan2(s.x - spot.x, s.z - spot.z), 0])
      screens.push({ x: spot.x, z: spot.z, title: p.badge, url: p.githubUrl })
    })

    /* SKILLS: tower row in a straight line trackside at CP2 */
    const twSide = sideFor(ST.SKILLS)
    const twBase = rawStation(ST.SKILLS, 15, twSide)
    const twTan = { x: SAMPLES[ST.SKILLS].tx, z: SAMPLES[ST.SKILLS].tz }
    skillCategories.forEach((cat, i) => {
      const spot = {
        x: twBase.x + twTan.x * (i - (skillCategories.length - 1) / 2) * 5,
        z: twBase.z + twTan.z * (i - (skillCategories.length - 1) / 2) * 5,
      }
      const h = 3.5 + (i % 4) * 1.4
      const color = ACCENTS[i % 4]
      const tower = new THREE.Mesh(new RoundedBoxGeometry(2.4, h, 2.4, 2, 0.12), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }))
      tower.position.set(spot.x, h / 2, spot.z)
      tower.castShadow = tower.receiveShadow = true
      scene.add(tower)
      staticBox([1.2, h / 2, 1.2], [spot.x, h / 2, spot.z])
      const short = cat.name.split(' ')[0].replace('&', '').toUpperCase()
      const tex = labelTexture(short, color)
      const aspect = tex.image.width / tex.image.height
      const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }))
      label.scale.set(1.1 * aspect, 1.1, 1)
      label.position.set(spot.x, h + 1.1, spot.z)
      scene.add(label)
    })

    /* monuments behind their pads */
    const monument = (idx: number) => stationPos(idx, 20)

    const aboutSpot = monument(ST.ABOUT)
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 1.6, 24), new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.7 }))
    pedestal.position.set(aboutSpot.x, 0.8, aboutSpot.z)
    pedestal.castShadow = pedestal.receiveShadow = true
    scene.add(pedestal)
    staticCylinder(2.6, 1.6, [aboutSpot.x, 0.8, aboutSpot.z])
    const statue = new THREE.Mesh(
      new RoundedBoxGeometry(2.4, 2.4, 2.4, 2, 0.15),
      new THREE.MeshStandardMaterial({ map: pixelTexture('L', '#1d1c19', '#edcb1f'), roughness: 0.3, metalness: 0.5 }),
    )
    statue.position.set(aboutSpot.x, 3.2, aboutSpot.z)
    statue.castShadow = true
    scene.add(statue)

    const contactSpot = monument(ST.CONTACT)
    const mailGroup = new THREE.Group()
    const mailPost = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 3, 10), new THREE.MeshStandardMaterial({ color: '#8f8672' }))
    mailPost.position.y = 1.5
    const mailBox = new THREE.Mesh(new RoundedBoxGeometry(2.6, 2, 3.6, 3, 0.5), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.4 }))
    mailBox.position.y = 3.8
    const mailFlag = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.5), new THREE.MeshStandardMaterial({ color: '#edcb1f' }))
    mailFlag.position.set(1.4, 4.8, 0.8)
    mailGroup.add(mailPost, mailBox, mailFlag)
    mailGroup.traverse(o => { o.castShadow = true })
    mailGroup.position.set(contactSpot.x, 0, contactSpot.z)
    scene.add(mailGroup)
    staticBox([1.3, 2.5, 1.8], [contactSpot.x, 2.5, contactSpot.z])

    const eduSpot = monument(ST.EDU)
    const capGroup = new THREE.Group()
    const capBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.2, 1.4, 20), new THREE.MeshStandardMaterial({ color: '#1d1c19', roughness: 0.5 }))
    capBase.position.y = 1.6
    const capTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.35, 5.4), new THREE.MeshStandardMaterial({ color: '#1d1c19', roughness: 0.5 }))
    capTop.position.y = 2.5
    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6), new THREE.MeshStandardMaterial({ color: '#edcb1f' }))
    tassel.position.set(2.4, 1.6, 2.4)
    tassel.rotation.z = 0.15
    capGroup.add(capBase, capTop, tassel)
    capGroup.traverse(o => { o.castShadow = true })
    capGroup.position.set(eduSpot.x, 0, eduSpot.z)
    scene.add(capGroup)
    staticBox([2.7, 1.6, 2.7], [eduSpot.x, 1.6, eduSpot.z])

    const blogSpot = monument(ST.BLOGS)
    ;['#4398cd', '#d82d17', '#298f1a'].forEach((bc, i) => {
      const book = new THREE.Mesh(
        new RoundedBoxGeometry(4.4 - i * 0.5, 0.9, 3.2 - i * 0.3, 2, 0.1),
        new THREE.MeshStandardMaterial({ color: bc, roughness: 0.6 }),
      )
      book.position.set(blogSpot.x, 0.5 + i * 0.95, blogSpot.z)
      book.rotation.y = (i - 1) * 0.3
      book.castShadow = book.receiveShadow = true
      scene.add(book)
    })
    staticBox([2.2, 1.5, 1.7], [blogSpot.x, 1.5, blogSpot.z])

    /* podium shifted 4 samples back along the track — out of the ramp landing lane */
    const certSpot = rawStation((ST.CERT - 4 + N_S) % N_S, 20, sideFor(ST.CERT))
    const gold = new THREE.MeshStandardMaterial({ color: '#edcb1f', roughness: 0.25, metalness: 0.7 })
    const silverM = new THREE.MeshStandardMaterial({ color: '#c9c4b8', roughness: 0.3, metalness: 0.6 })
    const bronzeM = new THREE.MeshStandardMaterial({ color: '#b0703a', roughness: 0.3, metalness: 0.5 })
    ;[
      { dx: 0, h: 2.4, m: gold }, { dx: -2.4, h: 1.6, m: silverM }, { dx: 2.4, h: 1, m: bronzeM },
    ].forEach(step => {
      const s = new THREE.Mesh(new RoundedBoxGeometry(2.2, step.h, 2.2, 2, 0.08), step.m)
      s.position.set(certSpot.x + step.dx, step.h / 2, certSpot.z)
      s.castShadow = s.receiveShadow = true
      scene.add(s)
      staticBox([1.1, step.h / 2, 1.1], [certSpot.x + step.dx, step.h / 2, certSpot.z])
    })
    const cup = new THREE.Group()
    const cupBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.45, 1, 14), gold)
    cupBowl.position.y = 0.6
    const cupStem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 0.6, 8), gold)
    cupStem.position.y = -0.1
    cup.add(cupBowl, cupStem)
    cup.traverse(o => { o.castShadow = true })
    cup.position.set(certSpot.x, 3.2, certSpot.z)
    scene.add(cup)

    /* ════ themed buildings — one behind each station ════ */
    const faceTrack = (g: THREE.Group, idx: number) => {
      const s = SAMPLES[(idx + 7) % N_S]
      g.lookAt(s.x, 0, s.z)
    }
    const buildingBase = (spot: { x: number; z: number }, w: number, h: number, d: number, wall: string, withWindows = true) => {
      const g = new THREE.Group()
      const winMat = withWindows
        ? new THREE.MeshStandardMaterial({ map: houseTex(wall), roughness: 0.85 })
        : new THREE.MeshStandardMaterial({ color: wall, roughness: 0.85 })
      const roofMat = new THREE.MeshStandardMaterial({ color: '#8a8378', roughness: 0.9 })
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [winMat, winMat, roofMat, roofMat, winMat, winMat])
      b.position.y = h / 2
      b.castShadow = b.receiveShadow = true
      g.add(b)
      g.position.set(spot.x, 0, spot.z)
      scene.add(g)
      staticBox([w / 2, h / 2, d / 2], [spot.x, h / 2, spot.z])
      return g
    }
    /* PROJECTS: office tower with rooftop antenna + dish */
    {
      const spot = BUILDING_SPOTS[0]
      const g = buildingBase(spot, 8, 14, 8, '#cfd8e4')
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 4, 6), new THREE.MeshStandardMaterial({ color: '#6b675c' }))
      mast.position.y = 16
      const dish = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#f2ede0', side: THREE.DoubleSide }))
      dish.rotation.x = Math.PI / 1.6
      dish.position.set(2.5, 14.6, 2)
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshStandardMaterial({ color: '#d82d17', emissive: '#d82d17', emissiveIntensity: 1.2 }))
      beacon.position.y = 18.1
      g.add(mast, dish, beacon)
      faceTrack(g, ST.PROJ)
    }
    /* SKILLS: workshop/factory with chimney */
    {
      const spot = BUILDING_SPOTS[1]
      const g = buildingBase(spot, 11, 6, 8, '#e0d6c4')
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 5, 10), new THREE.MeshStandardMaterial({ color: '#b0703a', roughness: 0.9 }))
      chimney.position.set(3.5, 8, -2)
      chimney.castShadow = true
      const vent = new THREE.Mesh(new RoundedBoxGeometry(3, 1.2, 3, 2, 0.2), new THREE.MeshStandardMaterial({ color: '#8a8378' }))
      vent.position.set(-2.5, 6.6, 0)
      g.add(chimney, vent)
      faceTrack(g, ST.SKILLS)
    }
    /* EDUCATION: school with pitched roof + clock tower */
    {
      const spot = BUILDING_SPOTS[2]
      const g = buildingBase(spot, 11, 6, 8, '#e8c9b0')
      /* flush ridge roof: slopes meet at the ridge and land on the eaves */
      ;[-1, 1].forEach(side => {
        const slope = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.3, 4.7), new THREE.MeshStandardMaterial({ color: '#c96f4a', roughness: 0.8 }))
        slope.position.set(0, 7, side * 2)
        slope.rotation.x = side * 0.464 // outer eave drops, slopes meet at the ridge (Λ, not V)
        slope.castShadow = true
        g.add(slope)
      })
      const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4, 2.4), new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.8 }))
      tower.position.set(0, 9, 0)
      const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.15, 16), new THREE.MeshStandardMaterial({ color: '#fdfbf5' }))
      clock.rotation.x = Math.PI / 2
      clock.position.set(0, 9.7, 1.25)
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: '#1d1c19' }))
      hand.position.set(0, 9.85, 1.34)
      const bellRoof = new THREE.Mesh(new THREE.ConeGeometry(2, 1.6, 4), new THREE.MeshStandardMaterial({ color: '#c96f4a' }))
      bellRoof.position.set(0, 11.8, 0)
      bellRoof.rotation.y = Math.PI / 4
      g.add(tower, clock, hand, bellRoof)
      faceTrack(g, ST.EDU)
    }
    /* ABOUT: cosy home with chimney */
    {
      const spot = BUILDING_SPOTS[3]
      const g = buildingBase(spot, 7, 5, 7, '#d9e2ce')
      ;[-1, 1].forEach(side => {
        const slope = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.3, 4.1), new THREE.MeshStandardMaterial({ color: '#b0703a', roughness: 0.8 }))
        slope.position.set(0, 5.95, side * 1.75)
        slope.rotation.x = side * 0.5 // ridge roof, not a valley
        slope.castShadow = true
        g.add(slope)
      })
      const chim = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.4, 0.9), new THREE.MeshStandardMaterial({ color: '#b08d5f' }))
      chim.position.set(2, 6.4, 1.5)
      g.add(chim)
      faceTrack(g, ST.ABOUT)
    }
    /* BLOGS: bookshop with awning + giant book on the roof */
    {
      const spot = BUILDING_SPOTS[4]
      const g = buildingBase(spot, 8, 5, 7, '#e6d3e0')
      const awning = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.2, 2.4), new THREE.MeshStandardMaterial({ map: stripeTexBlue(), roughness: 0.7 }))
      awning.position.set(0, 3.4, 4.2)
      awning.rotation.x = 0.25
      const roofBook = new THREE.Mesh(new RoundedBoxGeometry(4.4, 0.9, 3.2, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#4398cd', roughness: 0.6 }))
      roofBook.position.set(0, 5.7, 0)
      roofBook.rotation.y = 0.3
      roofBook.castShadow = true
      const roofBook2 = new THREE.Mesh(new RoundedBoxGeometry(3.9, 0.8, 2.9, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.6 }))
      roofBook2.position.set(0, 6.5, 0)
      roofBook2.rotation.y = -0.2
      roofBook2.castShadow = true
      g.add(awning, roofBook, roofBook2)
      faceTrack(g, ST.BLOGS)
    }
    /* CONTACT: post office with red band + sign */
    {
      const spot = BUILDING_SPOTS[5]
      const g = buildingBase(spot, 9, 5, 7, '#f2e3cf')
      const band = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 7.2), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.6 }))
      band.position.y = 4.4
      const signTex = labelTexture('POST', '#d82d17')
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), new THREE.MeshBasicMaterial({ map: signTex, transparent: true }))
      sign.position.set(0, 5.8, 3.6)
      g.add(band, sign)
      faceTrack(g, ST.CONTACT)
    }
    /* CERTIFICATES: open trophy hall — columns + roof */
    {
      const spot = BUILDING_SPOTS[6]
      const g = new THREE.Group()
      const base = new THREE.Mesh(new RoundedBoxGeometry(9, 0.8, 7, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.8 }))
      base.position.y = 0.4
      base.receiveShadow = true
      g.add(base)
      ;[[-3.4, -2.4], [3.4, -2.4], [-3.4, 2.4], [3.4, 2.4]].forEach(([cx, cz]) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 5, 10), new THREE.MeshStandardMaterial({ color: '#fdfbf5', roughness: 0.7 }))
        col.position.set(cx, 3.3, cz)
        col.castShadow = true
        g.add(col)
      })
      const roof = new THREE.Mesh(new RoundedBoxGeometry(9.6, 0.7, 7.6, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#edcb1f', roughness: 0.4, metalness: 0.4 }))
      roof.position.y = 6.1
      roof.castShadow = true
      g.add(roof)
      g.position.set(spot.x, 0, spot.z)
      scene.add(g)
      staticBox([4.5, 3.4, 3.5], [spot.x, 3.4, spot.z])
      faceTrack(g, ST.CERT)
    }

    /* windmill — infield centerpiece */
    const millGroup = new THREE.Group()
    const millTower = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, 9, 10), new THREE.MeshStandardMaterial({ color: '#f2ede0', roughness: 0.8 }))
    millTower.position.y = 4.5
    millTower.castShadow = true
    millGroup.add(millTower)
    const hub = new THREE.Group()
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.6, 0.12), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.6 }))
      blade.position.y = 2.3
      const arm = new THREE.Group()
      arm.add(blade)
      arm.rotation.z = (i / 4) * Math.PI * 2
      hub.add(arm)
    }
    hub.position.set(0, 8.6, -1.1)
    millGroup.add(hub)
    millGroup.position.set(0, 0, 0)
    millGroup.lookAt(0, 6, 60)
    scene.add(millGroup)
    staticCylinder(1.5, 9, [0, 4.5, 0])

    /* hot-air balloon */
    const hab = new THREE.Group()
    const envelope = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 12), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.6 }))
    const band = new THREE.Mesh(new THREE.CylinderGeometry(4.02, 4.02, 1.2, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#edcb1f', roughness: 0.6, side: THREE.DoubleSide }))
    const basket = new THREE.Mesh(new RoundedBoxGeometry(1.6, 1.2, 1.6, 2, 0.15), new THREE.MeshStandardMaterial({ color: '#8a6a48', roughness: 0.9 }))
    basket.position.y = -5.6
    hab.add(envelope, band, basket)
    scene.add(hab)

    /* trees — anywhere clear of track, stations, props */
    const propSpots: [number, number][] = [
      [18, 11], [-18, 13], [30, 34], [30, 18], [30, 50], [25, -15], [-25, -20], [0, 0],
      [-12, 38], [-2, 42], [8, 38], [16, 44], [2, 30],
      [-20, 30], [-34, 8], [-28, -8],
      /* toys: dominoes, wrecking rig, seesaw, beach balls, slalom */
      [-4, -12], [29, -18], [-6, 22], [8, 19], [-33, -29], [-23, -39],
    ]
    const treeSpots: [number, number][] = []
    const rng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647 } }
    const rand = rng(42)
    while (treeSpots.length < 90) {
      const x = (rand() - 0.5) * 176
      const z = (rand() - 0.5) * 176
      if (x * x + z * z > 86 ** 2) continue
      if (distToTrack(x, z) < 9) continue
      if (Math.abs(x - 30) < 7 && z > 4 && z < 60) continue // ramp jump lane stays clear
      if (ZONES.some(zn => (x - zn.x) ** 2 + (z - zn.z) ** 2 < 196)) continue
      if (BUILDING_SPOTS.some(b => (x - b.x) ** 2 + (z - b.z) ** 2 < 144)) continue
      if (propSpots.some(([px, pz]) => (x - px) ** 2 + (z - pz) ** 2 < 81)) continue
      treeSpots.push([x, z])
    }
    /* two tree types: round canopy + pine, mixed by parity */
    const roundSpots = treeSpots.filter((_, i) => i % 3 !== 0)
    const pineSpots = treeSpots.filter((_, i) => i % 3 === 0)
    const trunkMesh = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.28, 0.4, 1.8, 6),
      new THREE.MeshStandardMaterial({ color: '#8a6a48', roughness: 0.9 }),
      roundSpots.length,
    )
    const leafMesh = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.MeshStandardMaterial({ roughness: 0.8 }),
      roundSpots.length,
    )
    const pineTrunkMesh = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.22, 0.32, 2.2, 6),
      new THREE.MeshStandardMaterial({ color: '#6f5238', roughness: 0.9 }),
      pineSpots.length,
    )
    const pineTopMesh = new THREE.InstancedMesh(
      new THREE.ConeGeometry(1.4, 3.6, 7),
      new THREE.MeshStandardMaterial({ roughness: 0.8 }),
      pineSpots.length,
    )
    trunkMesh.castShadow = leafMesh.castShadow = pineTrunkMesh.castShadow = pineTopMesh.castShadow = true
    const mtx = new THREE.Matrix4()
    const leafColors = ['#3fae2a', '#57c93f', '#e0b12f', '#2c8f1f']
    const pineColors = ['#1f7a3a', '#2c8f4a', '#186332']
    roundSpots.forEach(([x, z], i) => {
      const s = 0.8 + rand() * 0.7
      mtx.makeScale(s, s, s).setPosition(x, 0.9 * s, z)
      trunkMesh.setMatrixAt(i, mtx)
      mtx.makeScale(s, s * (0.9 + rand() * 0.4), s).setPosition(x, 3 * s, z)
      leafMesh.setMatrixAt(i, mtx)
      leafMesh.setColorAt(i, new THREE.Color(leafColors[i % 4]))
      staticCylinder(0.45 * s, 3 * s, [x, 1.5 * s, z])
    })
    pineSpots.forEach(([x, z], i) => {
      const s = 0.8 + rand() * 0.8
      mtx.makeScale(s, s, s).setPosition(x, 1.1 * s, z)
      pineTrunkMesh.setMatrixAt(i, mtx)
      mtx.makeScale(s, s, s).setPosition(x, 3.9 * s, z)
      pineTopMesh.setMatrixAt(i, mtx)
      pineTopMesh.setColorAt(i, new THREE.Color(pineColors[i % 3]))
      staticCylinder(0.4 * s, 4 * s, [x, 2 * s, z])
    })
    scene.add(trunkMesh, leafMesh, pineTrunkMesh, pineTopMesh)

    /* rocks + flowers (decorative) */
    const rockMesh = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.MeshStandardMaterial({ color: '#9a958a', roughness: 0.95 }),
      26,
    )
    for (let i = 0; i < 26; i++) {
      let x = 0, z = 0
      do {
        x = (rand() - 0.5) * 176
        z = (rand() - 0.5) * 176
      } while (x * x + z * z > 86 ** 2 || distToTrack(x, z) < 8.5 || propSpots.some(([px, pz]) => (x - px) ** 2 + (z - pz) ** 2 < 64))
      const s = 0.5 + rand() * 1
      mtx.makeScale(s, s * 0.7, s).setPosition(x, 0.25 * s, z)
      rockMesh.setMatrixAt(i, mtx)
    }
    rockMesh.castShadow = true
    scene.add(rockMesh)
    const flowerMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.22, 0.22, 0.22),
      new THREE.MeshBasicMaterial(),
      220,
    )
    const flowerColors = ['#d82d17', '#edcb1f', '#f0f0ea', '#e88bc4']
    for (let i = 0; i < 220; i++) {
      let x = 0, z = 0
      do {
        x = (rand() - 0.5) * 176
        z = (rand() - 0.5) * 176
      } while (x * x + z * z > 84 ** 2 || distToTrack(x, z) < 8)
      mtx.makeScale(1, 1, 1).setPosition(x, 0.12, z)
      flowerMesh.setMatrixAt(i, mtx)
      flowerMesh.setColorAt(i, new THREE.Color(flowerColors[i % 4]))
    }
    scene.add(flowerMesh)

    /* cosy cottages (infield village) */
    const wallColors = ['#f2e3cf', '#e8c9b0', '#d9e2ce', '#e6d3e0']
    ;[[-12, 38, 6], [-2, 42, 7], [8, 38, 6], [16, 44, 5], [2, 30, 5]].forEach(([x, z, h], i) => {
      const w = 6
      const winMat = new THREE.MeshStandardMaterial({ map: houseTex(wallColors[i % 4]), roughness: 0.85 })
      const roofMat = new THREE.MeshStandardMaterial({ color: '#c96f4a', roughness: 0.8 })
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), [winMat, winMat, roofMat, roofMat, winMat, winMat])
      b.position.set(x, h / 2, z)
      b.castShadow = b.receiveShadow = true
      scene.add(b)
      staticBox([w / 2, h / 2, w / 2], [x, h / 2, z])
    })

    /* ════ dynamic props (infield playground) ════ */
    const dynamic: { body: CANNON.Body; mesh: THREE.Object3D }[] = []
    const addDynamic = (body: CANNON.Body, mesh: THREE.Object3D) => {
      world.addBody(body)
      scene.add(mesh)
      dynamic.push({ body, mesh })
    }
    const addBox = (pos: [number, number, number], size: [number, number, number], color: string, mass = 6) => {
      const body = new CANNON.Body({ mass, material: propMat, sleepSpeedLimit: 0.4 })
      body.position.set(...pos)
      body.addShape(new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2)))
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(size[0], size[1]) * 0.08),
        new THREE.MeshStandardMaterial({ color, roughness: 0.7 }),
      )
      mesh.castShadow = mesh.receiveShadow = true
      addDynamic(body, mesh)
    }

    const pyramid = (cx: number, cz: number) => {
      let ci = 0
      for (let row = 0; row < 3; row++) {
        const n = 3 - row
        for (let i = 0; i < n; i++) {
          addBox([cx + (i - (n - 1) / 2) * 1.3, 0.65 + row * 1.25, cz], [1.2, 1.2, 1.2], ACCENTS[ci++ % 4], 3)
        }
      }
    }
    pyramid(25, -15)
    pyramid(-25, -20)

    /* bowling */
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i <= row; i++) {
        const body = new CANNON.Body({ mass: 1, material: propMat, sleepSpeedLimit: 0.4 })
        body.position.set(18 + (i - row / 2) * 1.1, 0.9, 14 + row * 1.1)
        body.addShape(new CANNON.Cylinder(0.24, 0.34, 1.8, 8))
        const pin = new THREE.Group()
        const pinBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 1.8, 12), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.5 }))
        pinBody.castShadow = true
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.22, 12), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.5 }))
        stripe.position.y = 0.45
        pin.add(pinBody, stripe)
        addDynamic(body, pin)
      }
    }
    {
      const body = new CANNON.Body({ mass: 8, material: ballMat, sleepSpeedLimit: 0.4 })
      body.position.set(18, 1.2, 4)
      body.addShape(new CANNON.Sphere(1.1))
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.1, 20, 16), new THREE.MeshStandardMaterial({ color: '#4398cd', roughness: 0.3, metalness: 0.2 }))
      mesh.castShadow = true
      addDynamic(body, mesh)
    }

    /* soccer */
    {
      const body = new CANNON.Body({ mass: 3, material: ballMat, sleepSpeedLimit: 0.4 })
      body.position.set(-18, 1.5, 13)
      body.addShape(new CANNON.Sphere(1.4))
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 20, 16), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.4 }))
      mesh.castShadow = true
      addDynamic(body, mesh)
    }
    const goal = (gx: number) => {
      const postMat = new THREE.MeshStandardMaterial({ color: '#f7f3ea', roughness: 0.5 })
      ;[-3, 3].forEach(dz => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 8), postMat)
        post.position.set(gx, 1.5, 13 + dz)
        post.castShadow = true
        scene.add(post)
        staticCylinder(0.15, 3, [gx, 1.5, 13 + dz])
      })
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6, 8), postMat)
      bar.rotation.x = Math.PI / 2
      bar.position.set(gx, 3, 13)
      scene.add(bar)
    }
    goal(-26)
    goal(-10)

    /* ramp — three-stage incline: gentle entry so the nose never slams the base,
       steepening to a ~3.8 m launch lip. Entry at z≈22, lip at z≈36.4 */
    const RAMP = { x: 30, z: 34 }
    const rampMat3 = new THREE.MeshStandardMaterial({ color: '#8f8672', roughness: 0.85 })
    const RAMP_SEGS = [
      { tilt: 0.12, cy: 0.25, cz: 24.48 },
      { tilt: 0.26, cy: 1.19, cz: 29.38 },
      { tilt: 0.40, cy: 2.81, cz: 34.09 },
    ]
    RAMP_SEGS.forEach(sg => {
      staticBox([4.5, 0.25, 2.55], [RAMP.x, sg.cy, sg.cz], [-sg.tilt, 0, 0])
      const m = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 5.1), rampMat3)
      m.position.set(RAMP.x, sg.cy, sg.cz)
      m.rotation.x = -sg.tilt
      m.castShadow = m.receiveShadow = true
      scene.add(m)
    })
    /* boost pad on the ramp run-up: enough speed to catch the floating coins */
    const boostC = document.createElement('canvas')
    boostC.width = 64; boostC.height = 64
    {
      const bctx = boostC.getContext('2d')!
      bctx.fillStyle = '#4398cd'
      bctx.fillRect(0, 0, 64, 64)
      bctx.fillStyle = '#f7f3ea'
      bctx.beginPath()
      bctx.moveTo(12, 40); bctx.lineTo(32, 16); bctx.lineTo(52, 40); bctx.lineTo(40, 40); bctx.lineTo(40, 56); bctx.lineTo(24, 56); bctx.lineTo(24, 40)
      bctx.fill()
    }
    const rampBoost = {
      x: RAMP.x, z: RAMP.z - 16, cd: 0,
      mesh: new THREE.Mesh(new THREE.PlaneGeometry(4.5, 4.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(boostC), transparent: true, opacity: 0.95 })),
    }
    rampBoost.mesh.rotation.x = -Math.PI / 2
    rampBoost.mesh.position.set(rampBoost.x, 0.045, rampBoost.z)
    scene.add(rampBoost.mesh)

    /* parked cars */
    const buildCarMesh = (color: string) => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new RoundedBoxGeometry(2, 0.75, 3.8, 3, 0.18), new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.15 }))
      body.castShadow = true
      g.add(body)
      const cab = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.65, 1.9, 3, 0.16), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.25 }))
      cab.position.set(0, 0.65, -0.25)
      cab.castShadow = true
      g.add(cab)
      ;[[-0.95, 1.25], [0.95, 1.25], [-0.95, -1.25], [0.95, -1.25]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 12), new THREE.MeshStandardMaterial({ color: '#2c2a26', roughness: 0.9 }))
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(wx, -0.35, wz)
        g.add(wheel)
      })
      return g
    }
    ;[
      { pos: [-20, 30] as const, color: '#d82d17', rot: 0.3 },
      { pos: [-34, 8] as const, color: '#edcb1f', rot: -0.2 }, // moved out of the ramp lane
      { pos: [-28, -8] as const, color: '#298f1a', rot: 1.4 },
    ].forEach(pc => {
      const body = new CANNON.Body({ mass: 45, material: propMat, sleepSpeedLimit: 0.4 })
      body.position.set(pc.pos[0], 1, pc.pos[1])
      body.quaternion.setFromEuler(0, pc.rot, 0)
      body.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.55, 1.9)))
      addDynamic(body, buildCarMesh(pc.color))
    })

    /* ════ interactive toys ════ */
    /* dominoes — clip the first one and watch the cascade */
    for (let i = 0; i < 10; i++) {
      const body = new CANNON.Body({ mass: 2, material: dominoMat })
      body.allowSleep = false // a slow tip is too soft to wake a sleeping neighbor — keep the chain live
      body.position.set(-11 + i * 1.2, 1.3, -12)
      body.addShape(new CANNON.Box(new CANNON.Vec3(0.18, 1.3, 0.7)))
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(0.36, 2.6, 1.4, 2, 0.06),
        new THREE.MeshStandardMaterial({ color: i % 2 ? '#f7f3ea' : ACCENTS[i % 4], roughness: 0.6 }),
      )
      mesh.castShadow = true
      addDynamic(body, mesh)
    }

    /* wrecking ball on a chain — swing it into the pyramid */
    const gallowsMat = new THREE.MeshStandardMaterial({ color: '#6b675c', roughness: 0.8 })
    const gPole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 8.4, 10), gallowsMat)
    gPole.position.set(31, 4.2, -18)
    gPole.castShadow = true
    scene.add(gPole)
    staticCylinder(0.4, 8.4, [31, 4.2, -18])
    const gArm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.6, 8), gallowsMat)
    gArm.rotation.z = Math.PI / 2
    gArm.position.set(29.4, 8.1, -18)
    gArm.castShadow = true
    scene.add(gArm)
    const anchorBody = new CANNON.Body({ mass: 0 })
    anchorBody.position.set(28, 7.9, -18)
    world.addBody(anchorBody)
    const wreckBody = new CANNON.Body({ mass: 7, material: ballMat })
    wreckBody.position.set(28, 2.1, -18)
    wreckBody.addShape(new CANNON.Sphere(1))
    wreckBody.allowSleep = false
    const wreckMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.MeshStandardMaterial({ color: '#2c2a26', roughness: 0.4, metalness: 0.5 }),
    )
    wreckMesh.castShadow = true
    addDynamic(wreckBody, wreckMesh)
    world.addConstraint(new CANNON.DistanceConstraint(wreckBody, anchorBody, 5.8))
    const chainMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1, 6),
      new THREE.MeshStandardMaterial({ color: '#4a4a4e', roughness: 0.6 }),
    )
    scene.add(chainMesh)

    /* seesaw — drive over one end to launch the other */
    const seesawBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.7, 1, 10),
      new THREE.MeshStandardMaterial({ color: '#8f8672', roughness: 0.8 }),
    )
    seesawBase.position.set(-6, 0.5, 22)
    seesawBase.castShadow = true
    scene.add(seesawBase)
    const seesawPivot = new CANNON.Body({ mass: 0 })
    seesawPivot.position.set(-6, 1.05, 22)
    world.addBody(seesawPivot)
    const plankBody = new CANNON.Body({ mass: 10, material: propMat })
    plankBody.position.set(-6, 1.05, 22)
    plankBody.addShape(new CANNON.Box(new CANNON.Vec3(1.1, 0.12, 3.2)))
    plankBody.allowSleep = false
    const plankMesh = new THREE.Mesh(
      new RoundedBoxGeometry(2.2, 0.24, 6.4, 2, 0.05),
      new THREE.MeshStandardMaterial({ color: '#edcb1f', roughness: 0.6 }),
    )
    plankMesh.castShadow = true
    addDynamic(plankBody, plankMesh)
    world.addConstraint(new CANNON.HingeConstraint(plankBody, seesawPivot, {
      pivotA: new CANNON.Vec3(0, 0, 0),
      pivotB: new CANNON.Vec3(0, 0, 0),
      axisA: new CANNON.Vec3(1, 0, 0),
      axisB: new CANNON.Vec3(1, 0, 0),
    }))

    /* beach balls — big, light, very bouncy */
    ;[[8, 18], [9.6, 19.2], [7, 19.8]].forEach(([x, z], i) => {
      const body = new CANNON.Body({ mass: 0.8, material: ballMat, sleepSpeedLimit: 0.3 })
      body.position.set(x, 1.4, z)
      body.addShape(new CANNON.Sphere(1.1))
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 16, 12),
        new THREE.MeshStandardMaterial({ color: ACCENTS[i % 4], roughness: 0.5 }),
      )
      mesh.castShadow = true
      addDynamic(body, mesh)
    })

    /* slalom cones — weave through or bowl them over */
    for (let i = 0; i < 8; i++) {
      const body = new CANNON.Body({ mass: 0.8, material: propMat, sleepSpeedLimit: 0.3 })
      body.position.set(-34 + i * 1.7, 0.7, -28 - i * 1.7)
      body.addShape(new CANNON.Cylinder(0.15, 0.55, 1.4, 8))
      const cone = new THREE.Group()
      const coneBody = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 1.4, 12),
        new THREE.MeshStandardMaterial({ color: '#ff7b1a', roughness: 0.6 }),
      )
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.42, 0.24, 12),
        new THREE.MeshStandardMaterial({ color: '#f7f3ea', roughness: 0.6 }),
      )
      band.position.y = -0.1
      cone.add(coneBody, band)
      cone.traverse(o => { o.castShadow = true })
      addDynamic(body, cone)
    }

    /* coins */
    const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.14, 14)
    const coinMat = new THREE.MeshStandardMaterial({ color: '#edcb1f', emissive: '#edcb1f', emissiveIntensity: 0.35, roughness: 0.3 })
    const coinMeshes = COINS.map(([x, y, z]) => {
      const m = new THREE.Mesh(coinGeo, coinMat)
      m.rotation.x = Math.PI / 2
      m.position.set(x, y, z)
      m.castShadow = true
      scene.add(m)
      return { mesh: m, taken: false, x, y, z }
    })
    let coinCount = 0

    /* golden duck easter egg — hidden on the south beach */
    const eggDuck = new THREE.Group()
    {
      const b = new THREE.Mesh(new RoundedBoxGeometry(1.6, 1, 1.9, 2, 0.3), new THREE.MeshStandardMaterial({ color: '#edcb1f', roughness: 0.2, metalness: 0.7 }))
      const h = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.9, 0.9, 2, 0.2), new THREE.MeshStandardMaterial({ color: '#edcb1f', roughness: 0.2, metalness: 0.7 }))
      h.position.set(0, 0.8, 0.7)
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), new THREE.MeshStandardMaterial({ color: '#d82d17' }))
      beak.position.set(0, 0.7, 1.3)
      eggDuck.add(b, h, beak)
    }
    const EGG = { x: 0, z: -92 }
    eggDuck.position.set(EGG.x, 0.6, EGG.z)
    eggDuck.rotation.y = 2.4
    scene.add(eggDuck)
    let eggFound = false

    /* zone pads + labels */
    const padAnims: { ring: THREE.Mesh; label: THREE.Sprite; baseY: number; i: number }[] = []
    ZONES.forEach((z, i) => {
      const pad = new THREE.Mesh(new THREE.CircleGeometry(ZONE_RADIUS, 40), new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.2 }))
      pad.rotation.x = -Math.PI / 2
      pad.position.set(z.x, 0.04, z.z)
      scene.add(pad)
      const ring = new THREE.Mesh(new THREE.RingGeometry(ZONE_RADIUS - 0.25, ZONE_RADIUS, 48), new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.9 }))
      ring.rotation.x = -Math.PI / 2
      ring.position.set(z.x, 0.05, z.z)
      scene.add(ring)
      const tex = labelTexture(z.name, z.color)
      const aspect = tex.image.width / tex.image.height
      const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }))
      const h = 1.6
      label.scale.set(h * aspect, h, 1)
      label.position.set(z.x, 4.2, z.z)
      scene.add(label)
      padAnims.push({ ring, label, baseY: 4.2, i })
    })

    /* ════ player car — spawns ON the grid ════ */
    const spawnIdx = (N_S - 6) % N_S
    const spawnS = SAMPLES[spawnIdx]
    const spawnYaw = Math.atan2(spawnS.tx, spawnS.tz)
    const chassisBody = new CANNON.Body({ mass: 160, material: chassisMat })
    chassisBody.position.set(spawnS.x, 1.5, spawnS.z)
    chassisBody.quaternion.setFromEuler(0, spawnYaw, 0)
    chassisBody.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.4, 1.9)))
    chassisBody.allowSleep = false
    const vehicle = new CANNON.RaycastVehicle({ chassisBody, indexRightAxis: 0, indexUpAxis: 1, indexForwardAxis: 2 })
    const wheelOptions = {
      radius: 0.5,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 32,
      suspensionRestLength: 0.4,
      frictionSlip: 2.2, // grippier — less sliding, easier to place the car
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(-1, 0, 0),
      maxSuspensionTravel: 0.35,
    }
    const wheelPos: [number, number, number][] = [
      [-0.95, -0.1, 1.3], [0.95, -0.1, 1.3],
      [-0.95, -0.1, -1.3], [0.95, -0.1, -1.3],
    ]
    wheelPos.forEach(p => {
      vehicle.addWheel({ ...wheelOptions, chassisConnectionPointLocal: new CANNON.Vec3(...p) })
    })
    vehicle.addToWorld(world)

    const car = new THREE.Group()
    const bodyMesh = new THREE.Mesh(new RoundedBoxGeometry(2, 0.75, 3.8, 3, 0.18), new THREE.MeshStandardMaterial({ color: '#d82d17', roughness: 0.3, metalness: 0.2 }))
    bodyMesh.castShadow = true
    car.add(bodyMesh)
    const cabin = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.62, 1.9, 3, 0.16), new THREE.MeshStandardMaterial({ color: '#fdfdf8', roughness: 0.2, metalness: 0.1 }))
    cabin.position.set(0, 0.62, -0.25)
    cabin.castShadow = true
    car.add(cabin)
    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.5, 0.06),
      new THREE.MeshStandardMaterial({ color: '#4398cd', roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.7 }),
    )
    windshield.position.set(0, 0.62, 0.75)
    windshield.rotation.x = -0.35
    car.add(windshield)
    const spoiler = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.12, 0.5, 2, 0.05), new THREE.MeshStandardMaterial({ color: '#f7f3ea', roughness: 0.4 }))
    spoiler.position.set(0, 0.6, -1.85)
    spoiler.castShadow = true
    car.add(spoiler)
    const lightMat = new THREE.MeshStandardMaterial({ color: '#ffe9a0', emissive: '#ffe9a0', emissiveIntensity: 0.9 })
    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.08), lightMat)
    headL.position.set(-0.6, 0.08, 1.94)
    const headR = headL.clone()
    headR.position.x = 0.6
    car.add(headL, headR)
    const tailMat = new THREE.MeshStandardMaterial({ color: '#d82d17', emissive: '#d82d17', emissiveIntensity: 0.7 })
    const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.06), tailMat)
    tailL.position.set(-0.62, 0.1, -1.93)
    const tailR = tailL.clone()
    tailR.position.x = 0.62
    car.add(tailL, tailR)
    const headlight = new THREE.PointLight('#ffe9a0', 0, 22, 1.8)
    headlight.position.set(0, 0.5, 2.6)
    car.add(headlight)
    scene.add(car)

    const wheelMeshes = wheelPos.map(() => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.42, 16), new THREE.MeshStandardMaterial({ color: '#2c2a26', roughness: 0.9 }))
      tire.rotation.z = Math.PI / 2
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.44, 6), new THREE.MeshStandardMaterial({ color: '#e8e2d5', roughness: 0.35, metalness: 0.5 }))
      rim.rotation.z = Math.PI / 2
      const g = new THREE.Group()
      g.add(tire, rim)
      tire.castShadow = true
      scene.add(g)
      return g
    })

    const puffs = Array.from({ length: 30 }, () => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), new THREE.MeshBasicMaterial({ color: '#c9c4b8', transparent: true, opacity: 0 }))
      m.visible = false
      scene.add(m)
      return { mesh: m, life: 0 }
    })
    let puffIdx = 0
    let puffTimer = 0
    const exhaustLocal = new THREE.Vector3(0.55, -0.15, -2)

    const fwPool = Array.from({ length: 150 }, () => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, fog: false }))
      m.visible = false
      scene.add(m)
      return { mesh: m, vel: new THREE.Vector3(), life: 0 }
    })
    let fwIdx = 0
    let celebrating = 0
    let fwTimer = 0
    const burst = (x: number, y: number, z: number, count = 26, forceColor?: string) => {
      const color = forceColor ?? ACCENTS[Math.floor(Math.random() * 4)]
      for (let i = 0; i < count; i++) {
        const p = fwPool[fwIdx++ % fwPool.length]
        p.life = 1
        p.mesh.visible = true
        p.mesh.position.set(x, y, z)
        ;(p.mesh.material as THREE.MeshBasicMaterial).color.set(color)
        const a = Math.random() * Math.PI * 2
        const e = Math.random() * Math.PI - Math.PI / 2
        const s = 8 + Math.random() * 8
        p.vel.set(Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s + 6, Math.sin(a) * Math.cos(e) * s)
      }
    }

    /* sound */
    let audio: { ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null = null
    const initAudio = () => {
      if (audio) return
      try {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 420
        const gain = ctx.createGain()
        gain.gain.value = 0
        osc.connect(filter).connect(gain).connect(ctx.destination)
        osc.start()
        audio = { ctx, osc, gain }
      } catch { /* no audio */ }
    }
    const blip = (freq = 950, dur = 0.12, type: OscillatorType = 'square') => {
      if (!audio || mutedRef.current) return
      try {
        const o = audio.ctx.createOscillator()
        o.type = type
        o.frequency.value = freq
        const g = audio.ctx.createGain()
        g.gain.setValueAtTime(0.05, audio.ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, audio.ctx.currentTime + dur)
        o.connect(g).connect(audio.ctx.destination)
        o.start()
        o.stop(audio.ctx.currentTime + dur + 0.02)
      } catch { /* ignore */ }
    }
    const horn = () => { blip(610, 0.28, 'triangle'); blip(770, 0.28, 'triangle') }

    /* input */
    const keys = keysRef.current
    const setKey = (e: KeyboardEvent, v: boolean) => {
      switch (e.code) {
        case 'ArrowUp': case 'KeyW': keys.up = v; break
        case 'ArrowDown': case 'KeyS': keys.down = v; break
        case 'ArrowLeft': case 'KeyA': keys.left = v; break
        case 'ArrowRight': case 'KeyD': keys.right = v; break
        case 'Space': keys.brake = v; e.preventDefault(); break
        case 'ShiftLeft': case 'ShiftRight': keys.boost = v; break
      }
    }
    const resetCar = () => {
      chassisBody.position.set(spawnS.x, 1.5, spawnS.z)
      chassisBody.velocity.setZero()
      chassisBody.angularVelocity.setZero()
      chassisBody.quaternion.setFromEuler(0, spawnYaw, 0)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      initAudio()
      audio?.ctx.resume()
      if (panelRef.current) {
        if (e.code === 'Escape') setPanel(null)
        return
      }
      if (e.code === 'KeyR') resetCar()
      if (e.code === 'KeyM') setMuted(m => !m)
      if (e.code === 'KeyH') { horn(); ducks.forEach(d => { d.pop = 1 }) }
      if (e.code === 'KeyN') { dayTarget = dayTarget > 0.5 ? 0 : 1 }
      if (e.code === 'Enter') {
        if (screenPromptRef.current) window.open(screenPromptRef.current.url, '_blank', 'noopener')
        else if (zoneRef.current) setPanel(zoneRef.current.name)
      }
      setKey(e, true)
    }
    const onKeyUp = (e: KeyboardEvent) => setKey(e, false)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    let camZoom = 1
    const onWheel = (e: WheelEvent) => {
      if (panelRef.current) return
      camZoom = Math.min(2.2, Math.max(0.55, camZoom + e.deltaY * 0.001))
    }
    window.addEventListener('wheel', onWheel, { passive: true })

    /* right-drag orbit — pointer-captured so it can't get stuck or lose the drag */
    const orbit = { on: false, id: -1, yaw: 0, pitch: 0, lx: 0, ly: 0 }
    const endOrbit = (e?: PointerEvent) => {
      if (e && e.pointerId !== orbit.id) return
      orbit.on = false
      orbit.id = -1
      try { if (e) renderer.domElement.releasePointerCapture(e.pointerId) } catch { /* already released */ }
    }
    const onCtx = (e: MouseEvent) => e.preventDefault()
    renderer.domElement.addEventListener('contextmenu', onCtx)
    const onPDown = (e: PointerEvent) => {
      if (e.button === 2 && !panelRef.current) {
        orbit.on = true
        orbit.id = e.pointerId
        orbit.lx = e.clientX
        orbit.ly = e.clientY
        try { renderer.domElement.setPointerCapture(e.pointerId) } catch { /* unsupported */ }
        e.preventDefault()
      }
    }
    const onPMove = (e: PointerEvent) => {
      if (!orbit.on || e.pointerId !== orbit.id) return
      const dx = e.clientX - orbit.lx
      const dy = e.clientY - orbit.ly
      // ignore wild jumps (pointer re-entry glitches)
      if (Math.abs(dx) < 200 && Math.abs(dy) < 200) {
        orbit.yaw -= dx * 0.006
        orbit.pitch = Math.max(-1.25, Math.min(1.3, orbit.pitch + dy * 0.004)) // full range: ground level to nearly top-down
      }
      orbit.lx = e.clientX
      orbit.ly = e.clientY
    }
    const onPUp = (e: PointerEvent) => { if (e.button === 2 || e.pointerId === orbit.id) endOrbit(e) }
    const onPCancel = (e: PointerEvent) => endOrbit(e)
    const onBlur = () => { orbit.on = false; orbit.id = -1 }
    renderer.domElement.addEventListener('pointerdown', onPDown)
    window.addEventListener('pointermove', onPMove)
    window.addEventListener('pointerup', onPUp)
    window.addEventListener('pointercancel', onPCancel)
    window.addEventListener('blur', onBlur)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const mapCtx = mapRef.current?.getContext('2d') ?? null
    const MAP = 140
    const mapScale = MAP / (ISLAND_R * 2.2)
    const w2m = (v: number) => MAP / 2 + v * mapScale

    /* ════ main loop ════ */
    const MAX_FORCE = 380 // relaxed acceleration — easy to control
    const MAX_STEER = 0.55
    const camPos = new THREE.Vector3(spawnS.x, 34, spawnS.z - 34)
    const tmpV = new THREE.Vector3()
    const fwd = new THREE.Vector3()
    const rightV = new THREE.Vector3()
    let steerCur = 0
    let intro = 0
    let boostKick = 0
    let shake = 0
    let prevVx = 0, prevVy = 0, prevVz = 0
    let last = performance.now()
    let raf = 0
    let uiTick = 0
    const dayColor = new THREE.Color()
    const cDay = new THREE.Color(DAY_SKY)
    const cNight = new THREE.Color(NIGHT_SKY)

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 1 / 20)
      last = now
      const t = now * 0.001

      const vel = chassisBody.velocity
      const kmh = Math.hypot(vel.x, vel.z) * 3.6
      fwd.set(0, 0, 1).applyQuaternion(car.quaternion)
      rightV.set(1, 0, 0).applyQuaternion(car.quaternion)
      const fwdSpeed = vel.x * fwd.x + vel.z * fwd.z
      const sideSpeed = vel.x * rightV.x + vel.z * rightV.z

      /* force tapers with speed → soft top ~70 km/h (boost ~85), easy control */
      const taper = Math.max(0.12, 1 - kmh / 90)
      const force = (keys.boost ? MAX_FORCE * 1.5 : MAX_FORCE) * taper
      let engine = 0
      let brakeF = 0
      let brakeR = 0
      if (keys.up) {
        engine = -force
      } else if (keys.down) {
        if (fwdSpeed > 1) { brakeF = 24; brakeR = 8 }
        else engine = force * 0.5
      } else if (kmh > 2) {
        brakeF = 6; brakeR = 6
      }
      if (keys.brake) { brakeF = 26; brakeR = 12 }
      vehicle.applyEngineForce(engine, 2)
      vehicle.applyEngineForce(engine, 3)
      const steerTarget = (keys.left ? MAX_STEER : keys.right ? -MAX_STEER : 0) / (1 + kmh / 70)
      steerCur += (steerTarget - steerCur) * Math.min(1, dt * 10)
      vehicle.setSteeringValue(steerCur, 0)
      vehicle.setSteeringValue(steerCur, 1)
      vehicle.setBrake(brakeF, 0)
      vehicle.setBrake(brakeF, 1)
      vehicle.setBrake(brakeR, 2)
      vehicle.setBrake(brakeR, 3)

      world.step(1 / 60, dt, 3)
      if (chassisBody.position.y < -12) { blip(220); resetCar() }

      {
        const dvx = vel.x - prevVx, dvy = vel.y - prevVy, dvz = vel.z - prevVz
        const dv = Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz)
        if (dv > 6) { shake = Math.min(0.8, dv * 0.06); blip(160, 0.15, 'sawtooth') }
        prevVx = vel.x; prevVy = vel.y; prevVz = vel.z
      }
      shake = Math.max(0, shake - dt * 2.2)

      /* ramp boost: shoots you up the run-up fast enough to reach the coin arc */
      rampBoost.cd = Math.max(0, rampBoost.cd - dt)
      {
        const dx = chassisBody.position.x - rampBoost.x, dz = chassisBody.position.z - rampBoost.z
        if (rampBoost.cd <= 0 && dx * dx + dz * dz < 8) {
          rampBoost.cd = 1.5
          boostKick = 0.8
          chassisBody.applyImpulse(new CANNON.Vec3(0, 0, 2100)) // toward the ramp (north)
          blip(420, 0.25, 'sawtooth')
        }
        ;(rampBoost.mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 5) * 0.35
      }
      boostKick = Math.max(0, boostKick - dt)

      car.position.set(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z)
      car.quaternion.set(chassisBody.quaternion.x, chassisBody.quaternion.y, chassisBody.quaternion.z, chassisBody.quaternion.w)
      for (let i = 0; i < 4; i++) {
        vehicle.updateWheelTransform(i)
        const w = vehicle.wheelInfos[i].worldTransform
        wheelMeshes[i].position.set(w.position.x, w.position.y, w.position.z)
        wheelMeshes[i].quaternion.set(w.quaternion.x, w.quaternion.y, w.quaternion.z, w.quaternion.w)
      }
      dynamic.forEach(d => {
        d.mesh.position.set(d.body.position.x, d.body.position.y, d.body.position.z)
        d.mesh.quaternion.set(d.body.quaternion.x, d.body.quaternion.y, d.body.quaternion.z, d.body.quaternion.w)
      })

      dayT += (dayTarget - dayT) * Math.min(1, dt * 1.6)
      dayColor.lerpColors(cNight, cDay, dayT)
      ;(scene.background as THREE.Color).copy(dayColor)
      scene.fog!.color.copy(dayColor)
      sun.intensity = 0.12 + dayT * 1.5
      ambient.intensity = 0.15 + dayT * 0.35
      hemi.intensity = 0.12 + dayT * 0.6
      starMat.opacity = (1 - dayT) * 0.9
      moonMat.opacity = 1 - dayT
      cloudMat.opacity = dayT * 0.85
      headlight.intensity = 2 + (1 - dayT) * 12

      seaTex.offset.x = t * 0.008
      seaTex.offset.y = t * 0.005
      ducks.forEach(d => {
        d.a += dt * d.sp
        d.pop = Math.max(0, d.pop - dt * 2)
        d.g.scale.setScalar(1 + d.pop * 0.5)
        d.g.position.set(Math.cos(d.a) * d.r, -4 + Math.sin(t * 1.4 + d.a * 3) * 0.25 + d.pop * 1.2, Math.sin(d.a) * d.r)
        d.g.rotation.y = -d.a + Math.PI / 2
      })
      clouds.forEach((c, i) => { c.position.x += dt * (1.2 + (i % 3) * 0.4); if (c.position.x > 160) c.position.x = -160 })
      /* animal life */
      birds.forEach(b => {
        b.a += dt * b.sp
        const flap = Math.sin(t * 9 + b.ph) * 0.55
        b.wl.rotation.z = flap
        b.wr.rotation.z = -flap
        b.g.position.set(Math.cos(b.a) * b.r, b.h + Math.sin(t * 1.2 + b.ph) * 1.5, Math.sin(b.a) * b.r)
        b.g.rotation.y = -b.a
      })
      rabbits.forEach(r => {
        /* scared rabbits sprint and hop higher when the car gets close */
        const ddx = car.position.x - r.g.position.x, ddz = car.position.z - r.g.position.z
        const scared = ddx * ddx + ddz * ddz < 100
        r.a += dt * r.sp * (scared ? 4 : 1)
        const hop = Math.max(0, Math.sin(t * (scared ? 9 : 5) + r.ph))
        const rx = r.home[0] + Math.cos(r.a) * 4
        const rz = r.home[1] + Math.sin(r.a) * 4
        r.g.position.set(rx, hop * (scared ? 1.1 : 0.7), rz)
        r.g.rotation.y = -r.a + Math.PI / 2
      })
      /* wrecking-ball chain follows the swing */
      {
        const ax = 28, ay = 7.9, az = -18
        const bx = wreckBody.position.x, by = wreckBody.position.y, bz = wreckBody.position.z
        const len = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2)
        chainMesh.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2)
        chainMesh.scale.set(1, len, 1)
        chainMesh.lookAt(ax, ay, az)
        chainMesh.rotateX(Math.PI / 2)
      }
      sheep.forEach(sh => {
        sh.a += dt * sh.sp
        const graze = Math.sin(t * 0.8 + sh.ph)
        sh.head.rotation.x = graze > 0.4 ? 0.7 : 0 // head down to graze
        sh.g.position.set(sh.home[0] + Math.cos(sh.a) * 3.5, 0, sh.home[1] + Math.sin(sh.a) * 3.5)
        sh.g.rotation.y = -sh.a + Math.PI / 2
      })
      deer.forEach(dr => {
        dr.a += dt * dr.sp
        const bob = Math.abs(Math.sin(t * 2.4 + dr.ph)) * 0.1
        dr.g.position.set(dr.home[0] + Math.cos(dr.a) * 6, bob, dr.home[1] + Math.sin(dr.a) * 6)
        dr.g.rotation.y = -dr.a + Math.PI / 2
      })
      butterflies.forEach(bf => {
        const flap = Math.sin(t * 16 + bf.ph) * 1.1
        bf.wl.rotation.y = flap
        bf.wr.rotation.y = -flap
        bf.g.position.set(
          bf.home[0] + Math.sin(t * 0.6 + bf.ph) * 4,
          1.6 + Math.sin(t * 1.3 + bf.ph * 2) * 0.7,
          bf.home[1] + Math.sin(t * 0.45 + bf.ph * 1.4) * 4,
        )
        bf.g.rotation.y = t * 0.6 + bf.ph
      })
      turtleA += dt * 0.012
      turtle.position.set(Math.cos(turtleA) * 92, 0.15 + Math.sin(t * 3) * 0.04, Math.sin(turtleA) * 92)
      turtle.rotation.y = -turtleA
      statue.rotation.y += dt * 0.8
      cup.rotation.y += dt * 1.2
      hub.rotation.z += dt * 1.4
      hab.position.set(Math.cos(t * 0.045) * 70, 36 + Math.sin(t * 0.3) * 2, Math.sin(t * 0.045) * 70)
      flags.forEach(f => {
        f.m.rotation.y = f.base + Math.PI / 2 + Math.sin(t * 3 + f.phase) * 0.35
      })

      coinMeshes.forEach(c => {
        if (c.taken) return
        c.mesh.rotation.z += dt * 3
        const dx = car.position.x - c.x, dy = car.position.y - c.y, dz = car.position.z - c.z
        if (dx * dx + dy * dy + dz * dz < 6.5) {
          c.taken = true
          c.mesh.visible = false
          coinCount++
          setCoins(coinCount)
          blip(950 + coinCount * 18)
          burst(c.x, c.y + 0.5, c.z, 7, '#edcb1f')
        }
      })
      if (!eggFound) {
        eggDuck.rotation.y += dt * 1.5
        const dx = car.position.x - EGG.x, dz = car.position.z - EGG.z
        if (dx * dx + dz * dz < 9) {
          eggFound = true
          eggDuck.visible = false
          coinCount += 10
          setCoins(coinCount)
          blip(700); blip(880, 0.2); blip(1050, 0.3)
          burst(EGG.x, 4, EGG.z)
        }
      }

      puffTimer += dt
      const drifting = Math.abs(sideSpeed) > 4 && kmh > 25
      if ((kmh > 6 || keys.boost) && puffTimer > (keys.boost || drifting ? 0.04 : 0.12)) {
        puffTimer = 0
        const p = puffs[puffIdx++ % puffs.length]
        p.life = 1
        p.mesh.visible = true
        if (drifting) tmpV.set(puffIdx % 2 ? 0.95 : -0.95, -0.3, -1.3)
        else {
          tmpV.copy(exhaustLocal)
          if (puffIdx % 2) tmpV.x *= -1
        }
        car.localToWorld(tmpV)
        p.mesh.position.copy(tmpV)
        p.mesh.scale.setScalar(drifting ? 1.6 : 1)
      }
      puffs.forEach(p => {
        if (p.life <= 0) return
        p.life -= dt * 1.8
        if (p.life <= 0) { p.mesh.visible = false; return }
        p.mesh.position.y += dt * 1.6
        p.mesh.scale.setScalar(1 + (1 - p.life) * 2.2)
        ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life * 0.4
      })

      if (celebrating > 0) {
        celebrating -= dt
        fwTimer -= dt
        if (fwTimer <= 0) {
          fwTimer = 0.4
          burst(car.position.x + (Math.random() - 0.5) * 40, 14 + Math.random() * 10, car.position.z + (Math.random() - 0.5) * 40)
        }
        if (celebrating <= 0) setCelebrate(false)
      }
      fwPool.forEach(p => {
        if (p.life <= 0) return
        p.life -= dt * 0.7
        if (p.life <= 0) { p.mesh.visible = false; return }
        p.vel.y -= 14 * dt
        p.mesh.position.addScaledVector(p.vel, dt)
        ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(1, p.life * 1.4)
      })

      padAnims.forEach(a => {
        const s = 1 + Math.sin(t * 2 + a.i) * 0.05
        a.ring.scale.setScalar(s)
        a.label.position.y = a.baseY + Math.sin(t * 1.6 + a.i * 1.3) * 0.3
      })

      /* race */
      {
        raceRef.cool = Math.max(0, raceRef.cool - dt)
        const dx = car.position.x - s0.x, dz = car.position.z - s0.z
        const onStart = dx * dx + dz * dz < 25
        const along = Math.abs(vel.x * s0.tx + vel.z * s0.tz)
        const across = Math.abs(vel.x * OUTN[0].x + vel.z * OUTN[0].z)
        const tangential = along > across * 1.2
        if (!raceRef.active && raceRef.cool <= 0 && onStart && tangential && kmh > 15) {
          raceRef.active = true
          raceRef.cp = 0
          raceRef.t0 = now
          blip(500, 0.2); blip(1000, 0.3)
          setRace('CP 1/3')
        } else if (raceRef.active) {
          const cpIdx = CP_IDX[raceRef.cp]
          if (cpIdx !== undefined) {
            const cs = SAMPLES[cpIdx]
            const cdx = car.position.x - cs.x, cdz = car.position.z - cs.z
            if (cdx * cdx + cdz * cdz < 49) {
              raceRef.cp++
              blip(800 + raceRef.cp * 100, 0.15)
              setRace(raceRef.cp < CP_IDX.length ? `CP ${raceRef.cp + 1}/3` : 'BACK TO THE LINE!')
            }
          } else if (onStart) {
            const time = (now - raceRef.t0) / 1000
            const isRecord = raceRef.best === 0 || time < raceRef.best
            if (isRecord) raceRef.best = time
            localStorage.setItem('islandBest', String(raceRef.best))
            raceRef.active = false
            raceRef.cool = 4
            setRace(`${time.toFixed(1)}s ${isRecord ? '★ NEW BEST!' : `(best ${raceRef.best.toFixed(1)}s)`}`)
            blip(600, 0.2); blip(900, 0.2); blip(1200, 0.3)
            burst(car.position.x, 8, car.position.z, 26)
            setTimeout(() => setRace(null), 5000)
          }
        }
        cpRings.forEach((r, i) => {
          const active = raceRef.active && i === raceRef.cp
          const m = r.material as THREE.MeshStandardMaterial
          m.opacity = active ? 0.95 : 0.3
          m.emissiveIntensity = active ? 0.9 + Math.sin(t * 6) * 0.4 : 0.15
          r.rotation.z = active ? t * 2 : 0
        })
      }

      /* camera */
      intro = Math.min(1, intro + dt * 0.5)
      if (!orbit.on) {
        orbit.yaw *= Math.pow(0.05, dt)
        orbit.pitch *= Math.pow(0.05, dt)
      }
      const zoom = camZoom * (1 + (1 - intro) * 1.6)
      const dist = Math.hypot(13, 15) * zoom
      const el = Math.max(0.04, Math.min(1.52, Math.atan2(13, 15) + orbit.pitch))
      const az = Math.PI + orbit.yaw
      tmpV.set(
        car.position.x + dist * Math.cos(el) * Math.sin(az),
        car.position.y + dist * Math.sin(el),
        car.position.z + dist * Math.cos(el) * Math.cos(az),
      )
      camPos.lerp(tmpV, 1 - Math.pow(orbit.on ? 0.000001 : 0.001, dt))
      camera.position.copy(camPos)
      if (shake > 0.01) {
        camera.position.x += (Math.random() - 0.5) * shake
        camera.position.y += (Math.random() - 0.5) * shake
        camera.position.z += (Math.random() - 0.5) * shake
      }
      camera.lookAt(car.position.x, car.position.y + 1, car.position.z)
      const fovTarget = 50 + Math.min(12, kmh * 0.08) + boostKick * 14
      if (Math.abs(camera.fov - fovTarget) > 0.1) {
        camera.fov += (fovTarget - camera.fov) * Math.min(1, dt * 4)
        camera.updateProjectionMatrix()
      }
      sun.position.set(car.position.x + 30, 55, car.position.z - 25)
      sun.target.position.copy(car.position)

      /* zones */
      let inZone: typeof ZONES[number] | null = null
      for (const z of ZONES) {
        const dx = car.position.x - z.x, dz = car.position.z - z.z
        if (dx * dx + dz * dz < ZONE_RADIUS * ZONE_RADIUS) { inZone = z; break }
      }
      if (inZone !== zoneRef.current) {
        zoneRef.current = inZone
        setZone(inZone)
        if (inZone) {
          blip(600)
          setVisited(v => {
            if (v.includes(inZone.name)) return v
            const nv = [...v, inZone.name]
            if (nv.length === ZONES.length) {
              celebrating = 14
              setCelebrate(true)
            }
            return nv
          })
        }
      }

      let nearScreen: { title: string; url: string } | null = null
      for (const s of screens) {
        const dx = car.position.x - s.x, dz = car.position.z - s.z
        if (dx * dx + dz * dz < 42) { nearScreen = { title: s.title, url: s.url }; break }
      }
      if ((nearScreen?.url ?? null) !== (screenPromptRef.current?.url ?? null)) {
        setScreenPrompt(nearScreen)
      }

      if (++uiTick % 6 === 0) {
        setSpeed(Math.round(kmh))
        if (raceRef.active) setRace(`CP ${Math.min(raceRef.cp + 1, CP_IDX.length)}/3 · ${((now - raceRef.t0) / 1000).toFixed(1)}s`)
      }
      if (audio) {
        audio.osc.frequency.value = 55 + kmh * 3.2
        const targetGain = mutedRef.current ? 0 : Math.min(0.045, 0.012 + kmh * 0.0006)
        audio.gain.gain.setTargetAtTime(targetGain, audio.ctx.currentTime, 0.08)
      }

      if (mapCtx && uiTick % 3 === 0) {
        mapCtx.clearRect(0, 0, MAP, MAP)
        mapCtx.fillStyle = 'rgba(126,195,232,0.9)'
        mapCtx.fillRect(0, 0, MAP, MAP)
        mapCtx.fillStyle = '#e6dfd0'
        mapCtx.beginPath()
        mapCtx.arc(MAP / 2, MAP / 2, ISLAND_R * mapScale, 0, Math.PI * 2)
        mapCtx.fill()
        /* the circuit outline */
        mapCtx.strokeStyle = '#6b675c'
        mapCtx.lineWidth = 3
        mapCtx.beginPath()
        mapCtx.moveTo(w2m(SAMPLES[0].x), w2m(SAMPLES[0].z))
        for (let i = 4; i < N_S; i += 4) mapCtx.lineTo(w2m(SAMPLES[i].x), w2m(SAMPLES[i].z))
        mapCtx.closePath()
        mapCtx.stroke()
        mapCtx.lineWidth = 1
        mapCtx.strokeStyle = '#8f8672'
        mapCtx.strokeRect(0.5, 0.5, MAP - 1, MAP - 1)
        ZONES.forEach(z => {
          mapCtx.fillStyle = z.color
          mapCtx.fillRect(w2m(z.x) - 2.5, w2m(z.z) - 2.5, 5, 5)
        })
        mapCtx.fillStyle = '#c99700'
        coinMeshes.forEach(c => {
          if (!c.taken) mapCtx.fillRect(w2m(c.x) - 1, w2m(c.z) - 1, 2, 2)
        })
        const cx = w2m(car.position.x), cy = w2m(car.position.z)
        mapCtx.strokeStyle = '#1d1c19'
        mapCtx.beginPath()
        mapCtx.moveTo(cx, cy)
        mapCtx.lineTo(cx + fwd.x * 8, cy + fwd.z * 8)
        mapCtx.stroke()
        mapCtx.fillStyle = '#d82d17'
        mapCtx.fillRect(cx - 2, cy - 2, 4, 4)
      }

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('contextmenu', onCtx)
      renderer.domElement.removeEventListener('pointerdown', onPDown)
      window.removeEventListener('pointermove', onPMove)
      window.removeEventListener('pointerup', onPUp)
      window.removeEventListener('pointercancel', onPCancel)
      window.removeEventListener('blur', onBlur)
      audio?.osc.stop()
      audio?.ctx.close()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  const touch = (k: keyof Keys, v: boolean) => () => { keysRef.current[k] = v }
  const touchBtn = (label: string, k: keyof Keys) => (
    <button
      className="w-14 h-14 flex items-center justify-center text-xl font-bold select-none"
      style={{ background: 'rgba(29,28,25,0.15)', border: '1px solid #8f8672', color: INKTEXT, borderRadius: 2, touchAction: 'none' }}
      onPointerDown={touch(k, true)}
      onPointerUp={touch(k, false)}
      onPointerLeave={touch(k, false)}
    >
      {label}
    </button>
  )

  const chip: React.CSSProperties = { background: 'rgba(250,247,240,0.88)', border: '1px solid #b7ad99', color: INKTEXT }

  if (failed) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p style={{ color: '#6b675c' }}>3D isn't available on this device.</p>
        <div className="max-w-[900px]"><Projects /><Contact /></div>
      </section>
    )
  }

  const Panel = panel ? PANELS[panel] : null

  return (
    <section className="fixed inset-0" aria-label="Drivable island portfolio">
      <div ref={mountRef} className="absolute inset-0" />

      <div className="absolute top-5 left-5 px-4 py-2.5 text-[0.72rem] tracking-[0.12em] uppercase font-bold" style={chip}>
        <span className="font-display mr-3">LUVIS GP</span>
        <span style={{ color: '#c99700' }}>◆</span> {coins}/{COINS.length + 10}
        <span className="mx-2" style={{ color: '#b7ad99' }}>|</span>
        <span style={{ color: '#4398cd' }}>▣</span> {visited.length}/{ZONES.length}
      </div>

      {race && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 px-5 py-2.5 font-display text-[1.05rem]" style={{ background: '#edcb1f', color: INKTEXT, border: '2px solid #1d1c19', boxShadow: '4px 4px 0 0 rgba(29,28,25,0.35)' }}>
          🏁 {race}
        </div>
      )}

      {celebrate && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 font-display text-[1.1rem] animate-pulse" style={{ background: '#d82d17', color: '#fff', border: '2px solid #1d1c19', boxShadow: '5px 5px 0 0 rgba(29,28,25,0.35)' }}>
          🎉 ALL ZONES VISITED!
        </div>
      )}

      <canvas ref={mapRef} width={140} height={140} className="absolute bottom-5 left-5" style={{ border: '1px solid #8f8672', imageRendering: 'pixelated' }} />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 text-[0.66rem] tracking-[0.16em] uppercase whitespace-nowrap hidden md:block font-semibold" style={chip}>
        W drive · S brake/rev · Space handbrake · Shift boost · H horn · N day/night · Right-drag look · R reset
      </div>

      <div className="absolute bottom-5 right-5 px-4 py-2 font-display text-[1.3rem]" style={chip}>
        {speed}<span className="text-[0.7rem] ml-1" style={{ color: '#6b675c' }}>km/h</span>
      </div>

      <button onClick={() => setMuted(m => !m)} className="absolute top-5 right-5 px-3 py-2 text-[0.7rem] tracking-[0.18em] uppercase font-bold" style={chip}>
        Sound: {muted ? 'Off' : 'On'}
      </button>

      {screenPrompt && !zone && !panel && (
        <button
          onClick={() => window.open(screenPrompt.url, '_blank', 'noopener')}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 px-6 py-3 font-display text-[1rem] animate-pulse"
          style={{ background: '#1d1c19', color: '#fff', boxShadow: '5px 5px 0 0 rgba(29,28,25,0.35)' }}
        >
          ENTER → {screenPrompt.title} ON GITHUB
        </button>
      )}

      {zone && !panel && (
        <button
          onClick={() => setPanel(zone.name)}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 px-6 py-3 font-display text-[1rem] animate-pulse"
          style={{ background: zone.color, color: '#fff', border: '2px solid #1d1c19', boxShadow: '5px 5px 0 0 rgba(29,28,25,0.35)' }}
        >
          ENTER → {zone.name}
        </button>
      )}

      {panel && Panel && (
        <div className="absolute inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(10,10,11,0.93)', backdropFilter: 'blur(6px)' }}>
          <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4" style={{ background: 'rgba(10,10,11,0.9)', borderBottom: '1px solid #26262a' }}>
            <span className="font-display text-[1.1rem]" style={{ color: '#e8e8e6' }}>{panel}</span>
            <button onClick={() => setPanel(null)} className="px-4 py-2 text-[0.75rem] tracking-[0.15em] uppercase font-bold" style={{ background: '#e8e8e6', color: '#0a0a0b' }}>
              ✕ Back to track (Esc)
            </button>
          </div>
          <div className="max-w-[1000px] mx-auto">
            <Panel />
          </div>
        </div>
      )}

      <div className="md:hidden absolute bottom-20 right-5 grid grid-cols-3 gap-2" style={{ gridTemplateAreas: '". up ." "left down right"' }}>
        <div style={{ gridArea: 'up' }}>{touchBtn('▲', 'up')}</div>
        <div style={{ gridArea: 'left' }}>{touchBtn('◀', 'left')}</div>
        <div style={{ gridArea: 'down' }}>{touchBtn('▼', 'down')}</div>
        <div style={{ gridArea: 'right' }}>{touchBtn('▶', 'right')}</div>
      </div>
    </section>
  )
}
