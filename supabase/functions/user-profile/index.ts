import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    // GET - Fetch user profile with stats
    if (req.method === 'GET') {
      console.log('Fetching profile for user:', userId);

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      // Get connected wallets
      const { data: wallets, error: walletsError } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (walletsError) {
        console.error('Wallets fetch error:', walletsError);
      }

      // Get recent activity (last 10)
      const { data: recentActivity, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) {
        console.error('Activity fetch error:', activityError);
      }

      // Calculate aggregate stats
      const { data: activityStats } = await supabase
        .from('user_activity')
        .select('activity_type, status')
        .eq('user_id', userId);

      const stats = {
        total_activities: activityStats?.length || 0,
        completed_activities: activityStats?.filter(a => a.status === 'completed').length || 0,
        pending_activities: activityStats?.filter(a => a.status === 'pending').length || 0,
        failed_activities: activityStats?.filter(a => a.status === 'failed').length || 0,
      };

      return new Response(
        JSON.stringify({
          profile,
          wallets: wallets || [],
          recent_activity: recentActivity || [],
          stats,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // PUT - Update user profile preferences
    if (req.method === 'PUT') {
      const body = await req.json();
      console.log('Updating profile for user:', userId, body);

      const allowedFields = [
        'username',
        'avatar_url',
        'preferred_chain',
        'auto_claim_threshold',
        'gas_alerts_enabled',
        'notification_preferences',
      ];

      const updates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        throw new Error('No valid fields to update');
      }

      updates.updated_at = new Date().toISOString();

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      // Log activity
      await supabase.from('user_activity').insert({
        user_id: userId,
        activity_type: 'settings_update',
        details: { updated_fields: Object.keys(updates) },
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

      console.log('✓ Profile updated successfully');

      return new Response(
        JSON.stringify({ profile: updatedProfile }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );

  } catch (error) {
    console.error('Error in user-profile function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
