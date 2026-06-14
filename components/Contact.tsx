'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Send, Bot, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { SOCIAL } from '@/lib/constants';
import { letterVariants } from '@/lib/animations';
import ScrollReveal from './ScrollReveal';
import { useAchievements } from './AchievementTracker';

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({
  href,
  children,
  label,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!ref.current || prefersReducedMotion) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        x.set(dx * 0.35);
        y.set(dy * 0.35);
      }
    },
    [prefersReducedMotion, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-border text-text2 font-dm text-sm hover:text-accent hover:border-accent/40 transition-colors duration-200"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

// ─── SplitText contact headline ───────────────────────────────────────────────
function ContactSplitText({ text }: { text: string }) {
  const words = text.split(' ');
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="inline"
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex mr-[0.25em]">
          {word.split('').map((char, ci) => (
            <motion.span key={ci} variants={letterVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

// ─── Ask Naman Simulated Chatbot ─────────────────────────────────────────────
interface Message {
  id: string;
  sender: 'user' | 'naman';
  text: string;
}

const CHAT_QA = [
  {
    keywords: ['stack', 'tech', 'skills', 'languages'],
    response: "I work primarily with Python, JavaScript, and SQL. On the Data Science side, I use Scikit-learn, TF-IDF, and Pandas. For web apps, I deploy Next.js (TypeScript) and FastAPI. I am currently learning LangChain & pgvector!",
  },
  {
    keywords: ['intern', 'internship', 'hiring', 'available'],
    response: "Yes! I am actively looking for summer/fall internships in Data Science, ML Engineering, or Full-Stack Development. I am based in Greater Noida but open to remote roles as well.",
  },
  {
    keywords: ['indevaa', 'studio', 'agency', 'company'],
    response: "Indevaa Studio is a branding and storytelling agency I co-founded in Prayagraj. We build brand strategy, automate lead generation (saving clients ~60% outreach time), and manage content pipelines.",
  },
  {
    keywords: ['fake news', 'nlp', 'classifier', 'project'],
    response: "My NLP Classifier was trained on 40,000 news articles, hitting a 0.94 F1-score. I built a Flask backend, clean frontend, and an explainability layer using LIME/TinyLlama so the AI explains why a story is flagged.",
  },
  {
    keywords: ['resume', 'cv', 'education'],
    response: "I am a B.Tech CSE (Data Science) student at NIET, Greater Noida (AKTU 2024–2028). You can download my full CV using the button in the hero section!",
  },
];

function AskNamanChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'naman', text: "Hey! Virtual Naman here. Ask me anything about my projects, Indevaa Studio, or internship availability!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const { unlock } = useAchievements();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const chatbotTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (chatbotTimeoutRef.current) clearTimeout(chatbotTimeoutRef.current);
    };
  }, []);

  const handleSend = (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Track messages count for achievements
    const count = msgCount + 1;
    setMsgCount(count);
    if (count >= 3) {
      unlock('chatbot_friend');
    }

    // Process Response after timeout
    chatbotTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      let match = CHAT_QA.find((qa) =>
        qa.keywords.some((kw) => text.toLowerCase().includes(kw))
      );

      let responseText = "I'm best qualified to talk about my NLP models, Full-Stack applications, Indevaa Studio, and internships! Try typing 'stack', 'intern', or 'Indevaa'.";
      if (match) {
        responseText = match.response;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'naman',
          text: responseText
        }
      ]);
    }, 1000);
  };

  const handleSuggestClick = (q: string) => {
    handleSend(q);
  };

  const suggestions = [
    'What is your tech stack?',
    'Are you looking for internships?',
    'Tell me about Indevaa Studio',
  ];

  return (
    <div className="w-full max-w-[440px] bg-surface border border-border/80 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-[420px] select-none justify-between">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm">
          <Bot size={14} />
        </div>
        <div>
          <div className="font-syne font-bold text-xs text-text1">Ask Naman</div>
          <div className="font-mono text-[9px] text-accent flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Virtual Assistant
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {messages.map((m) => {
          const isMe = m.sender === 'naman';
          return (
            <div key={m.id} className={`flex gap-2.5 ${isMe ? '' : 'flex-row-reverse'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                isMe ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-accent2/10 text-accent2 border border-accent2/20'
              }`}>
                {isMe ? <Bot size={10} /> : <User size={10} />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[80%] font-dm text-xs leading-normal ${
                isMe ? 'bg-surface2/60 border border-border/30 text-text1 rounded-tl-sm' : 'bg-accent2 text-background font-medium rounded-tr-sm'
              }`}>
                {m.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <Bot size={10} />
            </div>
            <div className="bg-surface2/60 border border-border/30 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input / Suggestions Footer */}
      <div className="border-t border-border/40 pt-3 space-y-2.5">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestClick(s)}
                className="px-2.5 py-1.5 rounded-lg border border-border bg-surface2/40 hover:border-accent/40 hover:text-accent font-dm text-[10px] text-text2 transition-all leading-none"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#131110] border border-border/60 rounded-full px-3 py-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
            placeholder="Type 'stack' or 'internships'..."
            className="flex-1 bg-transparent font-dm text-xs text-text1 outline-none border-none placeholder-text3"
          />
          <button
            onClick={() => handleSend(inputText)}
            className="p-1 rounded-full bg-accent hover:bg-accent/80 text-background transition-colors"
          >
            <Send size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export default function Contact() {
  const { unlock } = useAchievements();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Project Enquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const mailtoUrl = `mailto:namanrai1204@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Enquiry] ${subject} from ${name}`
    )}&body=${encodeURIComponent(
      `Hi Naman,\n\nYou have received a new enquiry from your portfolio.\n\nName: ${name}\nEmail: ${email}\n\nEnquiry Details:\n${message}\n\nSent from Naman Rai's Portfolio.`
    )}`;

    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setIsSent(false);
    }, 3000);
  };

  return (
    <section id="contact" className="section relative overflow-hidden bg-[#080A0F]">
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '400px',
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(110,231,183,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="container-max relative z-10">
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">Contact</span>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
          
          {/* Details Column */}
          <div>
            {/* Big headline with shimmer */}
            <h2
              className="font-syne font-black leading-none mb-8 tracking-tighter"
              style={{
                fontSize: 'clamp(40px, 7vw, 72px)',
              }}
            >
              <span className="shimmer-text">
                <ContactSplitText text="Let's build something." />
              </span>
            </h2>

            <ScrollReveal delay={0.2} className="mb-8">
              <p className="font-dm text-base md:text-lg text-text2 max-w-[500px] leading-relaxed">
                Open to internships, freelance projects, and interesting conversations. Grab my coordinates below or leave a message in the chat deck.
              </p>
            </ScrollReveal>

            {/* Inline Enquiry Form */}
            <ScrollReveal delay={0.25} className="mb-8 w-full max-w-[500px]">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-border/80 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center gap-1.5 border-b border-border/40 pb-2 mb-2">
                    <Sparkles size={12} className="text-accent animate-pulse" />
                    <span className="font-mono text-[9px] text-accent tracking-widest uppercase">
                      INLINE ENQUIRY PIPELINE
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 font-mono text-[10px]">
                      <label className="text-text3 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-3 py-2 text-xs text-text1 outline-none focus:border-accent/50 transition-colors font-dm"
                      />
                    </div>
                    <div className="space-y-1 font-mono text-[10px]">
                      <label className="text-text3 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-3 py-2 text-xs text-text1 outline-none focus:border-accent/50 transition-colors font-dm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-[10px]">
                    <label className="text-text3 uppercase tracking-wider">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-3 py-2 text-xs text-text2 focus:text-text1 outline-none focus:border-accent/50 transition-colors font-dm appearance-none"
                    >
                      <option value="General Project Enquiry">General Project Enquiry</option>
                      <option value="Data Science / ML Internship">Data Science / ML Internship</option>
                      <option value="Brand Strategy Consulting">Brand Strategy Consulting</option>
                      <option value="Freelance Development Cooperation">Freelance Development Cooperation</option>
                    </select>
                  </div>

                  <div className="space-y-1 font-mono text-[10px]">
                    <label className="text-text3 uppercase tracking-wider">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly describe your enquiry..."
                      className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-3 py-2 text-xs text-text1 outline-none focus:border-accent/50 transition-colors font-dm resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-background font-dm font-bold text-xs py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send size={12} /> Submit to Gmail
                  </button>
                </form>
              ) : (
                <div className="bg-surface border border-border/80 rounded-2xl p-6 text-center space-y-3 shadow-md">
                  <div className="w-10 h-10 rounded-full bg-accent2/10 border border-accent2/20 flex items-center justify-center text-accent2 mx-auto">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 className="font-syne font-bold text-sm text-text1">Form compiled successfully.</h4>
                  <p className="font-dm text-xs text-text2 leading-relaxed">
                    Opening your email client to dispatch the message to Naman.
                  </p>
                </div>
              )}
            </ScrollReveal>

            {/* Magnetic contact buttons */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  href={SOCIAL.email}
                  label="Email"
                  onClick={() => unlock('social_connect')}
                >
                  <Mail size={16} />
                  Email
                </MagneticButton>
                <MagneticButton
                  href={SOCIAL.linkedin}
                  label="LinkedIn"
                  onClick={() => unlock('social_connect')}
                >
                  <Linkedin size={16} />
                  LinkedIn
                </MagneticButton>
                <MagneticButton
                  href={SOCIAL.github}
                  label="GitHub"
                  onClick={() => unlock('social_connect')}
                >
                  <Github size={16} />
                  GitHub
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Chatbot Column */}
          <ScrollReveal direction="right" delay={0.2} className="flex justify-center w-full">
            <AskNamanChat />
          </ScrollReveal>

        </div>

        {/* Footer micro */}
        <ScrollReveal delay={0.4} className="mt-24 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <span className="font-mono text-xs text-text3 flex items-center gap-1.5">
              <Sparkles size={11} className="text-accent" /> © 2026 Naman Rai · Built with intention, not templates.
            </span>
            <span className="font-mono text-xs text-text3">
              Greater Noida / Prayagraj · AKTU DS Node
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
