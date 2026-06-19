import reynLogo from './assets/reyn-logo-2.png'
import { collectionTags } from './constants/collections'
import './App.css'

function TagCloud() {
  // Repeat 4x so one "set" (50%) always overflows the viewport width
  const tags = Array(4).fill(collectionTags).flat()

  return (
    <div className="tag-cloud">
      <div className="tag-row tag-row--left">
        {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
      </div>
      <div className="tag-row tag-row--right">
        {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="page">
      <img src={reynLogo} alt="REYN. Redefine the Standard" className="logo" />

      <p className="tagline">Launching Soon!</p>

      <TagCloud />

      <div className="socials">
        <p className="follow-text">Stay updated</p>

        <div className="social-links">
          <a
            href="https://www.instagram.com/reynatelierofficial"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <a
            href="https://www.tiktok.com/@reynatelierofficial"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
