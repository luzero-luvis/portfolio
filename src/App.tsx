import Loader  from './components/Loader'
import World3D from './components/World3D'

/* Single-page island world — all content opens inside the 3D world. */
export default function App() {
  return (
    <>
      <Loader />
      <World3D />
    </>
  )
}
