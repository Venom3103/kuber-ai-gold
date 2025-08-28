
export function getGoldPriceINRPerGram(){ return 6500 } // tweak as needed or fetch from API
export function amountToGrams(amount:number, p=getGoldPriceINRPerGram()){ return +(amount/p).toFixed(3) }
export function rup(n:number){ return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n) }
export const facts=[
  'Gold historically helps during high inflation by preserving purchasing power.',
  'A 5–10% allocation to gold may reduce portfolio volatility due to low correlation with equities.',
  'Digital gold provides 24×7 liquidity and fractional buying starting at low amounts.'
]
export const randomFact = () => facts[Math.floor(Math.random()*facts.length)]
