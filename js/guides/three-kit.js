// HLV Sức Khỏe – bộ khung 3D dùng chung cho bài thể thao (three.js r170, nạp qua importmap)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export { THREE };

export function makeScene(view, opt) {
  opt = opt || {};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (e) {
    view.insertAdjacentHTML('beforeend', '<div class="nogl">Máy hoặc trình duyệt này chưa bật đồ họa 3D (WebGL). Bạn vẫn đọc bài và bấm các nút bên dưới được – phần chữ sẽ giải thích thay hình.</div>');
    return null;
  }
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  view.prepend(renderer.domElement);
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(opt.bg || 0x0b1424);
  if (opt.fog) scene.fog = new THREE.Fog(opt.bg || 0x0b1424, opt.fog[0], opt.fog[1]);
  var camera = new THREE.PerspectiveCamera(opt.fov || 45, 16 / 9, 0.1, 2000);
  camera.position.set.apply(camera.position, opt.cam || [0, 60, 80]);
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set.apply(controls.target, opt.target || [0, 0, 0]);
  controls.maxPolarAngle = opt.maxPolar || Math.PI * 0.48;
  controls.minDistance = opt.minDist || 5; controls.maxDistance = opt.maxDist || 400;
  controls.update();
  var hemi = new THREE.HemisphereLight(0xdfefff, 0x2b3b2b, 1.1); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set.apply(sun.position, opt.sun || [40, 80, 30]);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  var s = opt.shadowSize || 70; Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 300 });
  scene.add(sun);

  function size() {
    var w = view.clientWidth, h = view.clientHeight || w * 9 / 16;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); if (window.ResizeObserver) new ResizeObserver(size).observe(view); else addEventListener('resize', size);

  var frames = [], visible = true, clock = new THREE.Clock(), fly = null;
  if (window.IntersectionObserver) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(view);
  function loop() {
    requestAnimationFrame(loop);
    var raw = clock.getDelta(), dt = Math.min(0.05, raw), rdt = Math.min(0.25, raw);
    if (!visible) return;
    if (fly) {
      fly.t = Math.min(1, fly.t + dt / fly.d); var k = fly.t < .5 ? 2 * fly.t * fly.t : 1 - Math.pow(-2 * fly.t + 2, 2) / 2;
      camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k);
      if (fly.t >= 1) fly = null;
    }
    for (var i = 0; i < frames.length; i++) frames[i](dt, rdt);
    controls.update(); renderer.render(scene, camera);
  }
  loop();
  var vEl = document.createElement('div'); vEl.className = 'verdict'; vEl.setAttribute('aria-live', 'polite'); view.appendChild(vEl);
  var vT;
  return {
    THREE: THREE, scene: scene, camera: camera, renderer: renderer, controls: controls, reduce: reduce,
    onFrame: function (f) { frames.push(f); },
    flying: function () { return !!fly; },
    flyTo: function (pos, tgt, sec) {
      var p1 = new THREE.Vector3().fromArray(pos), t1 = new THREE.Vector3().fromArray(tgt);
      if (reduce || !sec) { camera.position.copy(p1); controls.target.copy(t1); return; }
      fly = { p0: camera.position.clone(), p1: p1, t0: controls.target.clone(), t1: t1, t: 0, d: sec };
    },
    verdict: function (txt, cls, ms) {
      clearTimeout(vT); vEl.textContent = txt; vEl.className = 'verdict on ' + (cls || '');
      if (ms !== 0) vT = setTimeout(function () { vEl.className = 'verdict'; }, ms || 3500);
    }
  };
}

// tiện ích: vật liệu, chữ nổi, đường kẻ, ống đi theo đường cong
export function mat(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .8, metalness: 0 }, o || {})); }
export function flatLine(points, color, y, width) {
  // vạch vôi: dải phẳng nằm trên mặt đất
  var g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: color || 0xffffff });
  for (var i = 0; i < points.length - 1; i++) {
    var a = points[i], b = points[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(L, width || .12), m);
    mesh.rotation.x = -Math.PI / 2; mesh.rotation.z = -Math.atan2(dz, dx);
    mesh.position.set((a[0] + b[0]) / 2, y || .02, (a[1] + b[1]) / 2); g.add(mesh);
  }
  return g;
}
export function circlePts(cx, cz, r, a0, a1, n) {
  var p = []; n = n || 48; for (var i = 0; i <= n; i++) { var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]); } return p;
}
export function label(text, opt) {
  opt = opt || {};
  var c = document.createElement('canvas'), x = c.getContext('2d'), fs = 48;
  x.font = '600 ' + fs + 'px "Be Vietnam Pro", system-ui, sans-serif';
  var w = Math.ceil(x.measureText(text).width) + 36; c.width = w; c.height = fs + 28;
  x.font = '600 ' + fs + 'px "Be Vietnam Pro", system-ui, sans-serif';
  x.fillStyle = opt.bg || 'rgba(10,18,30,.78)'; var r = 20;
  x.beginPath(); x.moveTo(r, 0); x.arcTo(w, 0, w, c.height, r); x.arcTo(w, c.height, 0, c.height, r); x.arcTo(0, c.height, 0, 0, r); x.arcTo(0, 0, w, 0, r); x.fill();
  x.fillStyle = opt.color || '#fff'; x.textBaseline = 'middle'; x.fillText(text, 18, c.height / 2 + 2);
  var tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  var h = opt.h || 2; sp.scale.set(h * w / c.height, h, 1); sp.renderOrder = 10; return sp;
}
export function bindGroup(container, attr, fn) {
  // nhóm nút chọn một: aria-pressed + gọi fn(giá trị)
  var bs = container.querySelectorAll('[' + attr + ']');
  bs.forEach(function (b) {
    b.addEventListener('click', function () {
      bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      fn(b.getAttribute(attr), b);
    });
  });
}
export function press(container, attr, val) {
  container.querySelectorAll('[' + attr + ']').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute(attr) === val ? 'true' : 'false'); });
}
