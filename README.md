
# 📄 Document QA RAG App

An end-to-end **local Retrieval-Augmented Generation (RAG)** system for answering questions from uploaded documents. This project combines a **Django backend**, **FAISS-based vector store**, and a **React (Vite) frontend**, integrated with **Gemini API** or **Groq models (e.g., Gemma 2)** to deliver accurate, context-aware responses.

---

## 🚀 Features

- 📁 Upload PDF documents and generate vector embeddings
- 🔍 Semantic search using FAISS for relevant chunk retrieval
- 🤖 Contextual answer generation via Gemini or Groq APIs
- 💬 Chat-style interface with persistent history
- ⚛️ Modern React UI (Vite + Tailwind)
- 🧱 Modular and API-first Django backend
- 🔒 Local-first: privacy-focused document QA

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Backend     | Django REST Framework, FAISS   |
| Frontend    | React (Vite), Tailwind CSS     |
| LLM         | Gemini API / Groq (Gemma 2)    |
| Vector DB   | FAISS                          |
| Parsing     | PyMuPDF                        |
| Other       | ChromaDB (optional), dotenv    |

---

## 📁 Project Structure

```bash
document-qa-rag-app/
├── backend/
│   ├── api/                 # Upload and query APIs
│   ├── services/            # Vector DB and RAG logic
│   ├── settings.py          # Django config
│   └── db.sqlite3           # Local DB (ignored via .gitignore)
├── frontend/
│   ├── src/pages/           # Upload & Query views
│   ├── node_modules/        # Ignored
│   └── dist/                # Production build (ignored)
├── faiss_indexes/           # Vector indexes (ignored)
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 🔧 Backend Setup (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # or source venv/bin/activate (Linux/Mac)

pip install -r requirements.txt

# Set API key in .env file
# Example:
# GEMINI_API_KEY=your_gemini_api_key
# GROQ_API_KEY=your_groq_api_key

python manage.py runserver
```

---

### 🌐 Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

Open in browser: [http://localhost:5173](http://localhost:5173)

---

## 🔐 .env Configuration

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

---

## 🧠 Future Improvements

- [ ] Cloud deployment (Render/Vercel)
- [ ] JWT-based user authentication
- [ ] Multi-document support
- [ ] Auto chat history expiry

---

## 📌 About

This project was built by **Mayank Rathi** as a personal portfolio project for demonstrating full-stack and GenAI capabilities using modern tools and local-first retrieval systems.

---

## 📄 License

This project is licensed under the MIT License.
