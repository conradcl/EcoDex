document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("galleryContainer");
  const backButton = document.getElementById("backButton");

  // ✅ Back to Home
  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // ✅ Optional: "Clear All" for testing
  const clearButton = document.createElement("button");
  clearButton.textContent = "🗑️ Clear All Sightings";
  clearButton.style.backgroundColor = "#d32f2f";
  clearButton.style.color = "white";
  clearButton.style.marginTop = "10px";
  clearButton.style.border = "none";
  clearButton.style.padding = "8px 14px";
  clearButton.style.borderRadius = "8px";
  clearButton.style.cursor = "pointer";
  clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all sightings?")) {
      localStorage.removeItem("ecoDexGallery");
      loadGallery();
    }
  });
  document.body.insertBefore(clearButton, backButton);

  // ✅ Load and display gallery
  function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem("ecoDexGallery")) || [];
    galleryContainer.innerHTML = "";

    if (gallery.length === 0) {
      galleryContainer.innerHTML = "<p>No sightings yet.</p>";
      return;
    }

    gallery.forEach((item) => {
      const div = document.createElement("div");
      div.className = "gallery-item";

      // User photo (uploaded/taken image)
      if (item.userImage) {
        const photo = document.createElement("img");
        photo.src = item.userImage;
        photo.alt = `${item.name} photo`;
        photo.className = "user-photo";
        div.appendChild(photo);
      }

      // Sprite icon
      const sprite = document.createElement("img");
      sprite.src = item.spriteUrl;
      sprite.alt = `${item.name} sprite`;
      sprite.className = "sprite-icon";
      div.appendChild(sprite);

      // Species name
      const p = document.createElement("p");
      p.textContent = item.name;
      div.appendChild(p);

      // Timestamp
      const date = document.createElement("p");
      const formatted = new Date(item.date).toLocaleString();
      date.textContent = formatted;
      date.style.fontSize = "0.8em";
      date.style.color = "#666";
      div.appendChild(date);

      // 📍 Coordinates (if available)
      if (item.latitude && item.longitude) {
        const loc = document.createElement("p");
        loc.textContent = `📍 ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`;
        loc.style.fontSize = "0.8em";
        loc.style.color = "#555";
        div.appendChild(loc);
      }

      galleryContainer.appendChild(div);
    });
  }

  loadGallery();
});
