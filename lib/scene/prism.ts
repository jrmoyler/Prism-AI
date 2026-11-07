// Prism AI, taken literally: a glass prism splits one white beam into five bands, one per
// role dimension (architect, integrator, designer, educator, consultant). One person, many
// directions. Choosing a role in the fieldbook brightens that band.
import { mount, THREE, rng, type SceneDef } from './kit';

export const BANDS = [
  ['architect', '#D4A843'], ['integrator', '#00D9B5'], ['designer', '#FB923C'], ['educator', '#0EA5E9'], ['consultant', '#F43F5E'],
] as const;
const NAVY = new THREE.Color('#050A18');

const bandVert = /* glsl */`
  varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const bandFrag = /* glsl */`
  uniform vec3 uColor; uniform float uHeat; uniform float uTime; varying vec2 vUv;
  void main(){
    float along = vUv.x;                       // 0 at the prism face, 1 at the far end
    float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
    float fade = (1.0 - along) * (0.75 + 0.25 * sin(uTime * 1.8 - along * 9.0));
    float core = smoothstep(0.35, 0.5, vUv.y) * smoothstep(0.65, 0.5, vUv.y);
    float a = edge * fade * (0.5 + uHeat * 0.9) + core * fade * (0.35 + uHeat * 0.6);
    gl_FragColor = vec4(uColor * (0.9 + uHeat * 0.6), a);
  }`;

export default function prism(host: HTMLElement) {
  const def: SceneDef = {
    fov: 32, exposure: 1.05, stillTime: 6.5,
    build({ scene, camera, env, state, host }) {
      scene.background = NAVY.clone();
      scene.environment = env({ key: 0xfff4dc, fill: 0x2a3d70, floor: 0x0a1020, strength: 1 });
      const rand = rng(5);

      // The glass. A triangular prism lying on its side so the beam crosses two faces.
      const tri = new THREE.Shape([new THREE.Vector2(-1.1, -0.75), new THREE.Vector2(1.1, -0.75), new THREE.Vector2(0, 1.1)]);
      const glassGeo = new THREE.ExtrudeGeometry(tri, { depth: 1.6, bevelEnabled: false });
      glassGeo.translate(0, 0, -0.8);
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xdfe9ff, roughness: 0.03, metalness: 0, transmission: 0.9, thickness: 1.6, ior: 1.55, dispersion: 4, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.0, transparent: true, opacity: 0.5, attenuationColor: new THREE.Color('#dfe9ff'), attenuationDistance: 3 });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(glassGeo, 20), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
      const prismG = new THREE.Group(); prismG.add(glass, edges); prismG.position.set(0, 0, 0); prismG.scale.setScalar(0.85); scene.add(prismG);

      // The white beam in: a thin additive slab from far left to the entry face.
      const beam = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.09), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beam.position.set(-5.2, 0.05, 0); beam.rotation.z = 0.06; scene.add(beam);
      const beamGlow = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.5), new THREE.MeshBasicMaterial({ color: 0xcfd8ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beamGlow.position.copy(beam.position); beamGlow.rotation.copy(beam.rotation); scene.add(beamGlow);

      // Five bands out, fanning from the exit face. Each band keeps its own heat.
      const bands = BANDS.map(([, hex], i) => {
        const mat = new THREE.ShaderMaterial({ vertexShader: bandVert, fragmentShader: bandFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
          uniforms: { uColor: { value: new THREE.Color(hex) }, uHeat: { value: 0 }, uTime: { value: 0 } } });
        const geo = new THREE.PlaneGeometry(13, 0.5, 1, 1); geo.translate(6.5, 0, 0);
        const m = new THREE.Mesh(geo, mat);
        const spread = (i - 2) * 0.15; // radians between neighbouring bands
        m.position.set(0.55, 0.05 - (i - 2) * 0.02, 0); m.rotation.z = -0.1 + spread;
        scene.add(m);
        return { m, mat, heat: 0, spread };
      });
      // Where the bands land: a soft lit wall far right so the colours have a destination.
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), new THREE.MeshStandardMaterial({ color: 0x0d1526, roughness: 0.9 }));
      wall.position.set(10.6, -0.3, -1.2); wall.rotation.y = -0.9; scene.add(wall);
      const wallLight = new THREE.SpotLight(0xffffff, 0, 10, 0.5, 0.8, 1.2); wallLight.position.set(1, 0.3, 0.5); wallLight.target = wall; scene.add(wallLight);

      // Dust in the beam so the light has a volume to cross.
      const N = state.mobile ? 180 : 420;
      const pts = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { pts[i * 3] = -8 + rand() * 18; pts[i * 3 + 1] = (rand() - 0.5) * 2.4; pts[i * 3 + 2] = (rand() - 0.5) * 3; }
      const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xdfe6ff, size: 0.022, transparent: true, opacity: 0.35, depthWrite: false }));
      scene.add(dust);

      const table = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), new THREE.MeshStandardMaterial({ color: 0x070d1b, roughness: 0.3, metalness: 0.5 }));
      table.rotation.x = -Math.PI / 2; table.position.y = -0.78; scene.add(table);
      const key = new THREE.DirectionalLight(0xfff3dd, 1.8); key.position.set(-3, 5, 4); scene.add(key);
      scene.add(new THREE.AmbientLight(0x101a30, 1.2));

      let focus = -1, focusUntil = 0;
      const onFocus = (e: Event) => { const d = (e as CustomEvent<{ index?: number; role?: string }>).detail || {}; focus = typeof d.index === 'number' ? d.index : BANDS.findIndex((b) => b[0] === d.role); focusUntil = state.time + 8; };
      host.addEventListener('scene:focus', onFocus);

      const base = new THREE.Vector3(0.6, 1.0, 9.4), look = new THREE.Vector3(0.1, -0.1, 0);
      camera.position.copy(base);
      return {
        lod(level) { if (level >= 1) { glassMat.transmission = 0; glassMat.transparent = true; glassMat.opacity = 0.35; glassMat.needsUpdate = true; } if (level >= 2) dust.visible = false; },
        update(dt, t, s) {
          if (focus >= 0 && t > focusUntil) focus = -1;
          bands.forEach((b, i) => {
            const want = focus < 0 ? 0.55 : i === focus ? 1.2 : 0.14;
            b.heat += (want - b.heat) * dt * 2.2;
            b.mat.uniforms.uHeat.value = b.heat; b.mat.uniforms.uTime.value = t;
            b.m.rotation.z = -0.1 + b.spread * (1 + Math.sin(t * 0.35) * 0.08);
          });
          prismG.rotation.y = Math.sin(t * 0.25) * 0.08 + s.pointer.x * 0.1;
          prismG.rotation.x = s.pointer.y * 0.06;
          dust.position.x = Math.sin(t * 0.07) * 0.4;
          camera.position.x += ((base.x + s.pointer.x * 0.35) - camera.position.x) * 0.05;
          camera.position.y += ((base.y + s.pointer.y * 0.25) - camera.position.y) * 0.05;
          camera.lookAt(look);
        },
        dispose() { host.removeEventListener('scene:focus', onFocus); },
      };
    },
  };
  return mount(host, def);
}
