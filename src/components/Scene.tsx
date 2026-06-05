'use client';

import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState, createContext, useContext, Suspense } from 'react';
import { Line, Html, Billboard, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

// Suppress THREE.Clock deprecation warnings originating from react-three-fiber internal usage
if (typeof window !== 'undefined') {
  THREE.setConsoleFunction((type, message, ...params) => {
    if (type === 'warn' && typeof message === 'string' && message.includes('Clock: This module has been deprecated')) {
      return;
    }
    if (type === 'log') {
      console.log(message, ...params);
    } else if (type === 'warn') {
      console.warn(message, ...params);
    } else if (type === 'error') {
      console.error(message, ...params);
    }
  });
}

interface TimerContextType {
  timer: THREE.Timer;
  coreRef: React.RefObject<THREE.Group | null>;
  scrollProgressRef: React.MutableRefObject<number>;
  lowPerf: boolean;
}

const TimerContext = createContext<TimerContextType | null>(null);

function useSharedTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useSharedTimer must be used within a TimerProvider');
  }
  return context;
}

function TimerUpdater({ timer }: { timer: THREE.Timer }) {
  useFrame(() => {
    timer.update();
  });
  return null;
}

const MODULES = [
  { name: 'ReconX', angle: (0 * 2 * Math.PI) / 18 },
  { name: 'CheckOut', angle: (1 * 2 * Math.PI) / 18 },
  { name: 'Payment Gateway', angle: (2 * 2 * Math.PI) / 18 },
  { name: 'Merchant Mobile App', angle: (3 * 2 * Math.PI) / 18 },
  { name: 'Connected Banking', angle: (4 * 2 * Math.PI) / 18 },
  { name: 'Payment Partner', angle: (5 * 2 * Math.PI) / 18 },
  { name: 'Payment Orchestration', angle: (6 * 2 * Math.PI) / 18 },
  { name: 'Travel API', angle: (7 * 2 * Math.PI) / 18 },
  { name: 'Payment Links & Forms', angle: (8 * 2 * Math.PI) / 18 },
  { name: 'Education ERP', angle: (9 * 2 * Math.PI) / 18 },
  { name: 'Housing Society ERP', angle: (10 * 2 * Math.PI) / 18 },
  { name: 'B2B Solution', angle: (11 * 2 * Math.PI) / 18 },
  { name: 'RewardX', angle: (12 * 2 * Math.PI) / 18 },
  { name: 'Saloonz', angle: (13 * 2 * Math.PI) / 18 },
  { name: 'TempleG', angle: (14 * 2 * Math.PI) / 18 },
  { name: 'PigmyX', angle: (15 * 2 * Math.PI) / 18 },
  { name: 'ParkingX', angle: (16 * 2 * Math.PI) / 18 },
  { name: 'StoryBox', angle: (17 * 2 * Math.PI) / 18 },
];

function getActiveIndex(progress: number) {
  if (progress < 0.05) return -1;
  const numServices = 18;
  // Map scroll progress from 5% to 95% evenly into 18 segments
  const segment = (progress - 0.05) / (0.90 / numServices);
  const idx = Math.floor(segment);
  return idx >= 0 && idx < numServices ? idx : (idx >= numServices ? numServices - 1 : -1);
}

function FloatingParticles({ count = 30 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 12;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 12;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return temp;
  }, [count]);

  const { timer, scrollProgressRef, lowPerf } = useSharedTimer();
  const materialRef = useRef<THREE.PointsMaterial>(null);

  if (lowPerf) return null;

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = timer.getElapsed() * 0.015;
    }
    const progress = scrollProgressRef.current;
    const t = Math.min(progress / 0.04, 1);
    if (materialRef.current) {
      materialRef.current.opacity = t * 0.25;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#22d3ee"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0}
      />
    </points>
  );
}

