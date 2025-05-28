
import { Navigate } from "react-router-dom";

// Esta página ha sido eliminada según los requerimientos.
// Los usuarios ahora se manejan desde /admin/salmonera (tab Pool Personal)
const Usuarios = () => {
  return <Navigate to="/admin/salmonera" replace />;
};

export default Usuarios;
