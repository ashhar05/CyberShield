
from xml.sax.saxutils import escape
from pathlib import Path
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether
)

# CyberShield website theme colours
NAVY = colors.HexColor("#0B1729")
PANEL = colors.HexColor("#10243D")
BLUE = colors.HexColor("#59A6FF")
WHITE = colors.HexColor("#F0F5FF")
MUTED = colors.HexColor("#B4C4D8")
BORDER = colors.HexColor("#304966")

# Use the exact same logo as the website
LOGO_PATH = Path(__file__).resolve().parent / "cybershield-logo.png"


# Draw the background and footer on every PDF page
def draw_background(canvas, doc):
    canvas.saveState()

    width, height = A4

    # Dark navy background
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)

    # Blue accent line at the top
    canvas.setFillColor(BLUE)
    canvas.rect(0, height - 3 * mm, width, 3 * mm,
                fill=1, stroke=0)

    # Footer divider
    canvas.setStrokeColor(BORDER)
    canvas.line(20 * mm, 19 * mm, width - 20 * mm, 19 * mm)

    # Footer information
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(
        20 * mm, 13 * mm,
        "CyberShield | Digital Safety Analysis"
    )
    canvas.drawRightString(
        width - 20 * mm, 13 * mm,
        f"Page {doc.page}"
    )

    canvas.restoreState()


def generate_report(message, analysis, output_path, screenshot_path=None):

    # Create the PDF document
    pdf = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=25 * mm
    )

    # Custom title style
    title_style = ParagraphStyle(
        "CyberShieldTitle",
        fontName="Helvetica-Bold",
        textColor=WHITE,
        fontSize=23,
        leading=29,
        spaceAfter=8
    )

    # Additional styles matching the website
    subtitle_style = ParagraphStyle(
        "CyberShieldSubtitle",
        fontSize=11,
        leading=16,
        textColor=MUTED
    )

    heading_style = ParagraphStyle(
        "CyberShieldHeading",
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=19,
        textColor=BLUE,
        spaceBefore=15,
        spaceAfter=10
    )

    body_style = ParagraphStyle(
        "CyberShieldBody",
        fontSize=10,
        leading=16,
        textColor=WHITE,
        splitLongWords=True
    )

    small_style = ParagraphStyle(
        "CyberShieldSmall",
        fontSize=9,
        leading=14,
        textColor=MUTED
    )

    story = []

    # Report heading
    # Display the exact website logo alongside the brand name
    if not LOGO_PATH.is_file():
        raise FileNotFoundError(
            f"CyberShield logo not found: {LOGO_PATH}"
        )

    logo = Image(
        str(LOGO_PATH),
        width=23 * mm,
        height=23 * mm
    )

    # Cyber in white and Shield in blue
    brand_name = Paragraph(
        '<font color="#F0F5FF">Cyber</font>'
        '<font color="#59A6FF">Shield</font>',
        title_style
    )

    brand_table = Table(
        [[logo, brand_name]],
        colWidths=[29 * mm, 136 * mm]
    )

    brand_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))

    story.append(brand_table)

    story.append(
        Paragraph(
            "AI-Assisted Cyberbullying Analysis Report",
            subtitle_style
        )
    )

    story.append(Spacer(1, 12))

    # Report information
    story.append(
        Paragraph(
            f"Generated on: {datetime.now().strftime('%d %B %Y, %I:%M %p')}",
            small_style
        )
    )

    story.append(Spacer(1, 20))

    # Original conversation
    story.append(
        Paragraph("01 / Submitted Conversation", heading_style)
    )

    safe_message = escape(message).replace("\n", "<br/>")

    story.append(
        Paragraph(
            safe_message or "No conversation provided.",
            body_style
        )
    )

    story.append(Spacer(1, 20))

    # Analysis results
    story.append(
        Paragraph("02 / AI Analysis Results", heading_style)
    )

    table_data = [
        [
            Paragraph("<b>Category</b>", body_style),
            Paragraph("<b>Model Score</b>", body_style)
        ]
    ]

    for category, score in analysis.items():
        table_data.append([
            Paragraph(
                escape(category.replace("_", " ").title()),
                body_style
            ),
            Paragraph(
                f"{float(score) * 100:.2f} / 100",
                body_style
            )
        ])

    results_table = Table(
        table_data,
        colWidths=[110 * mm, 55 * mm],
        repeatRows=1
    )

    results_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0),
         colors.HexColor("#17395D")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [PANEL, NAVY]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(results_table)
    story.append(Spacer(1, 20))

    # Original screenshot, if supplied
    if screenshot_path:
        story.append(
            Paragraph(
                "03 / Original Evidence Screenshot",
                heading_style
            )
        )

        evidence_image = Image(screenshot_path)
        evidence_image._restrictSize(155 * mm, 115 * mm)

        story.append(evidence_image)
        story.append(Spacer(1, 15))

    # Disclaimer
    story.append(
        KeepTogether([
            Paragraph("Important Disclaimer", heading_style),
            Paragraph(
                "CyberShield provides AI-assisted language analysis. "
                "Model scores are not calibrated probabilities and do not "
                "establish that cyberbullying occurred. Results should be "
                "reviewed in context and must not be treated as a definitive "
                "judgment about any individual.",
                small_style
            )
        ])
    )

    # Generate the PDF
    pdf.build(
        story,
        onFirstPage=draw_background,
        onLaterPages=draw_background
    )

    return output_path
