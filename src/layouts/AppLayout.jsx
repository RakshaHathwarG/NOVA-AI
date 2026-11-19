import AppSidebar from '../components/layout/AppSidebar'
import MobileTabBar from '../components/layout/MobileTabBar'
import AmbientBackground from '../components/effects/AmbientBackground'

export default function AppLayout({ children, wide = false }) {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground variant="quiet" />
      <AppSidebar />
      <MobileTabBar />
      <main className="relative z-10 lg:pl-64 pb-24 lg:pb-0 min-h-screen">
        <div className={wide ? 'w-full px-4 py-6 md:px-6' : 'mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10'}>{children}</div>
      </main>
    </div>
  )
}
