
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const push = (path: string) => {
    navigate(path);
  };

  const replace = (path: string) => {
    navigate(path, { replace: true });
  };

  const back = () => {
    navigate(-1);
  };

  const query = new URLSearchParams(location.search);

  return {
    push,
    replace,
    back,
    pathname: location.pathname,
    query: Object.fromEntries(query.entries()),
    params
  };
};
