import { useState } from 'react';
import { posts } from '../data/posts';
import type { Post } from '../data/posts';
import Typewriter from '../components/ui/Typewriter';
import PostModal from '../components/ui/PostModal';
import { motion } from 'framer-motion';

export default function Home() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const slogans = [
    "Ms.Smile TOEIC - nơi khơi nguồn cảm hứng chinh phục mọi mục tiêu",
    "Ms.Smile TOEIC - Siêu chất siêu nhộn"
  ];

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-slate-800 drop-shadow-sm">
             Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-light">Ms.Smile TOEIC</span>
          </h1>
          <div className="h-24 md:h-16 flex items-center justify-center">
            <Typewriter 
              texts={slogans} 
              className="text-xl md:text-3xl font-medium text-slate-500"
              speed={40}
              pause={2500}
            />
          </div>
          <p className="mt-8 text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Học TOEIC không còn là nỗi ám ảnh. Trải nghiệm phương pháp học <span className="text-slate-800 font-semibold">mới mẻ</span>, <span className="text-slate-800 font-semibold">thú vị</span> và <span className="text-slate-800 font-semibold">hiệu quả</span> ngay hôm nay.
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
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
