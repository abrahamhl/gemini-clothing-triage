import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <ComingSoon
      title="Analytics"
      lead="Rendimiento real de tu reventa, no solo cuánto tienes."
      points={[
        "Beneficio, rotación y tiempo medio de venta.",
        "Categorías y marcas más rentables.",
        "Valor inmovilizado y alertas de stock parado.",
      ]}
    />
  );
}
