import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Loading from '../components/Loading';
import messageService from '../services/messageService';
import { toast } from 'react-toastify';
import { formatTime } from '../utils/helpers';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      toast.error('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
      await messageService.markAsRead(conversationId);
    } catch (error) {
      toast.error('Erro ao carregar mensagens');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messageService.sendMessage({
        conversationId: selectedConversation._id,
        content: newMessage,
      });
      setNewMessage('');
      loadMessages(selectedConversation._id);
      toast.success('Mensagem enviada');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mensagens
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de conversas */}
        <Card className="md:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Conversas
          </h2>
          <div className="space-y-2">
            {conversations.map(conv => (
              <div
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedConversation?._id === conv._id
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={conv.otherUser?.avatar} name={conv.otherUser?.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {conv.otherUser?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conv.lastMessage?.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Área de mensagens */}
        <Card className="md:col-span-2 h-[600px] flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header da conversa */}
              <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-700">
                <Avatar
                  src={selectedConversation.otherUser?.avatar}
                  name={selectedConversation.otherUser?.name}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedConversation.otherUser?.name}
                </h3>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[70%] px-4 py-2 rounded-lg
                        ${msg.sender._id === user._id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }
                      `}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensagem */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t dark:border-gray-700">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit">Enviar</Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Selecione uma conversa para começar
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
