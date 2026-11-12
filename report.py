from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image
)
from datetime import datetime


def generate_report(message, analysis, output_path, screenshot_path=None):

    # Create the PDF document
    pdf = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )

    styles = getSampleStyleSheet()

    # Custom title style
    title_style = ParagraphStyle(
        "CyberShieldTitle",
        parent=styles["Title"],
        textColor=colors.HexColor("#123B5D"),
        fontSize=22,
        spaceAfter=8
    )

    story = []

    # Report heading
    story.append(Paragraph("CYBERSHIELD", title_style))
    story.append(
        Paragraph("Digital Safety Analysis Report", styles["Heading2"])
    )

    story.append(Spacer(1, 12))

    # Report information
    story.append(
        Paragraph(
            f"Generated on: {datetime.now().strftime('%d %B %Y, %I:%M %p')}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 20))

    # Original conversation
    
    # Original conversation
    story.append(
        Paragraph("1. Submitted Conversation", styles["Heading2"])
    )

    safe_message = escape(message).replace("\n", "<br/>")

    story.append(
        Paragraph(safe_message, styles["BodyText"])
    )

    story.append(Spacer(1, 20))


    story.append(Spacer(1, 20))

    # Analysis results
    story.append(Paragraph("2. AI Analysis Results", styles["Heading2"]))

    table_data = [
        ["Category", "Model Score"]
    ]

    for category, score in analysis.items():
        table_data.append([
            category.replace("_", " ").title(),
            f"{score * 100:.2f} / 100"
        ])

    results_table = Table(
        table_data,
        colWidths=[110 * mm, 55 * mm]
    )

    results_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#123B5D")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.whitesmoke, colors.lightgrey]),
    ]))

    story.append(results_table)
    story.append(Spacer(1, 20))

    # Original screenshot, if supplied
    if screenshot_path:
        story.append(
            Paragraph("3. Original Evidence Screenshot", styles["Heading2"])
        )
        evidence_image = Image(screenshot_path)
        evidence_image._restrictSize(160 * mm, 120 * mm)
        story.append(evidence_image)
        story.append(Spacer(1, 15))

    # Disclaimer
    story.append(Paragraph("Important Disclaimer", styles["Heading2"]))
    story.append(
        Paragraph(
            "CyberShield provides AI-assisted language analysis. "
            "Model scores are not calibrated probabilities and do not "
            "establish that cyberbullying occurred. Results should be "
            "reviewed in context and must not be treated as a definitive "
            "judgment about any individual.",
            styles["BodyText"]
        )
    )

    # Generate the PDF
    pdf.build(story)

    return output_path
