'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor' // เพิ่มตัวนี้เพื่อให้มีเส้นบอกตำแหน่งวาง
import { Bold, Italic, List, Image as ImageIcon } from 'lucide-react'

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Dropcursor.configure({
        color: '#facc15', // สีเหลือง BeeBlog เวลาลากรูปไปวาง
        width: 3,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl border border-gray-100 shadow-sm my-8 cursor-grab active:cursor-grabbing ProseMirror-selectednode:outline ProseMirror-selectednode:outline-3 ProseMirror-selectednode:outline-yellow-400',
        },
      }),
      Placeholder.configure({
        placeholder: 'เริ่มต้นเขียนเรื่องราวของคุณตรงนี้...',
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] cursor-text text-gray-900 leading-relaxed p-4',
      },
      // ดักจับเหตุการณ์ที่ระดับ Editor ทั้งหมด
      handleDrop: (view, event, slice, moved) => {
        // ถ้าเป็นการลากไฟล์จากภายนอก (ไม่ใช่การย้ายข้อความใน editor)
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          
          if (file.type.startsWith('image/')) {
            event.preventDefault(); // สั่งหยุด Browser ไม่ให้เปิดแท็บใหม่
            
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              // แทรกรูปตรงจุดที่วางเมาส์พอดี
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coordinates) {
                view.dispatch(view.state.tr.replaceWith(coordinates.pos, coordinates.pos, view.state.schema.nodes.image.create({ src: url })));
              }
            };
            reader.readAsDataURL(file);
            return true; // บอกว่าเราจัดการ Drop นี้แล้ว
          }
        }
        return false;
      },
      // ป้องกันเบราว์เซอร์เปิดแท็บใหม่ตอนลากผ่าน
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          event.preventDefault();
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              editor?.chain().focus().setImage({ src: url }).run();
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      }
    },
  })

  if (!editor) return null

  return (
    <div className="w-full h-full" 
      // ดักจับที่ตัวครอบนอกสุดอีกชั้นเพื่อความชัวร์
      onDragOver={(e) => e.preventDefault()} 
      onDrop={(e) => e.preventDefault()}
    >
      {/* Toolbar (ใช้โค้ดเดิมของคุณได้เลย) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-gray-50 border border-gray-200 rounded-2xl mb-8 sticky top-20 z-40">
        <div className="flex items-center gap-1">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-xl ${editor.isActive('bold') ? 'bg-white text-yellow-600' : ''}`}><Bold className="w-5 h-5" /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-xl ${editor.isActive('italic') ? 'bg-white text-yellow-600' : ''}`}><Italic className="w-5 h-5" /></button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-xl ${editor.isActive('bulletList') ? 'bg-white text-yellow-600' : ''}`}><List className="w-5 h-5" /></button>
        </div>
        <button onClick={() => {
          const url = window.prompt('URL:');
          if(url) editor.chain().focus().setImage({ src: url }).run();
        }} className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-bold flex gap-2 items-center">
          <ImageIcon className="w-4 h-4" /> เพิ่มรูปภาพ
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}