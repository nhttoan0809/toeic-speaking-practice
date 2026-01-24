import { Outlet } from 'react-router-dom';
import Header from '../layout/Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white text-slate-500 py-8 text-center text-sm border-t border-slate-100">
        &copy; {new Date().getFullYear()} Ms.Smile TOEIC. All rights reserved. | <span className="text-primary font-medium">Be Confident. Be You.</span>
      </footer>
    </div>
  );
}
