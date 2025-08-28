"use client"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import "./app.css"

type ChatResp = {
  intent: "gold_investment" | "general" | "goal_planning";
  reply: string;
  suggestedAmount?: number;   // INR per month (optional, for display)
  suggestedGrams?: number;    // grams per month (main for transactions)
};

type Purchase = { id:string; createdAt:string; grams:number; amountINR:number; pricePerGram:number; channel:string }

const GOLD_PRICE = 6500; // per gram

export default function DashboardPage(){
  const [me,setMe]=useState<{name:string,email:string}|null>(null)
  const [loading,setLoading]=useState(true)
  const [input,setInput]=useState("Should I invest in gold?")
  const [grams,setGrams]=useState("1")   // 👈 sidebar input is grams now
  const [messages,setMessages]=useState<{from:"user"|"bot",text:string,time?:string}[]>([])
  const [chat,setChat]=useState<ChatResp|null>(null)
  const [notice,setNotice]=useState("")
  const [history,setHistory]=useState<Purchase[]>([])
  const [totals,setTotals]=useState<{grams:number,amountINR:number}|null>(null)
  const bottomRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}) },[messages])

  useEffect(()=>{
    (async()=>{
      const r=await fetch("/api/auth/me",{credentials:"include"})
      const j=await r.json()
      if(!j.user){ window.location.href="/login"; return }
      setMe(j.user)
      setLoading(false)
      loadHistory()
    })()
  },[])

  async function loadHistory(){
    const r=await fetch("/api/history",{credentials:"include"})
    const j=await r.json()
    setHistory(j.rows)
    setTotals(j.totals)
  }

  async function send(){
    const now = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})
    setMessages(m=>[...m,{from:"user", text:input, time:now}])
    const r=await fetch("/api/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({message:input})
    })
    const d: ChatResp = await r.json()
    setChat(d)
    setMessages(m=>[...m,{from:"bot", text:d.reply, time:now}])
    setInput("")

    // auto-prefill sidebar grams if AI suggested one
    if (d.suggestedGrams) {
      setGrams(String(d.suggestedGrams))
    }
  }

  async function buy(gramsNum:number){
    const r=await fetch("/api/buy-gold",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({grams: gramsNum})
    })
    const d=await r.json()
    setNotice(d.message||"")
    await loadHistory()
  }

  if(loading) return <main className="p-8">Loading…</main>
  const inrPreview = inrFromGrams(grams)

  return (
    <main className="max-w-6xl mx-auto p-6">
      <Header me={me}/>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_380px] gap-6">
        
        {/* Chat column */}
        <div className="card p-6">
          <div className="space-y-3 min-h-[360px]">
            {messages.map((m,i)=>(
              <div key={i} className={clsx("flex", m.from==="user" && "justify-end")}>
                <div className={clsx("bubble", m.from==="user"?"bubble-user":"bubble-bot")}>{m.text}</div>
              </div>
            ))}
            <div className="text-xs text-slate-400">{messages.at(-1)?.time}</div>
            <div ref={bottomRef}/>
          </div>

          {/* 👇 Buy Suggested button */}
          {(chat?.suggestedGrams) && (
            <div className="mt-4 flex items-center gap-3">
              <button 
                className="btn btn-cta" 
                onClick={() => buy(chat.suggestedGrams!)}
              >
                Buy Suggested ({chat.suggestedGrams}g ≈ ₹{chat.suggestedGrams! * GOLD_PRICE})
              </button>
              <span className="text-sm text-slate-500">or enter a custom grams value</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <input className="input flex-1" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..." />
            <button className="btn btn-cta" onClick={send}>➤</button>
          </div>

          {notice && <div className="mt-3 text-sm text-emerald-700">{notice}</div>}
        </div>

        <div className="divider hidden md:block"></div>

        {/* Sidebar */}
        <aside className="card p-6">
          <ProfileCard me={me}/>
          <div className="mt-6 space-y-4">
            <Metric label="Monthly Income" value="₹50,000" />
            <Metric label="Monthly Savings" value="₹10,000" />
            <div className="border rounded-2xl p-3">
              <div className="text-slate-500 text-sm">Existing Investments</div>
              <div className="text-sm">SIP</div>
              <div className="text-xl font-semibold">₹10,00,000</div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="text-xs text-slate-500">Purchase (grams)</div>
            <input className="input" value={grams} onChange={e=>setGrams(e.target.value)} placeholder="e.g., 10" />
            <div className="text-xs text-slate-500">≈ <b>₹{inrPreview}</b></div>
            <button className="btn btn-cta w-full mt-1" onClick={()=>buy(Number(grams))}>Buy</button>
          </div>

          <HistoryPanel />
        </aside>
      </div>
    </main>
  )
}

function Header({me}:{me:any}){ /* same as yours */ }
function ProfileCard({me}:{me:any}){ /* same */ }
function Metric({label,value}:{label:string,value:string}){ /* same */ }
function HistoryPanel(){ /* same */ }

// 👇 helper for sidebar
function inrFromGrams(grams: string) {
  const n = Number(grams)
  if (!isFinite(n) || n<=0) return "0"
  return (n * GOLD_PRICE).toFixed(0)
}
