-- Enable DELETE for users on their own devices
CREATE POLICY "Users can delete their own devices"
ON public.device_registry
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);