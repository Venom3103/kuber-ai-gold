'use client'
import { useEffect, useState } from "react"
import Page from "@/app/page"  // your main gold advisor component

export default function Dashboard() {
  const [me, setMe] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      const data = await res.json()
      if (data.user) {
        setMe(data.user)
      } else {
        window.location.href = "/login"
      }
      setLoading(false)
    })()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!me) return null

  return (
    <>
      <Page />
    </>
  )
}
