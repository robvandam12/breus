
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import type { SecurityAlertRule } from '@/types/security';

const transformStringToArray = z.preprocess((val) => {
    if (typeof val === 'string') {
        return val.split(',').map(item => item.trim()).filter(Boolean);
    }
    if (Array.isArray(val)) {
        return val;
    }
    return [];
}, z.array(z.string()).min(1, 'Debe haber al menos un valor'));


const ruleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.string().min(1, 'El tipo es requerido'),
  priority: z.enum(['info', 'warning', 'critical', 'emergency']),
  enabled: z.boolean(),
  is_template: z.boolean(),
  description: z.string().optional().nullable(),
  message_template: z.string().min(1, 'La plantilla de mensaje es requerida'),
  escalation_policy: z.object({
    levels: z.array(z.object({
      after_minutes: z.coerce.number().min(1, 'Debe ser mayor a 0'),
      notify_roles: transformStringToArray,
      channels: transformStringToArray,
    }))
  }),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface AlertRuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SecurityAlertRule>) => void;
  rule: SecurityAlertRule | null;
}

export const AlertRuleForm = ({ isOpen, onClose, onSave, rule }: AlertRuleFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "escalation_policy.levels"
  });

  useEffect(() => {
    const defaultValues = {
      name: '',
      type: '',
      priority: 'warning' as const,
      enabled: true,
      is_template: true,
      description: '',
      message_template: '',
      escalation_policy: {
        levels: [{ after_minutes: 15, notify_roles: 'admin_servicio', channels: 'push' }]
      }
    };
    
    if (rule) {
      reset({
        ...rule,
        description: rule.description || '',
        escalation_policy: {
            levels: rule.escalation_policy.levels.map(l => ({
                ...l,
                notify_roles: Array.isArray(l.notify_roles) ? l.notify_roles.join(',') : l.notify_roles,
                channels: Array.isArray(l.channels) ? l.channels.join(',') : l.channels,
            })) as any,
        },
      });
    } else {
      reset(defaultValues as any);
    }
  }, [rule, reset, isOpen]);
  
  const onSubmit = (data: RuleFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? 'Editar' : 'Crear'} Regla de Alerta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Input id="type" {...register('type')} placeholder="ej. DEPTH_LIMIT" />
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div>
            <Label htmlFor="message_template">Plantilla de Mensaje</Label>
            <Textarea id="message_template" {...register('message_template')} placeholder="ej. ¡Alerta! {inmersion_code} ha superado la profundidad." />
            {errors.message_template && <p className="text-red-500 text-sm mt-1">{errors.message_template.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <Label>Prioridad</Label>
              <Controller name="priority" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Advertencia</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="flex items-center space-x-2 pt-6">
               <Controller name="enabled" control={control} render={({ field }) => <Switch id="enabled" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="enabled">Habilitada</Label>
            </div>
             <div className="flex items-center space-x-2 pt-6">
              <Controller name="is_template" control={control} render={({ field }) => <Switch id="is_template" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="is_template">Es plantilla</Label>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h4 className="font-medium">Política de Escalamiento</h4>
            {fields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-md space-y-2 relative bg-gray-50 dark:bg-gray-800/50">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm">Minutos para escalar</Label>
                        <Input type="number" {...register(`escalation_policy.levels.${index}.after_minutes`)} />
                        {errors.escalation_policy?.levels?.[index]?.after_minutes && <p className="text-red-500 text-sm mt-1">{errors.escalation_policy.levels[index].after_minutes.message}</p>}
                    </div>
                    <div>
                        <Label className="text-sm">Canales (separados por coma)</Label>
                        <Input placeholder="push,email" {...register(`escalation_policy.levels.${index}.channels`)} />
                        {errors.escalation_policy?.levels?.[index]?.channels && <p className="text-red-500 text-sm mt-1">{errors.escalation_policy.levels[index].channels.message}</p>}
                    </div>
                 </div>
                 <div>
                    <Label className="text-sm">Roles a Notificar (separados por coma)</Label>
                    <Input placeholder="admin_servicio,superuser" {...register(`escalation_policy.levels.${index}.notify_roles`)} />
                    {errors.escalation_policy?.levels?.[index]?.notify_roles && <p className="text-red-500 text-sm mt-1">{errors.escalation_policy.levels[index].notify_roles.message}</p>}
                 </div>
                 {fields.length > 1 && <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => remove(index)}><X className="h-4 w-4"/></Button>}
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={() => append({ after_minutes: 30, notify_roles: 'superuser', channels: 'email' })}>
              Añadir Nivel de Escalamiento
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
