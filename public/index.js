document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startCameraButton");
  const uploadInput = document.getElementById("imageUploader");
  const cameraView = document.getElementById("cameraView");
  const video = document.getElementById("videoFeed");
  const takePicButton = document.getElementById("takePictureButton");
  const canvas = document.getElementById("imageCanvas");
  const galleryButton = document.getElementById("viewGalleryButton");

  startButton.addEventListener("click", startCamera);
  takePicButton.addEventListener("click", takePicture);
  uploadInput.addEventListener("change", handleFileUpload);
  galleryButton.addEventListener("click", () => (window.location.href = "gallery.html"));

  async function startCamera() {
    startButton.classList.add("hidden");
    uploadInput.parentElement.classList.add("hidden");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = stream;
      cameraView.classList.remove("hidden");
    } catch (err) {
      alert("Could not access camera. Please allow permission or use HTTPS.");
      startButton.classList.remove("hidden");
      uploadInput.parentElement.classList.remove("hidden");
    }
  }

  function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    video.srcObject?.getTracks().forEach((t) => t.stop());

    localStorage.setItem("pendingImage", imageData);
    window.location.href = "results.html";
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      localStorage.setItem("pendingImage", event.target.result);
      window.location.href = "results.html";
    };
    reader.readAsDataURL(file);
  }
});
