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

export interface Testimonial {
  id: number;
  image_url: string;
  title: string;
  subtitle: string;
  delay?: number;
  created_at?: string;
}

export interface Contact {
  id: number;
  platform_id: 'fanpage' | 'tiktok' | 'facebook' | 'youtube';
  name: string;
  label: string;
  description: string;
  link: string;
  delay?: number;
  created_at?: string;
}

export interface AuthState {
  isAdmin: boolean;
  username: string | null;
}

export interface TimelineEvent {
  time: string;
  activity: string;
  description?: string;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export type AdminTab = 'banners' | 'posts' | 'testimonials' | 'contacts' | 'speaking-club';

export interface SpeakingClubPost {
  id: number;
  week_number: number;
  title: string;
  description: string;
  timeline: TimelineEvent[];
  resources: ResourceLink[];
  images: string[];
  created_at: string;
}