function EcosystemModuleNode({ name, index, basePosition }: { name: string; index: number; basePosition: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<any>(null);

  const { timer, scrollProgressRef, lowPerf } = useSharedTimer();
  const [stateValues, setStateValues] = useState({ activeIndex: -1, progressT: 0, isMobile: false });

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current;
    const activeIndex = getActiveIndex(progress);
    const isActive = activeIndex === index;
    const isAnyActive = activeIndex !== -1;

    const introFadeFactor = Math.min(progress / 0.08, 1);
    const isMobile = state.size.width < 768;

    if (
      stateValues.activeIndex !== activeIndex || 
      stateValues.progressT !== introFadeFactor || 
      stateValues.isMobile !== isMobile
    ) {
      setStateValues({ activeIndex, progressT: introFadeFactor, isMobile });
    }

    // Target positions and scales
    const targetScale = isActive ? 1.6 : 1.0;
    const targetOpacity = ((!isAnyActive) ? 1.0 : (isActive ? 1.0 : 0.22)) * introFadeFactor;
    const targetLineOpacity = ((!isAnyActive) ? 0.22 : (isActive ? 0.8 : 0.04)) * introFadeFactor;
    const targetLineWidth = isActive ? 3.0 : 1.0;

    const targetZOffset = isActive ? 1.4 : 0.0;
    const targetPosition = [
      basePosition[0],
      basePosition[1],
      basePosition[2] + targetZOffset
    ];

    // Frame-rate independent lerp (k = 5.0 for smooth, floaty transitions)
    const lerpFactor = 1 - Math.exp(-5.0 * delta);

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosition[0], lerpFactor);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosition[1], lerpFactor);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosition[2], lerpFactor);
    }

    if (meshRef.current) {
      const pulse = 1.0 + Math.sin(timer.getElapsed() * 3 + index) * 0.08;
      const currentScale = targetScale * pulse;
      meshRef.current.scale.set(currentScale, currentScale, currentScale);
      
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, lerpFactor);
        mat.color.set(isActive ? '#22d3ee' : '#0891b2');
      }
    }

    if (glowRingRef.current) {
      const ringMat = glowRingRef.current.material as THREE.MeshBasicMaterial;
      if (ringMat) {
        ringMat.opacity = THREE.MathUtils.lerp(ringMat.opacity, targetOpacity * 0.3, lerpFactor);
      }
      glowRingRef.current.scale.set(targetScale * 1.5, targetScale * 1.5, targetScale * 1.5);
    }

    if (lineRef.current) {
      lineRef.current.material.opacity = THREE.MathUtils.lerp(lineRef.current.material.opacity, targetLineOpacity, lerpFactor);
      lineRef.current.material.linewidth = THREE.MathUtils.lerp(lineRef.current.material.linewidth, targetLineWidth, lerpFactor);
      
      const currentPos = groupRef.current ? groupRef.current.position : new THREE.Vector3(...basePosition);
      lineRef.current.geometry.setPositions([0, 0, 0, currentPos.x, currentPos.y, currentPos.z]);
    }
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={[[0, 0, 0], basePosition]}
        color="#22d3ee"
        lineWidth={1.0}
        transparent
        opacity={0.22}
      />

      <group ref={groupRef} position={basePosition}>
        {/* Optimized geometry polygon counts: 8x8 sphere and 6x16 torus */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#0891b2" transparent opacity={1.0} />
        </mesh>
        
        <mesh ref={glowRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.004, 6, 16]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>

        {(!stateValues.isMobile || stateValues.activeIndex === index) && (
          <Html position={[0, 0.28, 0]} center distanceFactor={7}>
            <ActiveLabelWrapper 
              name={name} 
              index={index} 
              activeIndex={stateValues.activeIndex} 
              progressT={stateValues.progressT} 
              isMobile={stateValues.isMobile}
            />
          </Html>
        )}
      </group>
    </>
  );
}

