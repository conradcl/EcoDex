document.addEventListener("DOMContentLoaded", () => {
  // --- 1. API Setup ---
  const API_URL = "/api/gemini";

  // --- 2. Sprite Database ---
  const spriteDatabase = {
    cardinal: "img/sprites/cardinal.png",
    "northern cardinal": "img/sprites/cardinal.png",
    "white-tailed deer": "img/sprites/deer.png",
    "gray squirrel": "img/sprites/squirrel.png",
    "eastern gray squirrel": "img/sprites/squirrel.png",
    squirrel: "img/sprites/squirrel.png",
    robin: "img/sprites/robin.png",
    "american robin": "img/sprites/robin.png",
  };
  const defaultSprite = "img/sprites/question-mark.png";

  // --- 3. Get HTML Elements ---
  const startButton = document.getElementById("startCameraButton");
  const uploadInput = document.getElementById("imageUploader");
  const cameraView = document.getElementById("cameraView");
  const video = document.getElementById("videoFeed");
  const takePicButton = document.getElementById("takePictureButton");
  const canvas = document.getElementById("imageCanvas");
  const loader = document.getElementById("loader");
  const resultsSection = document.getElementById("resultsSection");
  const previewImage = document.getElementById("previewImage");
  const pokemonSprite = document.getElementById("pokemonSprite");
  const commonNameEl = document.getElementById("commonName");
  const speciesNameEl = document.getElementById("speciesName");
  const statusTagEl = document.getElementById("statusTag");
  const descriptionEl = document.getElementById("description");
  const galleryContainer = document.getElementById("galleryContainer");

  // --- 4. Event Listeners ---
  startButton.addEventListener("click", startCamera);
  takePicButton.addEventListener("click", takePicture);
  uploadInput.addEventListener("change", handleFileUpload);

  // --- 5. Camera + Upload ---
  async function startCamera() {
    startButton.classList.add("hidden");
    uploadInput.parentElement.classList.add("hidden");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = stream;
      cameraView.classList.remove("hidden");
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Check HTTPS or permissions.");
      startButton.classList.remove("hidden");
      uploadInput.parentElement.classList.remove("hidden");
    }
  }

  function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    video.srcObject.getTracks().forEach((t) => t.stop());
    cameraView.classList.add("hidden");
    startButton.classList.remove("hidden");
    uploadInput.parentElement.classList.remove("hidden");

    identifyImage(imageData);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => identifyImage(e.target.result);
    reader.readAsDataURL(file);
  }

  // --- 6. Identify Image via Gemini ---
  async function identifyImage(imageDataBase64) {
    loader.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    previewImage.src = imageDataBase64;

    try {
      const aiResponse = await callGeminiAPI(imageDataBase64);
      console.log("AI Response:", aiResponse);
      displayResults(aiResponse);
      saveToGallery(aiResponse);
    } catch (err) {
      console.error("Identify error:", err);
      alert("Error identifying image. Check console for details.");
    } finally {
      loader.classList.add("hidden");
    }
  }

  async function callGeminiAPI(imageBase64) {
    const prompt = `You are an expert biologist and ecologist for State College, Pennsylvania.
        1. Identify the primary species in this image.
        2. Determine if this species is Native, Invasive, or Endangered in Pennsylvania. If none of those, label it 'Common'.
        3. Provide a 1-2 sentence description explaining its role or impact in this local ecosystem.`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        imageBase64: imageBase64.split(",")[1], // send pure base64
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API request failed");

    return data;
  }

  // --- 7. Display Results ---
  function displayResults(data) {
    loader.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    const nameKey = (data.common_name || "unknown").toLowerCase();
    const spriteURL = spriteDatabase[nameKey] || defaultSprite;

    pokemonSprite.src = spriteURL;
    commonNameEl.textContent = data.common_name || "Unknown Species";
    speciesNameEl.textContent = data.species_name || "";
    descriptionEl.textContent = data.description || "";
    statusTagEl.textContent = data.status || "";

    // set CSS class for status color
    statusTagEl.className = "status-" + (data.status || "unknown").toLowerCase();
  }

  // --- 8. Gallery (LocalStorage) ---
  function saveToGallery(data) {
    const nameKey = (data.common_name || "unknown").toLowerCase();
    const spriteURL = spriteDatabase[nameKey] || defaultSprite;

    let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];

    gallery.push({
      name: data.common_name || "Unknown",
      spriteUrl: spriteURL,
      date: new Date().toISOString(),
    });

    localStorage.setItem("ecoDexGallery", JSON.stringify(gallery));
    loadGallery();
  }

  function loadGallery() {
    let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];
    galleryContainer.innerHTML = "";

    gallery.forEach((item) => {
      const div = document.createElement("div");
      div.className = "gallery-item";

      const img = document.createElement("img");
      img.src = item.spriteUrl;
      img.alt = item.name;

      const p = document.createElement("p");
      p.textContent = item.name;

      div.appendChild(img);
      div.appendChild(p);
      galleryContainer.appendChild(div);
    });
  }

  // Load existing sightings on startup
  loadGallery();
});
