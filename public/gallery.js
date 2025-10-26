document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");
    const backButtonGallery = document.getElementById("backButtonGallery");

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

    // --- Set up back button ---
    if (backButtonGallery) {
        backButtonGallery.addEventListener("click", () => {
            window.location.href = "index.html";
        });
        if (typeof setupImageButtonPressState === "function") {
            setupImageButtonPressState(backButtonGallery);
        }
    } else {
        console.error("Back button not found!");
    }

    // --- Load gallery ---
    function loadGallery() {
        let gallery = [];
        try {
            const galleryJSON = localStorage.getItem("ecoDexGallery");
            if (galleryJSON) {
                gallery = JSON.parse(galleryJSON);
            }
        } catch (e) {
            console.error("Error parsing gallery data from localStorage:", e);
            gallery = [];
        }

        galleryContainer.innerHTML = "";

        if (!Array.isArray(gallery) || gallery.length === 0) {
            galleryContainer.innerHTML = "<p></p>";
            return;
        }

        gallery.sort((a, b) => new Date(b.date) - new Date(a.date));

        gallery.forEach((sighting, index) => {
            if (!sighting || typeof sighting !== 'object') return;

            const item = document.createElement("div");
            item.className = "gallery-item clickable";

            if (sighting.userImage) {
                const img = document.createElement("img");
                img.src = sighting.userImage;
                img.alt = sighting.name || "Sighting image";
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '4px';
                item.appendChild(img);
            }

            const infoDiv = document.createElement("div");
            infoDiv.className = "gallery-info";

            const nameP = document.createElement("p");
            nameP.textContent = sighting.name || "Unknown";
            nameP.style.fontWeight = 'bold';

            const dateP = document.createElement("p");
            if (sighting.date) {
                try {
                    dateP.textContent = new Date(sighting.date).toLocaleDateString();
                } catch {
                    dateP.textContent = "Invalid date";
                }
            } else {
                dateP.textContent = "Date unknown";
            }
            dateP.style.fontSize = '0.8em';
            dateP.style.color = '#555';

            infoDiv.appendChild(nameP);
            infoDiv.appendChild(dateP);
            item.appendChild(infoDiv);

            item.addEventListener('click', () => {
                const fullSightingData = gallery[index];
                if (fullSightingData) {
                    sessionStorage.setItem("selectedSighting", JSON.stringify(fullSightingData));
                    window.location.href = "detail.html";
                } else {
                    alert("Error loading sighting details.");
                }
            });

            galleryContainer.appendChild(item);
        });
    }

    // --- Clear Gallery Button ---
    const clearButton = document.getElementById("clearGalleryButton");
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear all saved sightings?")) {
                localStorage.removeItem("ecoDexGallery");
                galleryContainer.innerHTML = "<p>Gallery cleared.</p>";
            }
        });
    }

    loadGallery();
});