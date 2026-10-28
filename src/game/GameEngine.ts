/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  BUS_SKINS,
  BusSkin,
  calculateSpeed,
  calculateDamage,
  calculateFare,
  checkNearMiss,
} from './rules.ts';
import {
  createBusMesh,
  createCNGMesh,
  createRickshawMesh,
  createCarMesh,
  createBusStopMesh,
  createTeaStallMesh,
  createBuildingMesh,
  createMetroViaductMesh,
  createBillboardTexture,
} from './graphics.ts';
import { soundManager } from './sound.ts';
import { getRandomDialogue, playBanglaSpeech, DialogueItem } from './dialogues.ts';

export interface GameEngineCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onDialogue: (dialogue: DialogueItem) => void;
  onGameOver: (finalStats: GameStats, reason: string) => void;
  onNearMissBonus: (bonusCash: number) => void;
  onStopArrival: (stopName: string) => void;
}

export interface GameStats {
  speed: number;
  distance: number;
  score: number;
  cash: number;
  passengers: number;
  damage: number;
  nextStopName: string;
  distanceToStop: number;
  combo: number;
}

export interface PlayerControls {
  gas: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
  horn: boolean;
}

interface TrafficEntity {
  mesh: THREE.Group;
  type: 'cng' | 'rickshaw' | 'car' | 'bus';
  speed: number;
  x: number;
  z: number;
  lane: number;
  targetLane: number;
  laneChangeTimer: number;
  width: number;
  length: number;
  active: boolean;
  swervedFromHorn: boolean;
}

interface RoadSegment {
  group: THREE.Group;
  z: number;
  hasStop: boolean;
  stopName?: string;
  stopZ?: number;
}

const DHAKA_STOPS = [
  'ফার্মগেট বাস স্টপ',
  'কারওয়ান বাজার',
  'শাহবাগ মোড়',
  'প্রেস ক্লাব মোড়',
  'পল্টন জংশন',
  'গুলিস্তান জিরো পয়েন্ট',
  'মতিঝিল শাপলা চত্বর',
  'সায়েদাবাদ বাস টার্মিনাল',
  'মহাখালী বাস টার্মিনাল',
  'মিরপুর ১০ গোলচত্বর',
];

const BILLBOARD_ADS = [
  { title: 'কাচ্চি ভাই বিরিয়ানি', sub: 'আসল বাসমতির স্বাদ ও বোরহানি', bg: '#991b1b', accent: '#fbbf24' },
  { title: 'বাংলালিঙ্ক ৪জি মেগা অফার', sub: '১০ জিবি মাত্র ৯৯ টাকা!', bg: '#ea580c', accent: '#fef08a' },
  { title: 'ঢাকা ড্রাইভ একাডেমি', sub: '১৫ দিনে লাইসেন্স গ্যারান্টি!', bg: '#15803d', accent: '#86efac' },
  { title: 'চন্দনপুর মিষ্টি ভাণ্ডার', sub: 'টাটকা রসগোল্লা ও চমচম', bg: '#4338ca', accent: '#c7d2fe' },
];

export class GameEngine {
  private container: HTMLDivElement;
  private callbacks: GameEngineCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  public isPaused: boolean = false;

  // Active Bus
  public currentSkin: BusSkin;
  private busMeshGroup!: THREE.Group;
  private busWheels: THREE.Group[] = [];

  // Player Bus State
  private busPos = new THREE.Vector3(0, 0, 0);
  private busVelocity = new THREE.Vector3(0, 0, 0);
  private busSpeedKmH: number = 0;
  private busSteerAngle: number = 0;
  private busDamage: number = 0;
  private busCash: number = 0;
  private busScore: number = 0;
  private busDistance: number = 0;
  private passengersCount: number = 0;
  private combo: number = 1;

  // Stop state
  private nextStopIndex: number = 0;
  private nextStopZ: number = 380;
  private currentStopName: string = DHAKA_STOPS[0];
  private isBoardingAtStop: boolean = false;
  private stopBoardingTimer: number = 0;

