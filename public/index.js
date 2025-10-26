document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const startButton = document.getElementById("startCameraButton");
  const uploadInput = document.getElementById("imageUploader");
  const viewGalleryButton = document.getElementById("viewGalleryButton");
  const cameraView = document.getElementById("cameraView");
  const video = document.getElementById("videoFeed");
  const takePicButton = document.getElementById("takePictureButton");
  const canvas = document.getElementById("imageCanvas");

  // Event listeners
  startButton.addEventListener("click", startCamera);
  takePicButton.addEventListener("click", takePicture);
  uploadInput.addEventListener("change", handleFileUpload);
  viewGalleryButton.addEventListener("click", () => {
    window.location.href = "gallery.html"; // Go to gallery page
  });

  // --- Camera & Upload Functions ---
  async function startCamera() {
    startButton.classList.add("hidden");
    uploadInput.parentElement.classList.add("hidden"); // Hide entire controls div might be better
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
      // Show controls again
      startButton.classList.remove("hidden");
      uploadInput.parentElement.classList.remove("hidden");
      viewGalleryButton.classList.remove("hidden");
    }
  }

  function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataBase64 = canvas.toDataURL("image/jpeg");

    // Stop camera and hide view
    video.srcObject?.getTracks().forEach((track) => track.stop()); // Optional chaining for safety
    cameraView.classList.add("hidden");

    // Pass image data to results page via localStorage
    localStorage.setItem("pendingImage", imageDataBase64);
    window.location.href = "results.html"; // Redirect to results page
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataBase64 = e.target.result;
      // Pass image data to results page via localStorage
      localStorage.setItem("pendingImage", imageDataBase64);
      window.location.href = "results.html"; // Redirect to results page
    };
    reader.readAsDataURL(file);
  }
});