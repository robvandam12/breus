
import React, { useState, useMemo } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, XCircle, Filter } from 'lucide-react';
import { NotificationWidgetSkeleton } from './skeletons/NotificationWidgetSkeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
        case 'error':
            return <XCircle className="w-5 h-5 text-red-600" />;
        default:
            return <Info className="w-5 h-5 text-blue-600" />;
    }
};

const NotificationWidget = () => {
    const { notifications, isLoading, markAsRead, deleteNotification } = useNotifications();
    const [filter, setFilter] = useState<{ types: string[], readStatus: 'all' | 'read' | 'unread' }>({
        types: ['info', 'warning', 'error', 'success'],
        readStatus: 'all',
    });

    const filteredNotifications = useMemo(() => {
        return notifications
            .filter(n => filter.types.includes(n.type))
            .filter(n => {
                if (filter.readStatus === 'all') return true;
                if (filter.readStatus === 'read') return n.read;
                if (filter.readStatus === 'unread') return !n.read;
                return true;
            });
    }, [notifications, filter]);

    if (isLoading) {
        return <NotificationWidgetSkeleton />;
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleTypeFilterChange = (type: string) => {
        setFilter(prev => {
            const newTypes = prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type];
            return { ...prev, types: newTypes };
        });
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Bell className="w-5 h-5" />
                    Notificaciones
                    {unreadCount > 0 && (
                        <Badge variant="secondary">{unreadCount} sin leer</Badge>
                    )}
                </CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={filter.types.includes('success')} onCheckedChange={() => handleTypeFilterChange('success')}>Success</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={filter.types.includes('info')} onCheckedChange={() => handleTypeFilterChange('info')}>Info</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={filter.types.includes('warning')} onCheckedChange={() => handleTypeFilterChange('warning')}>Warning</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={filter.types.includes('error')} onCheckedChange={() => handleTypeFilterChange('error')}>Error</DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={filter.readStatus === 'all'} onCheckedChange={() => setFilter(f => ({...f, readStatus: 'all'}))}>Todos</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={filter.readStatus === 'unread'} onCheckedChange={() => setFilter(f => ({...f, readStatus: 'unread'}))}>No Leídos</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={filter.readStatus === 'read'} onCheckedChange={() => setFilter(f => ({...f, readStatus: 'read'}))}>Leídos</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden pt-0">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Bell className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold">Sin notificaciones</h3>
                        <p className="text-sm">{notifications.length > 0 ? 'Ninguna coincide con los filtros.' : 'No tienes notificaciones.'}</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4 -mr-4">
                        <div className="space-y-3">
                            {filteredNotifications.map((notification) => (
                                <div key={notification.id} className={cn("p-3 rounded-lg border flex items-start gap-3 transition-opacity", !notification.read ? 'bg-background' : 'bg-background/50 opacity-70')}>
                                    <div className="pt-0.5">{getNotificationIcon(notification.type)}</div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-sm leading-tight">{notification.title}</h4>
                                            <div className="flex items-center gap-1 -mr-2 -mt-1">
                                                {!notification.read && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(notification.id)}>
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteNotification(notification.id)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground pt-1">{new Date(notification.created_at).toLocaleString('es-CL')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};

export default React.memo(NotificationWidget);
