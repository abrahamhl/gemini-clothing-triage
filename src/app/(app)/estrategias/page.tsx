import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <ComingSoon
      title="Estrategias IA"
      lead="Un consultor que audita el stock y propone movimientos con justificación, no solo datos."
      points={[
        "Recomendaciones: mantener, liquidar, agrupar, subir o bajar precio.",
        "Avisos por temporada y eventos con paquetes sugeridos.",
        "Justificación de precio con contexto de mercado.",
      ]}
    />
  );
}
