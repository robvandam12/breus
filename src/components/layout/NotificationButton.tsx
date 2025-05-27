
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export const NotificationButton = () => {
  const [notifications] = useState<{ id: number; title: string; message: string }[]>([
    { id: 1, title: 'Nueva operación asignada', message: 'Se ha asignado una nueva operación a tu equipo.' },
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-9 w-9 hover:bg-zinc-100"
        >
          <Bell className="h-5 w-5 text-zinc-500" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-medium">Notificaciones</h3>
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 py-8">
            No tienes notificaciones
          </div>
        ) : (
          <div className="max-h-96 overflow-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b last:border-0 hover:bg-zinc-50">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-xs text-zinc-500 mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
        )}
        {notifications.length > 0 && (
          <div className="p-2 border-t text-center">
            <Button variant="ghost" className="text-xs text-blue-600 w-full" size="sm">
              Marcar todas como leídas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
