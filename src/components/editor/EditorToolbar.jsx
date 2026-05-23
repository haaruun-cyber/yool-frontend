import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  ListChecks,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
} from 'lucide-react';
import clsx from 'clsx';

const Btn = ({ active, onClick, children, title, disabled }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      'rounded-lg p-2 text-ink-muted transition hover:bg-surface-muted hover:text-ink disabled:opacity-40',
      active && 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
    )}
  >
    {children}
  </button>
);

export function EditorToolbar({ editor, onImagePick }) {
  if (!editor) return null;

  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200/80 bg-surface-muted/40 px-2 py-2 dark:border-slate-800">
      <Btn title="Undo" disabled={!editor.can().undo()} onClick={() => chain().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn title="Redo" disabled={!editor.can().redo()} onClick={() => chain().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
      <Btn title="H1" active={editor.isActive('heading', { level: 1 })} onClick={() => chain().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-4 w-4" />
      </Btn>
      <Btn title="H2" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn title="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn title="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn title="Strike" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Btn>
      <Btn title="Code" active={editor.isActive('code')} onClick={() => chain().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
      <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Btn>
      <Btn title="Ordered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn title="Checklist" active={editor.isActive('taskList')} onClick={() => chain().toggleTaskList().run()}>
        <ListChecks className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
      <Btn
        title="Link"
        active={editor.isActive('link')}
        onClick={() => {
          const prev = editor.getAttributes('link').href;
          const url = window.prompt('URL', prev || 'https://');
          if (url === null) return;
          if (url === '') {
            chain().extendMarkRange('link').unsetLink().run();
          } else {
            chain().extendMarkRange('link').setLink({ href: url }).run();
          }
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </Btn>
      <Btn title="Image" onClick={onImagePick}>
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <Btn
        title="Table"
        onClick={() =>
          chain()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <Table className="h-4 w-4" />
      </Btn>
    </div>
  );
}
