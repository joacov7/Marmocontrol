import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categorias = [
  { nombre: "Plomería", icono: "🔧", descripcion: "Instalaciones y reparaciones de cañerías, agua y gas", color: "#2563EB" },
  { nombre: "Electricidad", icono: "⚡", descripcion: "Instalaciones eléctricas, tableros, cortocircuitos", color: "#D97706" },
  { nombre: "Albañilería", icono: "🧱", descripcion: "Construcción, reparaciones, revoques y cerámicos", color: "#DC2626" },
  { nombre: "Mecánica", icono: "🚗", descripcion: "Reparación y mantenimiento de autos y motos", color: "#059669" },
  { nombre: "Computación", icono: "💻", descripcion: "Reparación de PC, redes, soporte técnico", color: "#7C3AED" },
  { nombre: "Seguridad", icono: "🔒", descripcion: "Alarmas, cámaras, cerrajería y control de accesos", color: "#0891B2" },
  { nombre: "Medicina", icono: "👨‍⚕️", descripcion: "Médicos a domicilio, enfermería y cuidados", color: "#E11D48" },
  { nombre: "Abogados", icono: "⚖️", descripcion: "Asesoramiento legal, consultas y trámites", color: "#1D4ED8" },
  { nombre: "Jardinería", icono: "🌿", descripcion: "Mantenimiento de jardines, poda y paisajismo", color: "#16A34A" },
  { nombre: "Limpieza", icono: "🧹", descripcion: "Limpieza del hogar, oficinas y locales", color: "#0369A1" },
  { nombre: "Pintura", icono: "🎨", descripcion: "Pintura interior, exterior y decorativa", color: "#9333EA" },
  { nombre: "Gasista", icono: "🔥", descripcion: "Instalaciones y reparaciones de gas natural y envasado", color: "#EA580C" },
];

