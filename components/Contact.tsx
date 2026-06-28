'use client';

import { useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Send, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { SOCIAL } from '@/lib/constants';
import ScrollReveal from './ScrollReveal';
import { useAchievements } from './AchievementTracker';

// ─── Magnetic Social Button ────────────────────────────────────────────────────
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
  const ref = useCallback((node: HTMLAnchorElement | null) => {
    if (!node) return;
    // capture ref for magnetic effect
  }, []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 60) { x.set(dx * 0.35); y.set(dy * 0.35); }
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-border text-text2 font-dm text-sm hover:text-accent hover:border-accent/40 transition-colors duration-200"
    >
      {children}
    </motion.a>
  );
}

// ─── Contact Section ───────────────────────────────────────────────────────────
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
      `[Portfolio] ${subject} from ${name}`
    )}&body=${encodeURIComponent(
      `Hi Naman,\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\nSent from portfolio.`
    )}`;
    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => { setName(''); setEmail(''); setMessage(''); setIsSent(false); }, 3000);
  };

  return (
    <section id="contact" className="section relative overflow-hidden bg-[#080A0F]">
      {/* Ambient glow bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(110,231,183,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="container-max relative z-10">
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">Contact</span>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: Headline + Info ── */}
          <div>
            <ScrollReveal direction="clip-up" delay={0.05} className="mb-6">
              <h2
                className="font-syne font-black leading-none tracking-tighter text-text1"
                style={{ fontSize: 'clamp(40px, 6vw, 68px)' }}
              >
                Let&apos;s build<br />
                <span className="shimmer-text">something.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="mb-8">
              <p className="font-dm text-base md:text-lg text-text2 leading-relaxed max-w-[420px]">
                Open to internships, freelance projects, and interesting conversations.
                I respond within 24 hours.
              </p>
            </ScrollReveal>

            {/* Availability card */}
            <ScrollReveal delay={0.2} className="mb-10">
              <div className="inline-flex flex-col gap-4 bg-surface border border-border/60 rounded-2xl p-5 w-full max-w-[340px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                  <span className="font-mono text-xs text-text2">Available for opportunities</span>
                </div>
                <div className="space-y-2.5 font-mono text-xs text-text3">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-accent flex-shrink-0" />
                    Greater Noida / Prayagraj, India
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={11} className="text-accent2 flex-shrink-0" />
                    IST (UTC+5:30) · Open to remote
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-accent3 flex-shrink-0" />
                    namanrai1204@gmail.com
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Social links */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-3">
                <MagneticButton href={SOCIAL.email} label="Email" onClick={() => unlock('social_connect')}>
                  <Mail size={15} /> Email
                </MagneticButton>
                <MagneticButton href={SOCIAL.linkedin} label="LinkedIn" onClick={() => unlock('social_connect')}>
                  <Linkedin size={15} /> LinkedIn
                </MagneticButton>
                <MagneticButton href={SOCIAL.github} label="GitHub" onClick={() => unlock('social_connect')}>
                  <Github size={15} /> GitHub
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right: Contact Form ── */}
          <ScrollReveal direction="right" delay={0.15}>
            {!isSent ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-surface border border-border/60 rounded-2xl p-6 md:p-8"
              >
                <p className="font-mono text-[10px] text-text3 uppercase tracking-widest mb-6">
                  {"// Send a message"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-text3 uppercase tracking-wider block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-background/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-text1 outline-none focus:border-accent/50 transition-colors font-dm placeholder:text-text3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-text3 uppercase tracking-wider block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-background/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-text1 outline-none focus:border-accent/50 transition-colors font-dm placeholder:text-text3"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-text3 uppercase tracking-wider block">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-text2 outline-none focus:border-accent/50 transition-colors font-dm appearance-none"
                  >
                    <option value="General Project Enquiry">General Project Enquiry</option>
                    <option value="Data Science / ML Internship">Data Science / ML Internship</option>
                    <option value="Brand Strategy Consulting">Brand Strategy Consulting</option>
                    <option value="Freelance Development">Freelance Development</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-text3 uppercase tracking-wider block">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project or opportunity..."
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-sm text-text1 outline-none focus:border-accent/50 transition-colors font-dm resize-none leading-relaxed placeholder:text-text3"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-background font-dm font-bold text-sm py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Send Message
                </button>
              </form>
            ) : (
              <div className="bg-surface border border-border/60 rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent2/10 border border-accent2/20 flex items-center justify-center text-accent2 mx-auto">
                  <CheckCircle2 size={22} />
                </div>
                <h4 className="font-syne font-bold text-text1">Message compiled.</h4>
                <p className="font-dm text-sm text-text2 leading-relaxed">
                  Opening your email client to dispatch the message. Talk soon.
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Footer */}
        <ScrollReveal delay={0.4} className="mt-20 pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-mono text-xs text-text3">
              © 2026 Naman Rai · Built with intention, not templates.
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
