import { notFound } from "next/navigation";

export default function SalesAdminDashboard() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">B2B Sales Engine</h1>
      <p className="text-muted-foreground max-w-2xl">
        Internal development view. The private sales CRM is stored outside Git and Vercel and is not exposed through this route. Connect an approved private admin data source before enabling a production sales dashboard.
      </p>
    </div>
  );
}
