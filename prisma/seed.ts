import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Materiales
  const materiales = await Promise.all([
    prisma.material.upsert({
      where: { id: 1 },
      update: {},
      create: { nombre: "Granito Negro Absoluto", tipo: "granito", precioPorM2: 85000, color: "#1a1a1a", descripcion: "Importado, acabado brillante" },
    }),
    prisma.material.upsert({
      where: { id: 2 },
      update: {},
      create: { nombre: "Granito Blanco Cristal", tipo: "granito", precioPorM2: 75000, color: "#f0f0f0", descripcion: "Nacional, textura uniforme" },
    }),
    prisma.material.upsert({
      where: { id: 3 },
      update: {},
      create: { nombre: "Mármol Carrara", tipo: "marmol", precioPorM2: 120000, color: "#f5f5f0", descripcion: "Importado Italia, vetas grises" },
    }),
    prisma.material.upsert({
      where: { id: 4 },
      update: {},
      create: { nombre: "Mármol Beige", tipo: "marmol", precioPorM2: 65000, color: "#d4b896", descripcion: "Nacional" },
    }),
    prisma.material.upsert({
      where: { id: 5 },
      update: {},
      create: { nombre: "Porcelana Blanca Mate", tipo: "porcelana", precioPorM2: 95000, color: "#ffffff", descripcion: "Resistente a manchas" },
    }),
    prisma.material.upsert({
      where: { id: 6 },
      update: {},
      create: { nombre: "Silestone Gris Expo", tipo: "silestone", precioPorM2: 145000, color: "#9e9e9e", descripcion: "Cuarzo compacto, garantía 25 años" },
    }),
  ]);

  // Clientes
  const clientes = await Promise.all([
    prisma.cliente.upsert({
      where: { id: 1 },
      update: {},
      create: { nombre: "María García", telefono: "+54 9 11 2345-6789", email: "maria@gmail.com", direccion: "Av. Corrientes 1234, CABA" },
    }),
    prisma.cliente.upsert({
      where: { id: 2 },
      update: {},
      create: { nombre: "Carlos Rodríguez", telefono: "+54 9 11 8765-4321", email: "carlos.r@hotmail.com", direccion: "Calle 50 N°123, La Plata" },
    }),
    prisma.cliente.upsert({
      where: { id: 3 },
      update: {},
      create: { nombre: "Ana López", telefono: "+54 9 351 456-7890", notas: "Obra en construcción, coordinar con el arquitecto" },
    }),
    prisma.cliente.upsert({
      where: { id: 4 },
      update: {},
      create: { nombre: "Roberto Martínez", telefono: "+54 9 11 5555-0000", email: "rmartinez@empresa.com", direccion: "Palermo, CABA" },
    }),
  ]);

  // Pedidos
  const pedido1 = await prisma.pedido.upsert({
    where: { id: 1 },
    update: {},
    create: {
      clienteId: clientes[0].id,
      estado: "produccion",
      total: 312000,
      notas: "Mesada cocina + baño principal",
      fechaInstalacion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { materialId: materiales[0].id, descripcion: "Mesada cocina", largo: 2.8, ancho: 0.6, cantBachas: 1, cantCortes: 0, precioUnit: 85000, precioTotal: 157800 },
          { materialId: materiales[2].id, descripcion: "Mesada baño", largo: 1.2, ancho: 0.5, cantBachas: 1, cantCortes: 0, precioUnit: 120000, precioTotal: 87000 },
        ],
      },
    },
  });

  const pedido2 = await prisma.pedido.upsert({
    where: { id: 2 },
    update: {},
    create: {
      clienteId: clientes[1].id,
      estado: "presupuesto",
      total: 228500,
      notas: "Espera confirmación del cliente",
      items: {
        create: [
          { materialId: materiales[5].id, descripcion: "Mesada cocina en L", largo: 3.0, ancho: 0.6, cantBachas: 1, cantCortes: 2, precioUnit: 145000, precioTotal: 277000 },
        ],
      },
    },
  });

  await prisma.pedido.upsert({
    where: { id: 3 },
    update: {},
    create: {
      clienteId: clientes[2].id,
      estado: "listo",
      total: 168000,
      fechaInstalacion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { materialId: materiales[1].id, descripcion: "Mesada baño", largo: 1.5, ancho: 0.5, cantBachas: 1, cantCortes: 0, precioUnit: 75000, precioTotal: 168750 },
        ],
      },
    },
  });

  await prisma.pedido.upsert({
    where: { id: 4 },
    update: {},
    create: {
      clienteId: clientes[3].id,
      estado: "instalado",
      total: 432000,
      items: {
        create: [
          { materialId: materiales[4].id, descripcion: "Mesada cocina completa", largo: 4.0, ancho: 0.65, cantBachas: 2, cantCortes: 1, precioUnit: 95000, precioTotal: 279000 },
        ],
      },
    },
  });

  // Recordatorios
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);

  await prisma.recordatorio.createMany({
    data: [
      { clienteId: clientes[1].id, nota: "Llamar para confirmar presupuesto Silestone", fechaAviso: ayer },
      { clienteId: clientes[0].id, nota: "Coordinar fecha de instalación cocina", fechaAviso: manana },
    ],
  });

  console.log("✅ Seed completado");
  console.log(`   ${materiales.length} materiales`);
  console.log(`   ${clientes.length} clientes`);
  console.log(`   4 pedidos`);
  console.log(`   2 recordatorios`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
