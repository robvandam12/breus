
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Crear cliente con anon key para verificar el usuario
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Verificar que el usuario actual es superuser
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser();
    if (userError || !user) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar rol de superuser
    const { data: profile, error: profileError } = await supabaseAnon
      .from('usuario')
      .select('rol')
      .eq('usuario_id', user.id)
      .single();

    if (profileError || !profile || profile.rol !== 'superuser') {
      throw new Error('Solo los superusers pueden eliminar usuarios');
    }

    // Obtener el ID del usuario a eliminar del cuerpo de la petición
    const { userId } = await req.json();
    if (!userId) {
      throw new Error('ID de usuario requerido');
    }

    console.log(`Attempting to delete user: ${userId}`);

    // Crear cliente con service role para eliminar de auth.users
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Eliminar usuario de auth.users - esto triggereará el CASCADE
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      throw new Error(`Error eliminando usuario: ${deleteError.message}`);
    }

    console.log(`User ${userId} deleted successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Usuario eliminado exitosamente' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in delete-user function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
