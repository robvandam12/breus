
export const useOperationalContext = () => {
  const operationalContext = {
    mode: 'full_planning',
    permissions: [],
    activeModules: []
  };

  return {
    operationalContext
  };
};
