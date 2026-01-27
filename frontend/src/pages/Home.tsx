import { useState, useEffect } from 'react';
import Typewriter from '../components/ui/Typewriter';
import PostModal from '../components/ui/PostModal';
import GradientText from '../components/ui/GradientText';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Post } from '../lib/types';

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
        setSlogans(bannerData.map(b => b.text));
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
    fetchData();
  }, []);

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Banner */}
      <section className="bg-slate-50 text-slate-900 py-20 md:py-32 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6 tracking-wide uppercase">
            Start Your Journey
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-slate-800 drop-shadow-sm flex items-center justify-center gap-4 flex-wrap">
             Welcome to 
             <GradientText
                colors={["#0d9488", "#2dd4bf", "#0d9488", "#2dd4bf", "#0d9488"]}
                animationSpeed={3}
                showBorder={false}
              >
                Ms.Smile TOEIC
              </GradientText>
          </h1>
          <div className="h-24 md:h-16 flex items-center justify-center">
            {slogans.length > 0 && (
              <Typewriter 
                fixedText="Ms.Smile TOEIC - "
                texts={slogans} 
                className="text-xl md:text-3xl font-medium text-slate-500"
                speed={40}
                pause={2500}
              />
            )}
          </div>
          <p className="mt-8 text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Học TOEIC không còn là nỗi ám ảnh.<br />Trải nghiệm phương pháp học <span className="text-slate-800 font-semibold">mới mẻ</span>, <span className="text-slate-800 font-semibold">thú vị</span> và <span className="text-slate-800 font-semibold">hiệu quả</span> ngay hôm nay.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-teal-200/50 hover:shadow-teal-300/50 hover:-translate-y-1">
              Khám phá ngay
            </a>
            <a href="#" className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all hover:border-slate-300">
              Xem lộ trình
            </a>
          </div>
        </div>
      </section>

      {/* Post Grid Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Cập nhật mới nhất</h2>
            <p className="text-slate-500 font-medium">Khám phá các khóa học và sự kiện hấp dẫn tại Ms.Smile</p>
          </div>
          <div className="h-1 w-24 bg-accent rounded-full hidden md:block mb-3"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div
              layoutId={`post-${post.id}`}
              key={post.id}
              onClick={() => handleOpenPost(post)}
              className="group relative aspect-square bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer border border-slate-100"
              transition={{ duration: 0 }}
              whileHover={{ y: -8 }}
            >
              <img 
                src={post.image_url} 
                alt="Post" 
                className="w-full h-full object-cover transition-transform"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold text-lg">Xem chi tiết</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Post Modal */}
      <PostModal 
        post={selectedPost} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
