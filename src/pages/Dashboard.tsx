
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main index page which has the dashboard
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Dashboard;
