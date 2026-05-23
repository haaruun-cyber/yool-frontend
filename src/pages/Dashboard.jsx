import { useEffect } from 'react';
import { DatabaseTable } from '../components/notion/DatabaseTable';
import { useDocumentStore } from '../store/documentStore';

export default function Dashboard() {
  const resetFilters = useDocumentStore((s) => s.resetFilters);
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  return (
    <DatabaseTable
      pageTitle="Project Planner"
      pageDescription="Use this table to track projects. Add a row for each project, set status and deadline, then open a row to edit details."
    />
  );
}
