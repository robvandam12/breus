
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Bitacoras = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to supervisor logbooks by default
    navigate("/operaciones/bitacoras-supervisor", { replace: true });
  }, [navigate]);

  return null;
};

export default Bitacoras;