  // Camera Shake & Hitstop
  private hitstopTimer: number = 0;
  private cameraTrauma: number = 0;

  // World geometry
  private roadSegments: RoadSegment[] = [];
  private segmentLength: number = 120;
  private segmentCount: number = 5;

  // Traffic
  private trafficPool: TrafficEntity[] = [];
  private maxTraffic: number = 12;

  // Input
  public controls: PlayerControls = {
    gas: false,
    brake: false,
    left: false,
    right: false,
    handbrake: false,
    horn: false,
  };

  // Reusable math objects (Zero GC in loop)
  private _camTarget = new THREE.Vector3();
  private _lookTarget = new THREE.Vector3();

  constructor(container: HTMLDivElement, skin: BusSkin, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.currentSkin = skin;
    this.callbacks = callbacks;

    this.initRenderer();
    this.initScene();
    this.initPlayerBus();
    this.initRoads();
    this.initTraffic();

    this.startLoop();
  }

  private initRenderer(): void {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {
      this.isSoftwareGl = true;
    } else {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    }

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.5, 300);
    this.camera.position.set(0, 5.5, -9);
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    // Warm Dhaka afternoon sky with gentle horizon fog
    const skyColor = new THREE.Color(0x93c5fd);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2(0x93c5fd, 0.009);

