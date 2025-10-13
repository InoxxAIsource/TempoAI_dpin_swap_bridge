-- Mark first 2 solar panel devices as verified for demonstration
UPDATE device_registry 
SET is_verified = true,
    public_key = 'demo_verified_key_' || device_id
WHERE device_id IN ('solar_1', 'solar_2');