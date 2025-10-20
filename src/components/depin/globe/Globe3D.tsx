import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import DeviceMarker from './DeviceMarker';
import { latLngToVector3, parseLocation, getRandomLocation } from './utils/coordinates';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  last_seen_at: string;
  metadata: {
    location?: string;
    [key: string]: any;
  };
}

interface Globe3DProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  autoRotate: boolean;
}

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);

  // Create textures
  const colorMap = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-day.jpg'
  );
  const bumpMap = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png'
  );

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.05}
        metalness={0.1}
        roughness={0.7}
      />
    </mesh>
  );
};

const Globe3D = ({ devices, onDeviceClick, autoRotate }: Globe3DProps) => {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-primary/20 bg-black/50">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'radial-gradient(circle, #0a0a1a 0%, #000000 100%)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />

          <Earth />

          {/* Render device markers */}
          {devices.map((device) => {
            const coords = device.metadata?.location
              ? parseLocation(device.metadata.location)
              : getRandomLocation();

            if (!coords) return null;

            const position = latLngToVector3(coords.lat, coords.lng);

            return (
              <DeviceMarker
                key={device.id}
                position={position}
                device={device}
                onClick={() => onDeviceClick(device)}
              />
            );
          })}

          <OrbitControls
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={3}
            maxDistance={8}
            enablePan={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Globe3D;
