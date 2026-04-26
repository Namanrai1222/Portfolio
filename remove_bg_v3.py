import numpy as np
from PIL import Image

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img).astype(float)

R = arr[:,:,0]
G = arr[:,:,1]
B = arr[:,:,2]

# Text is dark and not blue.
# Background is blue (B - R is high).
# Corners are white (B and R are high).

# Blueness
blueness = B - R

# We want alpha to be high when blueness is low AND overall brightness is low.
# Text: blueness ~ 0, B ~ 50
# Blue bg: blueness ~ 110, B ~ 125
# White: blueness ~ 0, B ~ 255

# Let's map blueness to alpha (background removal)
# if blueness > 80 -> alpha = 0
# if blueness < 50 -> alpha = 255
alpha_blue = 255.0 * (80 - blueness) / (80 - 50)
alpha_blue = np.clip(alpha_blue, 0, 255)

# We also want to remove white corners.
# if B > 200 -> alpha = 0
# if B < 150 -> alpha = 255
alpha_white = 255.0 * (200 - B) / (200 - 150)
alpha_white = np.clip(alpha_white, 0, 255)

# Combine alphas (pixel must be neither blue nor white)
alpha = np.minimum(alpha_blue, alpha_white)

out_arr = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
out_arr[:,:,0] = 255 # R
out_arr[:,:,1] = 255 # G
out_arr[:,:,2] = 255 # B
out_arr[:,:,3] = alpha.astype(np.uint8) # A

out_img = Image.fromarray(out_arr, 'RGBA')
out_img.save('assets/images/logo.png', 'PNG')
print("Saved logo.png with white text and transparent background.")
