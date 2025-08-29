# **Kuber-AI-Gold**

**Kuber-AI-Gold is an intelligent web application designed to provide personalized gold investment guidance and seamless transaction tracking. It combines conversational AI with secure transactional features, allowing users to make informed investment decisions.**

# 🚀 Features

**Intuitive UI :**

• Chat interface with green user bubbles.

• Profile management, gold purchase, and transaction history sections.

• "Buy Suggested" feature appears contextually when the user's intent is gold investment.

**Authentication & Security :**

• Secure email/password login using bcrypt.

• JWT with httpOnly cookies for session management.

**Conversational AI :**

• /api/chat endpoint supports NLP-based intent detection.

• Provides contextual advice, investment nudges, and random facts on inflation hedge, diversification, and liquidity.

**Gold Purchase Workflow :**

• /api/buy-gold endpoint validates inputs (handles incorrect formats or amounts < ₹10 gracefully).

• Calculates gold in grams, stores transactions in PostgreSQL via Prisma, and returns a detailed receipt.

**Purchase History :**

• /api/history endpoint provides users with a complete view of their past transactions and cumulative totals.

**Database Schema :**

• Structured around User, Purchase, and ChatMessage entities for efficient data management.

# 🛠️ Tech Stack

**Frontend : React, Tailwind CSS**

**Backend : Node.js, Express**

**Database : PostgreSQL (via Prisma ORM)**

**Authentication : JWT, bcrypt**

**NLP : OpenAI API (optional fallback to local classifier)**

**Deployment : Vercel (for frontend), Heroku (for backend)**

# ⚙️ Setup & Installation
**Prerequisites**

**Node.js (v16+)**

**PostgreSQL**

**OpenAI API Key (optional, for enhanced NLP features)**

# Steps

**Clone the repository :**

• git clone https://github.com/Venom3103/kuber-ai-gold.git

• cd kuber-ai-gold


**Install dependencies :**

• npm install


**Set up environment variables :**

• Create a .env.local file in the root directory and add the following:

• DATABASE_URL=your_postgresql_connection_string

• OPENAI_API_KEY=your_openai_api_key (optional)

• JWT_SECRET=your_jwt_secret


**Run database migrations :**

• npx prisma migrate dev


**Start the development server :**

• npm run dev


**The application should now be running at http://localhost:3000**
.

# 📄 API Endpoints

**POST /api/chat :**

• Detects user intent and provides contextual responses.

• Optional integration with OpenAI API for enhanced NLP capabilities.

**POST /api/buy-gold :**

• Validates purchase inputs.

• Calculates gold in grams.

• Stores transaction details in the database.

• Returns a purchase receipt.

**GET /api/history :**

• Retrieves the user's purchase history.

• Displays cumulative totals.

# 🧪 Testing

**To run tests :**

• npm run test

# 📄 License

• This project is licensed under the MIT License.
