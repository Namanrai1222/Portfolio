from PIL import Image
import numpy as np

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img)

# Convert to grayscale
gray = np.mean(arr, axis=2)

print("Min grayscale:", np.min(gray))
print("Max grayscale:", np.max(gray))
print("Mean grayscale:", np.mean(gray))

# Let's print some percentile values to understand the distribution
print("1st percentile (darkest):", np.percentile(gray, 1))
print("5th percentile:", np.percentile(gray, 5))
print("10th percentile:", np.percentile(gray, 10))
print("50th percentile (median):", np.percentile(gray, 50))
print("90th percentile:", np.percentile(gray, 90))

# We want text to be white and background transparent.
# Text is the darkest part.
# Let's map gray values to alpha.
# Assuming text is <= dark_thresh, alpha = 255
# Assuming background is >= light_thresh, alpha = 0
dark_thresh = np.percentile(gray, 5) # Let's say text covers about 5% of the image
light_thresh = np.percentile(gray, 15) # Background starts here

print(f"Proposed thresholds: dark={dark_thresh}, light={light_thresh}")
