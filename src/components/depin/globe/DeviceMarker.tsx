import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DeviceMarkerProps {
  position: [number, number, number];
  device: {
    device_name: string;
    is_verified: boolean;
    status: string;
  };
  onClick: () => void;
}

const DeviceMarker = ({ position, device, onClick }: DeviceMarkerProps) => {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Determine color based on verification and status
  const getColor = () => {
    if (device.status !== 'active') return '#ef4444'; // red
    return device.is_verified ? '#22c55e' : '#3b82f6'; // green : blue
  };

  // Animate pulse
  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      pulseRef.current.scale.set(scale, scale, scale);
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      if (material) material.opacity = 0.5 - Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }

    if (markerRef.current && hovered) {
      markerRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.02;
    } else if (markerRef.current) {
      markerRef.current.position.set(...position);
    }
  });

  return (
    <group position={position}>
      {/* Main marker sphere */}
      <mesh
        ref={markerRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={getColor()} transparent opacity={hovered ? 1 : 0.9} />
      </mesh>

      {/* Pulse ring for active devices */}
      {device.status === 'active' && (
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.04, 0.05, 32]} />
          <meshBasicMaterial color={getColor()} side={THREE.DoubleSide} transparent />
        </mesh>
      )}

      {/* Glow effect */}
      <pointLight color={getColor()} intensity={hovered ? 1 : 0.5} distance={0.5} />

      {/* Label on hover */}
      {hovered && (
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.05}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          {device.device_name}
        </Text>
      )}
    </group>
  );
};

export default DeviceMarker;
