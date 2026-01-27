export interface Banner {
  id: number;
  text: string;
  is_active: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  image_url: string;
  content: string;
  link: string;
  created_at: string;
}

export interface AuthState {
  isAdmin: boolean;
  username: string | null;
}
