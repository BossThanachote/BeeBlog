# BeeBlog Application

ระบบเว็บบล็อก (Blog Application) ที่พัฒนาด้วยเทคโนโลยีสมัยใหม่ เน้นความเร็ว ความสวยงาม และการใช้งานที่ง่าย

---

## วิธีการติดตั้งและเริ่มใช้งาน (How to Run Project)

เพื่อให้โปรเจกต์ทำงานได้อย่างสมบูรณ์ กรุณาทำตามขั้นตอนดังนี้:

### 1. ความต้องการของระบบ (Prerequisites)
*   **IDE:** แนะนำให้ใช้ **Visual Studio Code (VS Code)**
*   **Node.js:** เวอร์ชัน **20.x หรือสูงกว่า** (แนะนำ LTS)
*   **Package Manager:** **npm** (มาพร้อมกับ Node.js)

### 2. การเตรียม Environment Variable
สร้างไฟล์ชื่อ `.env.local` ไว้ที่ root ของโปรเจกต์ และกำหนดค่าดังนี้:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
(ผมได้แนบไฟล์ .env.local ไว้ในโปรเจกต์แล้ว)
```

### 3. ขั้นตอนการรัน (Step by Step)
1.  **ติดตั้ง dependencies:** เปิด Terminal ใน IDE แล้วพิมพ์:
    ```bash
    npm install
    ```
2.  **เริ่มรันโปรเจกต์ (Development Mode):**
    ```bash
    npm run dev
    ```
3.  **เข้าชมเว็บไซต์:** เปิด Browser ไปที่ `http://localhost:3000`

---

## 🛠 Tech Stack ที่ใช้

*   **Frontend Framework:** [Next.js 15+] (App Router)
*   **Language:** [TypeScript]
*   **Styling:** [Tailwind CSS 4]
*   **Database & Auth:** [Supabase] (PostgreSQL)
*   **Icons:** [Lucide React]
*   **Editor:** [Tiptap Editor] สำหรับการเขียนบทความ (Rich Text)

---

## 💡 Assumption และข้อจำกัด (Assumptions & Limitations)

*   **การเข้าถึง Admin:** ในปัจจุบันระบบใช้การตรวจสอบผ่าน Middleware ของ Supabase โดยสมมติว่าผู้ใช้ที่มีสิทธิ์ Admin จะต้องผ่านการ Login และตรวจสอบ Role หรือเงื่อนไขที่กำหนดไว้ใน Database
*   **การจัดการรูปภาพ:** รูปภาพในบทความจะถูกจัดการผ่าน URL หรืออัปโหลดผ่าน Supabase Storage
*   **Responsiveness:** ระบบถูกออกแบบให้รองรับ Desktop เป็นหลัก แต่มีการใช้ Tailwind CSS เพื่อให้แสดงผลได้ดีใน Mobile (Responsive Design)
*   **ข้อจำกัด:** ระบบนี้เป็นการพัฒนาเพื่อจุดประสงค์ตาม Assignment ที่ได้รับมอบหมาย จึงมีความสามารถพื้นฐานของ Blog เช่น การสร้าง/แก้ไข/ลบบทความ และการอนุมัติคอมเมนต์ ยังไม่มีระบบระบบแจ้งเตือนผ่านอีเมล (Email Notification) ในเวอร์ชันนี้

account ที่มี role admin 
- email: adminTest@hotmail.com
- password: admin1234

หากอยากเข้าผ่านเว็บไซต์จริง ให้ไปที่ https://bee-blog-8cww.vercel.app/
