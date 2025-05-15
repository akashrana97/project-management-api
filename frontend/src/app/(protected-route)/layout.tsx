// app/(with-navbar)/layout.tsx
'use client';

import ResponsiveNavbar from '../../components/layouts/navbar';

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <ResponsiveNavbar />
      <div className="p-6">{children}</div>
    </main>
  );
}
