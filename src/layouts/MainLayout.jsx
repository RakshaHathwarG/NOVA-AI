import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AmbientBackground from '../components/effects/AmbientBackground'

export default function MainLayout({ children, showFooter = true, showAmbientBg = true }) {
  return (
    <div className="relative min-h-screen">
      {showAmbientBg && <AmbientBackground />}
      <Navbar />
      <main className="relative z-10 pt-28">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
