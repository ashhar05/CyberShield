
from PIL import Image
from ocr import extract_text

image = Image.open("sample.png")

text = extract_text(image)

print("Extracted text:")
print("----------------")
print(text)
