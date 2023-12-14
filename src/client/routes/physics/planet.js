import * as THREE from "three";

const createOrbit = (radius) => {
  const geometry = new THREE.RingGeometry(radius - 0.01, radius, 90);
  const material = new THREE.LineDashedMaterial({
    color: 0x2f3341,
    dashSize: 0.1,
    gapSize: 1,
    side: THREE.DoubleSide,
  });
  const orbit = new THREE.Mesh(geometry, material);
  orbit.rotation.x = Math.PI / 2;
  return orbit;
};

const createPlanet = (radius, colormap, orbit) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);

  const texture = new THREE.TextureLoader().load(colormap);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // make the planet
  const planet = new THREE.Mesh(geometry, material);
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 0, 0);
  planet.add(light);

  // make the orbit
  const orbital = createOrbit(orbit);

  return { planet, orbit: orbital };
};

export default createPlanet;