function ActiveLabelWrapper({ 
  name, 
  index, 
  activeIndex, 
  progressT, 
  isMobile 
}: { 
  name: string; 
  index: number; 
  activeIndex: number; 
  progressT: number; 
  isMobile: boolean;
}) {
  let opacityClass = 'scale-90';
  let baseOpacity = 0.8;
  
  if (activeIndex === -1) {
    if (isMobile) {
      // Hide all labels on mobile when zoomed out to prevent clutter
      return null;
    }
    opacityClass = 'scale-100';
    baseOpacity = 0.8;
  } else if (activeIndex === index) {
    opacityClass = 'scale-110 border-cyan-400 text-cyan-900 shadow-md font-bold';
    baseOpacity = 1.0;
  } else {
    if (isMobile) {
      // Hide non-active labels completely on mobile
      return null;
    }
    opacityClass = 'scale-90 pointer-events-none';
    baseOpacity = 0.2;
  }
  const opacityStyle = progressT * baseOpacity;

  return (
    <div 
      className={`px-2.5 py-1 text-[9px] text-cyan-800 bg-white/85 backdrop-blur-md border border-cyan-200/50 rounded-lg whitespace-nowrap select-none transition-all duration-500 ease-out ${opacityClass}`}
      style={{ opacity: opacityStyle }}
    >
      {name}
    </div>
  );
}

function ThinRing({ radius, color = '#22d3ee', opacity = 0.15, rotationSpeed = 0 }: { radius: number; color?: string; opacity?: number; rotationSpeed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { scrollProgressRef, lowPerf } = useSharedTimer();

  if (lowPerf && radius > 2.0) return null;

  useFrame((_, delta) => {
    if (ref.current && rotationSpeed !== 0) {
      ref.current.rotation.z += delta * rotationSpeed;
    }
    const progress = scrollProgressRef.current;
    const t = Math.min(progress / 0.04, 1);
    
    if (materialRef.current) {
      materialRef.current.opacity = t * opacity;
    }
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[radius - 0.006, radius + 0.006, 64]} />
      <meshBasicMaterial 
        ref={materialRef}
        color={color} 
        transparent 
        opacity={0} 
        side={THREE.DoubleSide} 
        depthWrite={false} 
      />
    </mesh>
  );
}

function NetworkDottedRing({ radius, count = 36, speed = 0.02, color = '#22d3ee', opacity = 0.2 }: { radius: number; count?: number; speed?: number; color?: string; opacity?: number }) {
  const ref = useRef<THREE.Group>(null);
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const { scrollProgressRef, lowPerf } = useSharedTimer();

  if (lowPerf) return null;
  
  const dots = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      temp.push(new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
    }
    return temp;
  }, [radius, count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
    const progress = scrollProgressRef.current;
    const t = Math.min(progress / 0.04, 1);

    materialRefs.current.forEach((mat) => {
      if (mat) {
        mat.opacity = t * opacity;
      }
    });
  });

  return (
    <group ref={ref}>
      {dots.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <circleGeometry args={[0.015, 8]} />
          <meshBasicMaterial 
            ref={(el) => { materialRefs.current[idx] = el; }}
            color={color} 
            transparent 
            opacity={0} 
            depthWrite={false} 
          />
        </mesh>
      ))}
    </group>
  );
}

