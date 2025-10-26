document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("galleryContainer");
  const backButton = document.getElementById("backButton");

  function loadGallery() {
    let gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];
    galleryContainer.innerHTML = ""; // Clear current gallery

    if (gallery.length === 0) {
        galleryContainer.innerHTML = "<p>No sightings saved yet!</p>";
        return;
    }

    // Sort by date, newest first
    gallery.sort((a, b) => new Date(b.date) - new Date(a.date));

    gallery.forEach((sighting) => {
      const item = document.createElement("div");
      item.className = "gallery-item"; // Reuse or create a new style

      // Display the user's original image
      if (sighting.userImage) {
        const img = document.createElement("img");
        img.src = sighting.userImage; // Use the saved base64 image data
        img.alt = sighting.name;
        img.style.width = '100px'; // Set a size for consistency
        img.style.height = '100px';
        img.style.objectFit = 'cover'; // Make images fit nicely
        item.appendChild(img);
      }

      const infoDiv = document.createElement("div");
      infoDiv.className = "gallery-info";

      const nameP = document.createElement("p");
      nameP.textContent = sighting.name;
      nameP.style.fontWeight = 'bold';

      const dateP = document.createElement("p");
      dateP.textContent = new Date(sighting.date).toLocaleDateString(); // Format date nicely
      dateP.style.fontSize = '0.8em';
      dateP.style.color = '#555';

      infoDiv.appendChild(nameP);
      infoDiv.appendChild(dateP);
      item.appendChild(infoDiv);

      galleryContainer.appendChild(item);
    });
  }

  // Back button functionality
  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Load the gallery when the page opens
  loadGallery();
});