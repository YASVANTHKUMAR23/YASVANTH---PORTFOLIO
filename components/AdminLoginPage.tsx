import React, { useState } from 'react';
import { Lock, User, ChevronLeft } from 'lucide-react';
import { useRealTimeData } from '../context/RealTimeDataContext';

interface AdminLoginProps {
  onNavigate: (page: string) => void;
}

const AdminLoginPage: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useRealTimeData();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(formData.password);
    if (success) {
      onNavigate('dashboard');
    } else {
      setError("Admin access denied: Invalid credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020b1d] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-800/20 rounded-full blur-[120px]" />
      </div>

      <button
        onClick={() => onNavigate('home')}
        className="absolute top-12 left-12 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-gray-500 hover:text-white transition-all group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Return to Gallery
      </button>

      <div className="entrance-anim relative w-full max-w-md px-6 z-10">
        <div className="bg-white/5 backdrop-blur-2xl p-12 md:p-16 rounded-[40px] shadow-2xl border border-white/10 relative overflow-hidden">

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-[2rem] mx-auto mb-8 shadow-2xl transform hover:rotate-12 transition-transform duration-500 border border-white/10">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-white mb-3 uppercase">Vault Access</h2>
            <p className="text-[10px] text-blue-400/40 uppercase tracking-[0.4em] font-black">Authorized Operations Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-[0.3em] font-black text-[9px] ${focusedField === 'username' || formData.username !== ''
                  ? '-top-6 text-blue-400 opacity-100'
                  : 'top-3 text-gray-500 opacity-60'
                  }`}
              >
                Identification
              </label>
              <div className="flex items-center gap-4 border-b-2 border-white/10 py-3 focus-within:border-blue-400 transition-all duration-300">
                <User className={`w-4 h-4 transition-colors ${focusedField === 'username' ? 'text-blue-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-gray-700"
                  placeholder={focusedField === 'username' ? "" : "Username"}
                />
              </div>
            </div>

            <div className="relative group">
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-[0.3em] font-black text-[9px] ${focusedField === 'password' || formData.password !== ''
                  ? '-top-6 text-blue-400 opacity-100'
                  : 'top-3 text-gray-500 opacity-60'
                  }`}
              >
                Access Key
              </label>
              <div className="flex items-center gap-4 border-b-2 border-white/10 py-3 focus-within:border-blue-400 transition-all duration-300">
                <Lock className={`w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-500'}`} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-transparent outline-none text-sm font-bold text-white placeholder:text-gray-700"
                  placeholder={focusedField === 'password' ? "" : "••••••••"}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-blue-700 transition-all shadow-2xl active:scale-[0.98] transform group overflow-hidden relative"
            >
              <span className="relative z-10">Authenticate</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>

          {/* Decorative Corner */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-400/5 rounded-full opacity-50" />
        </div>

        <p className="text-center mt-12 text-[9px] text-blue-400/20 uppercase tracking-[0.5em] font-black">
          Instance ID: LRSN-8842-X
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
