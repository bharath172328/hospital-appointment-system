@echo off
REM PatientCare OS - Project README Shortcut
REM Run this file from the project root to view setup and usage details.

echo.
echo ===============================
echo PatientCare OS - Project Overview
echo ===============================
echo.
echo This repository contains a React + Vite patient care application.
echo It uses Cloudflare Workers / Vite, Supabase for authentication and data,
echo Tailwind CSS for styling, and TanStack Router + React Query for state and routing.
echo.
echo Project root files:
echo   package.json      - npm scripts and dependencies
echo   tsconfig.json     - TypeScript configuration
echo   vite.config.ts    - Vite build / dev configuration
echo   bunfig.toml       - Bun config present in repo, but npm scripts are primary here
echo   wrangler.jsonc    - Cloudflare worker deployment config
echo.
echo Source layout:
echo   src/              - application source code
echo   src/routes/       - route components for pages and dashboards
echo   src/components/   - reusable UI components and design system primitives
echo   supabase/         - Supabase migration and config files
echo.
echo Common commands:
echo   npm install       - install dependencies
echo   npm run dev       - start local Vite development server
echo   npm run build     - build production assets
echo   npm run preview   - preview the production build locally
echo   npm run lint      - run ESLint checks
echo   npm run format    - run Prettier formatting
echo.
echo Notes:
echo   - The app uses React 19 and Tailwind CSS 4.
echo   - Supabase setup details and environment variables are expected in your local environment.
echo   - This project also includes generated router configuration under src/routeTree.gen.ts.
echo.
echo Getting started:
echo   1. Install dependencies: npm install
echo   2. Configure Supabase credentials / env vars.
echo   3. Run dev server: npm run dev
echo   4. Open the local URL shown in the terminal.
echo.
echo For more details, inspect the source files in src/ and supabase/.
echo.
pause
