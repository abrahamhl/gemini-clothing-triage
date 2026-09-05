import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <ComingSoon
      title="Anuncios"
      lead="Centro de anuncios generados. Hoy se crean desde la ficha de cada artículo; aquí vivirá su historial."
      points={[
        "Listado de anuncios por plataforma (Marktplaats, Vinted) y estado.",
        "Plantillas editables y notas estratégicas reutilizables.",
        "Vista previa tipo escaparate antes de publicar.",
      ]}
    />
  );
}
