import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from '../../api/axios';

const FournisseurMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/messages');
        setConversations(response.data || []);
        // If there are conversations and none is selected, select the first one
        if (response.data.length > 0 && !selectedConversationId) {
          setSelectedConversationId(response.data[0].id);
          fetchMessages(response.data[0].id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [selectedConversationId]); // We'll refetch conversations when selectedConversationId changes? Actually, we don't need to refetch conversations when selecting a different one, but we do need to fetch messages for the new selection.

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`/api/messages/${selectedConversationId}`);
          setMessages(response.data || []);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load messages');
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [selectedConversationId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/messages', {
        conversationId: selectedConversationId,
        content: newMessage,
      });
      // Append the new message to the messages list
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <DashboardLayout title="Messages" navLinks={[
      { path: '/fournisseur/dashboard', label: 'Dashboard', active: false },
      { path: '/fournisseur/products', label: 'Products', active: false },
      { path: '/fournisseur/promotions', label: 'Promotions', active: false },
      { path: '/fournisseur/orders', label: 'Orders', active: false },
      { path: '/fournisseur/messages', label: 'Messages', active: true },
    ]}>
      <div className="flex h-full">
        {/* Left Panel: Conversations List */}
        <div className="w-64 border-r border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="font-medium text-gray-900">Conversations</h2>
            <button
              onClick={() => {
                // In a real app, this would open a modal to start a new conversation
                alert('Start new conversation feature not implemented');
              }}
              className="text-indigo-600 hover:text-indigo-500"
            >
              New Message
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`flex items-center px-4 py-3 cursor-hover ${selectedConversationId === conv.id
                    ? 'bg-indigo-50'
                    : 'hover:bg-gray-50'}`}
                >
                  {/* Contact avatar placeholder */}
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">{conv.contact_name?.charAt(0)?.toUpperCase() ?? '?'}</span>
                  </div>
                  <div className="flex-1 ml-4 space-y-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{conv.contact_name || 'Unknown Contact'}</h3>
                      <p className="text-xs text-gray-500">{conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{conv.last_message_preview || ''}</p>
                  </div>
                  {/* Unread count badge */}
                  {conv.unread_count > 0 && (
                    <div className="ml-2 flex-shrink-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                      {conv.unread_count}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Chat Thread */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {!selectedConversationId ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-opacity-75 mt-1">
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>

              /* Message Input */
              <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
                <form onSubmit={sendMessage} className="flex-1 space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Send
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