
// Empresas y sitios mockup
export const empresasMockup = {
  salmoneras: [
    {
      id: "salmonera-001",
      nombre: "Salmonera Austral S.A.",
      rut: "96.123.456-7",
      email: "contacto@salmoneraustral.cl",
      telefono: "+56 2 2345 6789",
      direccion: "Av. Providencia 1234, Santiago, Chile",
      estado: "activa",
      sitios_activos: 3,
      created_at: "2023-01-15T09:00:00Z",
      updated_at: "2024-12-01T10:00:00Z"
    }
  ],

  contratistas: [
    {
      id: "contratista-001",
      nombre: "Servicios Subacuáticos del Sur Ltda.",
      rut: "76.987.654-3",
      email: "admin@serviciosur.cl",
      telefono: "+56 9 8765 4321",
      direccion: "Los Carrera 567, Puerto Montt, Chile",
      estado: "activo",
      especialidades: [
        "Inspección de estructuras acuícolas",
        "Mantenimiento preventivo y correctivo",
        "Soldadura subacuática",
        "Limpieza de redes y jaulas",
        "Documentación técnica"
      ],
      certificaciones: [
        "ISO 9001:2015",
        "Certificación SERNAPESCA",
        "Registro de contratistas acuícolas",
        "Certificación AWS soldadura subacuática"
      ],
      created_at: "2023-03-20T10:00:00Z",
      updated_at: "2024-11-15T14:30:00Z"
    }
  ],

  sitios: [
    {
      id: "sitio-norte-001",
      salmonera_id: "salmonera-001",
      nombre: "Centro Norte Chiloé",
      codigo: "CNC-001",
      ubicacion: "Canal Chacao, Chiloé",
      estado: "activo",
      coordenadas_lat: -41.7519,
      coordenadas_lng: -73.0842,
      profundidad_maxima: 35,
      capacidad_jaulas: 8,
      observaciones: "Centro principal de operaciones, condiciones óptimas para buceo",
      created_at: "2023-06-10T11:00:00Z",
      updated_at: "2024-10-20T09:15:00Z"
    },
    {
      id: "sitio-sur-001",
      salmonera_id: "salmonera-001",
      nombre: "Centro Sur Chiloé",
      codigo: "CSC-001",
      ubicacion: "Golfo de Ancud, Chiloé",
      estado: "activo",
      coordenadas_lat: -41.8519,
      coordenadas_lng: -73.1842,
      profundidad_maxima: 42,
      capacidad_jaulas: 12,
      observaciones: "Centro de mayor capacidad, requiere personal especializado",
      created_at: "2023-08-15T12:00:00Z",
      updated_at: "2024-11-10T16:20:00Z"
    }
  ],

  asociaciones: [
    {
      id: "asoc-001",
      salmonera_id: "salmonera-001",
      contratista_id: "contratista-001",
      estado: "activa",
      fecha_asociacion: "2023-04-01T10:00:00Z",
      created_at: "2023-04-01T10:00:00Z",
      updated_at: "2024-04-01T10:00:00Z"
    }
  ]
};
