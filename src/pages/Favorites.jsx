import { DatabaseTable } from '../components/notion/DatabaseTable';

export default function Favorites() {
  return <DatabaseTable mode="favorites" pageTitle="Favorites" pageDescription="Pages you starred." />;
}
