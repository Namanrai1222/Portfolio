import numpy as np
from PIL import Image

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img).astype(float)

B = arr[:,:,2]

# Text has B around 97-100
# Background has B around 120-130
# White corners have B around 250+

# Let's map B channel to alpha.
# If B <= 108 -> alpha = 255 (Text)
# If B >= 115 -> alpha = 0 (Background)

lower = 105.0
upper = 113.0

alpha = 255.0 * (upper - B) / (upper - lower)
alpha = np.clip(alpha, 0, 255)

out_arr = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
out_arr[:,:,0] = 255 # R
out_arr[:,:,1] = 255 # G
out_arr[:,:,2] = 255 # B
out_arr[:,:,3] = alpha.astype(np.uint8) # A

out_img = Image.fromarray(out_arr, 'RGBA')
out_img.save('assets/images/logo.png', 'PNG')
print("Saved logo.png using B-channel thresholding.")
