import Typewriter from '../../../components/ui/Typewriter';
import GradientText from '../../../components/ui/GradientText';

interface HeroBannerProps {
  slogans: string[];
}

export default function HeroBanner({ slogans }: HeroBannerProps) {
  return (
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
            colors={['#0d9488', '#2dd4bf', '#0d9488', '#2dd4bf', '#0d9488']}
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
          Học TOEIC không còn là nỗi ám ảnh.
          <br />
          Trải nghiệm phương pháp học <span className="text-slate-800 font-semibold">
            mới mẻ
          </span>, <span className="text-slate-800 font-semibold">thú vị</span> và{' '}
          <span className="text-slate-800 font-semibold">hiệu quả</span> ngay hôm nay.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-teal-200/50 hover:shadow-teal-300/50 hover:-translate-y-1"
          >
            Khám phá ngay
          </a>
          <a
            href="#"
            className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all hover:border-slate-300"
          >
            Xem lộ trình
          </a>
        </div>
      </div>
    </section>
  );
}
