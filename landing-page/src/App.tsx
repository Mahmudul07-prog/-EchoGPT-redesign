import { CtaBanner } from './components/CtaBanner'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Models } from './components/Models'
import { Nav } from './components/Nav'
import { Pricing } from './components/Pricing'
import { Screenshots } from './components/Screenshots'
import { Testimonials } from './components/Testimonials'
import { WhyChoose } from './components/WhyChoose'
import { ToastProvider } from './lib/toast-context'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg-light font-body text-text-light dark:bg-bg-dark dark:text-text-dark">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content">
          <Hero />
          <Features />
          <Models />
          <Screenshots />
          <WhyChoose />
          <Pricing />
          <Faq />
          <Testimonials />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App
