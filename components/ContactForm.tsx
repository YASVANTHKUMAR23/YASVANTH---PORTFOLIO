import React, { useState } from 'react';
import { User, Mail, FileText, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

const InputField = ({ label, name, icon: Icon, type = "text", value, onChange, onFocus, onBlur, isFocused }: {
  label: string,
  name: string,
  icon: any,
  type?: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onFocus: () => void,
  onBlur: () => void,
  isFocused: boolean
}) => {
  const hasValue = value !== '';

  return (
    <div className="relative mb-10 group">
      <label
        className={`absolute transition-all duration-300 pointer-events-none uppercase tracking-[0.2em] font-black ${isFocused || hasValue
          ? '-top-6 left-0 text-blue-400 text-[10px] opacity-100'
          : 'top-4 left-10 text-gray-400 text-xs opacity-40'
          }`}
      >
        {label}
      </label>
      <div className={`flex items-center gap-4 border-b-2 transition-all duration-500 py-4 px-4 rounded-t-xl bg-white/[0.02] hover:bg-white/[0.05] ${isFocused ? 'border-blue-500 bg-white/[0.07]' : 'border-white/10'}`}>
        <Icon className={`w-4 h-4 transition-colors duration-300 ${isFocused ? 'text-blue-400' : 'text-gray-500'}`} />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required
          autoComplete="off"
          className="w-full bg-transparent outline-none text-white font-semibold text-sm selection:bg-blue-500/30"
        />
      </div>
    </div>
  );
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-16">
        <InputField
          label="Your Name"
          name="name"
          icon={User}
          value={formData.name}
          onChange={handleInputChange as any}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
          isFocused={focused === 'name'}
        />
        <InputField
          label="Email Address"
          name="email"
          icon={Mail}
          type="email"
          value={formData.email}
          onChange={handleInputChange as any}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
          isFocused={focused === 'email'}
        />
      </div>

      <InputField
        label="Subject"
        name="subject"
        icon={FileText}
        value={formData.subject}
        onChange={handleInputChange as any}
        onFocus={() => setFocused('subject')}
        onBlur={() => setFocused(null)}
        isFocused={focused === 'subject'}
      />

      <div className="relative mb-14 group">
        <label
          className={`absolute transition-all duration-300 pointer-events-none uppercase tracking-[0.2em] font-black ${focused === 'message' || formData.message !== ''
            ? '-top-6 left-0 text-blue-400 text-[10px] opacity-100'
            : 'top-4 left-10 text-gray-400 text-xs opacity-40'
            }`}
        >
          Message Details
        </label>
        <div className={`flex items-start gap-4 border-b-2 transition-all duration-500 py-4 px-4 rounded-t-xl bg-white/[0.02] hover:bg-white/[0.05] ${focused === 'message' ? 'border-blue-500 bg-white/[0.07]' : 'border-white/10'}`}>
          <MessageSquare className={`w-4 h-4 mt-1 transition-colors duration-300 ${focused === 'message' ? 'text-blue-400' : 'text-gray-500'}`} />
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            required
            className="w-full bg-transparent outline-none text-white font-semibold text-sm resize-none selection:bg-blue-500/30"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`group relative w-full overflow-hidden py-7 rounded-2xl font-black uppercase tracking-[0.5em] text-[11px] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(37,99,235,0.2)] active:scale-95 border border-white/10 ${status === 'success' ? 'bg-emerald-500 text-white border-emerald-400/20' :
          status === 'error' ? 'bg-rose-500 text-white border-rose-400/20' :
            'bg-blue-600 text-white hover:bg-blue-500'
          }`}
      >
        <div className="relative z-10 flex items-center justify-center gap-4">
          {status === 'sending' ? (
            <>
              <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Message Sent</span>
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>Retry Failed</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span>Send Message</span>
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
      </button>

      <p className="text-[10px] text-blue-400/30 mt-10 text-center uppercase tracking-[0.6em] font-black">
        {status === 'success' ? "I'll get back to you soon" : "Typical response time: < 24 hrs"}
      </p>
    </form>
  );
};

export default ContactForm;
