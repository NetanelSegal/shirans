import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { uploadArticleImage } from '@/services/admin/articles.service';
import { cn } from '@/lib/cn';

/**
 * The article editor. It produces HTML, which the server sanitises before it
 * is stored — see server/src/utils/sanitizeHtml.ts for the allow-list this
 * toolbar is designed to stay inside.
 */

interface ToolbarButtonProps {
  label: string;
  icon: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({ label, icon, isActive, onClick, disabled }: ToolbarButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={isActive}
      className={cn(
        'size-9 rounded-card border border-line text-sm transition-colors disabled:opacity-50',
        isActive ? 'bg-primary text-on-dark' : 'bg-surface-raised text-ink hover:bg-surface-sunken',
      )}
    >
      <i className={icon} aria-hidden />
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const addLink = useCallback(() => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('כתובת הקישור', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const onImagePicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadArticleImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='flex flex-wrap gap-1.5 border-b border-line bg-surface-soft p-2'>
      <ToolbarButton
        label='כותרת ראשית'
        icon='fa-solid fa-heading'
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label='כותרת משנה'
        icon='fa-solid fa-heading fa-sm'
        isActive={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        label='מודגש'
        icon='fa-solid fa-bold'
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label='נטוי'
        icon='fa-solid fa-italic'
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label='רשימת תבליטים'
        icon='fa-solid fa-list-ul'
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label='רשימה ממוספרת'
        icon='fa-solid fa-list-ol'
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label='ציטוט'
        icon='fa-solid fa-quote-right'
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton label='קישור' icon='fa-solid fa-link' isActive={editor.isActive('link')} onClick={addLink} />
      <ToolbarButton
        label={uploading ? 'מעלה תמונה…' : 'תמונה'}
        icon={uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-image'}
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
      />
      <ToolbarButton
        label='קו מפריד'
        icon='fa-solid fa-minus'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <ToolbarButton
        label='ביטול'
        icon='fa-solid fa-rotate-left'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={onImagePicked} />
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  ariaLabel,
  minHeight = '20rem',
}: {
  value: string;
  onChange: (html: string) => void;
  ariaLabel: string;
  minHeight?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        dir: 'rtl',
        'aria-label': ariaLabel,
        class: 'article-body p-4 outline-none',
        style: `min-height:${minHeight}`,
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  // Reset when the form switches to a different article. Comparing against the
  // editor's own HTML first keeps this from fighting the user as they type.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className='overflow-hidden rounded-card border border-line bg-surface-raised'>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
