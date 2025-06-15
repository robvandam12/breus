
import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, ShieldAlert } from "lucide-react";
import { useSecurityAlertRules } from "@/hooks/useSecurityAlertRules";
import { AlertRulesTable } from "@/components/admin/AlertRulesTable";
import { AlertRuleForm } from "@/components/admin/AlertRuleForm";
import type { SecurityAlertRule } from '@/types/security';

export default function AlertRulesAdmin() {
    const { rules, isLoading, createRule, updateRule, deleteRule } = useSecurityAlertRules();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<SecurityAlertRule | null>(null);

    const handleCreateNew = () => {
        setSelectedRule(null);
        setIsFormOpen(true);
    };

    const handleEdit = (rule: SecurityAlertRule) => {
        setSelectedRule(rule);
        setIsFormOpen(true);
    };

    const handleDelete = async (ruleId: string) => {
        await deleteRule(ruleId);
    };

    const handleSave = async (ruleData: Partial<SecurityAlertRule>) => {
        if (selectedRule) {
            await updateRule({ ...ruleData, id: selectedRule.id });
        } else {
            await createRule(ruleData as any);
        }
        setIsFormOpen(false);
        setSelectedRule(null);
    };
    
    const handleCloseForm = () => {
      setIsFormOpen(false);
      setSelectedRule(null);
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
                <RoleBasedSidebar />
                <main className="flex-1 flex flex-col">
                    <Header
                        title="Administración de Reglas de Alerta"
                        subtitle="Configura las reglas de seguridad y sus políticas de escalamiento"
                        icon={ShieldAlert}
                    >
                        <Button onClick={handleCreateNew}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Regla
                        </Button>
                    </Header>

                    <div className="flex-1 overflow-auto p-6">
                        {isLoading ? (
                            <p>Cargando reglas...</p>
                        ) : (
                            <AlertRulesTable
                                rules={rules}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </main>
            </div>
            
            <AlertRuleForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSave={handleSave}
                rule={selectedRule}
            />
        </SidebarProvider>
    );
}
