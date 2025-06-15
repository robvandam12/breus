
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layouts } from 'react-grid-layout';
import { useDashboardTemplates } from './useDashboardTemplates';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { Role } from '@/components/dashboard/widgetRegistry';
import { getLayoutsForRole } from '@/components/dashboard/layouts';
import { filterLayoutsByRole } from '@/utils/dashboardUtils';

interface DashboardState {
    layouts: Layouts;
    widgets: any;
}

const defaultWidgets = {};

export const useDashboardInitialization = (currentRole: Role, resetDashboardState: (state: DashboardState) => void) => {
    const { templates, isLoading: isLoadingTemplates } = useDashboardTemplates();

    const defaultLayoutsAndWidgets = useMemo(() => {
        const template = templates.find(t => t.type === 'system' && t.role_target === currentRole);
        if (template && template.layout_config) {
            return {
                layouts: template.layout_config,
                widgets: template.widget_configs || defaultWidgets
            };
        }
        return {
            layouts: getLayoutsForRole(currentRole),
            widgets: defaultWidgets
        };
    }, [templates, currentRole]);

    const { 
        layout: savedLayout, 
        widgets: savedWidgets, 
        isLoading: isLoadingLayout, 
        saveLayout, 
        isSaving, 
        resetLayout, 
        isResetting 
    } = useDashboardLayout(defaultLayoutsAndWidgets.layouts, defaultLayoutsAndWidgets.widgets);

    const [isInitialized, setIsInitialized] = useState(false);

    const filteredLayout = useMemo(() => filterLayoutsByRole(savedLayout, currentRole), [savedLayout, currentRole]);

    const getInitialDashboardState = useCallback((): DashboardState => {
        return {
            layouts: filteredLayout,
            widgets: savedWidgets,
        };
    }, [filteredLayout, savedWidgets]);

    useEffect(() => {
        const initialDataLoading = isLoadingLayout || isLoadingTemplates;
        if (!initialDataLoading && !isInitialized) {
             resetDashboardState(getInitialDashboardState());
             setIsInitialized(true);
        }
    }, [isLoadingLayout, isLoadingTemplates, isInitialized, getInitialDashboardState, resetDashboardState]);

    return {
        isLoading: !isInitialized,
        getInitialDashboardState,
        defaultLayoutForRole: defaultLayoutsAndWidgets.layouts.lg || [],
        saveLayout,
        isSaving,
        resetLayout,
        isResetting,
    };
};
