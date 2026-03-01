import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { SpeakingClubPost } from '../../lib/types';
import SpeakingClubHero from './components/SpeakingClubHero';
import WeeklyCard from './components/WeeklyCard';
import UpcomingSessionCard from './components/UpcomingSessionCard';

export default function SpeakingClubPage() {
  const [posts, setPosts] = useState<SpeakingClubPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('speaking_club_posts')
          .select('*')
          .order('week_number', { ascending: false }); // Latest week first

        if (error) throw error;
        setPosts(data as SpeakingClubPost[]);
      } catch (err) {
        console.error('Error fetching speaking club posts:', err);
      } finally {
        setLoading(false);
      }
    }

    void fetchPosts();
  }, []);
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <SpeakingClubHero />

      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center md:text-left mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Hoạt động hàng tuần
            </h2>
            <p className="text-slate-500 max-w-xl">
              Cập nhật những hoạt động mới nhất từ Speaking Club. Đừng bỏ lỡ bất kỳ buổi học nào
              nhé!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:gap-12">
            {loading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <>
                {posts.map((post, index) => (
                  <WeeklyCard key={post.id} post={post} index={index} />
                ))}

                {/* Upcoming Session Placeholder */}
                <UpcomingSessionCard />
              </>
            )}
          </div>

          {!loading && posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">Chưa có hoạt động nào được đăng tải.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to action at bottom */}
      <section className="bg-primary py-20 text-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8 italic">Ready to speak up?</h2>
          <p className="text-primary-light text-lg mb-10 max-w-xl mx-auto">
            Hợp lực cùng Ms.Smile để chinh phục mục tiêu TOEIC của bạn ngay hôm nay. Mọi bài học lớn
            đều bắt đầu từ một lời chào.
          </p>
          <a
            href="#"
            className="inline-flex justify-center items-center px-10 py-4 text-lg font-bold text-primary bg-white rounded-full hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1"
          >
            Đăng ký tham gia ngay
          </a>
        </div>
      </section>
    </div>
  );
}
