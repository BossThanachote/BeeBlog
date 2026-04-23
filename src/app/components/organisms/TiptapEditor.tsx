'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent, Extension, Node, mergeAttributes } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Bold, Italic, Underline as UnderlineIcon, List, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, GripHorizontal } from 'lucide-react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

// 🌟 Component จัดการ Layout รูปภาพ (เพิ่มระบบเล็งพิกัดแทรกรูป ซ้าย/ขวา)
const ImageGroupComponent = (props: any) => {
  // 🌟 ดึง editor ออกมาใช้งานด้วยเพื่อใช้จัดการข้อมูลข้ามกล่อง
  const { node, selected, updateAttributes, deleteNode, getPos, editor } = props
  const images = node.attrs.images || []
  const isSingle = images.length === 1
  
  const [aspectRatios, setAspectRatios] = React.useState<number[]>([])
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [imagesLoaded, setImagesLoaded] = React.useState<boolean[]>(new Array(images.length).fill(false))
  
  // 🌟 State ใหม่สำหรับจำพิกัดว่ากำลังจะดรอปรูปทาง ซ้าย หรือ ขวา
  const [dragOverInfo, setDragOverInfo] = React.useState<{ index: number, isRight: boolean } | null>(null)

  React.useEffect(() => {
    if (!selected) setActiveIndex(null)
  }, [selected])

  React.useEffect(() => {
    if (images.length === 0) return
    const ratios: number[] = new Array(images.length).fill(1)
    
    images.forEach((src: string, index: number) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        ratios[index] = img.width / img.height
        setAspectRatios(prev => {
          const newRatios = [...(prev.length ? prev : ratios)]
          newRatios[index] = img.width / img.height
          return newRatios
        })
        setImagesLoaded(prev => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }
    })
  }, [images])

  const totalRatio = aspectRatios.length === images.length 
    ? aspectRatios.reduce((sum, ratio) => sum + ratio, 0) 
    : images.length

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_: string, i: number) => i !== indexToRemove)
    if (newImages.length === 0) {
      deleteNode()
    } else {
      updateAttributes({ images: newImages })
      setActiveIndex(null)
      setAspectRatios([]) 
      setImagesLoaded(new Array(newImages.length).fill(false))
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected && activeIndex !== null && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault()
        e.stopPropagation()
        removeImage(activeIndex)
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [selected, activeIndex, images])

  return (
    <NodeViewWrapper className={`group relative my-10 w-full outline-none ${selected ? 'ring-2 ring-yellow-400 rounded-xl p-1' : ''}`}>
      <div
        contentEditable={false}
        data-drag-handle
        className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing bg-white border border-gray-200 shadow-md p-1.5 rounded-lg z-50 hover:bg-gray-50 hover:scale-110"
        title="ลากเพื่อย้ายตำแหน่ง"
      >
        <GripHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      <div className={`w-full ${isSingle ? 'flex justify-center' : 'flex flex-row flex-nowrap gap-2 items-center'}`}>
        {images.map((src: string, index: number) => {
          const isReady = aspectRatios.length === images.length
          const ratio = isReady ? aspectRatios[index] : 1
          
          const widthPercentage = isSingle ? 'auto' : isReady ? `${(ratio / totalRatio) * 100}%` : `${100 / images.length}%`
          const paddingBottom = isSingle && isReady ? '0' : `${(1 / ratio) * 100}%`

          return (
            <div
              key={index}
              draggable={true} 
              onDragStart={(e) => {
                e.dataTransfer.setData('application/tiptap-image-move', JSON.stringify({ src, fromPos: getPos(), fromIndex: index }))
                e.dataTransfer.effectAllowed = 'move'
              }}
              // 🌟 1. ดักจับตอนเอาเมาส์ลากมาอยู่บนรูป เพื่อเล็งพิกัดซ้าย/ขวา
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const rect = e.currentTarget.getBoundingClientRect()
                const isRight = e.clientX > rect.left + rect.width / 2 // ถ้าเมาส์อยู่เลยกึ่งกลาง = แทรกด้านขวา
                setDragOverInfo({ index, isRight })
              }}
              onDragLeave={() => setDragOverInfo(null)}
              // 🌟 2. ดักจับตอน "ปล่อยเมาส์ (Drop)" แบบแม่นยำ
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDragOverInfo(null)

                // คำนวณ Index เป้าหมาย ว่าจะให้ไปอยู่ลำดับที่เท่าไหร่
                const rect = e.currentTarget.getBoundingClientRect()
                const isRight = e.clientX > rect.left + rect.width / 2
                let targetIndex = isRight ? index + 1 : index

                const internalMoveData = e.dataTransfer.getData('application/tiptap-image-move')

                // 🔀 กรณี: ลากย้ายรูปภาพ
                if (internalMoveData) {
                  try {
                    const { src: moveSrc, fromPos, fromIndex } = JSON.parse(internalMoveData)

                    if (fromPos === getPos()) {
                      // 1. ลากสลับตำแหน่ง "ในกล่องเดียวกัน"
                      if (fromIndex === targetIndex || fromIndex === targetIndex - 1) return 
                      const newImages = [...images]
                      newImages.splice(fromIndex, 1) // ดึงรูปออกจากตำแหน่งเดิม
                      if (fromIndex < targetIndex) targetIndex-- // ขยับ Index ถ้าตำแหน่งเลื่อน
                      newImages.splice(targetIndex, 0, moveSrc) // เสียบรูปเข้าไปในตำแหน่งเป้าหมายเป๊ะๆ
                      updateAttributes({ images: newImages })
                    } else {
                      // 2. ลากย้ายมาจาก "กล่องอื่น"
                      if (images.length >= 3) {
                        alert('กล่องบรรทัดนี้เต็ม 3 รูปแล้วครับ')
                        return
                      }
                      const newImages = [...images]
                      newImages.splice(targetIndex, 0, moveSrc)
                      updateAttributes({ images: newImages })

                      // สั่งลบรูปที่กล่องเดิมทิ้ง (Move ของจริง)
                      const tr = editor.state.tr
                      const sourceNode = editor.state.doc.nodeAt(fromPos)
                      if (sourceNode && sourceNode.type.name === 'imageGroup') {
                        const oldImages = [...sourceNode.attrs.images]
                        oldImages.splice(fromIndex, 1)
                        if (oldImages.length === 0) {
                          tr.delete(fromPos, fromPos + sourceNode.nodeSize)
                        } else {
                          tr.setNodeMarkup(fromPos, null, { images: oldImages })
                        }
                      }
                      editor.view.dispatch(tr)
                    }
                  } catch (err) { console.error('Move Error:', err) }
                } 
                // 🔀 กรณี: ลากไฟล์รูปจากเครื่องคอมพิวเตอร์มาใส่
                else if (e.dataTransfer.files?.length) {
                  const file = e.dataTransfer.files[0]
                  if (file.type.startsWith('image/') && images.length < 3) {
                    const reader = new FileReader()
                    reader.onload = (evt) => {
                      const newSrc = evt.target?.result as string
                      const newImages = [...images]
                      newImages.splice(targetIndex, 0, newSrc) // แทรกซ้าย/ขวา ได้อย่างอิสระ
                      updateAttributes({ images: newImages })
                    }
                    reader.readAsDataURL(file)
                  }
                }
              }}
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(index)
              }}
              className={`relative overflow-hidden rounded-lg border shadow-sm cursor-pointer transition-all duration-300 ${
                isSingle ? (isReady ? 'max-w-[80%] mx-auto' : 'w-full max-w-[80%] mx-auto') : ''
              } ${activeIndex === index ? 'ring-4 ring-red-500 z-10' : 'border-gray-100'}
                ${!imagesLoaded[index] ? 'bg-gray-200 animate-pulse' : 'bg-transparent'}
              `}
              style={{ width: widthPercentage }}
            >
              {/* 🌟 3. "เส้นบอกตำแหน่งสีเหลือง" จะแสดงขึ้นมาเวลาเอาเมาส์ลากรูปมาเล็งที่กรอบนี้ */}
              {dragOverInfo?.index === index && (
                <div className={`absolute top-0 bottom-0 w-2 bg-yellow-400 z-50 rounded-full shadow-lg ${dragOverInfo.isRight ? 'right-0' : 'left-0'}`} />
              )}

              {!isSingle && <div style={{ paddingBottom: paddingBottom, width: '100%' }} />}
              
              <img 
                src={src} 
                alt={`blog-content-${index}`} 
                draggable={false}
                className={`transition-opacity duration-500 ease-in-out ${isSingle ? 'relative w-full h-auto block' : 'absolute top-0 left-0 w-full h-full object-cover'} ${imagesLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
              />
              
              {activeIndex === index && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-20"
                >
                  ✕
                </button>
              )}
            </div>
          )
        })}
      </div>
      {!isSingle && <p className="text-center text-sm text-gray-400 mt-3 font-light">Image Gallery ({images.length} photos)</p>}
    </NodeViewWrapper>
  )
}

const ImageGroup = Node.create({
  name: 'imageGroup',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() { 
    return { 
      images: { 
        default: [],
        // 🌟 1. ดักตอนเอามาวาง (Paste): แปลงข้อความกลับเป็น Array
        parseHTML: element => {
          const data = element.getAttribute('data-images')
          return data ? JSON.parse(data) : []
        },
        // 🌟 2. ดักตอนกดก็อปปี้ (Copy): แปลง Array เป็นข้อความฝากไว้ใน HTML
        renderHTML: attributes => {
          return { 'data-images': JSON.stringify(attributes.images) }
        }
      } 
    } 
  },
  parseHTML() { return [{ tag: 'div[data-type="image-group"]' }] },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-group' })] },
  addNodeView() { return ReactNodeViewRenderer(ImageGroupComponent) },
})

const TabHandler = Extension.create({
  name: 'tabHandler',
  addKeyboardShortcuts() {
    return { Tab: () => { this.editor.commands.insertContent('\u00a0\u00a0\u00a0\u00a0'); return true } }
  },
})

export const TiptapEditor = ({ content, onChange }: { content: string, onChange: (c: string) => void }) => {
  const [, setRenderTrigger] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc ml-6' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal ml-6' } },
      }),
      ImageGroup, Underline, Dropcursor.configure({ color: '#facc15', width: 3 }),
      TextAlign.configure({ types: ['heading', 'paragraph'], defaultAlignment: 'left' }),
      Placeholder.configure({ placeholder: 'เริ่มต้นเขียนบล็อกของคุณ...' }), TabHandler,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()) },
    onTransaction: () => { setRenderTrigger(prev => prev + 1) },
    editorProps: {
      attributes: { class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] text-gray-900 p-4' },
      handlePaste: (view, event, slice) => {
        if (event.clipboardData?.files?.length) {
          const file = event.clipboardData.files[0]
          // เช็คว่าเป็นไฟล์รูปภาพไหม (เช่น ก็อปมาจาก Snipping Tool หรือก็อปไฟล์มา)
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              // สร้างกล่อง ImageGroup ใหม่แล้วเสียบลงไปตรงที่เคอร์เซอร์กระพริบอยู่
              const newNode = view.state.schema.nodes.imageGroup.create({ images: [src] })
              const tr = view.state.tr
              tr.replaceSelectionWith(newNode)
              view.dispatch(tr)
            }
            reader.readAsDataURL(file)
            return true
          }
        }
        return false // ถ้าไม่ใช่รูปภาพ ก็ปล่อยให้ Tiptap วางข้อความตามปกติ
      },
      
      handleDrop: (view, event, slice, moved) => {
        // จัดการลากเพื่อตั้งกล่องใหม่ (เมื่อไม่ได้วางบนรูปภาพ)
        const internalMoveData = event.dataTransfer?.getData('application/tiptap-image-move')
        if (internalMoveData) {
          try {
            const { src, fromPos, fromIndex } = JSON.parse(internalMoveData)
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
            if (!coordinates) return false

            const { tr } = view.state
            let targetGroupPos = -1
            let targetGroupNode: any = null

            view.state.doc.nodesBetween(coordinates.pos, coordinates.pos, (node, pos) => {
              if (node.type.name === 'imageGroup') { targetGroupPos = pos; targetGroupNode = node; return false }
            })

            // ถ้าปล่อยลงกล่องที่ Tiptap หาเจอ แต่ไม่ได้เจาะจงซ้ายขวา
            if (targetGroupPos !== -1 && targetGroupPos !== fromPos) {
              if (targetGroupNode.attrs.images.length >= 3) return false // เต็มแล้วไม่รับ
              
              const sourceNode = view.state.doc.nodeAt(fromPos)
              if (sourceNode && sourceNode.type.name === 'imageGroup') {
                const oldImages = [...sourceNode.attrs.images]
                oldImages.splice(fromIndex, 1)
                if (oldImages.length === 0) tr.delete(fromPos, fromPos + sourceNode.nodeSize)
                else tr.setNodeMarkup(fromPos, null, { images: oldImages })
              }
              const mappedTargetPos = tr.mapping.map(targetGroupPos)
              const newTargetImages = [...targetGroupNode.attrs.images, src]
              tr.setNodeMarkup(mappedTargetPos, null, { images: newTargetImages })
              view.dispatch(tr)
              return true
            }

            // ถ้าปล่อยลงพื้นที่ว่าง (ตัวหนังสือ)
            if (targetGroupPos === -1) {
              const sourceNode = view.state.doc.nodeAt(fromPos)
              if (sourceNode && sourceNode.type.name === 'imageGroup') {
                const oldImages = [...sourceNode.attrs.images]
                oldImages.splice(fromIndex, 1)
                if (oldImages.length === 0) tr.delete(fromPos, fromPos + sourceNode.nodeSize)
                else tr.setNodeMarkup(fromPos, null, { images: oldImages })
              }
              const mappedPos = tr.mapping.map(coordinates.pos)
              const newNode = view.state.schema.nodes.imageGroup.create({ images: [src] })
              tr.insert(mappedPos, newNode)
              view.dispatch(tr)
              return true
            }
          } catch (e) {}
        }
        
        // จัดการดึงไฟล์รูปภาพจากข้างนอกเข้าพื้นที่ว่าง
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
              if (coordinates && view.state) {
                let targetGroupPos = -1
                let targetGroupNode: any = null
                view.state.doc.nodesBetween(coordinates.pos, coordinates.pos, (node, pos) => {
                  if (node.type.name === 'imageGroup') { targetGroupPos = pos; targetGroupNode = node; return false }
                })

                if (targetGroupNode && targetGroupNode.attrs.images.length < 3) {
                  const newImages = [...targetGroupNode.attrs.images, src]
                  const tr = view.state.tr
                  tr.setNodeMarkup(targetGroupPos, null, { images: newImages })
                  view.dispatch(tr)
                } else if (!targetGroupNode) {
                  const newNode = view.state.schema.nodes.imageGroup.create({ images: [src] })
                  const tr = view.state.tr
                  tr.insert(coordinates.pos, newNode)
                  view.dispatch(tr)
                }
              }
            }
            reader.readAsDataURL(file)
            return true
          }
        }
        return false
      },
    },
  })

  if (!editor) return null

  return (
    <div className="w-full h-full">
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl mb-8 sticky top-24 z-40 shadow-sm">
        <div className="flex items-center gap-1">
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-xl transition-all ${editor.isActive('bold') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><Bold className="w-5 h-5" /></button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-xl transition-all ${editor.isActive('italic') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><Italic className="w-5 h-5" /></button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-xl transition-all ${editor.isActive('underline') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><UnderlineIcon className="w-5 h-5" /></button>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-xl transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><AlignLeft className="w-5 h-5" /></button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-xl transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><AlignCenter className="w-5 h-5" /></button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-xl transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><AlignRight className="w-5 h-5" /></button>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-xl transition-all ${editor.isActive('bulletList') ? 'bg-yellow-50 text-yellow-600' : 'text-gray-500 hover:bg-gray-50'}`}><List className="w-5 h-5" /></button>
        </div>
        <button 
          type="button" 
          onClick={() => {
            const url = window.prompt('URL รูปภาพ:');
            if (url) editor.chain().focus().insertContent({ type: 'imageGroup', attrs: { images: [url] } }).run()
          }} 
          className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded-xl text-sm font-bold flex gap-2 items-center hover:bg-yellow-500 transition-all shadow-sm active:scale-95"
        >
          <ImageIcon className="w-4 h-4" /> เพิ่มรูปภาพ
        </button>
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .tiptap ol { list-style-type: decimal !important; padding-left: 2rem !important; margin: 1rem 0; }
        .tiptap ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 1rem 0; }
        .tiptap li p { margin: 0; }
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror-selectednode { outline: none !important; }
      `}</style>
    </div>
  )
}