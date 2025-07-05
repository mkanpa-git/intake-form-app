import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { getCsrfToken } from '../../../utils/csrf';

export default function HelpChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const convoRef = useRef(null);

  useEffect(() => {
    if (convoRef.current) {
      convoRef.current.scrollTop = convoRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/help-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify({ message: trimmed, history: messages }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, an error occurred.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Unable to reach server.' }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chat Support">
      <div className="jules-helpchat-container">
        <div className="jules-helpchat-disclaimer">
          This chat is for general guidance only. Do not share personal or sensitive information.
        </div>
        <div className="jules-helpchat-conversation" ref={convoRef} tabIndex="0">
          {messages.map((m, idx) => (
            <div key={idx} className={`jules-helpchat-message jules-helpchat-${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>
        <div className="jules-helpchat-input-row">
          <textarea
            className="jules-helpchat-input"
            rows="2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
          />
          <Button onClick={sendMessage} disabled={sending} isLoading={sending} size="small">
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}
