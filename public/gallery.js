document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");
    const backButton = document.getElementById("backButton"); // Make sure this ID matches your gallery.html button

    function loadGallery() {
        let gallery = []; // Initialize as an empty array
        try {
            // Retrieve gallery data from localStorage
            const galleryJSON = localStorage.getItem("ecoDexGallery");
            if (galleryJSON) {
                gallery = JSON.parse(galleryJSON);
            }
        } catch (e) {
            console.error("Error parsing gallery data from localStorage:", e);
            // If parsing fails, proceed with an empty gallery
            gallery = [];
        }

        galleryContainer.innerHTML = ""; // Clear current gallery display

        // Check if gallery is actually an array and has items
        if (!Array.isArray(gallery) || gallery.length === 0) {
            galleryContainer.innerHTML = "<p>No sightings saved yet!</p>";
            return; // Exit the function if no valid gallery data
        }

        // Sort sightings by date, newest first
        gallery.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Create HTML elements for each sighting
        gallery.forEach((sighting, index) => {
             // Basic validation for each sighting object
             if (!sighting || typeof sighting !== 'object') {
                 console.warn(`Skipping invalid gallery item at index ${index}:`, sighting);
                 return; // Skip this iteration if the item is invalid
             }

            const item = document.createElement("div");
            item.className = "gallery-item clickable"; // Add clickable class

            // Display the user's original captured image
            if (sighting.userImage) {
                const img = document.createElement("img");
                img.src = sighting.userImage;
                img.alt = sighting.name || "Sighting image"; // Use name or default alt text
                // Apply styling for consistency
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                item.appendChild(img);
            }

            // Container for text information
            const infoDiv = document.createElement("div");
            infoDiv.className = "gallery-info";

            // Sighting name
            const nameP = document.createElement("p");
            nameP.textContent = sighting.name || "Unknown"; // Default to "Unknown" if name is missing
            nameP.style.fontWeight = 'bold';

            // Sighting date - *** Check around here (near line 50) ***
            const dateP = document.createElement("p");
            if (sighting.date) { // Check if date exists
               try {
                   // Format the date nicely (e.g., "10/25/2025")
                  dateP.textContent = new Date(sighting.date).toLocaleDateString();
               } catch (dateError) { // Handle potential invalid date strings
                   console.warn(`Invalid date format for sighting '${sighting.name}':`, sighting.date);
                   dateP.textContent = "Invalid date";
               }
            } else {
                 dateP.textContent = "Date unknown"; // Fallback if date is missing
            }
            // Apply styling to the date
            dateP.style.fontSize = '0.8em';
            dateP.style.color = '#555';
            // *** End check around line 50 ***

            // Add name and date to the info container
            infoDiv.appendChild(nameP);
            infoDiv.appendChild(dateP);
            // Add the info container to the main item div
            item.appendChild(infoDiv);

            // Add click listener to the entire item
            item.addEventListener('click', () => {
                console.log("Gallery item clicked:", sighting.name); // Debug log

                // Get the full data for the clicked item using its index
                const fullSightingData = gallery[index];

                if (fullSightingData) {
                    // Store data in sessionStorage for the detail page
                    sessionStorage.setItem("selectedSighting", JSON.stringify(fullSightingData));
                    // Redirect to the detail page
                    window.location.href = "detail.html";
                } else {
                    // Handle case where data might be missing (shouldn't happen with current logic)
                    console.error("Could not find sighting data for clicked item at index:", index);
                    alert("Error loading sighting details.");
                }
            }); // End of click listener

            // Add the item to the main gallery container on the page
            galleryContainer.appendChild(item);
        }); // End of forEach loop
    } // End of loadGallery function

    // Set up the back button event listener
    if (backButton) { // Check if the button element was found
        backButton.addEventListener("click", () => {
            window.location.href = "index.html"; // Go back to home page
        });
    } else {
        console.error("Back button element with ID 'backButton' not found!");
    }

    // Load the gallery when the page finishes loading
    loadGallery();
}); // End of DOMContentLoaded listener