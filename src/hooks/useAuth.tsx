
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UsuarioRow } from '@/types/auth';

export interface UserProfile {
  id: string;
  email: string;
  role: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  nombre: string;
  apellido: string;
  salmonera_id?: string;
  servicio_id?: string;
  created_at: string;
  updated_at: string;
  perfil_buzo?: any;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; redirectPath?: string }>;
  signUp: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isRole: (role: string) => boolean;
  getDashboardPath: () => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getDashboardPath = (): string => {
    return '/';
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('usuario_id', userId)
        .single() as { data: UsuarioRow | null; error: any };

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No profile found for user:', userId);
          return null;
        }
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        const userProfile: UserProfile = {
          id: data.usuario_id,
          email: data.email || '',
          role: data.rol || 'buzo',
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          salmonera_id: data.salmonera_id || undefined,
          servicio_id: data.servicio_id || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at,
          perfil_buzo: data.perfil_buzo || undefined
        };
        console.log('Profile fetched successfully:', userProfile);
        return userProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (mounted) {
          console.log('Initial session:', !!initialSession);
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          // Fetch profile if user exists
          if (initialSession?.user) {
            console.log('User found, fetching profile...');
            const userProfile = await fetchUserProfile(initialSession.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, !!session);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Defer profile fetching to avoid blocking
        setTimeout(async () => {
          if (mounted) {
            const userProfile = await fetchUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          }
        }, 0);
      } else {
        setProfile(null);
      }
      
      if (event === 'SIGNED_IN') {
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; redirectPath?: string }> => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Sign in successful');
      
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
      });

      return { 
        success: true, 
        redirectPath: '/'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: profileData
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('usuario')
          .insert([{
            usuario_id: data.user.id,
            email,
            nombre: profileData.nombre || '',
            apellido: profileData.apellido || '',
            rol: profileData.role || 'buzo',
            salmonera_id: profileData.salmonera_id || null,
            servicio_id: profileData.servicio_id || null
          }]);

        if (profileError) throw profileError;
      }

      toast({
        title: "Cuenta creada",
        description: "Revisa tu email para confirmar tu cuenta",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al crear la cuenta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al cerrar sesión",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Revisa tu email para restablecer tu contraseña",
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al enviar email de recuperación",
        variant: "destructive",
      });
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;

    const rolePermissions = {
      superuser: ['*'],
      admin_salmonera: [
        'manage_salmonera',
        'manage_sitios',
        'manage_contratistas',
        'view_operaciones',
        'view_reportes'
      ],
      admin_servicio: [
        'manage_servicio',
        'manage_equipos',
        'view_operaciones',
        'sign_bitacoras'
      ],
      supervisor: [
        'create_inmersiones',
        'manage_hpt',
        'manage_anexo_bravo',
        'create_bitacora_supervisor'
      ],
      buzo: [
        'view_inmersiones',
        'create_bitacora_buzo',
        'view_personal_history'
      ]
    };

    const userPermissions = rolePermissions[profile.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const isRole = (role: string): boolean => {
    return profile?.role === role;
  };

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasPermission,
    isRole,
    getDashboardPath,
  };
};
