import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3 } from './globe/utils/coordinates';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  metadata: any;
  last_seen_at: string;
  user_id: string;
}

interface Globe3DProps {
  devices?: Device[];
  onDeviceClick?: (deviceId: string) => void;
  autoRotate?: boolean;
}

const GLOBE_RADIUS = 2;

// Earth Globe Component
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <Sphere ref={earthRef} args={[GLOBE_RADIUS, 32, 32]}>
        <meshStandardMaterial
          color="#1e40af"
          metalness={0.4}
          roughness={0.7}
          emissive="#0f172a"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[GLOBE_RADIUS + 0.05, 32, 32]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// Device Marker Component
function DeviceMarker({ 
  device, 
  onClick 
}: { 
  device: Device; 
  onClick: (id: string) => void;
}) {
  const markerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const position = useMemo(() => {
    const lat = device.metadata?.lat ?? 0;
    const lng = device.metadata?.lng ?? 0;
    return latLngToVector3(lat, lng, GLOBE_RADIUS + 0.1);
  }, [device.metadata?.lat, device.metadata?.lng]);

  const isVerified = device.is_verified;
  const isOnline = device.status === 'online';

  const markerColor = isVerified 
    ? (isOnline ? '#10b981' : '#6b7280')
    : '#3b82f6';

  useFrame((state) => {
    if (markerRef.current) {
      const scale = hovered ? 1.5 : 1.0;
      markerRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      );

      // Pulse animation
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      markerRef.current.scale.multiplyScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onClick={() => onClick(device.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={hovered ? 1.5 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Marker Pin */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1]} />
        <meshStandardMaterial color={markerColor} />
      </mesh>

      {hovered && (
        <Html distanceFactor={8}>
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg min-w-[150px]">
            <p className="font-semibold text-sm text-foreground">{device.device_name}</p>
            <p className="text-xs text-muted-foreground">{device.device_type}</p>
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-500 mt-1">
                ✓ Verified
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Background Stars
function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 10 + Math.random() * 10;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Globe3D Component
export default function Globe3D({ 
  devices = [], 
  onDeviceClick = () => {}, 
  autoRotate = true 
}: Globe3DProps) {
  const devicesWithCoordinates = devices.filter(
    (d) => d.metadata?.lat !== undefined && d.metadata?.lng !== undefined
  );

  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl overflow-hidden border-2 border-primary/20">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#3b82f6" />

        {/* Scene Elements */}
        <Stars />
        <Earth />

        {/* Device Markers */}
        {devicesWithCoordinates.map((device) => (
          <DeviceMarker
            key={device.id}
            device={device}
            onClick={onDeviceClick}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(Math.PI * 3) / 4}
        />
      </Canvas>
    </div>
  );
}
