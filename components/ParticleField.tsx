'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { useAchievements } from './AchievementTracker';

function ParticleFallback() {
  const { theme } = useAchievements();
  const colorHex =
    theme === 'sunset' ? '#F97316' : theme === 'vaporwave' ? '#EC4899' : '#E27D60';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, ${colorHex} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useAchievements();
  const [useFallback, setUseFallback] = useState(true);

  const colorHex =
    theme === 'sunset' ? '#F97316' : theme === 'vaporwave' ? '#EC4899' : '#E27D60';

  useEffect(() => {
    const lowPower =
      typeof window !== 'undefined' &&
      window.navigator.hardwareConcurrency <= 4;
    setUseFallback(lowPower);
  }, []);

  useEffect(() => {
    if (useFallback || !mountRef.current) return;

    let cancelled = false;
    const container = mountRef.current;

    const init = async () => {
      const THREE = await import('three');

      if (cancelled || !mountRef.current) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      let scene: THREE.Scene;
      let camera: THREE.PerspectiveCamera;
      let renderer: THREE.WebGLRenderer;
      let geometry: THREE.BufferGeometry;
      let material: THREE.PointsMaterial;
      let particles: THREE.Points;
      let animId = 0;

      try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);

        const canvas = renderer.domElement;
        canvas.style.willChange = 'transform';
        canvas.style.transform = 'translateZ(0)';
        canvas.style.display = 'block';

        container.appendChild(canvas);

        const COUNT = 800;
        const positions = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
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

        const posArr = geometry.attributes.position.array as Float32Array;

        const animate = () => {
          animId = requestAnimationFrame(animate);

          for (let i = 0; i < COUNT; i++) {
            posArr[i * 3 + 1] += 0.002;
            if (posArr[i * 3 + 1] > 5) {
              posArr[i * 3 + 1] = -5;
            }
          }

          geometry.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
        };

        animate();

        const onResize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener('resize', onResize);

        return () => {
          cancelAnimationFrame(animId);
          window.removeEventListener('resize', onResize);
          scene.remove(particles);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (container.contains(canvas)) {
            container.removeChild(canvas);
          }
        };
      } catch (e) {
        console.warn(
          'WebGL is disabled or unsupported in this browser environment. ParticleField was skipped.',
          e
        );
        setUseFallback(true);
      }
    };

    let cleanup: (() => void) | undefined;

    init().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [colorHex, useFallback]);

  if (useFallback) {
    return <ParticleFallback />;
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
