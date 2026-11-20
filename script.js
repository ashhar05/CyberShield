
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

// CyberShield Enhanced Analysis elements
const enhancedAnalysisButton = document.getElementById("enhanced-analysis-btn");
const contextualQuestionnaire = document.getElementById("contextual-questionnaire");
const contextualForm = document.getElementById("contextual-form");
const contextualFeedback = document.getElementById("contextual-feedback");
const contextualResults = document.getElementById("contextual-results");
const contextualAssessmentText = document.getElementById("contextual-assessment-text");
const contextualObservations = document.getElementById("contextual-observations");
const contextualDisclaimer = document.getElementById("contextual-disclaimer");
const submitContextButton = document.getElementById("submit-context-btn");


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
    // Clear analysis associated with the previous message
latestAnalysis = null;

// Reset the optional contextual assessment
contextualQuestionnaire.hidden = true;
contextualResults.hidden = true;
contextualFeedback.textContent = "";
contextualForm.reset();
enhancedAnalysisButton.textContent = "Get Enhanced Analysis →";
});

// Display the model's category scores as speedometer gauges
function displayResults(analysis) {

    // Remove results from any previous analysis
    analysisResults.replaceChildren();

    // SVG namespace required for creating SVG elements
    const svgNS = "http://www.w3.org/2000/svg";

    // Loop through all seven categories
    for (const category in analysis) {

        const score = Number(analysis[category]);

        // Convert model score (0-1) into percentage (0-100)
        const percentage = Math.max(
            0,
            Math.min(100, (Number.isFinite(score) ? score : 0) * 100)
        );

        // Create the speedometer card
        const categoryBox = document.createElement("div");
        categoryBox.className = "gauge-card";

        // Create an SVG speedometer
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 240 210");
        svg.setAttribute("class", "gauge-svg");
        svg.setAttribute("role", "img");
        svg.setAttribute(
            "aria-label",
            `${categoryNames[category] || category}: ${percentage.toFixed(2)} percent`
        );

        // Curved 270-degree speedometer path
        // Starts at the lower-left and finishes at the lower-right
        const gaugePath =
            "M 44 174 A 100 100 0 1 1 196 174";

        // Create the dark background arc
        const track = document.createElementNS(svgNS, "path");
        track.setAttribute("d", gaugePath);
        track.setAttribute("class", "gauge-track");
        track.setAttribute("pathLength", "100");

        // Create the turquoise progress arc
        const progress = document.createElementNS(svgNS, "path");
        progress.setAttribute("d", gaugePath);
        progress.setAttribute("class", "gauge-progress");
        progress.setAttribute("pathLength", "100");

        // Start with an empty progress arc
        progress.style.strokeDasharray = "0 100";

        // Create the large percentage text
        const valueText = document.createElementNS(svgNS, "text");
        valueText.setAttribute("x", "120");
        valueText.setAttribute("y", "122");
        valueText.setAttribute("class", "gauge-value");
        valueText.textContent = `${percentage.toFixed(2)}%`;

        // Create the small description below the percentage
        const caption = document.createElementNS(svgNS, "text");
        caption.setAttribute("x", "120");
        caption.setAttribute("y", "145");
        caption.setAttribute("class", "gauge-caption");
        caption.textContent = "MODEL SCORE";

        // Assemble the SVG
        svg.appendChild(track);
        svg.appendChild(progress);
        svg.appendChild(valueText);
        svg.appendChild(caption);

        // Create the category name beneath the speedometer
        const categoryLabel = document.createElement("p");
        categoryLabel.className = "gauge-label";
        categoryLabel.textContent =
            categoryNames[category] || category;

        // Assemble the speedometer card
        categoryBox.appendChild(svg);
        categoryBox.appendChild(categoryLabel);

        // Add the card to the analysis dashboard
        analysisResults.appendChild(categoryBox);

        // Animate the turquoise arc to the model score
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                progress.style.strokeDasharray =
                    `${percentage} 100`;
            });
        });
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

        // Store the latest successful analysis
        latestAnalysis = data.analysis;

        // Show the results section before drawing the gauges
        results.hidden = false;

        // Display all seven speedometers
        displayResults(data.analysis);

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

// Show or hide the optional contextual questionnaire
enhancedAnalysisButton.addEventListener("click", function () {

    contextualQuestionnaire.hidden = !contextualQuestionnaire.hidden;

    // Change button text based on questionnaire visibility
    enhancedAnalysisButton.textContent = contextualQuestionnaire.hidden
        ? "Get Enhanced Analysis →"
        : "Hide Questionnaire ↑";

    if (!contextualQuestionnaire.hidden) {
        contextualQuestionnaire.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
});

// Handle contextual questionnaire submission
contextualForm.addEventListener("submit", async function (event) {

    // Prevent the browser from refreshing the page
    event.preventDefault();

    // Ensure the initial analysis has been completed
    if (!latestAnalysis) {
        contextualFeedback.textContent =
            "Please analyze a message before requesting enhanced analysis.";
        return;
    }

    // Read the current conversation text
    const message = messageInput.value.trim();

    // Collect answers from the four questions
    const context = {
        emotional_impact: document.getElementById("emotional-impact").value,
        relationship: document.getElementById("relationship").value,
        repetition: document.getElementById("repetition").value,
        intention: document.getElementById("intention").value
    };

    // Show loading state
    submitContextButton.disabled = true;
    submitContextButton.textContent = "Generating assessment...";
    contextualFeedback.textContent = "";
    contextualResults.hidden = true;

    try {

        // Send message and questionnaire responses to Flask
        const response = await fetch("/api/contextual-analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                context: context
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Contextual assessment failed."
            );
        }

        // Read the enhanced analysis returned by Flask
        const enhancedAnalysis = data.enhanced_analysis;

        // Display the contextual interpretation
        contextualAssessmentText.textContent =
            enhancedAnalysis.contextual_assessment;

        // Remove observations from any previous assessment
        contextualObservations.replaceChildren();

        // Display each contextual observation
        enhancedAnalysis.contextual_observations.forEach(function (observation) {

            const listItem = document.createElement("li");
            listItem.textContent = observation;

            contextualObservations.appendChild(listItem);
        });

        // Display the assessment disclaimer
        contextualDisclaimer.textContent =
            enhancedAnalysis.disclaimer;

        // Show the completed assessment
        contextualResults.hidden = false;

        contextualFeedback.textContent =
            "Enhanced contextual assessment completed successfully!";

        contextualResults.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (error) {

        contextualFeedback.textContent =
            error.message || "Could not generate contextual assessment.";

        console.error("Contextual assessment error:", error);

    } finally {

        // Restore the submit button
        submitContextButton.disabled = false;
        submitContextButton.textContent =
            "Generate Contextual Assessment →";
    }
});
