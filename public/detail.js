document.addEventListener("DOMContentLoaded", () => {
    // Get data saved by gallery.js
    const sightingDataJSON = sessionStorage.getItem("selectedSighting");

    if (!sightingDataJSON) {
        alert("No sighting data found. Returning to gallery.");
        window.location.href = "gallery.html";
        return;
    }

    const sighting = JSON.parse(sightingDataJSON);

    // Get elements from detail.html
    const userImageEl = document.getElementById("userImage");
    const commonNameEl = document.getElementById("commonName");
    const speciesNameEl = document.getElementById("speciesName");
    const statusTagEl = document.getElementById("statusTag");
    const descriptionEl = document.getElementById("description");
    const sightingDateEl = document.getElementById("sightingDate");
    // const sightingLocationEl = document.getElementById("sightingLocation"); // If you add location

    // --- Populate the page ---
    // Use the user's original image if available
    userImageEl.src = sighting.userImage || 'img/placeholder.png'; // Provide a fallback if needed
    commonNameEl.textContent = sighting.name || "Unknown";

    // Data might not always include these details if parsing failed originally
    speciesNameEl.textContent = sighting.species_name || "";
    statusTagEl.textContent = sighting.status || "N/A";
    descriptionEl.textContent = sighting.description || "No description saved.";
    sightingDateEl.textContent = sighting.date ? new Date(sighting.date).toLocaleString() : "Unknown date";

    // Set status tag style
    statusTagEl.className = "status-" + (sighting.status || "unknown").toLowerCase();

    // Optional: Display location if you saved it
    // if (sighting.latitude && sighting.longitude) {
    //     sightingLocationEl.textContent = `Lat: ${sighting.latitude.toFixed(4)}, Lon: ${sighting.longitude.toFixed(4)}`;
    // } else {
    //     sightingLocationEl.textContent = "Not recorded";
    // }

    // Clean up sessionStorage after loading
    // sessionStorage.removeItem("selectedSighting"); // Optional: remove if you don't need it anymore
});