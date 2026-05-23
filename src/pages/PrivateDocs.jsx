import { DatabaseTable } from '../components/notion/DatabaseTable';

export default function PrivateDocs() {
  return <DatabaseTable mode="private" pageTitle="Private" pageDescription="Only you can see these pages." />;
}