    // Studio environment reflections
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Warm Key Directional Sunlight
    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    dirLight.position.set(25, 45, 30);
    if (!this.isSoftwareGl) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 120;
      const d = 30;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    // Cool blue hemisphere sky fill
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.95);
    this.scene.add(hemiLight);
  }

  private initPlayerBus(): void {
    const { busGroup, wheels } = createBusMesh(this.currentSkin);
    this.busMeshGroup = busGroup;
    this.busWheels = wheels;
    this.busPos.set(0, 0, 0);
    this.busMeshGroup.position.copy(this.busPos);
    this.scene.add(this.busMeshGroup);
  }

  public setSkin(skin: BusSkin): void {
    this.currentSkin = skin;
    this.scene.remove(this.busMeshGroup);
    const { busGroup, wheels } = createBusMesh(skin);
    this.busMeshGroup = busGroup;
    this.busWheels = wheels;
    this.busMeshGroup.position.copy(this.busPos);
    this.busMeshGroup.rotation.y = this.busSteerAngle * 0.4;
    this.scene.add(this.busMeshGroup);
  }

  private buildRoadSegment(zCenter: number, hasStop: boolean, stopName?: string): RoadSegment {
    const group = new THREE.Group();
    group.position.z = zCenter;

    const roadWidth = 18;
    const len = this.segmentLength;

    // Asphalt Main Road Surface (wide 4-lane Dhaka Avenue)
    const roadGeo = new THREE.PlaneGeometry(roadWidth, len);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    group.add(road);

    // Double Solid Yellow Center Line (Flat on road, no collision blockage)
    const centerLineGeo = new THREE.PlaneGeometry(0.18, len);
    const centerLineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const cLine1 = new THREE.Mesh(centerLineGeo, centerLineMat);
    cLine1.rotation.x = -Math.PI / 2;
    cLine1.position.set(-0.2, 0.012, 0);
    group.add(cLine1);

    const cLine2 = new THREE.Mesh(centerLineGeo, centerLineMat);
    cLine2.rotation.x = -Math.PI / 2;
    cLine2.position.set(0.2, 0.012, 0);
    group.add(cLine2);

    // Lane Markings (White dashed lines dividing lanes 1-2 and 3-4)
    const lineGeo = new THREE.PlaneGeometry(0.18, 4.0);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let lz = -len / 2 + 3; lz < len / 2; lz += 9) {
      // Left lane dash
      const dashL = new THREE.Mesh(lineGeo, lineMat);
      dashL.rotation.x = -Math.PI / 2;
      dashL.position.set(-4.5, 0.015, lz);
      group.add(dashL);

      // Right lane dash
      const dashR = new THREE.Mesh(lineGeo, lineMat);
      dashR.rotation.x = -Math.PI / 2;
      dashR.position.set(4.5, 0.015, lz);
      group.add(dashR);
    }

    // Sidewalks (Curbs) on left & right
    const curbWidth = 6.0;
    const curbGeo = new THREE.BoxGeometry(curbWidth, 0.35, len);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });

    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-roadWidth / 2 - curbWidth / 2, 0.175, 0);
    group.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(roadWidth / 2 + curbWidth / 2, 0.175, 0);
    group.add(rightCurb);

    // Metro Rail Viaduct Pillar overhead in the center median every segment
    const viaduct = createMetroViaductMesh();
    viaduct.position.set(0, 0, 0);
    group.add(viaduct);

    // Roadside Buildings on flanks (Vibrant colorful Dhaka urban corridor)
    const dhakaBuildingColors = [
      0xc2410c, // Terracotta red brick
      0x059669, // Mint / Pistachio green
      0xd97706, // Warm amber ochre
      0x0284c7, // Vibrant sky blue
      0xb45309, // Burnt orange
      0x0f766e, // Deep teal
      0x7c3aed, // Royal violet accent
      0xca8a04, // Mustard yellow
    ];

    for (let side = -1; side <= 1; side += 2) {
      for (let bz = -len / 2 + 12; bz < len / 2; bz += 22) {
        const floors = 3 + Math.floor(Math.random() * 4); // 3 to 6 stories
        const col = dhakaBuildingColors[Math.floor(Math.random() * dhakaBuildingColors.length)];
        const bldg = createBuildingMesh(floors, col);

        // Position flush against the sidewalk
        const buildingX = side * (roadWidth / 2 + curbWidth + 4.5);
        bldg.position.set(buildingX, 0, bz);

        // Rotate facade to face inward toward the road
        bldg.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
        group.add(bldg);
      }
    }

    // Roadside Street Lights along both curbs
    const lampPoleGeo = new THREE.CylinderGeometry(0.08, 0.1, 5.5, 8);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const lampHeadGeo = new THREE.BoxGeometry(0.3, 0.15, 0.8);
    const lightBulbGeo = new THREE.BoxGeometry(0.25, 0.08, 0.6);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.8,
    });

    for (let side = -1; side <= 1; side += 2) {
      for (let lz = -len / 2 + 18; lz < len / 2; lz += 40) {
        const lampGroup = new THREE.Group();
        const pole = new THREE.Mesh(lampPoleGeo, lampMat);
        pole.position.y = 2.75;
        lampGroup.add(pole);

        const head = new THREE.Mesh(lampHeadGeo, lampMat);
        head.position.set(side * -0.3, 5.5, 0);
        lampGroup.add(head);

        const bulb = new THREE.Mesh(lightBulbGeo, bulbMat);
        bulb.position.set(side * -0.3, 5.42, 0);
        lampGroup.add(bulb);

        lampGroup.position.set(side * (roadWidth / 2 + 0.8), 0.35, lz);
        group.add(lampGroup);
      }
    }

    // Roadside Tea Stall on right side
    if (Math.random() > 0.35) {
      const stall = createTeaStallMesh();
      stall.position.set(roadWidth / 2 + 2.2, 0.35, len * 0.25);
      stall.rotation.y = -Math.PI / 2;
      group.add(stall);
    }

    // Roadside Billboard
    const ad = BILLBOARD_ADS[Math.floor(Math.random() * BILLBOARD_ADS.length)];
    const bbTex = createBillboardTexture(ad.title, ad.sub, ad.bg, ad.accent);
    const bbGeo = new THREE.PlaneGeometry(8, 4);
    const bbMat = new THREE.MeshBasicMaterial({ map: bbTex });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.position.set(-roadWidth / 2 - 2.5, 5.5, -len * 0.2);
    bbMesh.rotation.y = Math.PI / 2;
    group.add(bbMesh);

    // Billboard poles
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.0, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.position.set(-roadWidth / 2 - 2.5, 2.0, -len * 0.2 - 2.5);
    const pole2 = pole1.clone();
    pole2.position.z = -len * 0.2 + 2.5;
    group.add(pole1);
    group.add(pole2);

    // Bus Stop if specified
    let stopZ: number | undefined;
    if (hasStop && stopName) {
      const busStop = createBusStopMesh(stopName);
      stopZ = zCenter;
      busStop.position.set(-roadWidth / 2 - 1.2, 0.35, 0);
      group.add(busStop);
    }

    this.scene.add(group);
    return { group, z: zCenter, hasStop, stopName, stopZ };
  }

  private initRoads(): void {
    for (let i = 0; i < this.segmentCount; i++) {
      const z = i * this.segmentLength;
      const isStopSegment = i === 3;
      const stopName = isStopSegment ? DHAKA_STOPS[this.nextStopIndex % DHAKA_STOPS.length] : undefined;
      const seg = this.buildRoadSegment(z, isStopSegment, stopName);
      this.roadSegments.push(seg);
      if (isStopSegment) {
        this.nextStopZ = z;
        this.currentStopName = stopName!;
      }
    }
  }

  private initTraffic(): void {
    const lanes = [-6.2, -2.5, 2.5, 6.2];
    const types: ('cng' | 'rickshaw' | 'car' | 'bus')[] = ['cng', 'rickshaw', 'car', 'cng', 'bus', 'car'];

    for (let i = 0; i < this.maxTraffic; i++) {
      const type = types[i % types.length];
      let mesh: THREE.Group;
      let width = 2.0;
      let length = 4.0;
      let speed = 25;

      if (type === 'cng') {
        mesh = createCNGMesh();
        width = 1.6;
        length = 2.4;
        speed = 35 + Math.random() * 20;
      } else if (type === 'rickshaw') {
        mesh = createRickshawMesh();
        width = 1.4;
        length = 2.2;
        speed = 14 + Math.random() * 8;
      } else if (type === 'car') {
        mesh = createCarMesh(Math.random() > 0.5 ? 0xfacc15 : 0xf8fafc, Math.random() > 0.5);
        width = 2.0;
        length = 4.2;
        speed = 40 + Math.random() * 25;
      } else {
        const rivalSkin = BUS_SKINS[(i + 1) % BUS_SKINS.length];
        const res = createBusMesh(rivalSkin);
        mesh = res.busGroup;
        width = 2.5;
        length = 7.6;
        speed = 45 + Math.random() * 20;
      }

      const laneIdx = Math.floor(Math.random() * lanes.length);
      const laneX = lanes[laneIdx];
      const z = 40 + i * 28;

      mesh.position.set(laneX, 0, z);
      this.scene.add(mesh);

      this.trafficPool.push({
        mesh,
        type,
        speed,
        x: laneX,
        z,
        lane: laneIdx,
        targetLane: laneIdx,
        laneChangeTimer: 2 + Math.random() * 5,
        width,
        length,
        active: true,
        swervedFromHorn: false,
      });
    }
  }

  public honkHorn(): void {
    const success = soundManager.playHorn(this.currentSkin.hornType);
    if (!success) return;

    // Traffic reaction: Vehicles immediately ahead swerve to avoid the bus!
    let affectedCount = 0;
    this.trafficPool.forEach(t => {
      if (t.active && t.z > this.busPos.z && t.z < this.busPos.z + 45) {
        if (!t.swervedFromHorn) {
          t.swervedFromHorn = true;
          // Swerve outward away from center
          if (t.x < 0) {
            t.targetLane = 0; // far left lane
            t.x -= 1.2;
          } else {
            t.targetLane = 3; // far right lane
            t.x += 1.2;
          }
          affectedCount++;
        }
      }
    });

    if (affectedCount > 0 && Math.random() > 0.4) {
      const dialogue = getRandomDialogue('horn_reaction');
      this.callbacks.onDialogue(dialogue);
      playBanglaSpeech(dialogue.text, soundManager.voiceEnabled);
    }
  }

  private updateRoads(): void {
    const minZ = this.busPos.z - this.segmentLength * 1.5;
    const maxZ = Math.max(...this.roadSegments.map(s => s.z));

    this.roadSegments.forEach(seg => {
      if (seg.z < minZ) {
        // Recycle to the front
        const newZ = maxZ + this.segmentLength;
        seg.group.position.z = newZ;
        seg.z = newZ;

        // Check if next stop should appear
        const shouldHaveStop = Math.random() > 0.45;
        if (shouldHaveStop && !seg.hasStop) {
          this.nextStopIndex++;
          this.currentStopName = DHAKA_STOPS[this.nextStopIndex % DHAKA_STOPS.length];
          this.nextStopZ = newZ;
          this.callbacks.onStopArrival(this.currentStopName);
        }
      }
    });
  }

  private updateTraffic(dt: number): void {
    const lanes = [-6.2, -2.5, 2.5, 6.2];

    this.trafficPool.forEach(entity => {
      if (!entity.active) return;

      // Move forward along Z
      const moveDistance = (entity.speed * 1000 / 3600) * dt;
      entity.z += moveDistance;

      // Lane change behavior
      entity.laneChangeTimer -= dt;
      if (entity.laneChangeTimer <= 0) {
        entity.laneChangeTimer = 3 + Math.random() * 6;
        if (entity.type === 'cng' || entity.type === 'car') {
          // CNGs and cars love to dart lanes
          const delta = Math.random() > 0.5 ? 1 : -1;
          const nextLane = Math.max(0, Math.min(lanes.length - 1, entity.lane + delta));
          entity.targetLane = nextLane;
        }
      }

      // Smooth lane glide
      const targetX = lanes[entity.targetLane];
      entity.x = THREE.MathUtils.damp(entity.x, targetX, 2.5, dt);

      entity.mesh.position.set(entity.x, 0, entity.z);

      // Check Near-Miss with Player Bus
      const relSpeed = Math.abs(this.busSpeedKmH - entity.speed);
      const isNear = checkNearMiss(
        this.busPos.x,
        this.busPos.z,
        2.5,
        7.6,
        entity.x,
        entity.z,
        entity.width,
        entity.length,
        relSpeed
      );

      if (isNear && Math.random() > 0.6) {
        const bonus = 50 * this.combo;
        this.busCash += bonus;
        this.busScore += 150 * this.combo;
        soundManager.playNearMiss();
        this.callbacks.onNearMissBonus(bonus);

        if (Math.random() > 0.6) {
          const dialogue = getRandomDialogue('near_miss');
          this.callbacks.onDialogue(dialogue);
          playBanglaSpeech(dialogue.text, soundManager.voiceEnabled);
        }
      }

      // Check Collision with Player Bus
      const dx = Math.abs(this.busPos.x - entity.x);
      const dz = Math.abs(this.busPos.z - entity.z);
      const contactX = (2.5 + entity.width) * 0.48;
      const contactZ = (7.6 + entity.length) * 0.48;

      if (dx < contactX && dz < contactZ) {
        // Impact!
        const hitSpeed = Math.max(15, this.busSpeedKmH);
        this.busSpeedKmH = Math.max(0, this.busSpeedKmH * 0.4);
        this.busDamage = calculateDamage(this.busDamage, hitSpeed, true);
        this.cameraTrauma = Math.min(1.0, this.cameraTrauma + 0.6);
        this.hitstopTimer = 0.05; // 50ms hitstop
        this.combo = 1; // reset combo

        soundManager.playCrash('heavy');

        // Shove vehicle away
        entity.z += 8;
        entity.speed *= 0.5;

        const crashDialogue = getRandomDialogue('crash');
        this.callbacks.onDialogue(crashDialogue);
        playBanglaSpeech(crashDialogue.text, soundManager.voiceEnabled);

        if (this.busDamage >= 100) {
          this.triggerGameOver('বাসের ইঞ্জিন আর আপনার ধৈর্য—দুটোই ভেঙে গেছে!');
        }
      }

      // Recycle if too far behind
      if (entity.z < this.busPos.z - 40) {
        entity.z = this.busPos.z + 180 + Math.random() * 80;
        entity.lane = Math.floor(Math.random() * lanes.length);
        entity.targetLane = entity.lane;
        entity.x = lanes[entity.lane];
        entity.swervedFromHorn = false;
      }
    });
  }

  private updateBusPhysics(dt: number): void {
    const { gas, brake, left, right, handbrake } = this.controls;

    // Acceleration & Speed
    this.busSpeedKmH = calculateSpeed(
      this.busSpeedKmH,
      gas,
      brake,
      handbrake,
      this.currentSkin.acceleration,
      this.currentSkin.maxSpeed,
      dt
    );

    // Update sound engine pitch
    soundManager.updateEngineSpeed(this.busSpeedKmH, gas);

    // Steering & Lateral Movement
    const speedRatio = Math.min(1.0, this.busSpeedKmH / 40);
    const steerSpeed = (left ? -1 : 0) + (right ? 1 : 0);
    const steerForce = steerSpeed * this.currentSkin.handling * 8.5 * speedRatio;

    this.busPos.x += steerForce * dt;
    // Clamp to road bounds
    this.busPos.x = Math.max(-8.2, Math.min(8.2, this.busPos.x));

    // Move forward along Z
    const forwardSpeedMps = (this.busSpeedKmH * 1000) / 3600;
    this.busPos.z += forwardSpeedMps * dt;
    this.busDistance += forwardSpeedMps * dt;
    this.busScore += Math.floor(forwardSpeedMps * dt * 2.5);

    // Steer tilt & wheel turning
    this.busSteerAngle = THREE.MathUtils.damp(
      this.busSteerAngle,
      steerSpeed * 0.35,
      6.0,
      dt
    );

    this.busMeshGroup.position.copy(this.busPos);
    this.busMeshGroup.rotation.y = this.busSteerAngle * 0.45;
    this.busMeshGroup.rotation.z = -this.busSteerAngle * 0.08 * (this.busSpeedKmH / 60);

    // Roll wheels
    const wheelRotDelta = (forwardSpeedMps / 0.44) * dt;
    this.busWheels.forEach((wheel, idx) => {
      wheel.rotation.x += wheelRotDelta;
      if (idx < 2) {
        // Front wheels turn with steering
        wheel.rotation.y = this.busSteerAngle * 0.6;
      }
    });
  }

  private updatePassengerStop(dt: number): void {
    const distToStop = Math.abs(this.nextStopZ - this.busPos.z);
    const isAtStopZone = distToStop < 16 && Math.abs(this.busPos.x - (-4.5)) < 3.8;

    if (isAtStopZone && this.busSpeedKmH < 22) {
      if (!this.isBoardingAtStop) {
        this.isBoardingAtStop = true;
        this.stopBoardingTimer = 0;
      }

      this.stopBoardingTimer += dt;
      if (this.stopBoardingTimer > 0.8) {
        this.stopBoardingTimer = 0;
        // Board a batch of 3-5 passengers
        const newPassengers = 3 + Math.floor(Math.random() * 3);
        this.passengersCount += newPassengers;
        this.combo = Math.min(5, this.combo + 1);

        const { cashEarned, bonusPoints } = calculateFare(newPassengers, this.combo);
        this.busCash += cashEarned;
        this.busScore += bonusPoints;

        soundManager.playCoinChime();
        soundManager.playPassengerBoard();

        const dlg = getRandomDialogue('helper_call');
        this.callbacks.onDialogue(dlg);
        playBanglaSpeech(dlg.text, soundManager.voiceEnabled);
      }
    } else {
      this.isBoardingAtStop = false;
    }
  }

  private updateCamera(dt: number): void {
    // Dynamic chase camera following bus with exponential damping
    const speedKmh = this.busSpeedKmH;
    const targetDistance = 8.8 + (speedKmh / 100) * 2.2;
    const targetHeight = 4.8 + (speedKmh / 100) * 1.4;

    this._camTarget.set(
      this.busPos.x * 0.45,
      this.busPos.y + targetHeight,
      this.busPos.z - targetDistance
    );

    // Apply Camera Shake / Trauma
    if (this.cameraTrauma > 0) {
      this.cameraTrauma = Math.max(0, this.cameraTrauma - dt * 2.2);
      const shake = this.cameraTrauma * this.cameraTrauma * 0.45;
      this._camTarget.x += (Math.random() * 2 - 1) * shake;
      this._camTarget.y += (Math.random() * 2 - 1) * shake;
    }

    this.camera.position.lerp(this._camTarget, 1 - Math.exp(-9 * dt));

    this._lookTarget.set(
      this.busPos.x * 0.25,
      this.busPos.y + 1.4,
      this.busPos.z + 18
    );
    this.camera.lookAt(this._lookTarget);
  }

  private tick = (timestamp: number) => {
    if (!this.isRunning) return;

    if (!this.lastTime) this.lastTime = timestamp;
    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    const dt = Math.min(rawDt, 0.05);

    if (!this.isPaused) {
      // Hitstop logic
      if (this.hitstopTimer > 0) {
        this.hitstopTimer -= dt;
      } else {
        this.updateBusPhysics(dt);
        this.updateTraffic(dt);
        this.updateRoads();
        this.updatePassengerStop(dt);
      }

      this.updateCamera(dt);

      // Stats Callback (Throttled for React UI)
      this.callbacks.onStatsUpdate({
        speed: this.busSpeedKmH,
        distance: this.busDistance,
        score: this.busScore,
        cash: this.busCash,
        passengers: this.passengersCount,
        damage: this.busDamage,
        nextStopName: this.currentStopName,
        distanceToStop: Math.max(0, this.nextStopZ - this.busPos.z),
        combo: this.combo,
      });
    }

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(() => {
        if (this.isRunning) {
          this.frameId = requestAnimationFrame(this.tick);
        }
      });
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        window.setTimeout(cb, 60);
      }
    };
    window.setTimeout(poll, 5);
  }

  public startLoop(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = 0;
    soundManager.startEngine();
    this.frameId = requestAnimationFrame(this.tick);
  }

  public stopLoop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.frameId);
    soundManager.stopEngine();
  }

  public restart(): void {
    this.busPos.set(0, 0, 0);
    this.busSpeedKmH = 0;
    this.busSteerAngle = 0;
    this.busDamage = 0;
    this.busDistance = 0;
    this.busScore = 0;
    this.passengersCount = 0;
    this.combo = 1;
    this.nextStopIndex = 0;
    this.nextStopZ = 380;
    this.currentStopName = DHAKA_STOPS[0];
    this.isPaused = false;

    // Reset traffic
    const lanes = [-6.2, -2.5, 2.5, 6.2];
    this.trafficPool.forEach((entity, idx) => {
      entity.z = 40 + idx * 28;
      entity.lane = Math.floor(Math.random() * lanes.length);
      entity.targetLane = entity.lane;
      entity.x = lanes[entity.lane];
      entity.swervedFromHorn = false;
    });

    this.busMeshGroup.position.copy(this.busPos);
    this.camera.position.set(0, 5.5, -9);

    soundManager.startEngine();
  }

  private triggerGameOver(reason: string): void {
    this.isPaused = true;
    soundManager.stopEngine();
    soundManager.playCrash('heavy');

    const goDlg = getRandomDialogue('game_over');
    playBanglaSpeech(goDlg.text, soundManager.voiceEnabled);

    this.callbacks.onGameOver(
      {
        speed: 0,
        distance: this.busDistance,
        score: this.busScore,
        cash: this.busCash,
        passengers: this.passengersCount,
        damage: this.busDamage,
        nextStopName: this.currentStopName,
        distanceToStop: 0,
        combo: 1,
      },
      reason
    );
  }

  public handleResize(width: number, height: number): void {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    this.stopLoop();
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
