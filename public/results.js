document.addEventListener("DOMContentLoaded", async () => {
    // Get necessary elements
    const loader = document.getElementById("loader");
    const resultsSection = document.getElementById("resultsSection");
    const previewImage = document.getElementById("previewImage");
    const commonNameEl = document.getElementById("commonName");
    const speciesNameEl = document.getElementById("speciesName");
    const statusTagEl = document.getElementById("statusTag");
    const descriptionEl = document.getElementById("description");
    const backButton = document.getElementById("backButton");

    function setupImageButtonPressState(button) {
        const img = button?.querySelector('img');
        if (!img) return;
    
        const defaultSrc = img.dataset.defaultSrc || img.src;
        const pressedSrc = img.dataset.pressedSrc || defaultSrc;
    
        const setPressed = () => { img.src = pressedSrc; };
        const setDefault = () => { img.src = defaultSrc; };
    
        button.addEventListener('mousedown', setPressed);
        button.addEventListener('touchstart', setPressed, { passive: true });
        button.addEventListener('mouseup', setDefault);
        button.addEventListener('mouseleave', setDefault);
        button.addEventListener('touchend', setDefault);
        button.addEventListener('touchcancel', setDefault);

        // --- Hover events (added) ---
        button.addEventListener('mouseenter', setPressed);
        button.addEventListener('mouseleave', setDefault);
    }

    // --- Set up back button as image-button ---
    if (backButton) {
        backButton.addEventListener("click", () => {
            localStorage.removeItem("pendingImage");
            window.location.href = "index.html";
        });
        if (typeof setupImageButtonPressState === "function") {
            setupImageButtonPressState(backButton);
        }
    } else {
        console.error("Back button not found!");
    }

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
        // Send image data and prompt to your server's API endpoint
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt:
                    "Identify the primary species in this image. Determine if this species is Native, Invasive, or Endangered in the given location. If none of those, label it 'Common'.Provide a 1-2 sentence description explaining its role or impact in this local ecosystem.",
                imageBase64: imageData.split(",")[1], // Remove data:image/jpeg;base64,
            }),
        });

        if (!response.ok) {
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
        saveToGallery(data);

    } catch (err) {
        alert("Error identifying image. See console for details.");
        console.error("Identification Error:", err);
        loader.innerHTML = "<p>Error identifying image. Please try again.</p>";
        resultsSection.classList.add("hidden");
    }

    // Display Gemini results
    function displayResults(data) {
        loader.classList.add("hidden");
        resultsSection.classList.remove("hidden");

        commonNameEl.textContent = data.common_name || "Unknown Species";
        speciesNameEl.textContent = data.species_name || "";
        statusTagEl.textContent = data.status || "N/A";
        descriptionEl.textContent = data.description || "No description available.";

        statusTagEl.className = "status-" + (data.status || "unknown").toLowerCase();
    }

    // Save entry to gallery (including species_name, status, description)
    function saveToGallery(data) {
        if (!data || !data.common_name) {
            console.error("Invalid data received, cannot save to gallery:", data);
            return;
        }
        const imageData = localStorage.getItem("pendingImage");

        let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];
        gallery.push({
            name: data.common_name || "Unknown",
            species_name: data.species_name || "",
            status: data.status || "N/A",
            description: data.description || "",
            userImage: imageData,
            date: new Date().toISOString(),
        });
        localStorage.setItem("ecoDexGallery", JSON.stringify(gallery));
        console.log("Saved to gallery:", gallery[gallery.length - 1].name);
    }
});
