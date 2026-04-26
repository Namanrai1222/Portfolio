import numpy as np
from PIL import Image

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img).astype(float)

h, w = arr.shape[:2]
R = arr[:,:,0]

# Text is actually white! And so are the corners.
# We want to keep all bright pixels (R > 80) inside the circle.
# Let's create a circular mask to hide the white corners.

cy, cx = h / 2.0, w / 2.0
y, x = np.ogrid[:h, :w]

# Distance from center
dist = np.sqrt((x - cx)**2 + (y - cy)**2)

# The radius of the blue circle is roughly half the width/height
# Let's make the radius slightly smaller than w/2 to ensure we clip the corners
radius = min(h, w) / 2.0 * 0.95

# Alpha mapping:
# Bright pixels become opaque, dark pixels transparent
alpha = 255.0 * (R - 40) / (80 - 40)
alpha = np.clip(alpha, 0, 255)

# Apply circular mask: if distance > radius, alpha = 0
alpha[dist > radius] = 0

out_arr = np.zeros((h, w, 4), dtype=np.uint8)
out_arr[:,:,0] = 255 # R
out_arr[:,:,1] = 255 # G
out_arr[:,:,2] = 255 # B
out_arr[:,:,3] = alpha.astype(np.uint8) # A

out_img = Image.fromarray(out_arr, 'RGBA')
out_img.save('assets/images/logo.png', 'PNG')
print(f"Saved logo.png with circular mask. Size: {w}x{h}, Radius used: {radius}")
