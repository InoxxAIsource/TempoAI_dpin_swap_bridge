import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY, MAP_CONFIG } from '@/config/maps';
import { parseLocation } from './utils/coordinates';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  last_seen_at: string;
  user_id: string;
  metadata: any;
}

interface DeviceMapProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  autoRotate?: boolean;
}

const DeviceMap = ({ devices, onDeviceClick }: DeviceMapProps) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [mapCenter, setMapCenter] = useState(MAP_CONFIG.defaultCenter);

  useEffect(() => {
    // Center map on first device if available
    if (devices.length > 0 && devices[0].metadata?.location) {
      const coords = parseLocation(devices[0].metadata.location);
      if (coords) {
        setMapCenter(coords);
      }
    }
  }, [devices]);

  const handleMarkerClick = (device: Device) => {
    setSelectedDevice(device);
    onDeviceClick(device);
  };

  const getMarkerColor = (device: Device) => {
    const isOnline = new Date().getTime() - new Date(device.last_seen_at).getTime() < 300000;
    
    if (!device.is_verified) return '#6b7280'; // gray
    if (!isOnline) return '#ef4444'; // red
    return '#10b981'; // green
  };

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border border-border">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={MAP_CONFIG.defaultZoom}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
          mapId="depin-device-map"
          styles={MAP_CONFIG.styles}
          disableDefaultUI={false}
          gestureHandling="greedy"
        >
          {devices.map((device) => {
            const location = device.metadata?.location;
            if (!location) return null;

            const coords = parseLocation(location);
            if (!coords) return null;

            return (
              <AdvancedMarker
                key={device.id}
                position={coords}
                onClick={() => handleMarkerClick(device)}
              >
                <Pin
                  background={getMarkerColor(device)}
                  borderColor="#1e293b"
                  glyphColor="#ffffff"
                  scale={1.2}
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </Pin>
              </AdvancedMarker>
            );
          })}

          {selectedDevice && selectedDevice.metadata?.location && (
            <InfoWindow
              position={parseLocation(selectedDevice.metadata.location)!}
              onCloseClick={() => setSelectedDevice(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-sm">{selectedDevice.device_name}</h3>
                <p className="text-xs text-muted-foreground">{selectedDevice.device_type}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default DeviceMap;
