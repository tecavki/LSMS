// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-gray-950 min-h-screen">
      {children}
    </section>
  );
}