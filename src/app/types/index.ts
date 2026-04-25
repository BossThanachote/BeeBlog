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
  avatar_url?: string | null; 
  view_count?: number; 
  created_at: string;
  updated_at?: string;
  likes?: number;
  comments?: number;
  users?: {
    username: string;
    avatar_url: string | null; 
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