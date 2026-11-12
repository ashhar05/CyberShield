
import pytesseract
from PIL import Image


def extract_text(image):

    # Extract text from the supplied image
    extracted_text = pytesseract.image_to_string(
        image,
        lang="eng"
    )

    # Return the extracted text
    return extracted_text.strip()
