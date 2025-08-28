"use client"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import "./app.css"

type ChatResp = {
  intent: "gold_investment" | "general" | "goal_planning";
  reply: string;
  suggestedAmount?: number;
  suggestedGrams?: number;
};

type Purchase = { 
  id: string; 
  createdAt: string; 
  grams: number; 
  amountINR: number; 
  pricePerGram: number; 
  channel: string 
}

const GOLD_PRICE = 6500; // per gram

export default function DashboardPage() {
  const [me, setMe] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState("Should I invest in gold?")
  const [grams, setGrams] = useState("1")
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string; time?: string }[]>([])
  const [chat, setChat] = useState<ChatResp | null>(null)
  const [notice, setNotice] = useState("")
  const [history, setHistory] = useState<Purchase[]>([])
  const [totals, setTotals] = useState<{ grams: number; amountINR: number } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/auth/me", { credentials: "include" })
      const j = await r.json()
      if (!j.user) { window.location.href = "/login"; return }
      setMe(j.user)
      setLoading(false)
      loadHistory()
    })()
  }, [])

  async function loadHistory() {
    const r = await fetch("/api/history", { credentials: "include" })
    const j = await r.json()
    setHistory(j.rows)
    setTotals(j.totals)
  }

  async function send() {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    setMessages(m => [...m, { from: "user", text: input, time: now }])

    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: input })
    })
    const d: ChatResp = await r.json()
    setChat(d)

    setMessages(m => [...m, { from: "bot", text: d.reply, time: now }])
    setInput("")

    if (d.suggestedGrams) setGrams(String(d.suggestedGrams))
  }

  async function buy(gramsNum: number) {
    const r = await fetch("/api/buy-gold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ grams: gramsNum })
    })
    const d = await r.json()
    setNotice(d.message || "")
    await loadHistory()
  }

  if (loading) return <main className="p-8">Loading…</main>
  const inrPreview = inrFromGrams(grams)

  return (
    <main className="max-w-7xl mx-auto p-6">
      <Header me={me} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_360px] gap-6">
        
        {/* Chat Column */}
        <div className="card glass p-6 flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto min-h-[360px] pr-2">
            {messages.map((m, i) => (
              <div key={i} className={clsx("flex", m.from === "user" && "justify-end")}>
                <div className={clsx(
                  "max-w-[75%] px-4 py-2 rounded-2xl shadow-md",
                  m.from === "user" 
                    ? "bg-gradient-to-r from-amber-200 to-yellow-300 text-black" 
                    : "bg-black text-amber-300 border border-amber-400"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            <div className="text-xs text-slate-400">{messages.at(-1)?.time}</div>
            <div ref={bottomRef} />
          </div>

          {/* Suggested Buy */}
          {chat?.suggestedGrams && (
            <div className="mt-4 flex items-center gap-3">
              <button className="btn btn-cta" onClick={() => buy(chat.suggestedGrams!)}>
                Buy Suggested ({chat.suggestedGrams}g ≈ ₹{chat.suggestedGrams! * GOLD_PRICE})
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="mt-4 flex items-center gap-3">
            <input className="input flex-1 glass" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…" />
            <button className="btn btn-cta" onClick={send}>➤</button>
          </div>

          {notice && <div className="mt-3 text-sm text-emerald-700">{notice}</div>}
        </div>

        <div className="divider hidden md:block"></div>

        {/* Sidebar */}
        <aside className="card glass p-6 flex flex-col">
          <ProfileCard me={me} />

          <div className="mt-6 space-y-4">
            <Metric label="Monthly Income" value="₹50,000" />
            <Metric label="Monthly Savings" value="₹10,000" />
            <div className="border rounded-2xl p-3 bg-white/5">
              <div className="text-slate-400 text-sm">Existing Investments</div>
              <div className="text-xl font-semibold text-amber-400">₹10,00,000</div>
            </div>
          

          {/* Buy Section */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="text-xs text-slate-400">Purchase (grams)</div>
            <input className="input glass" value={grams} onChange={e => setGrams(e.target.value)} placeholder="e.g., 10" />
            <div className="text-xs text-slate-400">≈ <b>₹{inrPreview}</b></div>
            <button className= "btn btn-cta w-full mt-1"  onClick={() => buy(Number(grams))}>Buy</button>
          </div>

    {/* Purchase History at Bottom */}
<div className="mt-6 flex-1 overflow-y-auto border-t pt-4">
  <h3 className="text-sm font-semibold text-amber-400 mb-2">Purchase History</h3>
  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
    {(!history || history.length === 0) && (
      <p className="text-xs text-slate-500">No purchases yet.</p>
    )}
    {history?.map((h: any) => (
      <div
        key={h.id}
        className="text-xs flex justify-between border-b border-slate-700 pb-1"
      >
        <span>{new Date(h.createdAt).toLocaleDateString()}</span>
        <span className="text-amber-400">
          {h.grams}g @ ₹{h.amountINR}
        </span>
      </div>
    ))}
  </div>

  {/* Totals */}
  {totals && (
    <div className="mt-3 text-xs text-slate-400">
      Total: <b>{totals.grams}g</b> worth <b>₹{totals.amountINR}</b>
    </div>
  )}
</div>


          </div>
        </aside>
      </div>
    </main>
  )
}

/* --- Reusable Components --- */
function Header({ me }: { me: any }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    window.location.href = "/login"
  }

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-400">Kuber AI Gold</h1>
        <h3 className="text-amber-400 text-sm">Your Most Trusted Gold Investment Partner</h3>
      </div>

    </header>
  )
}


function ProfileCard({ me }: { me: any }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    window.location.href = "/login"
  }

  const initial = me?.email ? me.email[0].toUpperCase() : "U"

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl glass">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold">
        {initial}
      </div>

      {/* User Info */}
      <div>
        <div className="font-medium">
          {me?.email || "Unknown User"}
        </div>
        <div className="text-xs text-slate-400">
          Joined: {me?.createdAt ? new Date(me.createdAt).toLocaleDateString() : "-"}
        </div>

        {/* Logout Button */}
        <div className="mt-2">
          <button 
            onClick={logout} 
            className="btn bg-green-700 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}


function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-2xl bg-white/5 flex justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-semibold text-amber-300">{value}</span>
    </div>
  )
}

function inrFromGrams(grams: string) {
  const n = Number(grams)
  if (!isFinite(n) || n <= 0) return "0"
  return (n * GOLD_PRICE).toFixed(0)
}
