import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </div>
    </main>
  )
}