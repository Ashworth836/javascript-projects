const container = document.querySelector(".container");
const qrInput = document.querySelector(".qr-form input");
const generateBtn = document.querySelector(".qr-form button");
const qrImg = document.querySelector(".qr-code img");

let preValue;

generateBtn.addEventListener("click", () => {
    let qrValue = qrInput.value.trim();
    if (!qrValue || preValue === qrValue) return;
    preValue = qrValue;
    generateBtn.innerText = "Generating QR Code...";
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
    qrImg.onload = () => {
        container.classList.add("active");
        generateBtn.innerText = "Generate QR Code";
    };
});

qrInput.addEventListener("keyup", () => {
    if (!qrInput.value.trim()) {
        container.classList.remove("active");
        preValue = "";
    }
});