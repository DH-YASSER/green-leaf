import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Leaf, Bell, MessageSquare, Menu, User } from 'lucide-react';

const DashboardLayout = ({ children, title, navLinks }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const messagesPath = user?.role === 'fournisseur' ? '/fournisseur/messages' : '/restaurant/messages';

  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const revealElements = document.querySelectorAll('.reveal-item');
    
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [children]);

  return (
    <div className="min-h-screen text-brand-text relative overflow-hidden font-body selection:bg-brand-accent/50">
      {/* Heavy Luxury Background Elements */}
      <div className="hex-pens-background"></div>
      <div className="hex-overlay"></div>

      <div className="flex h-screen relative z-10">
        {/* Floating Glass Sidebar */}
        <aside className="w-20 lg:w-72 flex flex-col justify-between shrink-0 glass-panel border-l-0 border-t-0 border-b-0 m-4 rounded-r-3xl overflow-hidden transition-all duration-500">
          <div>
            <div className="p-6 lg:p-8 flex items-center justify-center lg:justify-start border-b border-white/[0.05]">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="h-12 w-12 bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors rounded-none">
                  <Leaf className="h-6 w-6 text-brand-accent group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="hidden lg:block font-heading text-xl font-black tracking-[0.2em] text-white uppercase mt-1">
                  Mark<span className="text-brand-accent">Eat</span>
                </span>
              </Link>
            </div>

            <nav className="mt-8 px-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-center lg:justify-start px-4 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                    link.active
                      ? 'bg-brand-accent text-[#000] shadow-[0_0_20px_rgba(247,148,32,0.3)]'
                      : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.icon && <span className="lg:mr-4">{link.icon}</span>}
                  <span className="hidden lg:block">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section */}
          <div className="p-4 lg:p-6 border-t border-white/[0.05]">
            <div className="flex flex-col lg:flex-row items-center gap-4 p-4 bg-black/40 border border-white/[0.05] mb-4">
              <div className="h-10 w-10 bg-white/10 flex items-center justify-center text-brand-accent font-heading font-black text-lg uppercase shrink-0">
                {user?.name?.charAt(0) ?? '?'}
              </div>
              <div className="hidden lg:block overflow-hidden">
                <p className="font-heading text-xs font-bold text-white uppercase tracking-widest truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[9px] text-brand-accent font-semibold uppercase tracking-[0.3em] mt-1">
                  {user?.role || ''}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn-sharp-outline w-full py-4 text-[10px] hidden lg:flex"
            >
              Logout
            </button>
            <button
              onClick={logout}
              className="lg:hidden w-full py-4 text-white/50 hover:text-white flex justify-center"
            >
              <User className="h-6 w-6" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
          {/* Transparent Header */}
          <header className="px-8 lg:px-16 py-8 flex items-center justify-between sticky top-0 z-50 glass-panel border-t-0 border-r-0 border-l-0 m-4 mt-4 ml-0 rounded-b-3xl">
            <h1 className="text-massive text-2xl lg:text-4xl heading-outline">
              {title}
            </h1>

            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(messagesPath)}
                className="relative p-3 bg-white/[0.03] border border-white/10 hover:border-brand-accent/50 text-white hover:text-brand-accent transition-all duration-500"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-brand-accent text-black text-[9px] font-black w-5 h-5 flex items-center justify-center border border-black">
                  3
                </span>
              </button>

              <button
                onClick={() => navigate(messagesPath)}
                className="relative p-3 bg-white/[0.03] border border-white/10 hover:border-brand-accent/50 text-white hover:text-brand-accent transition-all duration-500"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-8 lg:px-16 pb-16 pt-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
