import './App.scss'
import { AnimatedThemeToggler } from './components/ui/animated-theme-toggler'
import { DiaTextReveal } from "@/components/ui/dia-text-reveal"

function App() {
  return (
    <>
    <div>
      <DiaTextReveal text={'4lpha'} colors={['var(--primary)']} duration={2}>
      </DiaTextReveal>
    </div>
    <div style={{ position: 'absolute', right: '50%', bottom: '50%', transform: 'translate(50%, 50%)' }}>
      <AnimatedThemeToggler duration={1250} />
    </div>
    </>
  )
}

export default App
