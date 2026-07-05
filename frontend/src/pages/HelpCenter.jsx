import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';

const HelpCenter = () => {
  const { lang } = useAppStore();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('retailers');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      <style>{`
        .help-mobile-btn { display: none; }
        .help-desktop-content { display: block; }
        @media (max-width: 768px) {
          .help-mobile-btn { display: block; }
          .help-desktop-content { display: none !important; }
        }
      `}</style>

      {/* ── TOP NAVIGATION ── */}
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button 
          className="help-mobile-btn" 
          onClick={() => setMobileMenuOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1a1a1a' }}
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="faire-logo" style={{ fontSize: 20, margin: 0, textDecoration: 'none' }}>Green<span>Leaf</span></Link>
        <div className="help-desktop-content" style={{ width: 1, height: 24, backgroundColor: '#e8e8e8' }}></div>
        <span className="help-desktop-content" style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
          {lang === 'fr' 
            ? (activeTab === 'retailers' ? 'Centre d\'aide pour les détaillants' : 'Centre d\'aide pour les marques') 
            : (activeTab === 'retailers' ? 'Help Center for Retailers' : 'Help Center for Brands')}
        </span>
        
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
             <span className="help-desktop-content">{lang === 'fr' ? 'Retour aux achats' : 'Back to shopping'}</span>
          </Link>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <header style={{ backgroundColor: '#f9e8d4', padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <button 
              onClick={() => setActiveTab('retailers')}
              style={{ padding: '8px 24px', borderRadius: 20, backgroundColor: activeTab === 'retailers' ? '#1a1a1a' : '#fff', color: activeTab === 'retailers' ? '#fff' : '#1a1a1a', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Retailers
            </button>
            <button 
              onClick={() => setActiveTab('brands')}
              style={{ padding: '8px 24px', borderRadius: 20, backgroundColor: activeTab === 'brands' ? '#1a1a1a' : '#fff', color: activeTab === 'brands' ? '#fff' : '#1a1a1a', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Brands
            </button>
          </div>
          
          <h1 style={{ fontSize: 36, fontWeight: 400, color: '#1a1a1a', marginBottom: 24, fontFamily: 'Georgia, serif' }}>
            Hi {user?.name?.split(' ')[0] || 'YASSIR'}, how can we help?
          </h1>
          
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={18} color="#999" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search help articles" 
              style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 24, border: 'none', fontSize: 16, outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} 
            />
          </div>
          <p style={{ fontSize: 12, color: '#555' }}>
            Looking for help on an order? Go to your <Link to="/restaurant/dashboard" style={{ textDecoration: 'underline', color: '#1a1a1a' }}>Orders</Link> page.
          </p>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: 800, margin: '0 auto', width: '100%', padding: '48px 24px', flex: 1 }}>
        
        {activeTab === 'retailers' ? (
          <>
            {/* Quick Actions & Featured Guides - RETAILERS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: 48, marginBottom: 64 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 24, fontFamily: 'Georgia, serif' }}>Featured guides</h2>
                
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>Orders & shipping</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '8px 0' }}>How do I submit a return?</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>On GreenLeaf, we offer free returns on the first order you place with any brand so you can feel confident trying out new products for your store...</p>
                </div>
                
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>Orders & shipping</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '8px 0' }}>When will I get my orders?</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>For expected delivery dates for your orders, head over to your Orders page and view fulfillment and shipping timelines...</p>
                </div>
                
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>Orders & shipping</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '8px 0' }}>How can I cancel an order?</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>You can cancel an order within 24 hours of placing it, as long as the brand hasn't processed it...</p>
                </div>
              </div>
              
              <div>
                <div style={{ backgroundColor: '#f9f9f9', padding: 24, borderRadius: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 400, color: '#1a1a1a', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>Quick actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'underline', fontWeight: 500 }}>Report damaged/missing items</a>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'underline', fontWeight: 500 }}>Contact a brand</a>
                  </div>
                  <button style={{ width: '100%', marginTop: 24, padding: '12px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>
                    Get support
                  </button>
                </div>
              </div>
            </div>

            {/* Browse All Topics - RETAILERS */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 32, fontFamily: 'Georgia, serif' }}>Browse all topics</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>FAQ</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>What is GreenLeaf and how does it work?</a>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>How do I change my password?</a>
                    <a href="#" style={{ color: '#555', fontSize: 14, textDecoration: 'underline', marginTop: 4 }}>View all (12)</a>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Orders & shipping</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>How do I report a missing or damaged item?</a>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>How do I track my order?</a>
                    <a href="#" style={{ color: '#555', fontSize: 14, textDecoration: 'underline', marginTop: 4 }}>View all (25)</a>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Quick Actions & Featured Guides - BRANDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: 48, marginBottom: 64 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 24, fontFamily: 'Georgia, serif' }}>Featured guides for Brands</h2>
                
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>Fulfilling Orders</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '8px 0' }}>How do I process an order?</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>Learn the step-by-step process of accepting, packing, and shipping an order to ensure a smooth experience for your retailers...</p>
                </div>
                
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>Payments</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '8px 0' }}>How and when do I get paid?</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>GreenLeaf handles all payment processing. Find out our payout schedules and how to update your banking information...</p>
                </div>
                
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>Catalog Management</span>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '8px 0' }}>How do I add new products?</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>Keep your storefront fresh by adding new items. We'll show you how to upload images, set minimum quantities, and manage pricing...</p>
                </div>
              </div>
              
              <div>
                <div style={{ backgroundColor: '#f9f9f9', padding: 24, borderRadius: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 400, color: '#1a1a1a', margin: '0 0 16px 0', fontFamily: 'Georgia, serif' }}>Quick actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'underline', fontWeight: 500 }}>Update inventory</a>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'underline', fontWeight: 500 }}>Contact a retailer</a>
                  </div>
                  <button style={{ width: '100%', marginTop: 24, padding: '12px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>
                    Get support
                  </button>
                </div>
              </div>
            </div>

            {/* Browse All Topics - BRANDS */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 32, fontFamily: 'Georgia, serif' }}>Browse all topics</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Getting Started as a Brand</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>Setting up your profile</a>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>Understanding commission rates</a>
                    <a href="#" style={{ color: '#555', fontSize: 14, textDecoration: 'underline', marginTop: 4 }}>View all (8)</a>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Order Fulfillment</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>Handling delayed shipments</a>
                    <a href="#" style={{ color: '#1a1a1a', fontSize: 14, textDecoration: 'none' }}>Printing packing slips</a>
                    <a href="#" style={{ color: '#555', fontSize: 14, textDecoration: 'underline', marginTop: 4 }}>View all (14)</a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
      
      {/* ── GET SUPPORT FOOTER ── */}
      <div style={{ backgroundColor: '#f9e8d4', padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 16, fontFamily: 'Georgia, serif' }}>Get support</h2>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>Can't find what you're looking for? Our team is here to help.</p>
        <button style={{ padding: '12px 24px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>
          Contact support
        </button>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 9999, overflowY: 'auto' }}>
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e8e8e8' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="faire-logo" style={{ fontSize: 20, margin: 0, textDecoration: 'none' }}>Green<span>Leaf</span></Link>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1a1a1a' }}>
              <X size={24} />
            </button>
          </div>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 24 }}>Topics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>FAQ</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Getting started</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Managing account</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Managing products</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Optimizing shop</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Fulfilling & shipping</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Payouts & taxes</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Faire Direct</Link>
              <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none' }}>Terms & policies</Link>
            </div>
            
            <div style={{ height: 1, backgroundColor: '#e8e8e8', margin: '32px 0' }}></div>
            <Link to="#" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, color: '#1a1a1a', textDecoration: 'none', display: 'block' }}>Get support</Link>
            <div style={{ height: 1, backgroundColor: '#e8e8e8', margin: '32px 0' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1a1a1a', cursor: 'pointer' }}>
              <Globe size={18} strokeWidth={1.5} />
              <span style={{ fontSize: 16 }}>English (UK)</span>
              <ChevronDown size={18} style={{ marginLeft: 'auto' }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HelpCenter;
