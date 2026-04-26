import numpy as np
from PIL import Image

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img).astype(float)

R = arr[:,:,0]

# Background: R is very low (~6)
# Text: R is medium (~137)
# Corners: R is very high (~235)

# We want the text to be fully opaque (alpha=255)
# And everything else transparent (alpha=0)

# Let's map R to alpha using two smooth transitions
# Transition 1: Background to Text (R goes from 20 to 60)
# Transition 2: Text to Corners (R goes from 180 to 220)

alpha_low = 255.0 * (R - 20) / (60 - 20)
alpha_low = np.clip(alpha_low, 0, 255)

alpha_high = 255.0 * (220 - R) / (220 - 180)
alpha_high = np.clip(alpha_high, 0, 255)

# The text alpha is the minimum of the two
alpha = np.minimum(alpha_low, alpha_high)

out_arr = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
out_arr[:,:,0] = 255 # R
out_arr[:,:,1] = 255 # G
out_arr[:,:,2] = 255 # B
out_arr[:,:,3] = alpha.astype(np.uint8) # A

out_img = Image.fromarray(out_arr, 'RGBA')
out_img.save('assets/images/logo.png', 'PNG')
print("Saved logo.png extracting the light-colored text based on R channel.")
