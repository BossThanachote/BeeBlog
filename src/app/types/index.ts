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
  
  view_count?: number; 
  created_at: string;
  updated_at?: string;

  likes?: number;
  comments?: number;

  // 🌟 เพิ่มแค่ก้อนนี้ก้อนเดียวครับ เพื่อรองรับการ Join ตาราง users (ของเก่าอยู่ครบ 100%)
  users?: {
    username: string;
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