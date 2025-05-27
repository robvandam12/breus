
import { useNavigate } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const replace = (path: string) => {
    navigate(path, { replace: true });
  };

  return {
    navigateTo,
    goBack,
    replace,
  };
};
