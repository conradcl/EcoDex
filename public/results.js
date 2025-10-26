document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "/api/gemini"; // Define API URL here if used directly, though it seems redundant now

  // Get necessary elements
  const loader = document.getElementById("loader");
  const resultsSection = document.getElementById("resultsSection");
  const previewImage = document.getElementById("previewImage");
  const commonNameEl = document.getElementById("commonName");
  const speciesNameEl = document.getElementById("speciesName");
  const statusTagEl = document.getElementById("statusTag");
  const descriptionEl = document.getElementById("description");
  const backButton = document.getElementById("backButton");

  // Get image data from localStorage (as set by index.js)
  const imageData = localStorage.getItem("pendingImage");
  if (!imageData) {
    alert("No image data found. Returning home.");
    window.location.href = "index.html"; // Redirect to home if no image
    return;
  }

  previewImage.src = imageData; // Show the user's image

  try {
    console.log("Sending image to server for identification...");
    // Send image data to your server's API endpoint
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // server.js expects imageBase64, not the full data URL header
        imageBase64: imageData.split(",")[1],
        // The prompt is now defined within server.js
      }),
    });

    if (!response.ok) {
        // Try to get error message from server response
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
            const errData = await response.json();
            errorMsg = errData.error || errorMsg;
        } catch (e) {
            // Ignore if response wasn't JSON
        }
        throw new Error(`Server Error: ${errorMsg}`);
    }

    const data = await response.json();
    console.log("Received data from server:", data);
    displayResults(data);
    saveToGallery(data); // Save results (without sprites)

  } catch (err) {
    alert("Error identifying image. See console for details.");
    console.error("Identification Error:", err);
    loader.innerHTML = "<p>Error identifying image. Please try again.</p>"; // Update loader text
    resultsSection.classList.add("hidden"); // Ensure results are hidden on error
  }

  // Display Gemini results (simplified, no sprites)
  function displayResults(data) {
    loader.classList.add("hidden"); // Hide loader
    resultsSection.classList.remove("hidden"); // Show results

    commonNameEl.textContent = data.common_name || "Unknown Species";
    speciesNameEl.textContent = data.species_name || "";
    statusTagEl.textContent = data.status || "N/A";
    descriptionEl.textContent = data.description || "No description available.";

    // Update status tag class for styling
    statusTagEl.className = "status-" + (data.status || "unknown").toLowerCase();
  }

  // Save entry (without spriteUrl)
  function saveToGallery(data) {
     // Basic check if data seems valid
     if (!data || !data.common_name) {
      console.error("Invalid data received, cannot save to gallery:", data);
      return;
    }
    const imageData = localStorage.getItem("pendingImage"); // Get user image

    let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];
    gallery.push({
      name: data.common_name || "Unknown",
      userImage: imageData, // Save the user's original image instead of a sprite
      date: new Date().toISOString(),
      // Removed spriteUrl, lat, lon for simplicity
    });
    localStorage.setItem("ecoDexGallery", JSON.stringify(gallery));
    console.log("Saved to gallery:", gallery[gallery.length-1].name);
  }

  // Back button → Home
  backButton.addEventListener("click", () => {
    localStorage.removeItem("pendingImage"); // Clean up temp image data
    window.location.href = "index.html";
  });
});