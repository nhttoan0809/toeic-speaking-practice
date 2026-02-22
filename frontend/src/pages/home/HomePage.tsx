import { useState, useEffect } from 'react';
import PostModal from '../../components/ui/PostModal';
import { supabase } from '../../lib/supabase';
import type { Post } from '../../lib/types';
import HeroBanner from './components/HeroBanner';
import PostGrid from './components/PostGrid';
import TestimonialSection from './components/TestimonialSection';
// import ContactSection from './components/ContactSection';

export default function Home() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [slogans, setSlogans] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch Banners (Slogans)
      const { data: bannerData } = await supabase
        .from('banners')
        .select('text')
        .eq('is_active', true);

      if (bannerData) {
        setSlogans(bannerData.map((b: { text: string }) => b.text));
      }

      // Fetch Posts
      const { data: postData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postData) {
        setPosts(postData);
      }

      setLoading(false);
    }
    void fetchData();
  }, []);

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-12 pb-20">
      <HeroBanner slogans={slogans} />

      <PostGrid posts={posts} onOpenPost={handleOpenPost} />

      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />

      <TestimonialSection />
      {/* <ContactSection /> */}
    </div>
  );
}
