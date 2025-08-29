import Divider from '@/components/divider'
import Experiences from '@/components/experience'
import Footer from '@/components/footer'
import Header from '@/components/header'
import RecentWork from '@/components/recent-work'
import Stack from '@/components/stack'

export default function Home() {
  return (
    <main className='overflow-x-hidden'>
      <Header />
      <Experiences />
      <Divider />
      <RecentWork />
      <Divider />
      <Stack />
      <Divider />
      <Footer />
    </main>
  )
}
