import { useRef } from 'react';
import { Upload } from 'lucide-react';

export function FileUpload({ accept = 'image/*,application/pdf', label = 'Upload file', onFile }) {
  const ref = useRef(null);
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => onFile?.(e.target.files?.[0])} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-ink-muted transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600"
      >
        <Upload className="h-4 w-4" />
        {label}
      </button>
    </>
  );
}
