export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  slug: string;
  author_id?: string | null;
  gallery_images?: string[];
  is_published: boolean;
  
  // avatar_url ตรงนี้คือของตาราง blogs (ถ้ามี)
  avatar_url?: string | null; 
  
  view_count?: number; 
  created_at: string;
  updated_at?: string;

  likes?: number;
  comments?: number;

  // 🌟 ต้องเพิ่มเข้าไปในก้อน users ตรงนี้ด้วยครับ 
  // เพื่อให้ TypeScript รู้จักตอนเราเรียก blog.users.avatar_url
  users?: {
    username: string;
    avatar_url: string | null; // <-- เพิ่มบรรทัดนี้เข้าไปครับ
  };
}

interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string | null
  bio: string | null
  about_me: string | null
  pronouns: string | null
  role: string | null
  created_at: string
}