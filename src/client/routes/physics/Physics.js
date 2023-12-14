"use strict";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// components
import createPlanet from "./planet.js";
import Clock from "./clock.js";
import VelocitySlider from "./slider.js";
import Notify from "./notify.js";

const dilate = (v) => Math.sqrt(1 - Math.pow(v, 2));

const Physics = () => {
  const mountRef = useRef(null);
  let [notify, setNotify] = useState(true);
  // velocity storage
  const [velocity, setVelocity] = useState(0);
  let factor = useRef(1);

  const handleVelocity = (value) => {
    factor.current = dilate(value);
    setVelocity(value);
  };

  useEffect(() => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1c1e26);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight - 44);
    mountRef.current.appendChild(renderer.domElement);

    // Planet setup
    const distanceScale = 10;
    const sizeScale = 0.1;
    const { planet: sun } = createPlanet(
      10.9 * sizeScale,
      "./assets/physics/sunmap.jpg",
      0
    );
    sun.position.z = 0;
    scene.add(sun);
    const { planet: mercury, orbit: meOrbit } = createPlanet(
      0.38 * sizeScale,
      "./assets/physics/mercurymap.jpg",
      0.39 * distanceScale
    );
    mercury.position.z = 0.39 * distanceScale;
    scene.add(mercury);
    scene.add(meOrbit);
    const { planet: venus, orbit: veOrbit } = createPlanet(
      0.95 * sizeScale,
      "./assets/physics/venusmap.jpg",
      0.72 * distanceScale
    );
    venus.position.z = 0.72 * distanceScale;
    scene.add(venus);
    scene.add(veOrbit);
    const { planet: earth, orbit: eaOrbit } = createPlanet(
      1 * sizeScale,
      "./assets/physics/earthmap.jpg",
      1 * distanceScale
    );
    earth.position.z = distanceScale;
    scene.add(earth);
    scene.add(eaOrbit);
    const { planet: mars, orbit: maOrbit } = createPlanet(
      0.53 * sizeScale,
      "./assets/physics/marsmap.jpg",
      1.52 * distanceScale
    );
    mars.position.z = 1.52 * distanceScale;
    scene.add(mars);
    scene.add(maOrbit);
    const { planet: jupiter, orbit: juOrbit } = createPlanet(
      11.21 * sizeScale,
      "./assets/physics/jupitermap.jpg",
      5.2 * distanceScale
    );
    jupiter.position.z = 5.2 * distanceScale;
    scene.add(jupiter);
    scene.add(juOrbit);
    const { planet: saturn, orbit: saOrbit } = createPlanet(
      9.45 * sizeScale,
      "./assets/physics/saturnmap.jpg",
      9.58 * distanceScale
    );
    saturn.position.z = 9.58 * distanceScale;
    scene.add(saturn);
    scene.add(saOrbit);
    const { planet: uranus, orbit: uaOrbit } = createPlanet(
      4 * sizeScale,
      "./assets/physics/uranusmap.jpg",
      19.2 * distanceScale
    );
    uranus.position.z = 19.2 * distanceScale;
    scene.add(uranus);
    scene.add(uaOrbit);
    const { planet: neptune, orbit: neOrbit } = createPlanet(
      3.88 * sizeScale,
      "./assets/physics/neptunemap.jpg",
      30.18 * distanceScale
    );
    neptune.position.z = 30.18 * distanceScale;
    scene.add(neptune);
    scene.add(neOrbit);
    const { planet: pluto, orbit: plOrbit } = createPlanet(
      0.18 * sizeScale,
      "./assets/physics/plutomap.jpg",
      39.48 * distanceScale
    );
    pluto.position.z = 39.48 * distanceScale;
    scene.add(pluto);
    scene.add(plOrbit);

    // Camera setup
    camera.position.set(-2.9, 0.9, -0.35);
    camera.lookAt(0, 0, 2.6);

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // planet rotation
      sun.rotation.y += ((2 * Math.PI) / 86400) * factor.current;
      mercury.rotation.y += ((2 * Math.PI) / 1407.6) * factor.current;
      venus.rotation.y += ((2 * Math.PI) / 5832.5) * factor.current;
      earth.rotation.y += ((2 * Math.PI) / 86400) * factor.current;
      mars.rotation.y += ((2 * Math.PI) / 88642.5) * factor.current;
      jupiter.rotation.y += ((2 * Math.PI) / 35730) * factor.current;
      saturn.rotation.y += ((2 * Math.PI) / 38760) * factor.current;
      uranus.rotation.y += ((2 * Math.PI) / 30600) * factor.current;
      neptune.rotation.y += ((2 * Math.PI) / 60225) * factor.current;
      pluto.rotation.y += ((2 * Math.PI) / 90465) * factor.current;

      // planet speed dilation
      sun.scale.x = factor.current;
      mercury.scale.x = factor.current;
      meOrbit.scale.x = factor.current;
      venus.scale.x = factor.current;
      veOrbit.scale.x = factor.current;
      earth.scale.x = factor.current;
      eaOrbit.scale.x = factor.current;
      mars.scale.x = factor.current;
      maOrbit.scale.x = factor.current;
      jupiter.scale.x = factor.current;
      juOrbit.scale.x = factor.current;
      saturn.scale.x = factor.current;
      saOrbit.scale.x = factor.current;
      uranus.scale.x = factor.current;
      uaOrbit.scale.x = factor.current;
      neptune.scale.x = factor.current;
      neOrbit.scale.x = factor.current;
      pluto.scale.x = factor.current;
      plOrbit.scale.x = factor.current;

      // planet revolution
      mercury.position.x =
        Math.cos(0.004 * factor.current) *
        0.39 *
        distanceScale *
        factor.current;
      mercury.position.z =
        Math.sin(0.004 * factor.current) * 0.39 * distanceScale;
      venus.position.x =
        Math.cos(0.0035 * factor.current) *
        0.72 *
        distanceScale *
        factor.current;
      venus.position.z =
        Math.sin(0.0035 * factor.current) * 0.72 * distanceScale;
      earth.position.x =
        Math.cos(0.003 * factor.current) * distanceScale * factor.current;
      earth.position.z = Math.sin(0.003 * factor.current) * distanceScale;
      mars.position.x =
        Math.cos(0.0025 * factor.current) *
        1.52 *
        distanceScale *
        factor.current;
      mars.position.z =
        Math.sin(0.0025 * factor.current) * 1.52 * distanceScale;
      jupiter.position.x =
        Math.cos(0.001 * factor.current) * 5.2 * distanceScale * factor.current;
      jupiter.position.z =
        Math.sin(0.001 * factor.current) * 5.2 * distanceScale;
      saturn.position.x =
        Math.cos(0.0009 * factor.current) *
        9.58 *
        distanceScale *
        factor.current;
      saturn.position.z =
        Math.sin(0.0009 * factor.current) * 9.58 * distanceScale;
      uranus.position.x =
        Math.cos(0.0007 * factor.current) *
        19.2 *
        distanceScale *
        factor.current;
      uranus.position.z =
        Math.sin(0.0007 * factor.current) * 19.2 * distanceScale;
      neptune.position.x =
        Math.cos(0.0005 * factor.current) *
        30.18 *
        distanceScale *
        factor.current;
      neptune.position.z =
        Math.sin(0.0005 * factor.current) * 30.18 * distanceScale;
      pluto.position.x =
        Math.cos(0.0004 * factor.current) *
        39.48 *
        distanceScale *
        factor.current;
      pluto.position.z =
        Math.sin(0.0004 * factor.current) * 39.48 * distanceScale;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement)
        mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <Notify open={notify} onClose={() => setNotify(false)} />
      <div ref={mountRef}>
        <VelocitySlider
          currentVelocity={velocity}
          onVelocityChange={handleVelocity}
        />
        <Clock scale={factor.current} />
      </div>
    </>
  );
};

export default Physics;
