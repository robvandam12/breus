
import { useAuth } from "@/hooks/useAuth";

export default function Usuarios() {
  const { profile } = useAuth();
  
  console.log('Usuarios page rendering, profile:', profile);
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '24px' }}>TEST PAGE - USUARIOS</h1>
      <p style={{ color: 'black', fontSize: '16px' }}>
        Si puedes ver este texto azul, la navegación funciona.
      </p>
      <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px 0' }}>
        <p style={{ color: 'black' }}>Usuario: {profile?.nombre} {profile?.apellido}</p>
        <p style={{ color: 'black' }}>Rol: {profile?.role}</p>
        <p style={{ color: 'black' }}>Email: {profile?.email}</p>
      </div>
      <p style={{ color: 'red', fontSize: '14px' }}>
        Esta página usa estilos inline para asegurar que se vea.
      </p>
    </div>
  );
}
