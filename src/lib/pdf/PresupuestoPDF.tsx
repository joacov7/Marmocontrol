import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1d4ed8",
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  docNumber: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 3,
  },
  docDate: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  // Info section
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoBoxTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoBoxValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  infoBoxSub: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 1,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1d4ed8",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  cellDesc: { flex: 3 },
  cellMed: { flex: 2 },
  cellExtra: { flex: 1.5 },
  cellPrice: { flex: 1.5, alignItems: "flex-end" },
  cellText: {
    fontSize: 9,
    color: "#374151",
  },
  cellBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  cellSub: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 1,
  },
  // Totals
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 40,
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: "#6b7280",
    width: 100,
    textAlign: "right",
  },
  totalValue: {
    fontSize: 9,
    color: "#374151",
    width: 90,
    textAlign: "right",
  },
  totalFinalBox: {
    flexDirection: "row",
    backgroundColor: "#1d4ed8",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
    gap: 40,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#bfdbfe",
    width: 100,
    textAlign: "right",
  },
  totalFinalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    width: 90,
    textAlign: "right",
  },
  // Notes
  notesBox: {
    marginTop: 20,
    backgroundColor: "#fffbeb",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  notesTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: "#78350f",
    lineHeight: 1.5,
  },
  // Install date
  installBox: {
    marginTop: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  installLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  installDate: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
    marginTop: 2,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  footerBrand: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
  },
  // Validity
  validityText: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 16,
    textAlign: "center",
  },
});

interface ItemPedido {
  id: number;
  descripcion: string | null;
  largo: number;
  ancho: number;
  cantBachas: number;
  cantCortes: number;
  precioUnit: number;
  precioTotal: number;
  material: { nombre: string; tipo: string };
}

interface PedidoData {
  id: number;
  total: number;
  notas: string | null;
  fechaInstalacion: Date | string | null;
  creadoEn: Date | string;
  cliente: { nombre: string; telefono: string; email: string | null; direccion: string | null };
  items: ItemPedido[];
}

function formatPeso(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(d));
}

export function PresupuestoPDF({ pedido }: { pedido: PedidoData }) {
  const subtotalMateriales = pedido.items.reduce((acc, it) => {
    const m2 = it.largo * it.ancho;
    return acc + m2 * it.precioUnit;
  }, 0);
  const subtotalExtras = pedido.total - subtotalMateriales;

  return (
    <Document
      title={`Presupuesto #${pedido.id} — ${pedido.cliente.nombre}`}
      author="MarmoControl"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>MARMOCONTROL</Text>
            <Text style={styles.brandTagline}>Sistema de gestión para marmolerías</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>PRESUPUESTO</Text>
            <Text style={styles.docNumber}>N° {String(pedido.id).padStart(4, "0")}</Text>
            <Text style={styles.docDate}>Fecha: {formatDate(pedido.creadoEn)}</Text>
          </View>
        </View>

        {/* Client info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Cliente</Text>
            <Text style={styles.infoBoxValue}>{pedido.cliente.nombre}</Text>
            <Text style={styles.infoBoxSub}>{pedido.cliente.telefono}</Text>
            {pedido.cliente.email && (
              <Text style={styles.infoBoxSub}>{pedido.cliente.email}</Text>
            )}
            {pedido.cliente.direccion && (
              <Text style={styles.infoBoxSub}>{pedido.cliente.direccion}</Text>
            )}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Detalle del pedido</Text>
            <Text style={styles.infoBoxSub}>
              {pedido.items.length} pieza{pedido.items.length !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.infoBoxSub}>
              {pedido.items.reduce((acc, it) => acc + it.largo * it.ancho, 0).toFixed(2)} m² totales
            </Text>
            {pedido.fechaInstalacion && (
              <Text style={styles.infoBoxSub}>
                Instalación: {formatDate(pedido.fechaInstalacion)}
              </Text>
            )}
          </View>
        </View>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.cellDesc]}>Descripción</Text>
          <Text style={[styles.tableHeaderText, styles.cellMed]}>Medidas</Text>
          <Text style={[styles.tableHeaderText, styles.cellExtra]}>Extras</Text>
          <Text style={[styles.tableHeaderText, { ...styles.cellPrice, color: "#ffffff" }]}>Subtotal</Text>
        </View>

        {/* Table rows */}
        {pedido.items.map((item, idx) => (
          <View
            key={item.id}
            style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
          >
            <View style={styles.cellDesc}>
              <Text style={styles.cellBold}>
                {item.descripcion || item.material.nombre}
              </Text>
              <Text style={styles.cellSub}>
                {item.material.nombre} · {formatPeso(item.precioUnit)}/m²
              </Text>
            </View>
            <View style={styles.cellMed}>
              <Text style={styles.cellText}>
                {item.largo} × {item.ancho} m
              </Text>
              <Text style={styles.cellSub}>
                {(item.largo * item.ancho).toFixed(2)} m²
              </Text>
            </View>
            <View style={styles.cellExtra}>
              {item.cantBachas > 0 && (
                <Text style={styles.cellText}>
                  {item.cantBachas} bacha{item.cantBachas > 1 ? "s" : ""}
                </Text>
              )}
              {item.cantCortes > 0 && (
                <Text style={styles.cellText}>
                  {item.cantCortes} corte{item.cantCortes > 1 ? "s" : ""}
                </Text>
              )}
              {item.cantBachas === 0 && item.cantCortes === 0 && (
                <Text style={styles.cellSub}>—</Text>
              )}
            </View>
            <View style={styles.cellPrice}>
              <Text style={styles.cellBold}>{formatPeso(item.precioTotal)}</Text>
            </View>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsSection}>
          {subtotalExtras > 0 && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Materiales</Text>
                <Text style={styles.totalValue}>{formatPeso(subtotalMateriales)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Bachas y cortes</Text>
                <Text style={styles.totalValue}>{formatPeso(subtotalExtras)}</Text>
              </View>
            </>
          )}
          <View style={styles.totalFinalBox}>
            <Text style={styles.totalFinalLabel}>TOTAL</Text>
            <Text style={styles.totalFinalValue}>{formatPeso(pedido.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {pedido.notas && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Notas</Text>
            <Text style={styles.notesText}>{pedido.notas}</Text>
          </View>
        )}

        {/* Validity */}
        <Text style={styles.validityText}>
          Este presupuesto tiene validez de 7 días desde la fecha de emisión.
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Presupuesto N° {String(pedido.id).padStart(4, "0")} · {formatDate(pedido.creadoEn)}
          </Text>
          <Text style={styles.footerBrand}>MarmoControl</Text>
        </View>
      </Page>
    </Document>
  );
}
