import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Leaf, Bell, MessageSquare } from 'lucide-react';

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
    <div className="min-h-screen bg-brand-bg text-brand-text flex relative">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none"></div>

      {/* Left Sidebar */}
      <aside className="w-64 bg-brand-surface border-r border-brand-border flex flex-col justify-between shrink-0 relative z-10">
        <div>
          <div className="p-6 pb-8 border-b border-brand-border">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors">
                <Leaf className="h-4.5 w-4.5 text-brand-accent" />
              </div>
              <span className="font-heading text-sm font-bold tracking-tight text-white uppercase">
                Green<span className="text-brand-accent">Leaf</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 px-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                  link.active
                    ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'
                    : 'bg-transparent border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
                }`}
              >
                {link.icon && <span className="mr-3">{link.icon}</span>}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer info & logout */}
        <div className="p-4 border-t border-brand-border">
          {/* User info details */}
          <div className="flex items-center gap-3 px-3 py-4 mb-3 bg-white/[0.02] border border-white/[0.05]">
            <div className="h-9 w-9 bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-heading font-black text-sm uppercase">
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div className="overflow-hidden">
              <p className="font-heading text-xs font-bold text-white uppercase tracking-wide truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-white/35 font-semibold uppercase tracking-widest mt-0.5">
                {user?.role || ''}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="btn-sharp-outline w-full py-3 text-[11px] hover:border-brand-accent hover:text-brand-accent"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Bar Header */}
        <header className="bg-brand-surface border-b border-brand-border px-8 py-5 flex items-center justify-between glass-nav-dark">
          <h1 className="font-heading heading-outline text-md font-bold uppercase tracking-[0.15em] text-white">
            {title}
          </h1>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => navigate(messagesPath)}
                className="p-2.5 bg-white/[0.02] border border-white/10 hover:border-brand-accent/30 text-white/50 hover:text-white transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-brand-bg text-[8px] font-black w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* In-app Messages */}
            <div className="relative">
              <button
                onClick={() => navigate(messagesPath)}
                className="p-2.5 bg-white/[0.02] border border-white/10 hover:border-brand-accent/30 text-white/50 hover:text-white transition-all cursor-pointer"
                title="Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-brand-bg text-[8px] font-black w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard inner content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
