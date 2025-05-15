'use client';

import { useDynamicSelector } from "@/hooks/useDynamicSelector";
import DynamicTable from "@/components/DynamicTable";

export default function ModuleListPage() {
  const navItems = useDynamicSelector("navbar") || {};
  const navData = navItems?.data?.fetch || [];

  const filterColumns =["title", "url"]; // Example filters

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Modules</h1>
      <DynamicTable data={navData} filterColumns={filterColumns} />
    </div>
  );
}
