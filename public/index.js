// public/index.js
document.addEventListener("DOMContentLoaded", () => {
    // --- Prompt for location immediately when site loads (no popup message) ---
    requestUserLocation(false); // false = silent mode on load

    // --- Element references ---
    const startCameraButton = document.getElementById("startCameraButton");
    const uploadTriggerButton = document.getElementById("uploadTriggerButton"); // Get the button
    const uploadInput = document.getElementById("imageUploader");
    const viewGalleryButton = document.getElementById("viewGalleryButton");
    const updateLocationButton = document.getElementById("updateLocationButton");
    const cameraView = document.getElementById("cameraView");
    const video = document.getElementById("videoFeed");
    const takePicButton = document.getElementById("takePictureButton");
    const canvas = document.getElementById("imageCanvas");

    // --- Event listeners ---
    if (startCameraButton) {
        startCameraButton.addEventListener("click", startCamera);
    } else { console.error("Start Camera button not found!"); }

    if (takePicButton) {
        takePicButton.addEventListener("click", takePicture);
    }

    if (uploadTriggerButton && uploadInput) {
        // Make the Upload IMAGE BUTTON trigger the hidden file input
        uploadTriggerButton.addEventListener("click", () => {
            uploadInput.click();
        });
        // Handle the file selection from the hidden input
        uploadInput.addEventListener("change", handleFileUpload);
    } else { console.error("Upload Trigger button or input not found!"); }

    if (viewGalleryButton) {
        viewGalleryButton.addEventListener("click", () => {
            window.location.href = "gallery.html";
        });
    } else { console.error("View Gallery button not found!"); }

    if (updateLocationButton) {
        updateLocationButton.addEventListener("click", () => requestUserLocation(true)); // true = show alert
    } else { console.error("Update Location button not found!"); }


    // --- Camera & Upload Functions (Unchanged) ---
    async function startCamera() {
        // Hide controls when camera starts
        document.querySelectorAll('.controls-grid .image-button').forEach(btn => btn.classList.add('hidden'));
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            cameraView.classList.remove("hidden");
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Check permissions.");
            // Show controls again if camera fails
            document.querySelectorAll('.controls-grid .image-button').forEach(btn => btn.classList.remove('hidden'));
        }
    }

    function takePicture() {
        if (!video.videoWidth || !video.videoHeight) { return; }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataBase64 = canvas.toDataURL("image/jpeg");
        video.srcObject?.getTracks().forEach((track) => track.stop());
        cameraView.classList.add("hidden");
        document.querySelectorAll('.controls-grid .image-button').forEach(btn => btn.classList.remove('hidden'));
        localStorage.setItem("pendingImage", imageDataBase64);
        window.location.href = "results.html";
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataBase64 = e.target.result;
            localStorage.setItem("pendingImage", imageDataBase64);
            window.location.href = "results.html";
        };
        reader.readAsDataURL(file);
    }

    // --- Location request logic (Unchanged) ---
    function requestUserLocation(showAlert = false) {
        // ... (Keep existing location logic) ...
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords;
                    localStorage.setItem("userLocation", JSON.stringify({ lat: latitude, lon: longitude, accuracy: Math.round(accuracy ?? 0) }));
                    console.log("📍 Location stored:", latitude, longitude);
                    if (showAlert) alert("✅ Location updated!");
                },
                (err) => {
                    console.warn("⚠️ Location permission denied or unavailable:", err);
                    if (showAlert) alert("⚠️ Could not update location. Please enable permissions.");
                },
                { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
            );
        } else {
            console.warn("✖️ Geolocation not supported.");
            if (showAlert) alert("✖️ Geolocation not supported.");
        }
    }

    // --- Swap image-button sources on press/hover (Unchanged) ---
    function setupImageButtonPressState(button) {
        // ... (Keep existing image swap logic) ...
        const img = button?.querySelector('img');
        if (!img) return;
        const defaultSrc = img.dataset.defaultSrc || img.getAttribute('src');
        const pressedSrc = img.dataset.pressedSrc || defaultSrc;
        const setPressed = () => { img.src = pressedSrc; };
        const setDefault = () => { img.src = defaultSrc; };
        button.addEventListener('mousedown', setPressed);
        button.addEventListener('touchstart', setPressed, { passive: true });
        button.addEventListener('mouseup', setDefault);
        button.addEventListener('mouseleave', setDefault);
        button.addEventListener('touchend', setDefault);
        button.addEventListener('touchcancel', setDefault);
        button.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') setPressed(); });
        button.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') setDefault(); });
        button.addEventListener('mouseenter', setPressed);
        // mouseleave handled above
    }


    // --- Initialize pressed-state behavior for ALL image buttons ---
    if (startCameraButton) setupImageButtonPressState(startCameraButton); // ADDED
    if (uploadTriggerButton) setupImageButtonPressState(uploadTriggerButton); // ADDED
    if (viewGalleryButton) setupImageButtonPressState(viewGalleryButton);
    if (updateLocationButton) setupImageButtonPressState(updateLocationButton);
});