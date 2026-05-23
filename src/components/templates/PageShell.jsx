import { DocumentTypeIcon } from '../../utils/docIcons';
import { FileUpload } from '../editor/FileUpload';

export function PageShell({ docType, title, onTitleChange, cover, onCoverUpload, description, children }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="group relative">
        <img src={cover} alt="" className="h-32 w-full object-cover md:h-44" />
        {onCoverUpload && (
          <div className="absolute right-4 top-3">
            <FileUpload label="Change cover" accept="image/*" onFile={onCoverUpload} />
          </div>
        )}
      </div>
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-6 md:px-12">
        <DocumentTypeIcon type={docType} className="mb-2 h-10 w-10 text-ink-muted" />
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mb-2 w-full border-none bg-transparent text-4xl font-bold tracking-tight text-ink outline-none"
          placeholder="Untitled"
        />
        {description && <p className="mb-6 max-w-2xl text-sm text-ink-muted">{description}</p>}
        {children}
      </div>
    </div>
  );
}
