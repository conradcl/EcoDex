// Wait for the HTML document to be fully loaded before running code
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SET UP YOUR API KEY AND DEMO DATA ---

  // WARNING: PASTE YOUR API KEY HERE.
  // This is NOT secure for a real website, but is OK for a hackathon demo.
  // DO NOT share this key publicly.

  // Your "pre-generated" sprite database
  // Add more species and their aliases
  const spriteDatabase = {
    cardinal: "img/sprites/cardinal.png",
    "northern cardinal": "img/sprites/cardinal.png",
    "white-tailed deer": "img/sprites/deer.png",
    "spotted lanternfly": "img/sprites/lanternfly.png",
    "gray squirrel": "img/sprites/squirrel.png",
    "eastern gray squirrel": "img/sprites/squirrel.png",
    squirrel: "img/sprites/squirrel.png",
    "blue jay": "img/sprites/bluejay.png",
    robin: "img/sprites/robin.png",
    "american robin": "img/sprites/robin.png",
    // ...etc.
  };

  // A default sprite for anything not in our DB
  const defaultSprite = "img/sprites/question-mark.png";

  // --- 2. GET ALL YOUR HTML ELEMENTS ---

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

  // --- 3. ADD EVENT LISTENERS (THE "CONTROLS") ---

  startButton.addEventListener("click", startCamera);
  takePicButton.addEventListener("click", takePicture);
  uploadInput.addEventListener("change", handleFileUpload);

  // --- 4. CORE CAMERA & UPLOAD FUNCTIONS ---

  async function startCamera() {
    // Hide controls and show video
    startButton.classList.add("hidden");
    uploadInput.parentElement.classList.add("hidden");

    try {
      // Ask for the rear camera on mobile
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // Show the video feed and "take picture" button
      video.srcObject = stream;
      cameraView.classList.remove("hidden");
    } catch (err) {
      console.error("Error accessing the camera: ", err);
      alert(
        "Could not access the camera. Make sure you are on localhost or HTTPS and gave permission."
      );
      // Show controls again if camera fails
      startButton.classList.remove("hidden");
      uploadInput.parentElement.classList.remove("hidden");
    }
  }

  function takePicture() {
    // 1. Set the canvas size to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 2. Draw the current video frame onto the canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3. Get the image data from the canvas as a base64 string
    // 'image/jpeg' is smaller and faster than 'image/png'
    const imageDataBase64 = canvas.toDataURL("image/jpeg");

    // 4. Stop the camera and hide video feed
    video.srcObject.getTracks().forEach((track) => track.stop());
    cameraView.classList.add("hidden");
    startButton.classList.remove("hidden");
    uploadInput.parentElement.classList.remove("hidden");

    // 5. Identify the image!
    identifyImage(imageDataBase64);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataBase64 = e.target.result;
      // Identify the image!
      identifyImage(imageDataBase64);
    };
    reader.readAsDataURL(file);
  }

  // --- 5. THE "AI BRAINS" AND DISPLAY FUNCTIONS ---

  // This is the main function that coordinates everything
  async function identifyImage(imageDataBase64) {
    // Show the loader and hide old results
    loader.classList.remove("hidden");
    resultsSection.classList.add("hidden");

    // Set the preview image so the user sees what they submitted
    previewImage.src = imageDataBase64;

    try {
      // 1. Call the Gemini API
      const aiResponse = await callGeminiAPI(imageDataBase64);
      console.log("AI Response:", aiResponse);

      // 2. Display the results
      displayResults(aiResponse);

      // 3. Save to gallery
      saveToGallery(aiResponse);
    } catch (error) {
      console.error("Error identifying image:", error);
      alert(
        "Error identifying image. Check your API key or the browser console (F12)."
      );
      loader.classList.add("hidden");
    }
  }

  async function callGeminiAPI(imageBase64) {
    // We must strip the "data:image/jpeg;base64," part from the string
    const pureBase64 = imageBase64.split(",")[1];

    // This is your "magic prompt" - I've set it to your location.
    const prompt = `
        You are an expert biologist and ecologist for State College, Pennsylvania.
        1. Identify the primary species in this image.
        2. Determine if this species is Native, Invasive, or Endangered in Pennsylvania. If none of those, label it 'Common'.
        3. Provide a 1-2 sentence description explaining its role or impact in this local ecosystem.
        
        Respond ONLY with a valid JSON object. Do not include \`\`\`json or any other text.
        The JSON must follow this exact structure:
        {"species_name": "Scientific Name", "common_name": "Common Name", "status": "Native/Invasive/Endangered/Common", "description": "Your 1-2 sentence description."}
      `;

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: pureBase64,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Read the error message from the API
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(
        `API request failed with status ${response.status}: ${errorData.error.message}`
      );
    }

    const data = await response.json();

    // The response is complex, we need to dig for the JSON text
    // This line is very important!
    const jsonText = data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
  }

  function displayResults(data) {
    // Get the sprite from our "database"
    const nameKey = data.common_name.toLowerCase();
    const spriteURL = spriteDatabase[nameKey] || defaultSprite;

    // Populate the HTML
    pokemonSprite.src = spriteURL;
    commonNameEl.textContent = data.common_name;
    speciesNameEl.textContent = data.species_name;
    descriptionEl.textContent = data.description;
    statusTagEl.textContent = data.status;

    // Set the color for the status tag
    statusTagEl.className = "status-" + data.status.toLowerCase();

    // Hide loader and show results
    loader.classList.add("hidden");
    resultsSection.classList.remove("hidden");
  }

  // --- 6. GALLERY FUNCTIONS (using localStorage) ---

  function saveToGallery(data) {
    // Get the sprite URL again
    const nameKey = data.common_name.toLowerCase();
    const spriteURL = spriteDatabase[nameKey] || defaultSprite;

    // 1. Get the existing gallery (or an empty list)
    let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];

    // 2. Add the new sighting
    const newSighting = {
      name: data.common_name,
      spriteUrl: spriteURL,
      date: new Date().toISOString(),
    };
    gallery.push(newSighting);

    // 3. Save the *updated* list back to localStorage
    localStorage.setItem("ecoDexGallery", JSON.stringify(gallery));

    // 4. Re-draw the gallery on the page
    loadGallery();
  }

  function loadGallery() {
    let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];

    // Clear the current gallery display
    galleryContainer.innerHTML = "";

    // Loop through sightings and add them to the page
    gallery.forEach((sighting) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const img = document.createElement("img");
      img.src = sighting.spriteUrl;
      img.alt = sighting.name;

      const p = document.createElement("p");
      p.textContent = sighting.name;

      item.appendChild(img);
      item.appendChild(p);
      galleryContainer.appendChild(item);
    });
  }

  // --- 7. INITIALIZE THE APP ---

  // Load the gallery as soon as the page loads
  loadGallery();
});