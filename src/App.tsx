import { Collections } from './components/Collections'
import { Connect } from './components/Connect'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { LaunchStatus } from './components/LaunchStatus'
import { Manifesto } from './components/Manifesto'
import { Marquee } from './components/Marquee'
import { SiteFooter } from './components/SiteFooter'
import { StoreFab } from './components/StoreFab'
import { SizeChart } from './components/SizeChart'
import { collectionTags } from './constants/collections'
import { usePointerGlow } from './hooks/usePointerGlow'
import { useReveal } from './hooks/useReveal'
import './App.css'

const phrases = ['Redefine the Standard', 'One Vision · Five Worlds', 'Launching Soon', 'Made in Colombo']

// Two passes so a single marquee set stays wider than the viewport.
const statement = [...phrases, ...phrases]

function StatementBand() {
  return (
    <Marquee className="band" duration={38}>
      {statement.map((phrase, i) => (
        <span className="band__item" key={`${phrase}-${i}`}>
          {phrase}
          <span className="band__star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </Marquee>
  )
}

function TagCloud() {
  // Two passes per set so a single set always overflows wide viewports.
  const tags = [...collectionTags, ...collectionTags]

  return (
    <div className="tag-cloud" aria-hidden="true">
      <Marquee duration={46}>
        {tags.map((tag, i) => (
          <span className="tag" key={`a-${i}`}>
            {tag}
          </span>
        ))}
      </Marquee>
      <Marquee duration={54} reverse>
        {tags.map((tag, i) => (
          <span className="tag" key={`b-${i}`}>
            {tag}
          </span>
        ))}
      </Marquee>
    </div>
  )
}

function App() {
  useReveal()
  usePointerGlow()

  return (
    <div className="site">
      <div className="grain" aria-hidden="true" />
      <div className="spotlight" aria-hidden="true" />

      <main>
        <Hero />
        <StatementBand />
        <Manifesto />
        <Collections />
        <Gallery />
        <SizeChart />
        <TagCloud />
        <LaunchStatus />
        <Connect />
      </main>

      <SiteFooter />
      <StoreFab />
    </div>
  )
}

export default App
