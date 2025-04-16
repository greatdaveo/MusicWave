# 🎵 MusicWave API

**MusicWave API** powers a dynamic music streaming experience. It supports user and artiste accounts, song uploads, playlist management, user engagement (likes, follows), and personalized music discovery.

---

## 🚀 Features

- 👤 **User & Artiste Registration/Login**
- 🎶 **Song Upload & Streaming** (Artistes only)
- 📂 **Playlists** – Create, update, delete, add/remove songs
- 💙 **Like Songs** – Toggle liked songs
- 🔁 **Playback State** – Resume from last playback point
- 🌟 **Song Recommendations** – Based on tags & genres
- 🆕 **New & Recently Played Songs**
- 📤 **Shareable Links** – Share song URLs
- 🧑‍🎤 **Follow Artistes** – View followed artistes and their songs
- 🔔 **Notifications** – Read, push, mark read/unread, clear
- 📄 **Swagger API Docs** – Available at `/api-docs`

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT with Cookies
- **File Upload**: Multer
- **Docs**: Swagger + swagger-ui-express

---

## 📦 Getting Started

```bash
git clone https://github.com/greatdaveo/MusicWave.git
cd MusicWave
npm install
```

Create a `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run the dev server:

```bash
npm run dev
```

---

## 🔐 Authentication

All protected routes require a Bearer Token:

- First, login at `/api/auth/login`
- Copy the returned token
- In Swagger UI, click **Authorize** and paste: `Bearer <token>`

---

## 📚 API Documentation

Visit: [https://musicwave.onrender.com/api-docs](https://musicwave.onrender.com/api-docs)

🧪 Try it out online: [Open Swagger UI](https://musicwave.onrender.com/api-docs)

---

## 🧪 Testing (Optional)

```bash
npm run test
```

---

## 🧑‍💻 Author

Made with ❤️ by David Olowomeye – [GitHub](https://github.com/greatdaveo)

> 🎧 MusicWave makes streaming personalized and powerful — for users and artists alike.
