import { DatabaseTable } from '../components/notion/DatabaseTable';

export default function SharedDocs() {
  return <DatabaseTable mode="shared" pageTitle="Shared with me" pageDescription="Pages others shared with you." />;
}
