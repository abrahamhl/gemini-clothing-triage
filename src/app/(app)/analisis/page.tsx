import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <ComingSoon
      title="Análisis IA"
      lead="Cola de análisis y reanálisis sobre el mismo motor de visión que ya usa el inventario."
      points={[
        "Reanalizar artículos marcados para revisión.",
        "Comparativa de mercado y nivel de confianza por atributo.",
        "Ajuste manual asistido cuando la IA duda.",
      ]}
    />
  );
}
