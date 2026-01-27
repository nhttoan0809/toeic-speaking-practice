import type { LucideIcon } from "lucide-react";

export type TabId = 'eval' | 'roadmap' | 'resources' | 'practice' | 'test';

export interface Section {
  id: string;
  title: string;
  module?: 'speaking' | 'writing';
  type: 'overview' | 'content';
  icon?: LucideIcon;
}
