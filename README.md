# There For You - AI-Powered Student Assistance Platform

**Project ID:** 2026MIN525
**For:** Department of Technical Education, Government of Rajasthan

## Overview
There For You is a unified, full-stack student support prototype designed to assist students with academics, career, well-being, and scholarships through an intelligent conversational interface.

## Tech Stack
- **Frontend:** React, Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Architecture ready for:** PostgreSQL, Prisma, LLM Integration (OpenAI/Gemini), Vector DB (RAG)

## Running the Application Locally
This application is built as a highly interactive prototype with embedded mock data. It requires no external API keys or databases to run.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features & Modules
- **Login / Welcome:** A polished entry point (Click "Continue as Demo Student").
- **Dashboard:** Centralized KPI metrics, interactive tasks, and personalized AI recommendations.
- **AI Assistant:** A centralized chat interface with query routing (Mocked).
- **Academic Hub:** Performance tracking, study planner, and mock quiz generation.
- **Career & Placement:** Skill gap analysis, mock ATS resume scorer, and mock interviews.
- **Wellness Companion:** Daily check-ins, study balance tracking, and AI insights.
- **Scholarships:** Searchable database with AI matching score.
- **Profile & Settings:** Manage demo data and view project information.

## Future Architecture (Production Ready)
The codebase is structured to easily replace mock data with real backend endpoints (`/api/*`).
- To integrate real AI: Hook up the `generateMockResponse` inside `src/data/chatData.ts` to an LLM provider (e.g., Gemini API).
- To integrate RAG: Replace the knowledge datasets with a vector database retrieval pipeline.
