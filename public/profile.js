document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("backButtonProfile");
  
    // pressed-state behavior (reuse function if needed)
    function setupImageButtonPressState(button) {
      const img = button?.querySelector('img');
      if (!img) return;
  
      const defaultSrc = img.dataset.defaultSrc || img.getAttribute('src');
      const pressedSrc = img.dataset.pressedSrc || defaultSrc;
  
      const setPressed = () => { img.src = pressedSrc; };
      const setDefault = () => { img.src = defaultSrc; };
  
      button.addEventListener('mousedown', setPressed);
      button.addEventListener('mouseup', setDefault);
      button.addEventListener('mouseleave', setDefault);
      button.addEventListener('touchstart', setPressed, { passive: true });
      button.addEventListener('touchend', setDefault);
      button.addEventListener('touchcancel', setDefault);

        // --- Hover events (added) ---
      button.addEventListener('mouseenter', setPressed);
      button.addEventListener('mouseleave', setDefault);
    }
  
    setupImageButtonPressState(backButton);
  
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  });
  