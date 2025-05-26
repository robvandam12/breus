
import { useNavigate } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();

  return {
    push: (path: string) => navigate(path),
    back: () => navigate(-1),
    replace: (path: string) => navigate(path, { replace: true })
  };
};
