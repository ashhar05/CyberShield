
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const analyzeButton = document.getElementById("analyze-btn");
const feedback = document.getElementById("feedback");
const results = document.getElementById("results");
const resultMessage = document.getElementById("result-message");
const analysisResults = document.getElementById("analysis-results");

// Convert model category names into readable labels
const categoryNames = {
    profanity_vulgarity: "Profanity / Vulgarity",
    targeted_abuse_harassment: "Targeted Abuse / Harassment",
    discriminatory_hate_speech: "Discriminatory Hate Speech",
    caste: "Caste-related Content",
    communal_religious: "Communal / Religious Content",
    regional_xenophobic: "Regional / Xenophobic Content",
    misogyny_gender: "Misogyny / Gender-related Content"
};

// Update character count when the user types
messageInput.addEventListener("input", function () {
    const text = messageInput.value;

    charCount.textContent = `${text.length} characters`;
    feedback.textContent = "";
    results.hidden = true;
});

// Display the model's category scores
function displayResults(analysis) {

    // Remove results from any previous analysis
    analysisResults.replaceChildren();

    // Loop through all seven categories
    for (const category in analysis) {

        const score = analysis[category];
        const percentage = score * 100;

        // Create a container for this category
        const categoryBox = document.createElement("div");
        categoryBox.className = "category-result";

        // Create the category name
        const categoryLabel = document.createElement("p");
        categoryLabel.className = "category-label";
        categoryLabel.textContent =
            categoryNames[category] || category;

        // Create the score text
        const scoreText = document.createElement("span");
        scoreText.className = "category-score";
        scoreText.textContent = `${percentage.toFixed(2)} / 100`;

        // Create the progress bar background
        const progressBackground = document.createElement("div");
        progressBackground.className = "progress-background";

        // Create the actual progress bar
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        progressBar.style.width = `${percentage}%`;

        // Assemble the progress bar
        progressBackground.appendChild(progressBar);

        // Assemble the category result
        categoryBox.appendChild(categoryLabel);
        categoryBox.appendChild(scoreText);
        categoryBox.appendChild(progressBackground);

        // Add it to the results section
        analysisResults.appendChild(categoryBox);
    }
}

// Handle Analyze button click
analyzeButton.addEventListener("click", async function () {

    const text = messageInput.value.trim();

    if (text.length === 0) {
        feedback.textContent =
            "Please enter a message before continuing.";
        messageInput.focus();
        return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";

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

        resultMessage.textContent =
            `Analysis completed for ${data.character_count} characters.`;

        // Display all seven scores returned by Flask
        displayResults(data.analysis);

        results.hidden = false;

    } catch (error) {

        feedback.textContent =
            "Could not complete the analysis. Check that Flask is running.";

        console.error("Analysis error:", error);

    } finally {

        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analyze message →";
    }
});

