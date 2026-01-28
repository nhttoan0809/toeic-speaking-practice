import { motion } from 'framer-motion';
import type { Post } from '../../../lib/types';

interface PostGridProps {
  posts: Post[];
  onOpenPost: (post: Post) => void;
}

export default function PostGrid({ posts, onOpenPost }: PostGridProps) {
  return (
    <section className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Cập nhật mới nhất</h2>
          <p className="text-slate-500 font-medium">
            Khám phá các khóa học và sự kiện hấp dẫn tại Ms.Smile
          </p>
        </div>
        <div className="h-1 w-24 bg-accent rounded-full hidden md:block mb-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <motion.div
            layoutId={`post-${post.id}`}
            key={post.id}
            onClick={() => {
              onOpenPost(post);
            }}
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
  );
}
