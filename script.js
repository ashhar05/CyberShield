
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const analyzeButton = document.getElementById("analyze-btn");
const feedback = document.getElementById("feedback");
const results = document.getElementById("results");
const resultMessage = document.getElementById("result-message");

messageInput.addEventListener("input", function () {
    const text = messageInput.value;
    charCount.textContent = `${text.length} characters`;
    feedback.textContent = "";
    results.hidden = true;
});


analyzeButton.addEventListener("click", async function () {
    const text = messageInput.value.trim();

    if (text.length === 0) {
        feedback.textContent =
            "Please enter a message before continuing.";
        messageInput.focus();
        return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Sending...";

    feedback.textContent = "";
    results.hidden = true;

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Analysis request failed.");
        }

        feedback.textContent = data.message;
        results.hidden = false;

        resultMessage.textContent =
            `Python received ${data.character_count} characters.`;

    } catch (error) {
        feedback.textContent =
            "Could not contact the backend. Check that Flask is running.";
        console.error(error);

    } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analyze message →";
    }
});
