
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const analyzeButton = document.getElementById("analyze-btn");
const feedback = document.getElementById("feedback");

messageInput.addEventListener("input", function () {
    const text = messageInput.value;
    charCount.textContent = `${text.length} characters`;
    feedback.textContent = "";
});

analyzeButton.addEventListener("click", function () {
    const text = messageInput.value.trim();

    if (text.length === 0) {
        feedback.textContent = "Please enter a message before continuing.";
        messageInput.focus();
        return;
    }

    feedback.textContent =
        "Input received. AI analysis will be connected in a later step.";
});
