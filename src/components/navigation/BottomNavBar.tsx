
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Anchor, FileText, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const getNavItems = (role: string) => {
    const commonItems = [
        { to: '/configuracion', icon: User, label: 'Perfil' },
    ];

    if (role === 'buzo') {
        return [
            { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/buzo/operaciones', icon: Anchor, label: 'Operaciones' },
            { to: '/buzo/inmersiones', icon: FileText, label: 'Inmersiones' },
            ...commonItems,
        ];
    }
    
    // Default for supervisor, admin_servicio, admin_salmonera, superuser
    return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/operaciones', icon: Anchor, label: 'Operaciones' },
        { to: '/inmersiones', icon: FileText, label: 'Inmersiones' },
        ...commonItems,
    ];
};

export const BottomNavBar = () => {
    const { profile, loading } = useAuth();
    
    if (loading) {
        return null;
    }
    const userRole = profile?.role || '';
    if (!userRole) {
        return null;
    }

    const navItems = getNavItems(userRole);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
            <div className="grid h-16 grid-cols-4 items-center justify-around text-center">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'} // Important for dashboard link to not be always active
                        className={({ isActive }) => 
                            `flex flex-col items-center justify-center gap-1 p-2 transition-all ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