function JodeTxCore() {
  const { timer, coreRef, scrollProgressRef, lowPerf } = useSharedTimer();
  const logoTexture = useLoader(THREE.TextureLoader, '/jodetxlong.png');
  const ecosystemTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoTexture) {
      logoTexture.minFilter = THREE.LinearFilter;
      logoTexture.magFilter = THREE.LinearFilter;
    }
  }, [logoTexture]);

  const haloTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.45)'); // cyan/blue center
      gradient.addColorStop(0.35, 'rgba(14, 165, 233, 0.22)'); // soft sky blue middle
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fade out
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  const nodesGroupRef = useRef<THREE.Group>(null);
  const logoRef = useRef<THREE.Group>(null);

  const modulesData = useMemo(() => {
    const radius = 3.6;
    return MODULES.map((m, i) => {
      const theta = m.angle;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = Math.sin(i * 1.5) * 1.2;
      return {
        name: m.name,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = timer.getElapsed();
    const progress = scrollProgressRef.current;

    // Rotate core group (base rotation around Y axis on scroll) and apply bobbing (decreased bobbing depth/rate)
    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(t * 0.5) * 0.04;
      // Frame-rate independent lerp (k = 6.0 for fluid core transitions)
      const lerpFactor = 1 - Math.exp(-6.0 * delta);
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, progress * Math.PI * 0.6, lerpFactor);
    }

    // Continuous orbit rotation of service nodes (decreased continuous orbital movement to feel more stable)
    const nodesRotationZ = t * 0.01;
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.z = nodesRotationZ;
    }

    // Dynamically recede the logo from the camera view to the center of the 3D model
    if (logoRef.current) {
      const cam = state.camera;
      const progressT = Math.min(progress / 0.04, 1);
      // Interpolate along the camera line of sight (from 50% distance down to 0)
      const lerpFactor = 0.50 * (1 - progressT);
      
      logoRef.current.position.x = cam.position.x * lerpFactor;
      logoRef.current.position.y = cam.position.y * lerpFactor;
      logoRef.current.position.z = cam.position.z * lerpFactor;

      // Scale the logo to be smaller: starts at 0.80, recedes to 0.55 at center
      const scale = 0.55 + (1 - progressT) * 0.25;
      logoRef.current.scale.set(scale, scale, scale);

      // Fade out "Ecosystem" text as logo recedes
      if (ecosystemTextRef.current) {
        const ecosystemOpacity = Math.max(0, 1 - progressT * 2.0);
        ecosystemTextRef.current.style.opacity = ecosystemOpacity.toString();
        ecosystemTextRef.current.style.transform = `scale(${scale})`;
      }
    }
  });

  return (
    <group ref={coreRef}>
      {/* Soft Blue Halo behind the logo */}
      <Billboard position={[0, 0, -0.1]}>
        {haloTexture && (
          <mesh>
            <planeGeometry args={[2.5, 2.5]} />
            <meshBasicMaterial 
              map={haloTexture} 
              transparent 
              depthWrite={false} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
        )}
      </Billboard>

      {/* Official JodeTx SVG Logo Hero Object */}
      <group ref={logoRef}>
        <Billboard position={[0, 0, 0]}>
          {logoTexture && (
            <mesh>
              <planeGeometry args={[2.2, 0.702]} />
              <meshBasicMaterial 
                map={logoTexture} 
                transparent 
                depthWrite={false}
                opacity={1}
              />
            </mesh>
          )}
        </Billboard>
        {/* "Ecosystem" text Billboard/HTML that moves and scales with the logo */}
        <Billboard position={[0, -0.65, 0]}>
          <Html center distanceFactor={7}>
            <div 
              ref={ecosystemTextRef}
              className="text-2xl md:text-4xl font-semibold tracking-wide select-none"
              style={{
                color: '#1a2744',
                opacity: 1,
                transition: 'opacity 0.05s ease-out',
                whiteSpace: 'nowrap'
              }}
            >
              Ecosystem
            </div>
          </Html>
        </Billboard>
      </group>

      {/* Thin Orbit Rings (Fintech OS aesthetic) */}
      <ThinRing radius={1.4} color="#22d3ee" opacity={0.08} />
      <ThinRing radius={3.6} color="#22d3ee" opacity={0.12} />
      
      {/* Subtle Financial Network Circles (Delicate dotted rings) */}
      <NetworkDottedRing radius={2.5} count={28} speed={0.02} color="#22d3ee" opacity={0.20} />
      <NetworkDottedRing radius={1.9} count={20} speed={-0.03} color="#0891b2" opacity={0.15} />

      {/* Orbiting Ecosystem modules and transaction particles */}
      <group ref={nodesGroupRef}>
        {modulesData.map((node, i) => (
          <EcosystemModuleNode 
            key={i}
            name={node.name} 
            index={i} 
            basePosition={node.position} 
          />
        ))}
      </group>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const { timer, coreRef, scrollProgressRef } = useSharedTimer();
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const t = timer.getElapsed();
    const progress = scrollProgressRef.current;
    const activeIndex = getActiveIndex(progress);

    let targetX = 0;
    let targetY = 5.2;
    let targetZ = 8.0;
    
    let lookTargetX = 0;
    let lookTargetY = 0;
    let lookTargetZ = 0;

    const isMobile = state.size.width < 768;

    if (activeIndex === -1) {
      // Intro/Overview of infrastructure
      const localProg = progress / 0.05;
      targetX = 0;
      targetY = THREE.MathUtils.lerp(isMobile ? 6.0 : 5.2, isMobile ? 4.5 : 3.5, localProg);
      targetZ = THREE.MathUtils.lerp(isMobile ? 9.5 : 8.0, isMobile ? 8.5 : 7.0, localProg);
      
      lookTargetX = 0;
      lookTargetY = 0;
      lookTargetZ = 0;
    } else {
      // Smoothly navigate closer to the active node coordinates
      const radius = 3.6;
      const theta = MODULES[activeIndex].angle;
      const nodeX = radius * Math.cos(theta);
      const nodeY = radius * Math.sin(theta);
      const nodeZ = Math.sin(activeIndex * 1.5) * 1.2;

      // Active node is offset towards camera Z-offset when selected
      const nodeZActive = nodeZ + 1.4;

      // Calculate actual world position of the active node by applying nodes orbit and core rotation & position
      const activeNodeWorldPos = new THREE.Vector3(nodeX, nodeY, nodeZActive);
      const nodesRotationZ = t * 0.01; // rotate with orbit speed (matched with JodeTxCore)
      activeNodeWorldPos.applyAxisAngle(new THREE.Vector3(0, 0, 1), nodesRotationZ);

      if (coreRef.current) {
        activeNodeWorldPos.applyEuler(coreRef.current.rotation);
        activeNodeWorldPos.add(coreRef.current.position);
      }

      const worldX = activeNodeWorldPos.x;
      const worldY = activeNodeWorldPos.y;
      const worldZ = activeNodeWorldPos.z;

      if (isMobile) {
        // Mobile: Node is centered horizontally but shifted up to avoid the bottom text card
        targetX = worldX;
        targetY = worldY + 0.2;
        targetZ = worldZ + 3.4;

        lookTargetX = worldX;
        lookTargetY = worldY - 0.7; // Push node vertically upward in view
        lookTargetZ = worldZ;
      } else {
        // Desktop: Alternate side of the screen
        // Even indices: Text on Left, Node on Right (camera offset to Left)
        // Odd indices: Text on Right, Node on Left (camera offset to Right)
        const isNodeOnRight = activeIndex % 2 === 0;
        
        targetX = worldX + (isNodeOnRight ? -0.5 : 0.5);
        targetY = worldY + 0.3;
        targetZ = worldZ + 3.0;

        lookTargetX = worldX + (isNodeOnRight ? -1.3 : 1.3);
        lookTargetY = worldY;
        lookTargetZ = worldZ;
      }
    }

    // Frame-rate independent lerp (k = 5.5 for smooth camera tracking)
    const lerpFactor = 1 - Math.exp(-5.5 * delta);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, lerpFactor);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, lerpFactor);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, lerpFactor);

    const targetLookAt = new THREE.Vector3(lookTargetX, lookTargetY, lookTargetZ);
    
    // Smoothly lerp look-at vectors to avoid any sharp gimbal snaps
    lookAtRef.current.lerp(targetLookAt, lerpFactor);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}

export default function Scene() {
  const timer = useMemo(() => new THREE.Timer(), []);
  const coreRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);
  const [dpr, setDpr] = useState<number>(1);
  const [lowPerf, setLowPerf] = useState(false);

  useEffect(() => {
    // Set a static DPR on mount to prevent dynamic canvas resizing (which crashes WebGL on mobile)
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setDpr(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    }

    if (typeof document !== 'undefined') {
      timer.connect(document);
    }

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      scrollProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      timer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [timer]);

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 5.2, 8.0], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor 
          onDecline={() => {
            setLowPerf(true);
          }}
          onIncline={() => {
            setLowPerf(false);
          }}
        />
        <TimerUpdater timer={timer} />
        <TimerContext.Provider value={{ timer, coreRef, scrollProgressRef, lowPerf }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#e0f7fa" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#0891b2" />
          <pointLight position={[0, 0, 3]} intensity={1.5} color="#22d3ee" />
          
          <Suspense fallback={null}>
            <JodeTxCore />
          </Suspense>
          <FloatingParticles count={lowPerf ? 15 : 45} />
          <CameraController />
        </TimerContext.Provider>
      </Canvas>
    </div>
  );
}
