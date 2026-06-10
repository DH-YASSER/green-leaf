import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';
import { Send, Check, CheckCheck, MessageSquare, PlusCircle } from 'lucide-react';

const FournisseurMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages');
      const data = response.data || [];
      setConversations(data);
      
      // Auto-select first conversation on initial load if none selected
      if (data.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data[0].id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/messages/${selectedConversationId}`);
          setMessages(response.data || []);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load messages');
        }
      };
      fetchMessages();
    }
  }, [selectedConversationId]);

  // Auto scroll to bottom when messages array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    try {
      const response = await axios.post('/api/messages', {
        conversationId: selectedConversationId,
        content: newMessage,
      });
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Refresh conversation list preview
      const convResponse = await axios.get('/api/messages');
      setConversations(convResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const activeContact = conversations.find(c => c.id === selectedConversationId);

  return (
    <DashboardLayout title="Messages" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: false },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: true },
    ]}>
      <div className="flex bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[calc(100vh-160px)] min-h-[500px]">
        
        {/* Left Panel: Conversations List */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-base font-black text-brand-primary uppercase tracking-wider">Inbox / Messages</h2>
            <button
              onClick={() => alert('New conversations are initiated by restaurant buyers. They will appear here when a client contacts you.')}
              className="text-brand-secondary hover:text-brand-primary p-1 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const isActive = selectedConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`flex items-center px-6 py-4.5 cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-brand-highlight/20 border-l-4 border-brand-primary' 
                        : 'hover:bg-slate-50 bg-white'
                    }`}
                  >
                    {/* Avatar with initial letter */}
                    <div className={`h-11 w-11 flex-shrink-0 rounded-2xl flex items-center justify-center font-black text-base shadow-sm ${
                      isActive ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {conv.contact_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>

                    <div className="flex-1 ml-4 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-sm font-bold truncate ${isActive ? 'text-brand-primary' : 'text-slate-800'}`}>
                          {conv.contact_name || 'Unknown Contact'}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium ml-2 shrink-0">
                          {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold truncate">
                        {conv.last_message_preview || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread count badge */}
                    {conv.unread_count > 0 && (
                      <div className="ml-3 flex-shrink-0 flex items-center justify-center min-w-5 h-5 px-1 bg-brand-terracotta text-white text-[10px] font-black rounded-full">
                        {conv.unread_count}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider">No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Chat Thread */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {!selectedConversationId ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-sm font-bold uppercase tracking-wider">Select a conversation to start chatting</p>
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Chat Area Header */}
              <div className="px-6 py-4.5 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-brand-highlight/40 rounded-xl flex items-center justify-center text-brand-primary font-black text-sm">
                    {activeContact?.contact_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">{activeContact?.contact_name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Restaurant Buyer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isSelf = msg.sender === 'user';
                    return (
                      <div key={index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4.5 py-3 rounded-2xl shadow-sm text-sm relative group ${
                          isSelf
                            ? 'bg-brand-secondary text-white rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                        }`}>
                          <p className="leading-relaxed font-semibold">{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-bold ${
                            isSelf ? 'text-brand-highlight/70' : 'text-slate-400'
                          }`}>
                            <span>
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                            {isSelf && (
                              <CheckCheck className="w-3 h-3 text-brand-highlight" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs font-bold uppercase tracking-wider">No messages in this chat thread</p>
                  </div>
                )}
                {/* Scroll Target */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="bg-white border-t border-slate-100 px-6 py-4">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message ici / Type message..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/35 text-sm font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="h-11 w-11 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FournisseurMessages;
