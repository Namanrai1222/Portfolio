from PIL import Image
import math

def distance(c1, c2):
    return math.sqrt(sum((a - b)**2 for a, b in zip(c1, c2)))

img = Image.open('assets/images/logo.jpeg').convert("RGBA")
datas = img.getdata()

# Find the most common color (assuming it's the background)
from collections import Counter
# take sample of borders
width, height = img.size
borders = []
for x in range(width):
    borders.append(img.getpixel((x, 0))[:3])
    borders.append(img.getpixel((x, height-1))[:3])
for y in range(height):
    borders.append(img.getpixel((0, y))[:3])
    borders.append(img.getpixel((width-1, y))[:3])

most_common_color = Counter(borders).most_common(1)[0][0]
print("Detected background color:", most_common_color)

newData = []
for item in datas:
    # item is (R, G, B, A)
    if distance(item[:3], most_common_color) < 70:
        # Transparent
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save("assets/images/logo.png", "PNG")
print("Saved as logo.png")
