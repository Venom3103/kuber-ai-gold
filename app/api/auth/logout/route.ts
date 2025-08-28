// app/logout/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    document.cookie = "token=; Max-Age=0; path=/"
    router.push('/login')
  }, [router])

  return <p>Logging out...</p>
}
