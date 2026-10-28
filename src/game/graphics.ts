/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { BusSkin } from './rules.ts';

// Shared materials and procedural textures cache
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates procedural canvas texture for Dhaka Bus LED Destination Board
 */
export function createDestinationBoardTexture(text: string, color: string = '#facc15'): THREE.CanvasTexture {
  const cacheKey = `dest_${text}_${color}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  // Dark LED display background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // LED grid dot matrix effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let x = 0; x < canvas.width; x += 6) {
    for (let y = 0; y < canvas.height; y += 6) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Border frame
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  // Glowing Bengali Text
  ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates Dhaka street shop signboard texture
 */
export function createShopSignTexture(shopName: string, subText: string, bg: string, textCol: string): THREE.CanvasTexture {
  const cacheKey = `shop_${shopName}_${bg}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Inner border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  // Glowing Text
  ctx.fillStyle = textCol;
  ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(shopName, canvas.width / 2, 58);

  ctx.fillStyle = '#fef08a';
  ctx.font = '20px "Hind Siliguri", sans-serif';
  ctx.fillText(subText, canvas.width / 2, 98);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates Dhaka billboard advert texture
 */
export function createBillboardTexture(title: string, sub: string, bg: string, accent: string): THREE.CanvasTexture {
  const cacheKey = `bb_${title}_${bg}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Colorful diagonal banner
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(160, 0);
  ctx.lineTo(80, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();

  // White inner border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2 + 30, 90);

  ctx.fillStyle = '#fef08a';
  ctx.font = '24px "Hind Siliguri", sans-serif';
  ctx.fillText(sub, canvas.width / 2 + 30, 150);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '16px monospace';
  ctx.fillText('DHAKA BUS BOSS ★ সবার উপরে ঢাকা', canvas.width / 2, 210);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Soft radial contact shadow texture for vehicles
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  if (textureCache.has('contact_shadow')) {
    return textureCache.get('contact_shadow')!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('contact_shadow', texture);
  return texture;
}

/**
 * Procedural wheel mesh builder with rubber tire and metallic rim
 */
export function createWheelMesh(radius: number = 0.42, width: number = 0.32): THREE.Group {
  const group = new THREE.Group();

  // Rubber tire
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 16);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.1,
  });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.castShadow = true;
  group.add(tire);

  // Metallic Rim
  const rimGeo = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, width + 0.02, 12);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.8,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  group.add(rim);

  // Hub cap nut
  const capGeo = new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, width + 0.04, 8);
  capGeo.rotateZ(Math.PI / 2);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.9,
  });
  const cap = new THREE.Mesh(capGeo, capMat);
  group.add(cap);

  return group;
}

/**
 * Creates 3D Dhaka Local Bus (Composite 12-part model)
 */
export function createBusMesh(skin: BusSkin): { busGroup: THREE.Group; wheels: THREE.Group[]; destinationMesh: THREE.Mesh } {
  const busGroup = new THREE.Group();
  busGroup.name = 'DhakaBus';

  const busLength = 7.6;
  const busWidth = 2.5;
  const busHeight = 2.8;

  // 1. Main Lower Body (Primary silhouette)
  const bodyGeo = new THREE.BoxGeometry(busWidth, busHeight * 0.58, busLength);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: skin.primaryColor,
    roughness: 0.4,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = (busHeight * 0.58) / 2 + 0.35;
  body.castShadow = true;
  busGroup.add(body);

  // 2. Upper Cabin / Roof Section
  const roofGeo = new THREE.BoxGeometry(busWidth * 0.98, busHeight * 0.44, busLength * 0.99);
  const roofMat = new THREE.MeshStandardMaterial({
    color: skin.roofColor,
    roughness: 0.35,
    metalness: 0.25,
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = busHeight * 0.58 + (busHeight * 0.44) / 2 + 0.35;
  roof.castShadow = true;
  busGroup.add(roof);

  // 3. Side Deco Stripe
  const stripeGeo = new THREE.BoxGeometry(busWidth + 0.04, 0.26, busLength + 0.02);
  const stripeMat = new THREE.MeshStandardMaterial({
    color: skin.stripeColor,
    roughness: 0.3,
    metalness: 0.4,
  });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.y = body.position.y;
  busGroup.add(stripe);

  // 4. Windows (Continuous dark reflective glass band)
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.85,
  });

  // Front Windshield
  const frontWindshieldGeo = new THREE.PlaneGeometry(busWidth * 0.9, 0.9);
  const frontWindshield = new THREE.Mesh(frontWindshieldGeo, windowMat);
  frontWindshield.position.set(0, busHeight * 0.65 + 0.35, busLength / 2 + 0.02);
  busGroup.add(frontWindshield);

  // Rear Window
  const rearWindowGeo = new THREE.PlaneGeometry(busWidth * 0.88, 0.85);
  const rearWindow = new THREE.Mesh(rearWindowGeo, windowMat);
  rearWindow.position.set(0, busHeight * 0.65 + 0.35, -busLength / 2 - 0.02);
  rearWindow.rotation.y = Math.PI;
  busGroup.add(rearWindow);

  // Side Window Strips (Left & Right)
  const sideWindowGeo = new THREE.PlaneGeometry(busLength * 0.82, 0.75);
  const leftSideWin = new THREE.Mesh(sideWindowGeo, windowMat);
  leftSideWin.position.set(busWidth / 2 + 0.02, busHeight * 0.65 + 0.35, 0.1);
  leftSideWin.rotation.y = Math.PI / 2;
  busGroup.add(leftSideWin);

  const rightSideWin = new THREE.Mesh(sideWindowGeo, windowMat);
  rightSideWin.position.set(-busWidth / 2 - 0.02, busHeight * 0.65 + 0.35, 0.1);
  rightSideWin.rotation.y = -Math.PI / 2;
  busGroup.add(rightSideWin);

  // 5. LED Destination Signboard on Top-Front
  const destGeo = new THREE.PlaneGeometry(busWidth * 0.88, 0.42);
  const destTex = createDestinationBoardTexture(skin.routeText, skin.secondaryColor);
  const destMat = new THREE.MeshBasicMaterial({
    map: destTex,
    transparent: true,
  });
  const destinationMesh = new THREE.Mesh(destGeo, destMat);
  destinationMesh.position.set(0, busHeight + 0.28, busLength / 2 + 0.03);
  busGroup.add(destinationMesh);

  // 6. Roof Luggage Rack & Bundled Luggage (Signature Dhaka local bus feature)
  const rackGeo = new THREE.BoxGeometry(busWidth * 0.84, 0.15, busLength * 0.55);
  const rackMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
    metalness: 0.7,
  });
  const rack = new THREE.Mesh(rackGeo, rackMat);
  rack.position.set(0, busHeight + 0.42, -0.6);
  busGroup.add(rack);

  // Roof Luggage bundles
  const luggageColors = [0x991b1b, 0x1e3a8a, 0x854d0e, 0x374151];
  for (let i = 0; i < 4; i++) {
    const lugGeo = new THREE.BoxGeometry(0.65, 0.35, 0.7);
    const lugMat = new THREE.MeshStandardMaterial({
      color: luggageColors[i % luggageColors.length],
      roughness: 0.8,
    });
    const lug = new THREE.Mesh(lugGeo, lugMat);
    lug.position.set((i % 2 === 0 ? -0.45 : 0.45), busHeight + 0.6, -1.2 + (i > 1 ? 1.0 : 0));
    lug.rotation.y = (i * 0.15);
    busGroup.add(lug);
  }

  // Roof Spare Tire
  const spareTire = createWheelMesh(0.38, 0.26);
  spareTire.rotation.x = Math.PI / 2;
  spareTire.position.set(0, busHeight + 0.58, 0.4);
  busGroup.add(spareTire);

  // 7. Front Chrome Grille and Heavy Bumper
  const bumperGeo = new THREE.BoxGeometry(busWidth + 0.1, 0.38, 0.35);
  const bumperMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.2,
    metalness: 0.85,
  });
  const bumper = new THREE.Mesh(bumperGeo, bumperMat);
  bumper.position.set(0, 0.42, busLength / 2 + 0.12);
  bumper.castShadow = true;
  busGroup.add(bumper);

  // Rear Bumper
  const rearBumper = bumper.clone();
  rearBumper.position.set(0, 0.42, -busLength / 2 - 0.12);
  busGroup.add(rearBumper);

  // 8. Headlights & Taillights
  const headLightGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12);
  headLightGeo.rotateX(Math.PI / 2);
  const headLightMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xffedd5,
    emissiveIntensity: 0.8,
    roughness: 0.1,
  });
  const leftHeadLight = new THREE.Mesh(headLightGeo, headLightMat);
  leftHeadLight.position.set(-busWidth * 0.38, 0.75, busLength / 2 + 0.05);
  const rightHeadLight = leftHeadLight.clone();
  rightHeadLight.position.x = busWidth * 0.38;
  busGroup.add(leftHeadLight);
  busGroup.add(rightHeadLight);

  // Taillights
  const tailLightGeo = new THREE.BoxGeometry(0.35, 0.18, 0.08);
  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xef4444,
    emissiveIntensity: 0.7,
    roughness: 0.2,
  });
  const leftTail = new THREE.Mesh(tailLightGeo, tailLightMat);
  leftTail.position.set(-busWidth * 0.38, 0.78, -busLength / 2 - 0.05);
  const rightTail = leftTail.clone();
  rightTail.position.x = busWidth * 0.38;
  busGroup.add(leftTail);
  busGroup.add(rightTail);

  // Rear Dhaka Metro Number Plate & Advice Decal
  const plateCanvas = document.createElement('canvas');
  plateCanvas.width = 256;
  plateCanvas.height = 128;
  const pctx = plateCanvas.getContext('2d')!;
  pctx.fillStyle = '#0f172a';
  pctx.fillRect(0, 0, 256, 128);
  pctx.strokeStyle = '#facc15';
  pctx.lineWidth = 6;
  pctx.strokeRect(4, 4, 248, 120);
  pctx.fillStyle = '#facc15';
  pctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  pctx.textAlign = 'center';
  pctx.fillText('ঢাকা মেট্রো-ব-১৪-০০৭', 128, 45);
  pctx.fillStyle = '#ef4444';
  pctx.font = 'bold 18px "Hind Siliguri", sans-serif';
  pctx.fillText('দূরত্ব বজায় রাখুন', 128, 85);
  pctx.fillStyle = '#10b981';
  pctx.font = '16px "Hind Siliguri", sans-serif';
  pctx.fillText('★ মা বাবার দোয়া ★', 128, 115);

  const plateTex = new THREE.CanvasTexture(plateCanvas);
  plateTex.colorSpace = THREE.SRGBColorSpace;
  const plateGeo = new THREE.PlaneGeometry(1.6, 0.75);
  const plateMat = new THREE.MeshBasicMaterial({ map: plateTex });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.set(0, 1.25, -busLength / 2 - 0.03);
  plate.rotation.y = Math.PI;
  busGroup.add(plate);

  // Rear Mudflaps (Left & Right hanging behind rear wheels)
  const flapGeo = new THREE.BoxGeometry(0.5, 0.45, 0.05);
  const flapMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
  const flapL = new THREE.Mesh(flapGeo, flapMat);
  flapL.position.set(busWidth * 0.38, 0.28, -busLength / 2 - 0.02);
  const flapR = flapL.clone();
  flapR.position.x = -busWidth * 0.38;
  busGroup.add(flapL);
  busGroup.add(flapR);

  // 9. Side Mirrors with Stalks
  const mirrorGeo = new THREE.BoxGeometry(0.12, 0.32, 0.18);
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
  const leftMirror = new THREE.Mesh(mirrorGeo, mirrorMat);
  leftMirror.position.set(busWidth / 2 + 0.18, busHeight * 0.65 + 0.35, busLength / 2 - 0.3);
  const rightMirror = leftMirror.clone();
  rightMirror.position.x = -busWidth / 2 - 0.18;
  busGroup.add(leftMirror);
  busGroup.add(rightMirror);

  // 10. Wheels (2 front, 2 rear)
  const wheels: THREE.Group[] = [];
  const wheelX = busWidth / 2 + 0.04;
  const wheelY = 0.42;
  const frontZ = busLength * 0.32;
  const rearZ = -busLength * 0.28;

  const wFL = createWheelMesh(0.44, 0.3);
  wFL.position.set(wheelX, wheelY, frontZ);
  busGroup.add(wFL);
  wheels.push(wFL);

  const wFR = createWheelMesh(0.44, 0.3);
  wFR.position.set(-wheelX, wheelY, frontZ);
  busGroup.add(wFR);
  wheels.push(wFR);

  const wRL = createWheelMesh(0.44, 0.3);
  wRL.position.set(wheelX, wheelY, rearZ);
  busGroup.add(wRL);
  wheels.push(wRL);

  const wRR = createWheelMesh(0.44, 0.3);
  wRR.position.set(-wheelX, wheelY, rearZ);
  busGroup.add(wRR);
  wheels.push(wRR);

  // 11. Soft Radial Contact Shadow Disc
  const shadowGeo = new THREE.PlaneGeometry(busWidth * 1.5, busLength * 1.25);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  busGroup.add(shadow);

  return { busGroup, wheels, destinationMesh };
}

/**
 * Creates Green CNG Auto-Rickshaw 3D Model
 */
export function createCNGMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CNG';

  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.4,
    metalness: 0.2,
  });
  const blackCoverMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
  });
  const yellowHazardMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.4,
  });

  // Lower Cage Body
  const baseGeo = new THREE.BoxGeometry(1.4, 0.75, 2.3);
  const base = new THREE.Mesh(baseGeo, greenMat);
  base.position.y = 0.65;
  base.castShadow = true;
  group.add(base);

  // Curved Top Roof
  const roofGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.2, 12, 1, false, 0, Math.PI);
  roofGeo.rotateZ(Math.PI / 2);
  roofGeo.rotateY(Math.PI / 2);
  const roof = new THREE.Mesh(roofGeo, blackCoverMat);
  roof.position.set(0, 1.28, -0.05);
  group.add(roof);

  // Front Windshield
  const winGeo = new THREE.PlaneGeometry(1.1, 0.55);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
  const win = new THREE.Mesh(winGeo, winMat);
  win.position.set(0, 1.15, 1.16);
  group.add(win);

  // Rear Hazard Bumper
  const bkgGeo = new THREE.BoxGeometry(1.42, 0.2, 0.1);
  const bkg = new THREE.Mesh(bkgGeo, yellowHazardMat);
  bkg.position.set(0, 0.45, -1.16);
  group.add(bkg);

  // 3 Wheels (1 front center, 2 rear)
  const frontW = createWheelMesh(0.24, 0.16);
  frontW.position.set(0, 0.24, 0.85);
  group.add(frontW);

  const rearWL = createWheelMesh(0.26, 0.18);
  rearWL.position.set(0.68, 0.26, -0.65);
  group.add(rearWL);

  const rearWR = createWheelMesh(0.26, 0.18);
  rearWR.position.set(-0.68, 0.26, -0.65);
  group.add(rearWR);

  // Headlight
  const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 10);
  lightGeo.rotateX(Math.PI / 2);
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xffedd5, emissiveIntensity: 0.6 });
  const headlight = new THREE.Mesh(lightGeo, lightMat);
  headlight.position.set(0, 0.8, 1.18);
  group.add(headlight);

  // Contact shadow
  const shadowGeo = new THREE.PlaneGeometry(2.0, 3.0);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * Creates Cycle Rickshaw 3D Model
 */
export function createRickshawMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Rickshaw';

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.6 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.7 });
  const hoodMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 });

  // Rear passenger seat
  const seatGeo = new THREE.BoxGeometry(1.2, 0.45, 0.7);
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.position.set(0, 0.75, -0.3);
  seat.castShadow = true;
  group.add(seat);

  // Painted Rear Hood
  const hoodGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.18, 10, 1, false, 0, Math.PI);
  hoodGeo.rotateZ(Math.PI / 2);
  hoodGeo.rotateY(Math.PI / 2);
  const hood = new THREE.Mesh(hoodGeo, hoodMat);
  hood.position.set(0, 1.35, -0.35);
  group.add(hood);

  // Driver Bicycle Frame
  const frameGeo = new THREE.BoxGeometry(0.12, 0.12, 1.4);
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 0.55, 0.5);
  group.add(frame);

  // Handlebars
  const handleGeo = new THREE.BoxGeometry(0.65, 0.08, 0.08);
  const handle = new THREE.Mesh(handleGeo, frameMat);
  handle.position.set(0, 1.05, 1.05);
  group.add(handle);

  // 3 Thin Wheels
  const fWheel = createWheelMesh(0.32, 0.09);
  fWheel.position.set(0, 0.32, 1.15);
  group.add(fWheel);

  const rWheelL = createWheelMesh(0.34, 0.1);
  rWheelL.position.set(0.62, 0.34, -0.4);
  group.add(rWheelL);

  const rWheelR = createWheelMesh(0.34, 0.1);
  rWheelR.position.set(-0.62, 0.34, -0.4);
  group.add(rWheelR);

  // Contact shadow
  const shadowGeo = new THREE.PlaneGeometry(1.8, 2.5);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * Creates Private Car / Yellow Taxi 3D Model
 */
export function createCarMesh(colorHex: number = 0xf8fafc, isTaxi: boolean = false): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Car';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.3,
    metalness: 0.4,
  });
  const winMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.9,
  });

  // Lower chassis
  const lowerGeo = new THREE.BoxGeometry(1.8, 0.55, 4.2);
  const lower = new THREE.Mesh(lowerGeo, bodyMat);
  lower.position.y = 0.5;
  lower.castShadow = true;
  group.add(lower);

  // Cabin
  const cabinGeo = new THREE.BoxGeometry(1.5, 0.55, 2.2);
  const cabin = new THREE.Mesh(cabinGeo, winMat);
  cabin.position.set(0, 0.98, -0.2);
  cabin.castShadow = true;
  group.add(cabin);

  // Taxi roof light
  if (isTaxi) {
    const taxiLightGeo = new THREE.BoxGeometry(0.5, 0.15, 0.2);
    const taxiLightMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.7 });
    const taxiLight = new THREE.Mesh(taxiLightGeo, taxiLightMat);
    taxiLight.position.set(0, 1.35, -0.2);
    group.add(taxiLight);
  }

  // 4 Wheels
  const wFL = createWheelMesh(0.3, 0.2);
  wFL.position.set(0.92, 0.3, 1.25);
  group.add(wFL);

  const wFR = createWheelMesh(0.3, 0.2);
  wFR.position.set(-0.92, 0.3, 1.25);
  group.add(wFR);

  const wRL = createWheelMesh(0.3, 0.2);
  wRL.position.set(0.92, 0.3, -1.25);
  group.add(wRL);

  const wRR = createWheelMesh(0.3, 0.2);
  wRR.position.set(-0.92, 0.3, -1.25);
  group.add(wRR);

  // Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.4, 4.6);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * Creates Dhaka Bus Stop Shelter with Waiting Crowd and Signboard
 */
export function createBusStopMesh(stopName: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `BusStop_${stopName}`;

  // Concrete Platform
  const platGeo = new THREE.BoxGeometry(4.0, 0.25, 14.0);
  const platMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
  const platform = new THREE.Mesh(platGeo, platMat);
  platform.position.y = 0.125;
  platform.receiveShadow = true;
  group.add(platform);

  // Passenger Shelter Canopy
  const roofGeo = new THREE.BoxGeometry(3.2, 0.12, 8.0);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0.5, 3.2, 0);
  roof.castShadow = true;
  group.add(roof);

  // Metal Support Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.0, 8);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
  const p1 = new THREE.Mesh(pillarGeo, pillarMat);
  p1.position.set(1.5, 1.6, -3.2);
  const p2 = p1.clone();
  p2.position.z = 3.2;
  group.add(p1);
  group.add(p2);

  // Illuminated Bus Stop Signboard
  const signGeo = new THREE.BoxGeometry(0.1, 0.7, 2.4);
  const signTex = createDestinationBoardTexture(stopName, '#38bdf8');
  const signMat = new THREE.MeshBasicMaterial({ map: signTex });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(-1.2, 2.7, 0);
  group.add(sign);

  // Yellow striped pickup zone marker on the road side
  const zoneGeo = new THREE.PlaneGeometry(3.5, 16.0);
  const zoneCanvas = document.createElement('canvas');
  zoneCanvas.width = 128;
  zoneCanvas.height = 512;
  const zctx = zoneCanvas.getContext('2d')!;
  zctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
  zctx.fillRect(0, 0, 128, 512);
  zctx.strokeStyle = '#eab308';
  zctx.lineWidth = 12;
  zctx.strokeRect(6, 6, 116, 500);
  // Diagonal caution lines
  for (let y = 0; y < 512; y += 48) {
    zctx.beginPath();
    zctx.moveTo(0, y);
    zctx.lineTo(128, y + 32);
    zctx.stroke();
  }
  const zoneTex = new THREE.CanvasTexture(zoneCanvas);
  zoneTex.colorSpace = THREE.SRGBColorSpace;
  const zoneMat = new THREE.MeshBasicMaterial({ map: zoneTex, transparent: true, opacity: 0.8, depthWrite: false });
  const zone = new THREE.Mesh(zoneGeo, zoneMat);
  zone.rotation.x = -Math.PI / 2;
  zone.position.set(-3.5, 0.025, 0);
  group.add(zone);

  // Waiting Passengers (stylized human figures waiting eagerly)
  const personColors = [0xd97706, 0x2563eb, 0x16a34a, 0x9333ea, 0xdc2626];
  for (let i = 0; i < 5; i++) {
    const personGroup = new THREE.Group();
    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.9, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: personColors[i % personColors.length], roughness: 0.8 });
    const pBody = new THREE.Mesh(bodyGeo, bodyMat);
    pBody.position.y = 0.45;
    personGroup.add(pBody);
    // Head
    const headGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const pHead = new THREE.Mesh(headGeo, headMat);
    pHead.position.y = 1.02;
    personGroup.add(pHead);

    personGroup.position.set(0.6 + (i % 2) * 0.4, 0.25, -2.5 + i * 1.25);
    group.add(personGroup);
  }

  return group;
}

/**
 * Creates Roadside Tea Stall ("টং দোকান") with tea kettle and tin roof
 */
export function createTeaStallMesh(): THREE.Group {
  const stall = new THREE.Group();
  stall.name = 'TongDokaan';

  // Wooden Counter
  const countGeo = new THREE.BoxGeometry(2.4, 0.9, 1.4);
  const countMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const counter = new THREE.Mesh(countGeo, countMat);
  counter.position.y = 0.45;
  stall.add(counter);

  // Slanted Tin Roof
  const tinGeo = new THREE.BoxGeometry(2.8, 0.08, 1.8);
  const tinMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
  const tin = new THREE.Mesh(tinGeo, tinMat);
  tin.position.set(0, 1.9, 0);
  tin.rotation.x = 0.15;
  stall.add(tin);

  // Aluminum Tea Kettle
  const kettleGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.3, 10);
  const kettleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
  const kettle = new THREE.Mesh(kettleGeo, kettleMat);
  kettle.position.set(-0.5, 1.05, 0);
  stall.add(kettle);

  // Bengali signboard "চায়ের টং"
  const signTex = createDestinationBoardTexture('গরম চা ও বিস্কুট ☕', '#f97316');
  const sGeo = new THREE.PlaneGeometry(1.6, 0.38);
  const sMat = new THREE.MeshBasicMaterial({ map: signTex });
  const sMesh = new THREE.Mesh(sGeo, sMat);
  sMesh.position.set(0, 1.6, 0.75);
  stall.add(sMesh);

  return stall;
}

const DHAKA_SHOP_LIST = [
  { name: 'মেডিসিন কর্নার ও ফার্মেসি', sub: '২৪ ঘণ্টা খোলা ★ প্রয়োজনীয় সব ঔষধ', bg: '#065f46', text: '#34d399' },
  { name: 'মা মিষ্টি ভাণ্ডার ও বেকারি', sub: 'টাটকা রসগোল্লা, চমচম ও প্যাটিস', bg: '#991b1b', text: '#fde047' },
  { name: 'গ্রামীণ ইলেকট্রনিক্স ও মোবাইল', sub: 'মোবাইল রিচার্জ ও বিকাশ-নগদ সেবা', bg: '#1e40af', text: '#93c5fd' },
  { name: 'আল-আমিন জেনারেল স্টোর', sub: 'চাল, ডাল, তেল ও নিত্যপ্রয়োজনীয় পণ্য', bg: '#854d0e', text: '#fef08a' },
  { name: 'ঢাকা অপটিক্যাল ও চশমা ঘর', sub: 'কম্পিউটারাইজড চোখের পরীক্ষা', bg: '#0369a1', text: '#7dd3fc' },
  { name: 'জনতা ব্যাংক এটিএম বুথ', sub: '২৪ ঘণ্টা নিরবচ্ছিন্ন ক্যাশ উত্তোলন', bg: '#166534', text: '#86efac' },
];

/**
 * Creates Highly Attractive, Stylized 3D Dhaka Multistorey Building
 * Features:
 * - Cantilevered 3D balconies with railings and plant boxes
 * - Ground floor commercial shops with colorful roll-up shutters, striped fabric awnings & illuminated Bengali signs
 * - Window sunshades (chajja) with glass frames
 * - Exterior AC compressor units
 * - Rooftop stairwell headhouse (সিঁড়িঘর), water tanks on stilts, parapets, and rooftop antennas
 */
export function createBuildingMesh(heightFloors: number = 5, colorHex: number = 0xb45309): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AttractiveDhakaBuilding';

  const width = 11.0;
  const depth = 9.0;
  const floorHeight = 3.2;
  const totalHeight = heightFloors * floorHeight;

  // 1. Main Architectural Facade (with rich matte masonry texture)
  const mainGeo = new THREE.BoxGeometry(width, totalHeight, depth);
  const mainMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.75,
    metalness: 0.1,
  });
  const mainBody = new THREE.Mesh(mainGeo, mainMat);
  mainBody.position.y = totalHeight / 2;
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  group.add(mainBody);

  // 2. Concrete Floor Slab Dividing Strips
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
  for (let f = 1; f <= heightFloors; f++) {
    const slabGeo = new THREE.BoxGeometry(width + 0.35, 0.22, depth + 0.35);
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.y = f * floorHeight;
    group.add(slab);
  }

  // 3. Ground Floor Commercial Shop (Street-level Dhaka shop)
  const shopData = DHAKA_SHOP_LIST[Math.floor(Math.random() * DHAKA_SHOP_LIST.length)];
  const shopSignTex = createShopSignTexture(shopData.name, shopData.sub, shopData.bg, shopData.text);

  // Signboard
  const signGeo = new THREE.PlaneGeometry(width * 0.88, 0.85);
  const signMat = new THREE.MeshBasicMaterial({ map: shopSignTex });
  const shopSign = new THREE.Mesh(signGeo, signMat);
  shopSign.position.set(0, floorHeight - 0.55, depth / 2 + 0.22);
  group.add(shopSign);

  // Striped Fabric Awning (শামিয়ানা) projecting over the sidewalk
  const awningGeo = new THREE.BoxGeometry(width * 0.92, 0.1, 1.4);
  const awningMat = new THREE.MeshStandardMaterial({
    color: Math.random() > 0.5 ? 0xd97706 : 0x0284c7,
    roughness: 0.6,
  });
  const awning = new THREE.Mesh(awningGeo, awningMat);
  awning.position.set(0, floorHeight - 1.05, depth / 2 + 0.75);
  awning.rotation.x = 0.18;
  group.add(awning);

  // Shop Rolling Shutter / Glass Door
  const shutterGeo = new THREE.BoxGeometry(width * 0.86, 1.6, 0.15);
  const shutterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.5 });
  const shutter = new THREE.Mesh(shutterGeo, shutterMat);
  shutter.position.set(0, 0.9, depth / 2 + 0.1);
  group.add(shutter);

  // 4. Upper Floors: Balconies, Windows, Sunshades & AC Units
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
  const balconyMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
  const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const acMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.3 });

  for (let f = 1; f < heightFloors; f++) {
    const floorY = f * floorHeight;

    // Balcony 1 (Left Bay)
    const balcSlabGeo = new THREE.BoxGeometry(2.8, 0.2, 1.3);
    const balcSlab = new THREE.Mesh(balcSlabGeo, slabMat);
    balcSlab.position.set(-2.8, floorY + 0.1, depth / 2 + 0.65);
    group.add(balcSlab);

    // Balcony Railing / Grill
    const grillGeo = new THREE.BoxGeometry(2.76, 0.75, 1.25);
    const grill = new THREE.Mesh(grillGeo, balconyMat);
    grill.position.set(-2.8, floorY + 0.55, depth / 2 + 0.65);
    group.add(grill);

    // Green Potted Plant Box on Balcony
    if (Math.random() > 0.3) {
      const plantGeo = new THREE.BoxGeometry(1.6, 0.3, 0.3);
      const plant = new THREE.Mesh(plantGeo, plantMat);
      plant.position.set(-2.8, floorY + 0.98, depth / 2 + 1.2);
      group.add(plant);
    }

    // Balcony French Glass Door behind the balcony
    const doorGeo = new THREE.PlaneGeometry(1.6, 2.0);
    const door = new THREE.Mesh(doorGeo, glassMat);
    door.position.set(-2.8, floorY + 1.2, depth / 2 + 0.03);
    group.add(door);

    // Window Bay (Right side)
    const winGeo = new THREE.PlaneGeometry(2.2, 1.4);
    const win = new THREE.Mesh(winGeo, glassMat);
    win.position.set(2.8, floorY + 1.5, depth / 2 + 0.03);
    group.add(win);

    // Window Sunshade (Chajja / সানশেড)
    const chajjaGeo = new THREE.BoxGeometry(2.5, 0.1, 0.55);
    const chajja = new THREE.Mesh(chajjaGeo, slabMat);
    chajja.position.set(2.8, floorY + 2.3, depth / 2 + 0.28);
    chajja.rotation.x = 0.12;
    group.add(chajja);

    // AC Outdoor Compressor Unit on the wall
    if (Math.random() > 0.4) {
      const acGeo = new THREE.BoxGeometry(0.75, 0.55, 0.45);
      const ac = new THREE.Mesh(acGeo, acMat);
      ac.position.set(4.4, floorY + 0.7, depth / 2 + 0.25);
      group.add(ac);
    }
  }

  // 5. Rooftop Details
  // Rooftop Parapet Wall around the perimeter
  const parapetGeo = new THREE.BoxGeometry(width + 0.2, 0.65, depth + 0.2);
  const parapet = new THREE.Mesh(parapetGeo, slabMat);
  parapet.position.y = totalHeight + 0.32;
  group.add(parapet);

  // Rooftop Stairwell Headhouse (সিঁড়িঘর)
  const stairGeo = new THREE.BoxGeometry(3.6, 2.4, 3.2);
  const stairMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8 });
  const stairHouse = new THREE.Mesh(stairGeo, stairMat);
  stairHouse.position.set(-2.5, totalHeight + 1.2, -1.0);
  group.add(stairHouse);

  // Water Tanks on elevated steel stilts (Classic Dhaka rooftop silhouette)
  const tankGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.4, 12);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.4 });
  const tank1 = new THREE.Mesh(tankGeo, tankMat);
  tank1.position.set(2.2, totalHeight + 1.2, 1.2);
  group.add(tank1);

  const tankStiltGeo = new THREE.BoxGeometry(1.6, 0.5, 1.6);
  const tankStilt = new THREE.Mesh(tankStiltGeo, slabMat);
  tankStilt.position.set(2.2, totalHeight + 0.25, 1.2);
  group.add(tankStilt);

  // Rooftop Telecommunication Cell Tower / Antenna Mast
  if (Math.random() > 0.4) {
    const mastGeo = new THREE.CylinderGeometry(0.06, 0.12, 4.5, 6);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(2.5, totalHeight + 2.25, -2.0);
    group.add(mast);

    // Blinking obstruction light bulb on top
    const beaconGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(2.5, totalHeight + 4.55, -2.0);
    group.add(beacon);
  }

  return group;
}

/**
 * Creates Elevated Metro Rail Viaduct Spanning Overhead Across the Avenue
 * Supports are placed on the curbs (x = ±11.5) so the roadway is 100% open!
 */
export function createMetroViaductMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'MetroRailViaduct';

  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 });
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7, metalness: 0.3 });

  // Left Curb Support Pier (on the sidewalk)
  const leftPierGeo = new THREE.CylinderGeometry(0.9, 1.1, 9.5, 12);
  const leftPier = new THREE.Mesh(leftPierGeo, concreteMat);
  leftPier.position.set(-11.5, 4.75, 0);
  leftPier.castShadow = true;
  group.add(leftPier);

  // Right Curb Support Pier (on the sidewalk)
  const rightPier = leftPier.clone();
  rightPier.position.x = 11.5;
  group.add(rightPier);

  // Portal Cross-Beam Spanning Across the Avenue
  const portalGeo = new THREE.BoxGeometry(26.0, 1.4, 3.0);
  const portal = new THREE.Mesh(portalGeo, beamMat);
  portal.position.set(0, 9.8, 0);
  portal.castShadow = true;
  group.add(portal);

  // Elevated Metro Rail Viaduct Tracks (Twin box girders)
  const girderGeo = new THREE.BoxGeometry(10.5, 1.8, 40.0);
  const girder = new THREE.Mesh(girderGeo, railMat);
  girder.position.set(0, 11.2, 0);
  girder.castShadow = true;
  group.add(girder);

  // Parapet safety barriers on track
  const barrierGeo = new THREE.BoxGeometry(0.3, 0.9, 40.0);
  const bL = new THREE.Mesh(barrierGeo, concreteMat);
  bL.position.set(-5.1, 12.3, 0);
  const bR = bL.clone();
  bR.position.x = 5.1;
  group.add(bL);
  group.add(bR);

  return group;
}
