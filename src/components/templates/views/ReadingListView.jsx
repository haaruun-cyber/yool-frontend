import { Plus } from 'lucide-react';
import { uid } from '../../../utils/templateContent';
import { DbToolbar } from '../DbToolbar';

export function ReadingListView({ content, onChange }) {
  const books = content.books || [];

  const setBooks = (next) => onChange({ ...content, books: next });

  return (
    <div>
      <DbToolbar
        title="Books"
        onNew={() => setBooks([...books, { id: uid(), title: 'New book', author: '', status: 'want' }])}
      />
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="border-b border-notion-border text-left text-xs text-ink-muted">
            <th className="py-2 font-normal">Title</th>
            <th className="py-2 font-normal">Author</th>
            <th className="py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} className="border-b border-notion-border hover:bg-notion-hover/50">
              <td className="py-2 pr-3">
                <input
                  value={b.title}
                  onChange={(e) =>
                    setBooks(books.map((x) => (x.id === b.id ? { ...x, title: e.target.value } : x)))
                  }
                  className="w-full bg-transparent outline-none"
                />
              </td>
              <td className="py-2 pr-3">
                <input
                  value={b.author}
                  onChange={(e) =>
                    setBooks(books.map((x) => (x.id === b.id ? { ...x, author: e.target.value } : x)))
                  }
                  className="w-full bg-transparent text-ink-muted outline-none"
                />
              </td>
              <td className="py-2">
                <select
                  value={b.status}
                  onChange={(e) =>
                    setBooks(books.map((x) => (x.id === b.id ? { ...x, status: e.target.value } : x)))
                  }
                  className="rounded bg-notion-hover px-2 py-1 text-xs"
                >
                  <option value="want">Want to read</option>
                  <option value="reading">Reading</option>
                  <option value="done">Finished</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => setBooks([...books, { id: uid(), title: 'New book', author: '', status: 'want' }])}
        className="mt-2 flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:bg-notion-hover"
      >
        <Plus className="h-4 w-4" /> New page
      </button>
    </div>
  );
}
