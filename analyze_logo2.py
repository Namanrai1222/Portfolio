from PIL import Image
import numpy as np

img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img)

R = arr[:,:,0]
G = arr[:,:,1]
B = arr[:,:,2]

print("R median:", np.median(R))
print("G median:", np.median(G))
print("B median:", np.median(B))

print("R 1st pct:", np.percentile(R, 1))
print("G 1st pct:", np.percentile(G, 1))
print("B 1st pct:", np.percentile(B, 1))

print("B - R median:", np.median(B - R))
print("B - G median:", np.median(B - G))
