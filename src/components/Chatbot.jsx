import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import '../styles/Chatbot.css';
import { askChatbot } from '../api/chatbot';

// Build a lightweight FAQ/Q&A over portfolio content
const buildKnowledgeBase = (portfolioData) => {
  const entries = [];
  const aboutAnswer = `I'm ${portfolioData.name}, ${portfolioData.tagline}. Currently pursuing ${portfolioData.education}.`;
  const contactAnswer = `Reach me at ${portfolioData.email} or ${portfolioData.phone}. Location: ${portfolioData.location}.`;

  // About / intro
  ['who are you', 'tell me about you', 'about you', 'introduce yourself', 'who am i', 'about me'].forEach((q) => {
    entries.push({ q, a: aboutAnswer });
  });

  // Contact
  ['contact', 'how to contact you', 'how can i contact you', 'reach you', 'get in touch', 'email', 'phone', 'mobile', 'call you'].forEach((q) => {
    entries.push({ q, a: contactAnswer });
  });

  entries.push({ q: 'education', a: portfolioData.education });
  entries.push({ q: 'skills', a: `Key skills: ${portfolioData.skills.join(', ')}.` });
  entries.push({ q: 'projects', a: `Featured projects: ${portfolioData.projects.map(p => p.title).join(', ')}.` });
  portfolioData.projects.forEach(p => {
    entries.push({ q: p.title.toLowerCase(), a: `${p.title} — ${p.subtitle}. ${p.description} Tech: ${p.tech.join(', ')}.` });
  });
  entries.push({ q: 'achievements', a: `Highlights: ${portfolioData.achievements.map(a => `${a.title} (${a.badge})`).join('; ')}.` });
  return entries;
};

// Render answer text: bold (**text**), line breaks, bullet points (•/🏆/🚀/📧/📞/📍)
const renderAnswer = (text) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Convert **word** to <strong>
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={j}>{part.slice(2, -2)}</strong>
        : part
    );
    return <div key={i} style={{ marginBottom: '2px' }}>{parts}</div>;
  });
};

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const similarity = (a, b) => {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  // Phrase containment is a strong signal (e.g., "contact" in "how to contact you")
  if (nb.includes(na)) return 0.9;

  const aw = new Set(na.split(' '));
  const bw = new Set(nb.split(' '));
  let overlap = 0;
  aw.forEach(w => { if (bw.has(w)) overlap++; });
  const union = aw.size + bw.size - overlap;
  return overlap / Math.max(1, union); // Jaccard
};

const defaultSuggestions = [
  'Tell me about you',
  'Show your projects',
  'What are your skills?',
  'Your achievements?',
  'How to contact you?',
];

const Chatbot = ({ portfolioSnapshot }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m your portfolio assistant. Ask me anything about Venkatesh, projects, skills, achievements, or how to get in touch.' }
  ]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  const kb = useMemo(() => buildKnowledgeBase(portfolioSnapshot), [portfolioSnapshot]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking, open]);

  const answerLocal = (query) => {
    const n = normalize(query);
    let best = { score: 0, a: null };
    kb.forEach(entry => {
      const score = similarity(entry.q, n);
      if (score > best.score) best = { score, a: entry.a };
    });
    if (best.score > 0.2) return best.a;
    // Fallback composed answer
    const firstProject = portfolioSnapshot.projects && portfolioSnapshot.projects.length > 0
      ? ` like ${portfolioSnapshot.projects[0].title}` : '';
    return `I'm ${portfolioSnapshot.name}. ${portfolioSnapshot.tagline}. I'm experienced with ${(portfolioSnapshot.skills || []).slice(0,6).join(', ')} and have built ${(portfolioSnapshot.projects || []).length} featured projects${firstProject}. Ask about projects, skills, achievements, or contact.`;
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setThinking(true);
    try {
      const reply = await askChatbot(userText);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      const reply = answerLocal(userText);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } finally {
      setThinking(false);
    }
  };

  const handleSend = () => sendMessage();

  return (
    <div className="chatbot-root">
      {!open && (
        <button className="chatbot-fab" aria-label="Open chat" onClick={() => setOpen(true)}>
          <MessageCircle size={22} />
        </button>
      )}
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={18} />
              <span>Portfolio Assistant</span>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="chatbot-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-avatar">{m.role === 'bot' ? <Bot size={14} /> : <User size={14} />}</div>
                <div className="chat-bubble">{m.role === 'bot' ? renderAnswer(m.text) : m.text}</div>
              </div>
            ))}
            {thinking && (
              <div className="chat-msg bot">
                <div className="chat-avatar"><Bot size={14} /></div>
                <div className="chat-bubble">
                  <span className="dots">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="chatbot-suggestions">
            {defaultSuggestions.map((s, idx) => (
              <button key={idx} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, achievements…"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button className="chat-send" onClick={handleSend} aria-label="Send"><Send size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;