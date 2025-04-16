document.getElementById("pick-color").addEventListener("click", () => {
    const resultElement = document.getElementById("color-code-display");
    const resultColor = document.getElementById("color-display")
    if (!window.EyeDropper){
        resultElement.textContent = "Your browser does not support the EyeDropper API";
        return;
    }
    const eyeDropper = new EyeDropper();
    const abortController = new AbortController();
  
    eyeDropper
      .open({ signal: abortController.signal })
      .then((result) => {
        resultElement.textContent = result.sRGBHex;
        resultColor.style.backgroundColor = result.sRGBHex;
      })
      .catch((e) => {
        resultElement.textContent = e;
      });
  
    setTimeout(() => {
      abortController.abort();
    }, 5000);
});

document.getElementById("copy-hex").addEventListener("click", () => {
    copyColor();
});

function copyColor() {
    var range = document.createRange();
    range.selectNode(document.getElementById("color-code-display")); // Ensure this is where the color code is displayed
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // to deselect
    alert("Copied Color");
}