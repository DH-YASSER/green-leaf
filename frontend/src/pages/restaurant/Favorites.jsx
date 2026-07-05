import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Grid, Package, Plus, X } from 'lucide-react';
import axios from '../../api/axios';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const Favorites = () => {
  const { lang } = useAppStore();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'boards', 'following'
  
  // Data state
  const [favorites, setFavorites] = useState([]);
  const [boards, setBoards] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  // Fetch data
  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get('/api/restaurant/favorites');
      setFavorites(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchBoards = useCallback(async () => {
    try {
      const res = await axios.get('/api/restaurant/boards');
      setBoards(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await axios.get('/api/restaurant/following');
      setFollowing(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchFavorites(), fetchBoards(), fetchFollowing()]);
    setLoading(false);
  }, [fetchFavorites, fetchBoards, fetchFollowing]);

  useEffect(() => { loadData(); }, [loadData]);

  // Actions
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      await axios.post('/api/restaurant/boards', { name: newBoardName, description: newBoardDesc });
      setShowCreateBoard(false);
      setNewBoardName('');
      setNewBoardDesc('');
      fetchBoards();
    } catch (err) {
      console.error(err);
    }
  };

  const unfollow = async (fournisseurId) => {
    try {
      await axios.post('/api/restaurant/following/toggle', { fournisseur_id: fournisseurId });
      fetchFollowing();
    } catch (err) { console.error(err); }
  };

  const removeFavorite = async (productId) => {
    try {
      await axios.post('/api/restaurant/favorites/toggle', { product_id: productId });
      fetchFavorites();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── TOP NAVIGATION ── */}
      <div style={{ padding: '24px 32px', flexShrink: 0 }}>
        <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
           {lang === 'fr' ? 'Retour aux achats' : 'Back to shopping'}
        </Link>
      </div>

      {/* ── TABS ── */}
      <div style={{ borderBottom: '1px solid #e8e8e8', padding: '0 48px' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <button onClick={() => setActiveTab('saved')} style={{ padding: '16px 0', fontSize: 14, color: activeTab === 'saved' ? '#1a1a1a' : '#555', borderBottom: activeTab === 'saved' ? '2px solid #1a1a1a' : '2px solid transparent', fontWeight: activeTab === 'saved' ? 600 : 400, background: 'none', border: 'none', borderBottom: 'none', cursor: 'pointer' }}>
            {lang === 'fr' ? 'Produits enregistrés' : 'Saved products'}
          </button>
          <button onClick={() => setActiveTab('boards')} style={{ padding: '16px 0', fontSize: 14, color: activeTab === 'boards' ? '#1a1a1a' : '#555', borderBottom: activeTab === 'boards' ? '2px solid #1a1a1a' : '2px solid transparent', fontWeight: activeTab === 'boards' ? 600 : 400, background: 'none', border: 'none', borderBottom: 'none', cursor: 'pointer' }}>
            {lang === 'fr' ? 'Tableaux' : 'Boards'}
          </button>
          <button onClick={() => setActiveTab('following')} style={{ padding: '16px 0', fontSize: 14, color: activeTab === 'following' ? '#1a1a1a' : '#555', borderBottom: activeTab === 'following' ? '2px solid #1a1a1a' : '2px solid transparent', fontWeight: activeTab === 'following' ? 600 : 400, background: 'none', border: 'none', borderBottom: 'none', cursor: 'pointer' }}>
            {lang === 'fr' ? 'Abonnements' : 'Following'}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '48px 24px', flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>Loading...</div>
        ) : (
          <>
            {/* SAVED PRODUCTS TAB */}
            {activeTab === 'saved' && (
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 400, color: '#1a1a1a', marginBottom: 32, letterSpacing: 2, textTransform: 'uppercase' }}>
                  {lang === 'fr' ? 'Produits enregistrés' : 'Saved products'}
                </h1>
                {favorites.length === 0 ? (
                  <div style={{ textAlign: 'center', maxWidth: 400, margin: '80px auto 0' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 16, fontFamily: 'Georgia, serif' }}>
                      {lang === 'fr' ? 'Vous n\'avez encore rien enregistré' : 'You haven\'t saved anything yet'}
                    </h2>
                    <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>
                      {lang === 'fr' ? 'Parcourez les produits et ajoutez-les à vos favoris.' : 'Browse products and add them to your favorites.'}
                    </p>
                    <Link to="/browse" style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid #e8e8e8', borderRadius: 4, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
                      {lang === 'fr' ? 'Parcourir' : 'Start shopping'}
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
                    {favorites.map(fav => (
                      <div key={fav.id} style={{ position: 'relative' }}>
                        <Link to={`/product/${fav.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div style={{ aspectRatio: '1/1', backgroundColor: '#f5f5f5', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                            {fav.image ? (
                              <img src={fav.image} alt={fav.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}><Package size={40} /></div>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{fav.fournisseur_name}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{fav.name}</div>
                          <div style={{ fontSize: 13, color: '#1a1a1a' }}>{Number(fav.price).toFixed(2)} MAD / {fav.unit}</div>
                        </Link>
                        <button onClick={(e) => { e.preventDefault(); removeFavorite(fav.product_id); }} style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <X size={14} color="#1a1a1a" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BOARDS TAB */}
            {activeTab === 'boards' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 400, color: '#1a1a1a', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>
                    {lang === 'fr' ? 'Tableaux' : 'Boards'}
                  </h1>
                  <button onClick={() => setShowCreateBoard(true)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={16} />
                    {lang === 'fr' ? 'Créer un tableau' : 'Create Board'}
                  </button>
                </div>
                {boards.length === 0 ? (
                  <div style={{ textAlign: 'center', maxWidth: 400, margin: '80px auto 0' }}>
                    <Grid size={48} strokeWidth={1} color="#ccc" style={{ marginBottom: 16 }} />
                    <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 16, fontFamily: 'Georgia, serif' }}>
                      {lang === 'fr' ? 'Organisez vos produits' : 'Organize your products'}
                    </h2>
                    <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>
                      {lang === 'fr' ? 'Créez des tableaux pour regrouper vos articles préférés.' : 'Create boards to group your favorite items together.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
                    {boards.map(board => (
                      <div key={board.id} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 20, cursor: 'pointer', transition: 'all 0.2s', ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                        <div style={{ aspectRatio: '16/9', backgroundColor: '#f5f5f5', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
                           {board.thumbnail ? (
                             <img src={board.thumbnail} alt={board.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : (
                             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}><Grid size={32} /></div>
                           )}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px 0' }}>{board.name}</h3>
                        <div style={{ fontSize: 13, color: '#777' }}>{board.product_count} {lang === 'fr' ? 'produits' : 'products'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FOLLOWING TAB */}
            {activeTab === 'following' && (
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 400, color: '#1a1a1a', marginBottom: 32, letterSpacing: 2, textTransform: 'uppercase' }}>
                  {lang === 'fr' ? 'Abonnements' : 'Following'}
                </h1>
                {following.length === 0 ? (
                  <div style={{ textAlign: 'center', maxWidth: 400, margin: '80px auto 0' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 400, color: '#1a1a1a', marginBottom: 16, fontFamily: 'Georgia, serif' }}>
                      {lang === 'fr' ? 'Vous ne suivez aucun fournisseur' : 'You aren\'t following any suppliers'}
                    </h2>
                    <p style={{ fontSize: 16, color: '#555', marginBottom: 32 }}>
                      {lang === 'fr' ? 'Suivez des marques pour voir leurs nouveautés.' : 'Follow brands to see their new arrivals.'}
                    </p>
                    <Link to="/browse" style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid #e8e8e8', borderRadius: 4, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
                      {lang === 'fr' ? 'Explorer les marques' : 'Explore Brands'}
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {following.map(f => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid #e8e8e8', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600, color: '#555' }}>
                            {f.company_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{f.company_name}</div>
                            {f.city && <div style={{ fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {f.city}</div>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <Link to={`/supplier/${f.fournisseur_id}`} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid #e8e8e8', color: '#1a1a1a', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                            {lang === 'fr' ? 'Voir la boutique' : 'View Shop'}
                          </Link>
                          <button onClick={() => unfollow(f.fournisseur_id)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid #e8e8e8', background: '#f9f9f9', color: '#1a1a1a', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                            {lang === 'fr' ? 'Se désabonner' : 'Unfollow'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* CREATE BOARD MODAL */}
      {showCreateBoard && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 32, width: '100%', maxWidth: 400 }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 24, fontWeight: 400, fontFamily: 'Georgia, serif' }}>{lang === 'fr' ? 'Créer un tableau' : 'Create a Board'}</h2>
            <form onSubmit={handleCreateBoard}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>{lang === 'fr' ? 'Nom du tableau' : 'Board Name'}</label>
                <input type="text" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} required placeholder="e.g. Summer Menu Ideas"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d4', borderRadius: 4, fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>{lang === 'fr' ? 'Description (optionnel)' : 'Description (optional)'}</label>
                <textarea value={newBoardDesc} onChange={e => setNewBoardDesc(e.target.value)} rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d4', borderRadius: 4, fontSize: 14, outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setShowCreateBoard(false)} style={{ padding: '10px 20px', background: 'none', border: '1px solid #e8e8e8', borderRadius: 4, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button type="submit" style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                  {lang === 'fr' ? 'Créer' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
