'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAchievements } from './AchievementTracker';

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useAchievements();

  // Map theme names to their corresponding primary accent color hex strings
  const colorHex = theme === 'sunset' ? '#F97316' : theme === 'vaporwave' ? '#EC4899' : '#E27D60';

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let geometry: THREE.BufferGeometry;
    let material: THREE.PointsMaterial;
    let particles: THREE.Points;
    let animId: number;

    try {
      // ─── Scene ──────────────────────────────────────────────────────────────
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // ─── Particles ──────────────────────────────────────────────────────────
      const COUNT = 800;
      const positions = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 12; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;  // z
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      material = new THREE.PointsMaterial({
        size: 0.04,
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0.35,
        sizeAttenuation: true,
        depthWrite: false,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // ─── Animate — slow upward drift with wraparound ─────────────────────
      const posArr = geometry.attributes.position.array as Float32Array;

      const animate = () => {
        animId = requestAnimationFrame(animate);

        for (let i = 0; i < COUNT; i++) {
          posArr[i * 3 + 1] += 0.002; // drift upward
          if (posArr[i * 3 + 1] > 5) {
            posArr[i * 3 + 1] = -5; // wrap around
          }
        }

        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();

      // ─── Resize ─────────────────────────────────────────────────────────────
      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', onResize);

      // ─── Cleanup ─────────────────────────────────────────────────────────────
      return () => {
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (e) {
      console.warn("WebGL is disabled or unsupported in this browser environment. ParticleField was skipped.", e);
    }
  }, [colorHex]); // Re-initialize when the theme color changes

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
