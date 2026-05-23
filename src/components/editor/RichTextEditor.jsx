import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';

function normalizeDoc(content) {
  if (content && typeof content === 'object' && content.type === 'doc') return content;
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: content && typeof content === 'string' ? [{ type: 'text', text: content }] : [] }],
  };
}

export function RichTextEditor({ value, onChange, placeholder = 'Write something…', editable = true }) {
  const debounceRef = useRef();
  const fileRef = useRef(null);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder]
  );

  const editor = useEditor({
    extensions,
    editable,
    content: normalizeDoc(value),
    onUpdate: ({ editor: ed }) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange?.(ed.getJSON());
      }, 800);
    },
  });

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const onFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [editor]
  );

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-surface dark:border-slate-800">
      <EditorToolbar editor={editor} onImagePick={onImagePick} />
      <EditorContent editor={editor} className="tiptap min-h-[420px] px-4 py-4" />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}
