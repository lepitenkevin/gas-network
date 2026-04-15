⛽ FuelNet: Community Gas Station Network
FuelNet is a crowdsourced, responsive web application designed to help the local community track, update, and find the cheapest gas prices in real-time. Built with a modern tech stack, it features an interactive map, dynamic filtering, and a moderation system for community-submitted price updates.

✨ Key Features
Smart Dashboard & Filtering: Instantly sort stations by the lowest prices or filter by specific fuel categories (🟢 Unleaded, 🔴 Premium, ⚫ Diesel).

Interactive Mapping: Integrated Leaflet maps allow users to view exact station coordinates and allow managers to drop map pins visually.

Crowdsourced Price Updates: Drivers can submit real-time price changes by uploading photo proof of station price boards.

Admin Moderation System: Station managers and admins can review, approve, or reject community-submitted photos to ensure data accuracy.

Progressive Web App (PWA): Fully installable on mobile devices with a custom, beautifully designed installation banner.

Modern UI/UX: Built with Tailwind CSS, featuring a custom color palette, glassmorphism effects, glowing hover states, and seamless Dark Mode integration.

Web Share API: Users can instantly share formatted gas price updates directly to social media or messaging apps.

Serverless Email Integration: A built-in contact form powered by EmailJS for direct community support and feedback.

🛠️ Tech Stack
Frontend:

React (Vite)

React Router DOM (Navigation)

Tailwind CSS (Styling & Dark Mode)

React Leaflet (Interactive Maps)

Vercel Analytics (Traffic Monitoring)

Backend:

PHP 8+

MySQL (Relational Database)

Secure REST API architecture with CORS protection

🚀 Getting Started
Prerequisites
Node.js and npm installed

A local or remote server running PHP and MySQL (e.g., XAMPP, CloudPanel)

Frontend Setup
Clone the repository.

Navigate to the project directory and install dependencies:

Bash
npm install
Create a .env file in the root directory and add your environment variables:

Code snippet
VITE_API_URL=https://your-backend-domain.com/api.php
VITE_API_MEDIA_URL=https://your-backend-domain.com/
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
Start the development server:

Bash
npm run dev
Backend Setup
Upload the PHP files to your web server.

Create a new MySQL database and import the required tables (stations, gas_types, station_fuels, reviews, users).

Update db.php with your database credentials.

Ensure the uploads/ directory has the correct write permissions (e.g., chmod 777) for community photo submissions.

🔒 Security & Architecture
Role-Based Access Control (RBAC): Admins have global control over master fuel types, colors, and user assignments, while Station Managers can only edit prices for their designated branches.

Rate Limiting: IP-based cooldowns prevent spam submissions on the crowdsourced review forms.

Data Integrity: "Ghost" gas types typed by managers are safely defaulted and caught by the backend without crashing the UI.

👨‍💻 Author
Kevin Victor Lepiten
Handcrafted in Cebu, Philippines 🇵🇭
