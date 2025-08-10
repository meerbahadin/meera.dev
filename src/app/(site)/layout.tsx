import Navbar from '@/components/navbar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const SiteLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default SiteLayout
