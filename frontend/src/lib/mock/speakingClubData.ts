import type { SpeakingClubPost } from '../types';

export const SPEAKING_CLUB_POSTS: SpeakingClubPost[] = [
  {
    id: 1,
    week_number: 1,
    title: 'Warm-up & Introductions',
    description: 'Bắt đầu hành trình với những chủ đề quen thuộc và làm quen với bạn đồng hành.',
    timeline: [
      {
        time: '19:00',
        activity: 'Chào mừng & Mini-game',
        description: 'Hoạt động phá băng để mọi người thoải mái hơn.',
      },
      {
        time: '19:30',
        activity: 'Thảo luận nhóm nhỏ',
        description: 'Chia sẻ về sở thích và mục tiêu học tập.',
      },
      {
        time: '20:15',
        activity: 'Thực hành Speaking Part 1',
        description: 'Luyện tập trả lời các câu hỏi cá nhân.',
      },
    ],
    resources: [
      { label: 'Tài liệu giới thiệu bản thân', url: '#' },
      { label: 'Cấu trúc câu hỏi Part 1', url: '#' },
    ],
    images: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523240715639-963c9a0e6019?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    ],
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 2,
    week_number: 2,
    title: 'Describing Pictures & Daily Life',
    description: 'Nâng cao khả năng quan sát và diễn đạt ý tưởng qua hình ảnh.',
    timeline: [
      {
        time: '19:00',
        activity: 'Vocabulary Review',
        description: 'Ôn tập từ vựng chủ đề văn phòng.',
      },
      {
        time: '19:20',
        activity: 'Picture Description Workshop',
        description: 'Các bước mô tả tranh hiệu quả.',
      },
      {
        time: '20:00',
        activity: 'Group Practice',
        description: 'Mô tả tranh theo cặp và nhận xét.',
      },
    ],
    resources: [
      { label: 'Bản đồ từ vựng Workplace', url: '#' },
      { label: 'Checklist mô tả tranh', url: '#' },
    ],
    images: [
      'https://images.unsplash.com/photo-1523240715639-963c9a0e6019?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    ],
    created_at: '2024-03-08T00:00:00Z',
  },
];
