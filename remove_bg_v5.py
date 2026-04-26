import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

# Load image
img = Image.open('assets/images/logo.jpeg').convert('RGB')
arr = np.array(img)
h, w, d = arr.shape

# Reshape for clustering
pixels = arr.reshape(-1, 3)

# We expect 3 main colors: Text (darkest), Background (blue), Corners (white)
kmeans = KMeans(n_clusters=3, random_state=42, n_init=5)
labels = kmeans.fit_predict(pixels)
centers = kmeans.cluster_centers_

print("Cluster centers (R, G, B):")
for i, c in enumerate(centers):
    print(f"Cluster {i}: {c} -> Mean brightness: {np.mean(c)}")

# Find the cluster with the lowest mean brightness (Text)
text_cluster = np.argmin(np.mean(centers, axis=1))

# Find the background cluster (middle brightness)
sorted_clusters = np.argsort(np.mean(centers, axis=1))
bg_cluster = sorted_clusters[1]

print(f"Text cluster is {text_cluster}")

# Create alpha mask: 255 for text cluster, 0 for others
mask = (labels == text_cluster).reshape(h, w)

# The mask might be noisy. Let's create an output image.
out_arr = np.zeros((h, w, 4), dtype=np.uint8)
out_arr[:, :, 0] = 255
out_arr[:, :, 1] = 255
out_arr[:, :, 2] = 255
out_arr[:, :, 3] = mask * 255

out_img = Image.fromarray(out_arr, 'RGBA')
out_img.save('assets/images/logo.png', 'PNG')
print("Saved logo.png using KMeans clustering.")
