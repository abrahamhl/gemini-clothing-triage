import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <ComingSoon
      title="Integraciones"
      lead="Exporta tu catálogo donde lo necesites, manteniendo el núcleo intacto."
      points={[
        "Exportación a WordPress / WooCommerce y Shopify.",
        "Publicación asistida en marketplaces.",
        "Vista escaparate como ecommerce, solo para ti por ahora.",
      ]}
    />
  );
}
