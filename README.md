# 📱 SOS-Calculator

**[EN]**  
SOS-Calculator is an experimental web application that estimates the amount of waste generated from your smartphone usage by analyzing an image of your daily or weekly screen time.  
**[ES]**  
SOS-Calculator es una aplicación web experimental que estima la cantidad de residuos generados por el uso del teléfono móvil, analizando una imagen del tiempo de uso diario o semanal.

---

## 🧠 AI Integration / Integración de Inteligencia Artificial

**[EN]**  
The core of SOS-Calculator relies on **LLaVA 3.2 Vision**, a multimodal model capable of understanding visual content. The application uses **Ollama** to run the model locally, with a reverse proxy configured via **ngrok** to allow remote API access.  
When a user uploads an image of their screen time, the image is stored in **Supabase**, retrieved by the server, and sent to the LLaVA API for analysis.

**[ES]**  
El núcleo de SOS-Calculator se basa en **LLaVA 3.2 Vision**, un modelo multimodal capaz de comprender contenido visual. La aplicación utiliza **Ollama** para ejecutar el modelo localmente, con un proxy inverso mediante **ngrok** para permitir el acceso remoto a la API.  
Cuando el usuario sube una imagen de su tiempo de uso, esta se almacena en **Supabase**, luego es descargada por el servidor y enviada a la API de LLaVA para su análisis.

---

## 🛠️ Technologies Used / Tecnologías Usadas

- 🧠 LLaVA 3.2 (via Ollama)
- 🌐 Next.js + React (frontend)
- 🖥️ Node.js (backend)
- ☁️ Supabase (image storage)
- 🔄 Ngrok (reverse proxy)
- 📦 npm (package manager)

---

## 🚀 How to Run / Cómo Ejecutar

**[EN]**  
To run the app locally, make sure you have `npm` (or another compatible package manager like `yarn`, `bun`, or `pnpm`) installed.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
