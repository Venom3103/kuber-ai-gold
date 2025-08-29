
# Kuber AI — Gold 

## Highlights
- **UI**: Chat (green user bubbles), profile + buy + history. “Buy Suggested” appears only when intent is gold.
- **Auth**: email/password (bcrypt), JWT httpOnly cookie.
- **/api/chat**: NLP intent detection (OpenAI optional; robust local classifier fallback). Random fact (inflation hedge/diversification/liquidity) + nudge.
- **/api/buy-gold**: Validation (bad format / amount < ₹10 gracefully handled). Computes grams, writes to Postgresql(Prisma), returns receipt.
- **/api/history**: Returns user’s purchase history + totals.
- **DB**: User, Purchase, ChatMessage.

## Run
```bash
npx prisma generate
npm i
npm run dev
```
Open `http://localhost:3000`, create an account, then start chatting.

Generated 2025-08-29 T21:17:26.457274Z
