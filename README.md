<div align="center">

# 🎒 Lost & Found — Lovely Professional University

**A community portal where LPU students and staff report lost or found belongings and securely hand them back to their owners.**

[![Live Site](https://img.shields.io/badge/Live-lostandfoundlpu.ai.studio-FF4D00?style=for-the-badge&logo=googlechrome&logoColor=white)](https://lostandfoundlpu.ai.studio/)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### 🔗 [**Visit the Live Website → lostandfoundlpu.ai.studio**](https://lostandfoundlpu.ai.studio/)

</div>


---

## 📖 About the Project

Losing a phone, ID card, laptop or a pair of earbuds on a campus as big as LPU is stressful, and finding someone else's belongings and not knowing who to return them to is just as frustrating.

**Lost & Found** is a public, easy-to-use hub for the LPU community. Anyone can post a *Lost* or *Found* report, and every report is protected by a **secret resolution code**, so only the person who created the report can mark the case as resolved once the item has been handed over.

---

## ✨ Features

- 📝 **Report Lost or Found Items:** quick forms to post an item with title, category, campus location, date and time, description and identifying marks.
- 🔐 **Protected Handover:** every report gets a unique secret code; only the report holder with the code can resolve the case.
- ✅ **Case Resolution:** close a report with a handover note, and it is marked as *Resolved & Returned* (with a confetti celebration 🎉).
- 📊 **Live Campus Stats:** total reported, lost items, found items and resolved cases at a glance.
- 🔎 **Smart Search:** search by item name, description, brand or registration number.
- 🗂️ **Filters and Tabs:** switch between *All Reports*, *Lost Items*, *Found Items* and *Resolved Cases*, and filter by **campus location** (e.g. Block 13 Student Centre, Block 34 Engineering & Tech) and **category** (Electronics & Gadgets, ID Cards, etc.).
- 🤝 **Connect with Peers:** reach the reporter directly through the contact details on each card.
- 🌗 **Dark / Light Mode:** comfortable viewing day or night.
- 📱 **Fully Responsive:** works on mobile, tablet and desktop.
- ⚡ **Real-time Database:** reports are stored in Firebase Firestore.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + Montserrat font |
| Database | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| Animations | [Motion](https://motion.dev/) and [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| Icons | [Lucide React](https://lucide.dev/) |
| AI SDK | [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) |
| Server | Express |
| Built & Hosted on | [Google AI Studio](https://aistudio.google.com/) |

---

## 🗃️ Data Model

All reports live in a single Firestore collection: `reports`.

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"lost"` \| `"found"` | Whether the item was lost or found |
| `title` | string (≤ 120) | Name of the item |
| `category` | string (≤ 60) | Item category |
| `location` | string (≤ 120) | LPU campus location |
| `dateTime` | string | Date and time of the incident |
| `description` | string (≤ 1500) | Details and identifying marks |
| `reporterName` | string | Name or handle of the reporter |
| `reporterContact` | string | Phone, email or registration number |
| `secretCode` | string (4 to 30) | Code needed to resolve the report |
| `status` | `"open"` \| `"resolved"` | Current status |
| `resolvedAt` | string | When the case was resolved |
| `resolvedByNote` | string (≤ 400) | Handover remarks |
| `imageUrl` | string | Optional image URL |
| `createdAt` | string | Creation timestamp |

Firestore security rules (`firestore.rules`) validate every write: required fields, length limits, valid `type` and `status` values, new reports must start as `open`, updates require a matching secret code, and deletion is disabled.

---

## 🚀 Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/) (v18 or newer)

```bash
# 1. Clone this repository from github.com/shuvammali and open its folder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# then open .env.local and add your GEMINI_API_KEY

# 4. Start the dev server
npm run dev
```

The app runs at **http://localhost:3000**.

### Available Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove build output |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Gemini API key (injected automatically by AI Studio at runtime) |
| `APP_URL` | URL where the app is hosted (injected automatically by AI Studio) |

---

## 🌐 Deployment

The project is built and deployed with **Google AI Studio** and is live at:

👉 **https://lostandfoundlpu.ai.studio/**

You can also view the source app in AI Studio: https://ai.studio/apps/83dade3b-0ec9-4271-b3fd-d520adba343c

---

## 📁 Project Files

```
├── index.html                 # App entry HTML (SEO + Open Graph meta tags)
├── src/main.tsx               # React entry point
├── firestore.rules            # Firestore security rules
├── firebase-blueprint.json    # Report entity schema
├── firebase-applet-config.json# Firebase project config
├── metadata.json              # AI Studio app metadata
├── vite.config.ts             # Vite + React + Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies and scripts
└── .env.example               # Environment variable template
```

---

## 🤝 Contributing

Suggestions and improvements are welcome! Fork the repo, create a branch, make your changes and open a pull request.

---

## 👨‍💻 Author

**Shuvam Mali**
Student at Lovely Professional University

[![GitHub](https://img.shields.io/badge/GitHub-shuvammali-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shuvammali)

---

<div align="center">

Made with ❤️ for the LPU community

⭐ If this project helped you, consider giving it a star!

</div>
