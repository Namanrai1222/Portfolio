'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Project Enquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSent(false);
    };
    window.addEventListener('open-enquiry', handleOpen);
    return () => window.removeEventListener('open-enquiry', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Build the mailto url dynamically
    const mailtoUrl = `mailto:namanrai1204@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Enquiry] ${subject} from ${name}`
    )}&body=${encodeURIComponent(
      `Hi Naman,\n\nYou have received a new enquiry from your portfolio.\n\nName: ${name}\nEmail: ${email}\n\nEnquiry Details:\n${message}\n\nSent from Naman Rai's Portfolio.`
    )}`;

    // Open user mail client
    window.location.href = mailtoUrl;

    setIsSent(true);
    // Auto-close after a delay
    setTimeout(() => {
      setIsOpen(false);
      setName('');
      setEmail('');
      setMessage('');
      setIsSent(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 backdrop-blur-md overflow-y-auto px-4 py-8 md:py-16 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Card */}
          <motion.div
            className="w-full max-w-[540px] bg-surface border border-border/80 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-text3 hover:text-accent font-mono text-xs transition-colors p-2"
              title="Close modal"
            >
              <X size={18} />
            </button>

            {/* Glowing accent border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent3" />

            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="font-mono text-[9px] text-accent tracking-widest uppercase flex items-center gap-1.5 mb-1">
                    <Sparkles size={10} /> secure transmission protocol
                  </span>
                  <h3 className="font-syne font-black text-2xl md:text-3xl text-text1 leading-none">
                    Start an Enquiry.
                  </h3>
                  <p className="font-dm text-xs text-text2 mt-2 leading-relaxed">
                    Fill out the parameters below. Upon submission, it compiles a pre-formatted message and opens your Gmail client to send directly to <span className="text-accent">namanrai1204@gmail.com</span>.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-text3 uppercase tracking-wider text-[9px]">Name / Organization</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe / Indevaa Studio"
                      className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-4 py-3 text-text1 outline-none focus:border-accent/50 transition-colors placeholder:text-text3/60 font-dm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-text3 uppercase tracking-wider text-[9px]">Email Coordinates</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. client@domain.com"
                      className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-4 py-3 text-text1 outline-none focus:border-accent/50 transition-colors placeholder:text-text3/60 font-dm"
                    />
                  </div>

                  {/* Subject selector */}
                  <div className="space-y-1.5">
                    <label className="text-text3 uppercase tracking-wider text-[9px]">Enquiry Focus</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-4 py-3 text-text2 focus:text-text1 outline-none focus:border-accent/50 transition-colors font-dm appearance-none"
                    >
                      <option value="General Project Enquiry">General Project Enquiry</option>
                      <option value="Data Science / ML Internship">Data Science / ML Internship</option>
                      <option value="Brand Strategy Consulting">Brand Strategy Consulting</option>
                      <option value="Freelance Development Cooperation">Freelance Development Cooperation</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label className="text-text3 uppercase tracking-wider text-[9px]">Enquiry Details</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly detail your query, project scope, or timeline expectations..."
                      className="w-full bg-[#1A1817] border border-border/60 rounded-xl px-4 py-3 text-text1 outline-none focus:border-accent/50 transition-colors placeholder:text-text3/60 font-dm resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-accent text-background font-dm font-bold text-sm py-4 rounded-xl hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Open Gmail Client
                </button>
              </form>
            ) : (
              /* Success confirmation state */
              <motion.div
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-accent2/10 border border-accent2/20 flex items-center justify-center text-accent2">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-syne font-black text-2xl text-text1">Enquiry Compiled!</h3>
                <p className="font-dm text-xs text-text2 max-w-[320px] leading-relaxed">
                  Your mail client has been opened. Please review and hit send in Gmail to deliver the email. Closing form window...
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
