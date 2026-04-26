import numpy as np
from PIL import Image

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img).astype(float)

R = arr[:,:,0]
G = arr[:,:,1]
B = arr[:,:,2]

# The text is black, so it has low B values.
# The background is blue, so it has B ~ 125.
# White corners have B ~ 255.
# Let's map B channel to alpha.
# B <= 60 -> Alpha = 255
# B >= 110 -> Alpha = 0

alpha = np.zeros_like(B)

# Smooth transition
lower = 60.0
upper = 110.0

alpha_float = 255.0 * (upper - B) / (upper - lower)
alpha_float = np.clip(alpha_float, 0, 255)

# The user wants the text to be white!
# So RGB should all be 255, and we just set the alpha channel.
out_arr = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
out_arr[:,:,0] = 255 # R
out_arr[:,:,1] = 255 # G
out_arr[:,:,2] = 255 # B
out_arr[:,:,3] = alpha_float.astype(np.uint8) # A

out_img = Image.fromarray(out_arr, 'RGBA')
out_img.save('assets/images/logo.png', 'PNG')
print("Saved logo.png with white text and transparent background.")
