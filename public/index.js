document.addEventListener("DOMContentLoaded", () => {
  // --- Prompt for location immediately when site loads (no popup message) ---
  requestUserLocation(false); // false = silent mode on load

  // --- Element references ---
  const startButton = document.getElementById("startCameraButton");
  const uploadInput = document.getElementById("imageUploader");
  const viewGalleryButton = document.getElementById("viewGalleryButton");
  const updateLocationButton = document.getElementById("updateLocationButton");
  const cameraView = document.getElementById("cameraView");
  const video = document.getElementById("videoFeed");
  const takePicButton = document.getElementById("takePictureButton");
  const canvas = document.getElementById("imageCanvas");

  // --- Event listeners ---
  startButton.addEventListener("click", startCamera);
  takePicButton.addEventListener("click", takePicture);
  uploadInput.addEventListener("change", handleFileUpload);
  viewGalleryButton.addEventListener("click", () => {
    window.location.href = "gallery.html";
  });
  updateLocationButton.addEventListener("click", () => requestUserLocation(true)); // true = show alert

  uploadButton.addEventListener("click", () => {
    uploadInput.click();
  });

  // --- Camera & Upload Functions ---
// --- Start Camera ---
async function startCamera() {
  // Hide only the location button
  document.getElementById("updateLocationButton").classList.add("hidden");

  startButton.classList.add("hidden");
  uploadInput.parentElement.classList.add("hidden");
  viewGalleryButton.classList.add("hidden");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
    cameraView.classList.remove("hidden");
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Could not access camera. Check permissions.");

    // Re-show everything if camera fails
    startButton.classList.remove("hidden");
    uploadInput.parentElement.classList.remove("hidden");
    viewGalleryButton.classList.remove("hidden");
    document.getElementById("updateLocationButton").classList.remove("hidden");
  }
}

// --- Stop Camera View ---
function stopCameraView() {
  cameraView.classList.add("hidden");

  startButton.classList.remove("hidden");
  uploadInput.parentElement.classList.remove("hidden");
  viewGalleryButton.classList.remove("hidden");

  // Re-show location button when camera closes
  document.getElementById("updateLocationButton").classList.remove("hidden");
}



  function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataBase64 = canvas.toDataURL("image/jpeg");

    // Stop camera
    video.srcObject?.getTracks().forEach((track) => track.stop());
    cameraView.classList.add("hidden");

    // Save photo to localStorage and redirect
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

  // --- Location request logic (used on load + button click) ---
  function requestUserLocation(showAlert = false) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          localStorage.setItem(
            "userLocation",
            JSON.stringify({
              lat: latitude,
              lon: longitude,
              accuracy: Math.round(accuracy ?? 0),
            })
          );
          console.log("Location stored:", latitude, longitude);
          if (showAlert) alert("Location updated!");
        },
        (err) => {
          console.warn("Location permission denied or unavailable:", err);
          if (showAlert) alert("Could not update location. Please enable permissions.");
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
      );
    } else {
      console.warn("Geolocation not supported in this browser.");
      if (showAlert) alert("Geolocation not supported in this browser.");
    }
  }

  // --- Swap image-button sources on press for visual feedback ---
  function setupImageButtonPressState(button) {
  const img = button?.querySelector('img');
  if (!img) return;

  const defaultSrc = img.dataset.defaultSrc || img.getAttribute('src');
  const pressedSrc = img.dataset.pressedSrc || defaultSrc;

  const setPressed = () => { img.src = pressedSrc; };
  const setDefault = () => { img.src = defaultSrc; };

  // --- Mouse/touch press events ---
  button.addEventListener('mousedown', setPressed);
  button.addEventListener('touchstart', setPressed, { passive: true });
  button.addEventListener('mouseup', setDefault);
  button.addEventListener('mouseleave', setDefault);
  button.addEventListener('touchend', setDefault);
  button.addEventListener('touchcancel', setDefault);

  // --- Keyboard press events ---
  button.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') setPressed();
  });
  button.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') setDefault();
  });

  // --- Hover events (added) ---
  button.addEventListener('mouseenter', setPressed);
  button.addEventListener('mouseleave', setDefault);
}


  // Initialize pressed-state behavior for image buttons
  setupImageButtonPressState(viewGalleryButton);
  setupImageButtonPressState(updateLocationButton);
  setupImageButtonPressState(startButton);
  setupImageButtonPressState(uploadButton);
});
  
