const pickColorBtn = document.getElementById("pick-color");
const resultColor = document.getElementById("color-display");
const resultElement = document.getElementById("color-code-display");
const formatSelector = document.getElementById("code-type-select");

let lastPickedColor = null; // Store the last picked color

// Format and show color based on current selected format
function updateDisplayedColor(hex) {
  if (!hex) return;

  let formattedColor;
  if (formatSelector.value === "hex") {
    formattedColor = hex;
  } else if (formatSelector.value === "rgb") {
    formattedColor = hexToRgb(hex);
  } else if (formatSelector.value === "hsl") {
    formattedColor = hexToHsl(hex);
  }

  resultElement.textContent = formattedColor;
}

// Listen for dropdown changes
formatSelector.addEventListener("change", () => {
  updateDisplayedColor(lastPickedColor);
});

// Pick color
pickColorBtn.addEventListener("click", async () => {
  if (!window.EyeDropper) {
    alert("Your browser doesn't support the EyeDropper API");
    return;
  }

  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open();
    lastPickedColor = result.sRGBHex;
    resultColor.style.backgroundColor = lastPickedColor;
    updateDisplayedColor(lastPickedColor);
  } catch (err) {
    console.error("Color pick cancelled or failed", err);
  }
});
const copyButton = document.querySelector(".copy-code");

copyButton.addEventListener("click", () => {
  const colorText = resultElement.textContent;
  if (!colorText) {
    alert("No color to copy!");
    return;
  }

  navigator.clipboard.writeText(colorText)
    .then(() => {
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1500);
    })
    .catch(err => {
      console.error("Copy failed", err);
      alert("Failed to copy the color code.");
    });
});

// Convert HEX to RGB
function hexToRgb(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// Convert HEX to HSL
function hexToHsl(hex) {
  let r = parseInt(hex.substr(1, 2), 16) / 255;
  let g = parseInt(hex.substr(3, 2), 16) / 255;
  let b = parseInt(hex.substr(5, 2), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}