const profesionales = [
  {
    nombre: "Carlos Rodríguez",
    telefono: "11-4523-8901",
    email: "carlos.rod@email.com",
    descripcion: "Plomero matriculado con 15 años de experiencia. Urgencias las 24hs.",
    zona: "CABA - Palermo, Belgrano, Núñez",
    calificacion: 4.8,
    totalTrabajos: 127,
    categorias: ["Plomería"],
  },
  {
    nombre: "Martín López",
    telefono: "11-5678-2345",
    email: "martin.lopez@email.com",
    descripcion: "Electricista matriculado. Instalaciones domiciliarias y comerciales.",
    zona: "CABA - Caballito, Flores, Floresta",
    calificacion: 4.6,
    totalTrabajos: 89,
    categorias: ["Electricidad"],
  },
  {
    nombre: "Roberto Fernández",
    telefono: "11-2345-6789",
    descripcion: "Albañil con experiencia en obra fina y construcción en seco.",
    zona: "GBA Oeste - Morón, Haedo, El Palomar",
    calificacion: 4.5,
    totalTrabajos: 203,
    categorias: ["Albañilería"],
  },
  {
    nombre: "Diego García",
    telefono: "11-8765-4321",
    email: "diego.garcia@mecanica.com",
    descripcion: "Mecánico automotriz y motociclista. Especializado en diagnóstico electrónico.",
    zona: "CABA - Mataderos, Liniers, Parque Avellaneda",
    calificacion: 4.9,
    totalTrabajos: 312,
    categorias: ["Mecánica"],
  },
  {
    nombre: "Ana Martínez",
    telefono: "11-3456-7890",
    email: "ana.tec@gmail.com",
    descripcion: "Técnica en computación. Reparación de PCs, laptops y configuración de redes.",
    zona: "CABA - Villa Crespo, Almagro, Villa del Parque",
    calificacion: 4.7,
    totalTrabajos: 156,
    categorias: ["Computación"],
  },
  {
    nombre: "Lucas Sánchez",
    telefono: "11-9012-3456",
    descripcion: "Técnico en seguridad electrónica. Instalación de alarmas, CCTV y control de accesos.",
    zona: "CABA - Recoleta, Barrio Norte, Retiro",
    calificacion: 4.4,
    totalTrabajos: 78,
    categorias: ["Seguridad"],
  },
  {
    nombre: "Dr. Juan Pérez",
    telefono: "11-7890-1234",
    email: "drjuanperez@medico.com",
    descripcion: "Médico clínico. Consultas a domicilio, urgencias y seguimiento de pacientes crónicos.",
    zona: "CABA - Todos los barrios",
    calificacion: 4.9,
    totalTrabajos: 450,
    categorias: ["Medicina"],
  },
  {
    nombre: "Dra. Laura Gómez",
    telefono: "11-5432-1098",
    email: "laura.gomez.abogada@estudio.com",
    descripcion: "Abogada especialista en derecho civil y familia. Consultas online y presenciales.",
    zona: "CABA y GBA",
    calificacion: 4.8,
    totalTrabajos: 95,
    categorias: ["Abogados"],
  },
  {
    nombre: "Pedro González",
    telefono: "11-6789-0123",
    descripcion: "Plomero y gasista matriculado. Instalaciones completas y urgencias.",
    zona: "GBA Norte - San Isidro, Tigre, Vicente López",
    calificacion: 4.6,
    totalTrabajos: 184,
    categorias: ["Plomería", "Gasista"],
  },
  {
    nombre: "Sofía Torres",
    telefono: "11-2109-8765",
    email: "sofia.limpieza@gmail.com",
    descripcion: "Servicio de limpieza profesional del hogar, con productos incluidos.",
    zona: "CABA - Palermo, Recoleta, San Telmo",
    calificacion: 4.7,
    totalTrabajos: 267,
    categorias: ["Limpieza"],
  },
  {
    nombre: "Gustavo Herrera",
    telefono: "11-3210-9876",
    descripcion: "Pintor profesional. Interior, exterior y trabajos decorativos.",
    zona: "CABA y GBA",
    calificacion: 4.5,
    totalTrabajos: 138,
    categorias: ["Pintura"],
  },
  {
    nombre: "Ramón Flores",
    telefono: "11-4321-0987",
    descripcion: "Jardinero paisajista. Diseño, mantenimiento y poda de árboles.",
    zona: "GBA Norte y CABA",
    calificacion: 4.6,
    totalTrabajos: 201,
    categorias: ["Jardinería"],
  },
];

async function main() {
  console.log("Seeding ServiYa...");

  await prisma.calificacion.deleteMany();
  await prisma.asignacion.deleteMany();
  await prisma.solicitud.deleteMany();
  await prisma.profesionalCategoria.deleteMany();
  await prisma.profesional.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.categoria.deleteMany();

  const categoriasCreadas = await Promise.all(
    categorias.map((c) => prisma.categoria.create({ data: c }))
  );

  const categoriaMap = Object.fromEntries(
    categoriasCreadas.map((c) => [c.nombre, c.id])
  );

  for (const prof of profesionales) {
    const { categorias: cats, ...data } = prof;
    await prisma.profesional.create({
      data: {
        ...data,
        categorias: {
          create: cats
            .filter((c) => categoriaMap[c])
            .map((c) => ({ categoriaId: categoriaMap[c] })),
        },
      },
    });
  }

  const cliente = await prisma.cliente.create({
    data: {
      nombre: "María Ejemplo",
      telefono: "11-1111-2222",
      email: "maria@ejemplo.com",
      direccion: "Av. Corrientes 1234, CABA",
    },
  });

  await prisma.solicitud.create({
    data: {
      clienteId: cliente.id,
      categoriaId: categoriasCreadas[0].id,
      descripcion: "Se rompió un caño bajo la pileta de la cocina. Hay pérdida de agua.",
      direccion: "Av. Corrientes 1234, CABA",
      urgencia: "urgente",
      estado: "pendiente",
    },
  });

  console.log(`✅ Categorías: ${categoriasCreadas.length}`);
  console.log(`✅ Profesionales: ${profesionales.length}`);
  console.log("✅ Seed completado");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
