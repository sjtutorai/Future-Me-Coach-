
# Future Me Coach

A minimal, serious, and emotion-driven discipline coach application.

## Setup Instructions

1.  **Clone the project**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    *   Create a `.env` file or set the `API_KEY` (Gemini API) in your Vercel/Local environment.
4.  **Local Development**:
    ```bash
    npm run dev
    ```
5.  **Build**:
    ```bash
    npm run build
    ```
6.  **Deployment (Vercel)**:
    *   Connect your repository to Vercel.
    *   Ensure the `API_KEY` environment variable is added to the Vercel project settings.
    *   Vercel will automatically use `vercel.json` and `vite.config.ts`.

## Tech Stack
*   **Vite**: Frontend build tool.
*   **React**: UI framework.
*   **Tailwind CSS**: Styling.
*   **Firebase**: Authentication and Database.
*   **Gemini API**: AI personality logic and Text-to-Speech.

## Core Features
*   **30-Day Lock-in**: Once configured, parameters are immutable for 30 days.
*   **Silent Judge**: Direct, cold feedback on your current trajectory.
*   **Reverse Regret**: Visceral exercises to feel the weight of future failure.
*   **Memory Vault**: Permanent record of warnings and realizations.
