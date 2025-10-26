document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "/api/gemini";

  const loader = document.getElementById("loader");
  const resultsSection = document.getElementById("resultsSection");
  const previewImage = document.getElementById("previewImage");
  const pokemonSprite = document.getElementById("pokemonSprite");
  const commonNameEl = document.getElementById("commonName");
  const speciesNameEl = document.getElementById("speciesName");
  const statusTagEl = document.getElementById("statusTag");
  const descriptionEl = document.getElementById("description");
  const backButton = document.getElementById("backButton");

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

  const imageData = localStorage.getItem("pendingImage");
  if (!imageData) {
    alert("No image data found. Returning home.");
    window.location.href = "index.html";
    return;
  }

  previewImage.src = imageData;

  try {
    const prompt = `You are an expert biologist and ecologist for State College, Pennsylvania.
      1. Identify the primary species in this image.
      2. Determine if this species is Native, Invasive, or Endangered in Pennsylvania. If none of those, label it 'Common'.
      3. Provide a 1-2 sentence description explaining its role or impact in this local ecosystem.`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        imageBase64: imageData.split(",")[1],
      }),
    });

    const data = await response.json();
    displayResults(data);
    saveToGalleryWithLocation(data);
  } catch (err) {
    alert("Error identifying image. Check console.");
    console.error(err);
  }

  // Display Gemini results
  function displayResults(data) {
    loader.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    const nameKey = (data.common_name || "unknown").toLowerCase();
    const spriteURL = spriteDatabase[nameKey] || defaultSprite;

    pokemonSprite.src = spriteURL;
    commonNameEl.textContent = data.common_name || "Unknown Species";
    speciesNameEl.textContent = data.species_name || "";
    statusTagEl.textContent = data.status || "";
    descriptionEl.textContent = data.description || "";
    statusTagEl.className = "status-" + (data.status || "unknown").toLowerCase();
  }

  // Save entry including geolocation
  function saveToGalleryWithLocation(data) {
    const nameKey = (data.common_name || "unknown").toLowerCase();
    const spriteURL = spriteDatabase[nameKey] || defaultSprite;
    const imageData = localStorage.getItem("pendingImage");

    // Request geolocation
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        saveEntry(data, spriteURL, imageData, latitude, longitude);
      },
      (err) => {
        console.warn("⚠️ Location not available:", err.message);
        saveEntry(data, spriteURL, imageData, null, null); // save anyway
      }
    );

    // Helper: store entry in localStorage
    function saveEntry(data, spriteURL, imageData, lat, lon) {
      let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];

      gallery.push({
        name: data.common_name || "Unknown",
        spriteUrl: spriteURL,
        userImage: imageData,
        latitude: lat,
        longitude: lon,
        date: new Date().toISOString(),
      });

      localStorage.setItem("ecoDexGallery", JSON.stringify(gallery));
    }
  }

  // Back button → Home
  backButton.addEventListener("click", () => {
    localStorage.removeItem("pendingImage");
    window.location.href = "index.html";
  });
});
