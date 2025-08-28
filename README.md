
# Kuber AI — Gold Advisor (Supreme Build v7)

**God-tier assignment**: polished UI + smarter intent + full auth + DB history.

## Highlights
- **UI**: Chat left (green user bubbles), profile + buy + history right. “Buy Suggested” appears only when intent is gold.
- **Auth**: email/password (bcrypt), JWT httpOnly cookie.
- **/api/chat**: NLP intent detection (OpenAI optional; robust local classifier fallback). Random fact (inflation hedge/diversification/liquidity) + nudge.
- **/api/buy-gold**: Validation (bad format / amount < ₹10 gracefully handled). Computes grams, writes to SQLite (Prisma), returns receipt.
- **/api/history**: Returns user’s purchase history + totals.
- **DB**: User, Purchase, ChatMessage.

## Run
```bash
npm i
cp .env.local.example .env.local
npx prisma migrate dev --name init
npm run dev
```
Open `http://localhost:3000/login`, create an account, then start chatting.

Generated 2025-08-26T21:17:26.457274Z
