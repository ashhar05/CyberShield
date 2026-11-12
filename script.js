
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const analyzeButton = document.getElementById("analyze-btn");
const feedback = document.getElementById("feedback");
const results = document.getElementById("results");
const resultMessage = document.getElementById("result-message");
const analysisResults = document.getElementById("analysis-results");
const screenshotInput = document.getElementById("screenshot");
const imagePreview = document.getElementById("image-preview");
const imagePreviewContainer = document.getElementById("image-preview-container");
const extractButton = document.getElementById("extract-btn");
const ocrFeedback = document.getElementById("ocr-feedback");
const downloadReportButton = document.getElementById("download-report-btn");
const reportFeedback = document.getElementById("report-feedback");

// Store the latest successful analysis
let latestAnalysis = null;

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
        latestAnalysis = data.analysis;

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

// Handle screenshot selection
screenshotInput.addEventListener("change", function () {

    const file = screenshotInput.files[0];

    if (!file) {
        return;
    }

    // Display image preview
    const imageURL = URL.createObjectURL(file);

    imagePreview.src = imageURL;
    imagePreviewContainer.hidden = false;

    // Enable extraction button
    extractButton.disabled = false;

    ocrFeedback.textContent = "";
});

// Handle OCR extraction
extractButton.addEventListener("click", async function () {

    const file = screenshotInput.files[0];

    if (!file) {
        ocrFeedback.textContent = "Please select an image first.";
        return;
    }

    // Prepare image for upload
    const formData = new FormData();
    formData.append("image", file);

    extractButton.disabled = true;
    extractButton.textContent = "Extracting text...";
    ocrFeedback.textContent = "";

    try {

        const response = await fetch("/api/extract", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "OCR extraction failed.");
        }

        // Put extracted text into the existing textarea
        messageInput.value = data.extracted_text;

        // Update character counter
        charCount.textContent =
            `${data.extracted_text.length} characters`;

        // Hide previous analysis results
        results.hidden = true;

        ocrFeedback.textContent = "Text extracted successfully! Review it below.";

        // Bring the user to the extracted text
        messageInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (error) {

        ocrFeedback.textContent =
            error.message || "Could not extract text from the image.";

        console.error("OCR error:", error);

    } finally {

        extractButton.disabled = false;
        extractButton.textContent = "Extract text →";
    }
});

// Handle PDF report download
downloadReportButton.addEventListener("click", async function () {

    if (!latestAnalysis) {
        reportFeedback.textContent =
            "Please analyse a message before generating a report.";
        return;
    }

    const message = messageInput.value.trim();

    if (!message) {
        reportFeedback.textContent =
            "No conversation text available.";
        return;
    }

    downloadReportButton.disabled = true;
    downloadReportButton.textContent = "Generating report...";
    reportFeedback.textContent = "";

    try {

        const response = await fetch("/api/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                analysis: latestAnalysis
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "PDF generation failed."
            );
        }

        // Receive the PDF as a browser Blob
        const pdfBlob = await response.blob();

        // Create a temporary download URL
        const downloadURL = URL.createObjectURL(pdfBlob);

        // Create a temporary download link
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download = "CyberShield_Analysis_Report.pdf";

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Release the temporary URL
        URL.revokeObjectURL(downloadURL);

        reportFeedback.textContent =
            "Your PDF report has been generated successfully!";

    } catch (error) {

        reportFeedback.textContent =
            error.message || "Could not generate the PDF report.";

        console.error("PDF report error:", error);

    } finally {

        downloadReportButton.disabled = false;
        downloadReportButton.textContent = "Download PDF Report ↓";
    }
});
