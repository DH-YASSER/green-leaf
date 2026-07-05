import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Settings, MessageCircle, Send } from 'lucide-react';
import axios from '../../api/axios';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const Messages = () => {
  const { lang } = useAppStore();
  const { user } = useAuthStore();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');
  const [showUnread, setShowUnread] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get('/api/restaurant/conversations');
      setConversations(res.data || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setLoadingMsgs(true);
    try {
      const res = await axios.get(`/api/restaurant/messages/${conv.id}`);
      setMessages(res.data || []);
      // Mark as read locally
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv || sending) return;

    setSending(true);
    try {
      const res = await axios.post('/api/restaurant/messages', {
        receiver_id: activeConv.id,
        body: newMsg.trim(),
      });
      setMessages(prev => [...prev, res.data]);
      setNewMsg('');
      // Update last message in sidebar
      setConversations(prev => prev.map(c =>
        c.id === activeConv.id ? { ...c, last_message: newMsg.trim(), last_message_time: new Date().toISOString() } : c
      ));
    } catch (err) {
      console.error('Failed to send:', err);
    } finally {
      setSending(false);
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  const filteredConvs = conversations.filter(c => {
    if (showUnread && !c.unread_count) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatTime = (t) => {
    if (!t) return '';
    const d = new Date(t);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  return (
    <div style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      {/* ── TOP NAVIGATION ── */}
      <div style={{ padding: '24px 32px', flexShrink: 0 }}>
        <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>
           {lang === 'fr' ? 'Retour aux achats' : 'Back to shopping'}
        </Link>
      </div>

      {/* ── MESSAGES CONTENT (2 PANE) ── */}
      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width: 280, borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: '#1a1a1a', margin: 0, letterSpacing: 3, textTransform: 'uppercase' }}>
              {lang === 'fr' ? 'Messages' : 'Messages'}
            </h2>
            <Settings size={18} color="#555" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ padding: '0 20px 12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#999" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder={lang === 'fr' ? 'Rechercher' : 'Search messages'}
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 20, border: '1px solid #e8e8e8', fontSize: 13, outline: 'none' }} />
            </div>
          </div>

          <div style={{ padding: '0 20px 16px' }}>
            <button onClick={() => setShowUnread(!showUnread)}
              style={{ padding: '4px 14px', borderRadius: 16, border: '1px solid #e8e8e8', background: showUnread ? '#1a1a1a' : '#fff', color: showUnread ? '#fff' : '#1a1a1a', fontSize: 12, cursor: 'pointer' }}>
              {lang === 'fr' ? `Non lus (${totalUnread})` : `Unread (${totalUnread})`}
            </button>
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConvs ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#999', fontSize: 13 }}>Loading...</div>
            ) : filteredConvs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999', fontSize: 14 }}>
                {lang === 'fr' ? 'Vous n\'avez aucun message.' : 'You have no messages.'}
              </div>
            ) : (
              filteredConvs.map(conv => (
                <div key={conv.id} onClick={() => openConversation(conv)}
                  style={{ padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                    background: activeConv?.id === conv.id ? '#f9f9f9' : 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: conv.unread_count ? 700 : 500, color: '#1a1a1a' }}>{conv.name}</span>
                    <span style={{ fontSize: 11, color: '#999' }}>{formatTime(conv.last_message_time)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.last_message || (lang === 'fr' ? 'Pas de messages' : 'No messages')}
                  </div>
                  {conv.unread_count > 0 && (
                    <span style={{ display: 'inline-block', marginTop: 4, background: '#2D9B4F', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #e8e8e8', fontSize: 13 }}>
            <strong>{lang === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}</strong>{' '}
            <Link to="/help" style={{ color: '#2D9B4F', textDecoration: 'underline' }}>
              {lang === 'fr' ? 'Support GreenLeaf' : 'Get GreenLeaf support'}
            </Link>
          </div>
        </div>

        {/* RIGHT CHAT PANE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              <MessageCircle size={40} strokeWidth={1} style={{ marginBottom: 16 }} />
              <span style={{ fontSize: 16 }}>{lang === 'fr' ? 'Sélectionnez une conversation' : 'Select a conversation'}</span>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#555' }}>
                  {activeConv.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{activeConv.name}</div>
                  <div style={{ fontSize: 12, color: '#999', textTransform: 'capitalize' }}>{activeConv.role}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                {loadingMsgs ? (
                  <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>Loading...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#999', padding: 40, fontSize: 14 }}>
                    {lang === 'fr' ? 'Pas encore de messages. Commencez la conversation !' : 'No messages yet. Start the conversation!'}
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                        <div style={{
                          maxWidth: '70%', padding: '10px 16px', borderRadius: 16,
                          background: isMine ? '#1a1a1a' : '#f5f5f5',
                          color: isMine ? '#fff' : '#1a1a1a',
                          fontSize: 14, lineHeight: 1.5,
                          borderBottomRightRadius: isMine ? 4 : 16,
                          borderBottomLeftRadius: isMine ? 16 : 4,
                        }}>
                          {msg.body}
                          <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' }}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} style={{ padding: '16px 24px', borderTop: '1px solid #e8e8e8', display: 'flex', gap: 12 }}>
                <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  placeholder={lang === 'fr' ? 'Écrire un message...' : 'Type a message...'}
                  style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1px solid #e8e8e8', fontSize: 14, outline: 'none' }} />
                <button type="submit" disabled={sending || !newMsg.trim()}
                  style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: newMsg.trim() ? '#1a1a1a' : '#e8e8e8', color: '#fff', cursor: newMsg.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
