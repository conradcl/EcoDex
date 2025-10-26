
# EcoDex 🌿🐾

EcoDex identifies local wildlife from photos using AI, inspired by retro Pokémon games.

---

## Features

- **Image Identification:** Upload a photo or use your camera to identify wildlife.  
- **Local Information:** Get the species name, status (Native, Invasive, Endangered, Common), and description relevant to Pennsylvania.  
- **Sighting Gallery:** Automatically saves your identifications to a personal gallery in your browser.  
- **Detail View:** Click gallery items to see full details.  
- **Custom UI:** Features handmade icons inspired by retro games.

---

## 🧰 Setup and Running Locally

Follow these steps to get EcoDex running on your local machine.

---

### 1. Install Node.js

You need Node.js to run the server and install dependencies.

- **Download:** Go to the [Node.js official website](https://nodejs.org/) and download the **LTS (Long-Term Support)** version recommended for most users.  
- **Install:** Run the installer, accepting the default options. This will also install **npm** (Node Package Manager).  
- **Verify Installation:** Open your terminal or command prompt and run these commands. They should output version numbers:

```bash
node -v
npm -v
````

*(If the commands aren't found, try restarting your terminal or computer.)*

---

### 2. Install Dependencies

Navigate to the project folder in your terminal and install the necessary packages listed in `package.json`:

```bash
npm install
```

---

### 3. Create `.env` File for API Key 🔑

EcoDex uses the **Google Gemini API**, which requires an API key.

#### Get an API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable **Billing** for the project (required even for the free tier).
4. Search for and **Enable** the “Generative Language API.”
5. Go to **APIs & Services > Credentials.**
6. Click **“+ CREATE CREDENTIALS” → “API key.”**
7. Copy the generated API key. *(Do not restrict the key for local testing.)*

#### Create the `.env` File

In the root of your EcoDex project folder (same level as `server.js` and `package.json`), create a new file named **`.env`**

Inside the `.env` file, add the following line (replace `YOUR_GOOGLE_API_KEY_HERE` with your actual key):

```bash
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
```

> ⚠️ Make sure there are **no quotes** or extra spaces around the key.

---

### 4. Run the Website

Start the Node.js server from your terminal:

```bash
node server.js
```

You should see a message like:

```
✅ Server running at http://localhost:3000
```

Then open your browser and visit:

👉 [http://localhost:3000](http://localhost:3000)

The EcoDex website should now be running locally! 🎉

---

### 🐛 Troubleshooting

* If the server doesn’t start, ensure your `.env` file is correctly named and located in the root folder.
* Run `npm install` again if you encounter missing module errors.
* Check your Node.js version (LTS recommended).

---

### 💚 Credits

Credits to Conrad, Nick and Emulen!


