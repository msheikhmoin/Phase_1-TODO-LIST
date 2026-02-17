'use client';

import { useState, useEffect, useRef } from 'react';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiUrl}/todos/`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(`${apiUrl}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTodos(todos.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.error || 'Sorry, I could not process that.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Error connecting to AI assistant.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // ========== STYLES ==========
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      borderBottom: '1px solid #27272a',
      backgroundColor: '#18181b',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#a1a1aa',
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      animation: 'pulse 2s infinite',
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
    },
    panel: {
      backgroundColor: '#18181b',
      borderRadius: '16px',
      border: '1px solid #27272a',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    panelHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #27272a',
      backgroundColor: 'rgba(24, 24, 27, 0.5)',
    },
    panelTitle: {
      fontSize: '18px',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: 0,
    },
    badge: {
      padding: '4px 10px',
      fontSize: '12px',
      borderRadius: '9999px',
      backgroundColor: '#27272a',
      color: '#a1a1aa',
      fontWeight: 500,
    },
    onlineBadge: {
      padding: '4px 10px',
      fontSize: '12px',
      borderRadius: '9999px',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    form: {
      padding: '24px',
      borderBottom: '1px solid #27272a',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      resize: 'none' as const,
      boxSizing: 'border-box',
      minHeight: '80px',
    },
    button: {
      width: '100%',
      padding: '14px 20px',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      backgroundColor: '#3f3f46',
      cursor: 'not-allowed',
    },
    todoList: {
      padding: '24px',
      maxHeight: '500px',
      overflowY: 'auto' as const,
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '48px 24px',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 16px',
      borderRadius: '50%',
      backgroundColor: '#27272a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
    },
    emptyText: {
      color: '#71717a',
      fontSize: '15px',
    },
    todoItem: {
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #27272a',
      backgroundColor: '#18181b',
      marginBottom: '12px',
      transition: 'border-color 0.2s, transform 0.2s',
    },
    todoItemCompleted: {
      backgroundColor: 'rgba(9, 9, 11, 0.5)',
      border: '1px solid rgba(39, 39, 42, 0.5)',
    },
    todoContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: '2px solid #52525b',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      flexShrink: 0,
      marginTop: '2px',
    },
    checkboxChecked: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    },
    todoText: {
      flex: 1,
      minWidth: 0,
    },
    todoTitle: {
      fontWeight: 500,
      fontSize: '15px',
    },
    todoTitleCompleted: {
      textDecoration: 'line-through',
      color: '#71717a',
    },
    todoDescription: {
      fontSize: '13px',
      color: '#a1a1aa',
      marginTop: '4px',
    },
    todoDate: {
      fontSize: '11px',
      color: '#52525b',
      marginTop: '8px',
    },
    deleteBtn: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      opacity: 0,
      transition: 'opacity 0.2s',
    },
    chatPanel: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '700px',
    },
    chatMessages: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto' as const,
    },
    chatEmpty: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
    },
    chatEmptyIcon: {
      width: '80px',
      height: '80px',
      marginBottom: '16px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
    },
    chatEmptyTitle: {
      fontSize: '18px',
      fontWeight: 500,
      marginBottom: '8px',
    },
    chatEmptyText: {
      fontSize: '14px',
      color: '#71717a',
      maxWidth: '320px',
    },
    messageRow: {
      display: 'flex',
      marginBottom: '16px',
    },
    messageRowUser: {
      justifyContent: 'flex-end',
    },
    messageBubble: {
      maxWidth: '85%',
      padding: '12px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      lineHeight: 1.5,
    },
    messageBubbleUser: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      color: '#ffffff',
      borderBottomRightRadius: '4px',
    },
    messageBubbleAssistant: {
      backgroundColor: '#27272a',
      color: '#ffffff',
      borderBottomLeftRadius: '4px',
      border: '1px solid #3f3f46',
    },
    messageTime: {
      fontSize: '11px',
      marginTop: '6px',
      opacity: 0.7,
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 16px',
      backgroundColor: '#27272a',
      borderRadius: '20px',
      borderBottomLeftRadius: '4px',
      border: '1px solid #3f3f46',
      width: 'fit-content',
    },
    typingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#818cf8',
    },
    chatInput: {
      padding: '24px',
      borderTop: '1px solid #27272a',
      backgroundColor: 'rgba(24, 24, 27, 0.5)',
    },
    chatInputRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px',
    },
    chatInputField: {
      flex: 1,
      padding: '14px 16px',
      backgroundColor: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      resize: 'none' as const,
      minHeight: '48px',
      maxHeight: '128px',
      boxSizing: 'border-box',
    },
    sendButton: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: '#4f46e5',
      border: 'none',
      color: '#ffffff',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
    },
  };

  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>📋</div>
            <span style={styles.logoText}>TaskFlow Pro</span>
          </div>
          <div style={styles.statusBadge}>
            <span>Dashboard</span>
            <span style={styles.statusDot}></span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.grid}>
          
          {/* Todo Panel */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                <span>✅</span>
                Your Tasks
                <span style={styles.badge}>{pendingCount} pending</span>
              </h2>
            </div>

            <form onSubmit={addTodo} style={styles.form}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  style={styles.input}
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details (optional)"
                  style={styles.textarea}
                />
                <button type="submit" style={styles.button}>
                  <span>➕</span> Add Task
                </button>
              </div>
            </form>

            <div style={styles.todoList}>
              {todos.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📝</div>
                  <p style={styles.emptyText}>No tasks yet. Add your first one!</p>
                </div>
              ) : (
                todos.map(todo => (
                  <div
                    key={todo.id}
                    style={{
                      ...styles.todoItem,
                      ...(todo.completed ? styles.todoItemCompleted : {}),
                    }}
                  >
                    <div style={styles.todoContent}>
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        style={{
                          ...styles.checkbox,
                          ...(todo.completed ? styles.checkboxChecked : {}),
                        }}
                      >
                        {todo.completed && '✓'}
                      </button>
                      <div style={styles.todoText}>
                        <p style={{
                          ...styles.todoTitle,
                          ...(todo.completed ? styles.todoTitleCompleted : {}),
                        }}>
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p style={styles.todoDescription}>{todo.description}</p>
                        )}
                        <p style={styles.todoDate}>
                          Created {new Date(todo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        style={styles.deleteBtn}
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div style={{ ...styles.panel, ...styles.chatPanel }}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                <span style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>⚡</span>
                AI Assistant
                <span style={styles.onlineBadge}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  Online
                </span>
              </h2>
            </div>

            <div style={styles.chatMessages}>
              {chatMessages.length === 0 ? (
                <div style={styles.chatEmpty}>
                  <div style={styles.chatEmptyIcon}>💬</div>
                  <h3 style={styles.chatEmptyTitle}>Start a Conversation</h3>
                  <p style={styles.chatEmptyText}>
                    Ask me anything about your tasks, productivity tips, or just chat!
                  </p>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.messageRow,
                        ...(msg.role === 'user' ? styles.messageRowUser : {}),
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageBubble,
                          ...(msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAssistant),
                        }}
                      >
                        {msg.content}
                        <div style={styles.messageTime}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={styles.messageRow}>
                      <div style={styles.typingIndicator}>
                        <span style={styles.typingDot}></span>
                        <span style={styles.typingDot}></span>
                        <span style={styles.typingDot}></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            <div style={styles.chatInput}>
              <div style={styles.chatInputRow}>
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  style={styles.chatInputField}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={loading || !chatInput.trim()}
                  style={{
                    ...styles.sendButton,
                    ...(loading || !chatInput.trim() ? styles.buttonDisabled : {}),
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Inline keyframes for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
