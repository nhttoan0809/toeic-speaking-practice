import { Layout, Info, Compass, GraduationCap, FileText, PlayCircle, PenTool } from 'lucide-react';
import type { Section } from './types';

export const SECTIONS: Section[] = [
  { id: 'overview', title: 'Tổng quan bài thi S&W', type: 'overview', icon: Layout },
  { id: 'speaking-overview', title: 'Tổng quan Speaking', module: 'speaking', type: 'overview', icon: Info },
  { id: 'speaking-1', title: '1. Read a text aloud', module: 'speaking', type: 'content' },
  { id: 'speaking-2', title: '2. Describe a picture', module: 'speaking', type: 'content' },
  { id: 'speaking-3', title: '3. Respond to questions', module: 'speaking', type: 'content' },
  { id: 'speaking-4', title: '4. Respond to questions using information provided', module: 'speaking', type: 'content' },
  { id: 'speaking-5', title: '5. Express an opinion', module: 'speaking', type: 'content' },
  { id: 'writing-overview', title: 'Tổng quan Writing', module: 'writing', type: 'overview', icon: Info },
  { id: 'writing-1', title: '1. Write a sentence based on a picture', module: 'writing', type: 'content' },
  { id: 'writing-2', title: '2. Respond to a written request', module: 'writing', type: 'content' },
  { id: 'writing-3', title: '3. Write an opinion essay', module: 'writing', type: 'content' },
];

export const TABS = [
  { id: 'eval', label: 'Hình thức đánh giá', icon: Compass },
  { id: 'roadmap', label: 'Lộ trình luyện tập', icon: GraduationCap },
  { id: 'resources', label: 'Tài liệu', icon: FileText },
  { id: 'practice', label: 'Luyện tập', icon: PlayCircle },
  { id: 'test', label: 'Kiểm tra', icon: PenTool },
] as const;
