import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './ChatPage.css';
import { chatService } from './services/chatService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface Thread {
  threadId: string;
  timestamp: string;
  messageCount: number;
  title?: string;
}

// Generate a unique thread ID (UUID format)
function generateThreadId(): string {
  return crypto.randomUUID();
}

export default function ChatPage() {
  const { threadId: paramThreadId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  const [threadId, setThreadId] = useState<string>(paramThreadId || '');

  // Sync URL with state
  useEffect(() => {
    if (!paramThreadId) {
      const newId = generateThreadId();
      navigate(`/chat/${newId}`, { replace: true });
      return;
    }
    
    if (paramThreadId !== threadId) {
      setThreadId(paramThreadId);
    }
  }, [paramThreadId, navigate, threadId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load threads on mount
  useEffect(() => {
    loadThreads();
  }, []);

  // Load messages when threadId changes
  useEffect(() => {
    if (threadId) {
      loadCurrentThreadMessages();
    }
  }, [threadId]);

  const loadCurrentThreadMessages = async () => {
    try {
      const result = await chatService.getThreadMessages(threadId);
      // API returns Message[] directly
      if (Array.isArray(result)) {
        setMessages(result);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading current thread messages:', error);
      setMessages([]);
    }
  };

  const loadThreads = async () => {
    try {
      const result = await chatService.getThreads();
      // API returns Thread[] directly
      setThreads(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const switchThread = async (newThreadId: string) => {
    if (newThreadId === threadId) return;
    navigate(`/chat/${newThreadId}`);
    setShowSidebar(false);
  };

  const deleteThread = async (threadIdToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent switching to thread when deleting
    
    if (!confirm('Delete this conversation?')) return;
    
    try {
      await chatService.deleteThread(threadIdToDelete);
      
      // Reload thread list
      loadThreads();
      
      // If deleted current thread, create new one
      if (threadIdToDelete === threadId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Failed to delete conversation');
    }
  };

  const startEditingTitle = (thread: Thread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(thread.threadId);
    setEditingTitle(thread.title || '');
  };

  const saveThreadTitle = async (threadIdToUpdate: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await chatService.updateThreadTitle(threadIdToUpdate, editingTitle);
      
      setEditingThreadId(null);
      setEditingTitle('');
      loadThreads();
    } catch (error) {
      console.error('Error updating thread title:', error);
      alert('Failed to update title');
    }
  };

  const cancelEditing = () => {
    setEditingThreadId(null);
    setEditingTitle('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setToolStatus('Connecting...');

    try {
      const response = await chatService.sendChatMessage(userMessage, threadId);

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      setToolStatus('Connected');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';
      let buffer = '';

      // Don't add empty bot message yet - wait for first content

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Split by newlines to process complete messages
          const lines = buffer.split('\n');
          
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              
              if (data === '[DONE]') {
                continue;
              }

              if (data === '') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'content') {
                  botMessage += parsed.content;
                  setToolStatus('Responding...');
                  // Add bot message on first content, then update it
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg?.role === 'bot') {
                      updated[updated.length - 1] = { role: 'bot', text: botMessage };
                    } else {
                      updated.push({ role: 'bot', text: botMessage });
                    }
                    return updated;
                  });
                } else if (parsed.type === 'tool_start') {
                  // Show what tool is being used
                  const toolName = parsed.tool?.includes('todo_manager') ? 'todo list' : 'tool';
                  setToolStatus(`Analyzing your ${toolName}...`);
                } else if (parsed.type === 'tool_end') {
                  setToolStatus('Processing results...');
                } else if (parsed.type === 'step') {
                  if (parsed.step === 'model_request') {
                    setToolStatus('Thinking...');
                  }
                } else if (parsed.type === 'error') {
                  botMessage = `Error: ${parsed.error}`;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'bot', text: botMessage };
                    return updated;
                  });
                }
              } catch (e) {
                console.log('Parse error for line:', line, e);
              }
            }
          }
        }
      }

      // Reload messages from database to ensure consistency
      await loadCurrentThreadMessages();
      
      // Clear status when done
      setToolStatus(null);
    } catch (error) {
      console.error('Error:', error);
      setToolStatus(null);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      setToolStatus(null);
    }
  };

  const handleNewChat = () => {
    if (isLoading) return;
    navigate(`/chat/${generateThreadId()}`);
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title="View chat history"
          >
            ☰
          </button>
          <h1>Chat</h1>
        </div>
        <button 
          className="new-chat-btn" 
          onClick={handleNewChat}
          disabled={isLoading}
          title="Start a new conversation"
        >
          ✚ New Chat
        </button>
      </header>

      {showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
      )}
      
      <div className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="sidebar-close" onClick={() => setShowSidebar(false)}>✕</button>
        </div>
        <div className="thread-list">
          {threads.length === 0 ? (
            <div className="no-threads">No conversations yet</div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.threadId}
                className={`thread-item ${thread.threadId === threadId ? 'active' : ''}`}
                onClick={() => switchThread(thread.threadId)}
              >
                <div className="thread-header">
                  {editingThreadId === thread.threadId ? (
                    <form 
                      className="thread-title-edit-form"
                      onSubmit={(e) => saveThreadTitle(thread.threadId, e)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        className="thread-title-input"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Enter title..."
                        autoFocus
                        maxLength={50}
                      />
                      <button 
                        type="submit"
                        className="save-title-btn"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button 
                        type="button"
                        className="cancel-title-btn"
                        onClick={(e) => { e.stopPropagation(); cancelEditing(); }}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="thread-title">
                        {thread.title || (thread.messageCount === 0 ? 'New conversation' : 'Conversation')}
                      </div>
                      <div className="thread-actions">
                        <button 
                          className="edit-thread-btn"
                          onClick={(e) => startEditingTitle(thread, e)}
                          title="Rename conversation"
                        >
                          ✎
                        </button>
                        <button 
                          className="delete-thread-btn"
                          onClick={(e) => deleteThread(thread.threadId, e)}
                          title="Delete conversation"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="thread-id-display">
                  {thread.threadId}
                </div>
                <div className="thread-meta">
                  <span>{new Date(thread.timestamp).toLocaleDateString()}</span>
                  <span>{thread.messageCount} msgs</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <p>💬</p>
              <p>Start a conversation</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? 'ò ó' : '✮⋆'}
                </div>
                <div className="message-bubble">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="message bot">
              <div className="message-avatar avatar-loading">✮⋆</div>
              <div className="message-bubble typing">
                {toolStatus ? (
                  <div className="tool-status">
                    <div className="loader"></div>
                    <span>{toolStatus}</span>
                  </div>
                ) : (
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-form">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-btn" disabled={isLoading}>
            {isLoading ? '...' : '➤'}
          </button>
        </form>
      </div>
    </div>
  );
}
