import React, { useState, useRef } from 'react';
import {
  LayoutDashboard, Home, Briefcase, Award, Info,
  LogOut, ChevronRight, Plus, Trash2, Edit2, Share2, Twitter, Github, Linkedin, Instagram, Mail, Upload, FileUp, Laptop
} from 'lucide-react';
import { useRealTimeData } from '../context/RealTimeDataContext';
import Toast, { ToastType } from './ui/Toast';
import { DebouncedInput } from './ui/DebouncedInput';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type Section =
  | 'Overview'
  | 'Home Content'
  | 'About Content'
  | 'Projects'
  | 'Experience'
  | 'Certificates'
  | 'Contact Info'
  | 'Skills'
  | 'Social Links';

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('adminToken');
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData
  });

  if (!res.ok) {
    throw new Error('Image upload failed');
  }

  const data = await res.json();
  return data.imageUrl; // Expecting { imageUrl: "/uploads/..." }
};

/* =========================
   Inline Editor Components
   ========================= */

const ProjectEditorItem: React.FC<{
  project: any;
  onUpdate: (p: any) => void;
  onDelete: (id: number) => void;
}> = ({ project, onUpdate, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        onUpdate({ ...project, image_url: imageUrl });
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image");
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl flex flex-col md:flex-row gap-8 items-start group">
      <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden bg-black/20 flex-shrink-0 relative group/img border border-white/5">
        <img src={project.image_url || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest gap-2"
          aria-label="Change project image"
          title="Change project image"
        >
          <Upload className="w-4 h-4" /> Change Image
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
      <div className="flex-1 space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">Project Title</label>
            <DebouncedInput
              value={project.title}
              onDebouncedChange={(val) => onUpdate({ ...project, title: val })}
              className="w-full text-lg font-bold border-b border-white/10 bg-transparent py-2 focus:border-blue-400 outline-none text-white"
              placeholder="Title"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">Stack (comma separated)</label>
            <DebouncedInput
              value={project.stack}
              onDebouncedChange={(val) => onUpdate({ ...project, stack: val })}
              className="w-full text-[10px] font-black uppercase tracking-widest border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
              placeholder="React, Node.js..."
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase font-bold text-gray-300">Description</label>
          <DebouncedInput
            textarea
            value={project.description}
            onDebouncedChange={(val) => onUpdate({ ...project, description: val })}
            className="w-full text-sm border border-white/10 bg-black/20 p-4 rounded-xl focus:border-blue-400 outline-none min-h-[80px] text-gray-300"
            placeholder="Description"
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(e) => onUpdate({ ...project, featured: e.target.checked })}
              className="w-4 h-4 accent-blue-400"
            />
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Featured In Gallery</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">Live URL</label>
            <DebouncedInput
              value={project.live_url || ''}
              onDebouncedChange={(val) => onUpdate({ ...project, live_url: val })}
              className="w-full text-xs border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">GitHub Repo</label>
            <DebouncedInput
              value={project.github_url || ''}
              onDebouncedChange={(val) => onUpdate({ ...project, github_url: val })}
              className="w-full text-xs border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(project.id)}
        className="text-red-400/60 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-all"
        aria-label="Delete project"
        title="Delete project"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

const CertificateEditorItem: React.FC<{
  certificate: any;
  onUpdate: (c: any) => void;
  onDelete: (id: number) => void;
}> = ({ certificate, onUpdate, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        onUpdate({ ...certificate, image_url: imageUrl });
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image");
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl flex flex-col md:flex-row gap-8 items-center group">
      <div className="w-full md:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-black/20 flex-shrink-0 relative group/cert border border-white/5">
        <img src={certificate.image_url || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover/cert:opacity-100 transition-all flex items-center justify-center text-white"
          aria-label="Change certificate image"
          title="Change certificate image"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="space-y-1">
          <label className="text-[8px] uppercase font-bold text-gray-300">Certification Name</label>
          <DebouncedInput
            value={certificate.title}
            onDebouncedChange={(val) => onUpdate({ ...certificate, title: val })}
            className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase font-bold text-gray-300">Issuing Organization</label>
          <DebouncedInput
            value={certificate.organization}
            onDebouncedChange={(val) => onUpdate({ ...certificate, organization: val })}
            className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
          />
        </div>
      </div>
      <button
        onClick={() => onDelete(certificate.id)}
        className="text-red-400/60 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

const ExperienceEditorItem: React.FC<{
  experience: any;
  onUpdate: (e: any) => void;
  onDelete: (id: number) => void;
}> = ({ experience, onUpdate, onDelete }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[32px] border border-white/10 shadow-2xl space-y-6 group">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">Year / Duration</label>
            <DebouncedInput
              value={experience.year_range}
              onDebouncedChange={(val) => onUpdate({ ...experience, year_range: val })}
              className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
              placeholder="e.g. 2022 — Present"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">Job Title</label>
            <DebouncedInput
              value={experience.role}
              onDebouncedChange={(val) => onUpdate({ ...experience, role: val })}
              className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-gray-300">Company Name</label>
            <DebouncedInput
              value={experience.company}
              onDebouncedChange={(val) => onUpdate({ ...experience, company: val })}
              className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
            />
          </div>
        </div>
        <button
          onClick={() => onDelete(experience.id)}
          className="text-red-400/60 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-full transition-all"
          aria-label="Delete experience entry"
          title="Delete experience entry"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-1">
        <label className="text-[8px] uppercase font-bold text-gray-300">Key Contributions</label>
        <DebouncedInput
          textarea
          value={experience.description}
          onDebouncedChange={(val) => onUpdate({ ...experience, description: val })}
          className="w-full text-sm border border-white/10 bg-black/20 p-6 rounded-2xl focus:border-blue-400 outline-none min-h-[100px] text-gray-300"
        />
      </div>
    </div>
  );
};

const menuItems = [
  { name: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: 'Home Content', icon: <Home className="w-4 h-4" /> },
  { name: 'About Content', icon: <Info className="w-4 h-4" /> },
  { name: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
  { name: 'Certificates', icon: <Award className="w-4 h-4" /> },
  { name: 'Skills', icon: <Laptop className="w-4 h-4" /> },
  { name: 'Experience', icon: <ChevronRight className="w-4 h-4" /> },
  { name: 'Contact Info', icon: <Info className="w-4 h-4" /> },
  { name: 'Social Links', icon: <Share2 className="w-4 h-4" /> },
];

const HeaderEditor: React.FC<{
  pageKey: string;
  label: string;
  header: any;
  onUpdate: (val: any) => void;
}> = ({ pageKey, label, header, onUpdate }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[32px] border border-white/10 shadow-2xl space-y-6">
      <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">
        {label} Section Header
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-[8px] uppercase font-bold text-gray-300">Eyebrow / Sub-heading</span>
          <DebouncedInput
            value={header?.eyebrow || ''}
            onDebouncedChange={val => onUpdate({ ...header, eyebrow: val })}
            className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
          />
        </div>
        <div className="space-y-2">
          <span className="text-[8px] uppercase font-bold text-gray-300">Section Title</span>
          <DebouncedInput
            value={header?.title || ''}
            onDebouncedChange={val => onUpdate({ ...header, title: val })}
            className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-[8px] uppercase font-bold text-gray-300">Introduction</span>
        <DebouncedInput
          textarea
          value={header?.description || ''}
          onDebouncedChange={val => onUpdate({ ...header, description: val })}
          className="w-full text-sm border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 min-h-[80px] text-gray-300"
        />
      </div>
    </div>
  );
};

/* =========================
   Main Admin Dashboard
   ========================= */

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<Section>('Overview');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [draftData, setDraftData] = useState<any | null>(null);
  const {
    data: globalData,
    loading,
    setIsPaused,
    logout,
    updatePageHeader,
    createProject,
    updateProject,
    createCertificate,
    updateCertificate,
    createExperience,
    updateExperience,
    createSkill,
    updateSkill,
    updateSocialLink,
    updateSettings,
  } = useRealTimeData();

  // Use draft data if editing, else global data
  const data = draftData || globalData;
  const isDirty = !!draftData;

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const dirtyRefs = useRef({
    projects: new Set<number>(),
    certificates: new Set<number>(),
    experience: new Set<number>(),
    skills: new Set<number>(),
    settings: new Set<string>(),
    socialLinks: new Set<string>(),
    pageHeaders: new Set<string>(),
    philosophy: new Set<number>(),
    animatedTitles: new Set<number>()
  });

  const discardChanges = () => {
    setDraftData(null);
    setIsPaused(false);
    showToast('Changes discarded', 'success');
    // Clear dirty refs
    Object.values(dirtyRefs.current).forEach(s => s.clear());
  };

  const saveChanges = async () => {
    try {
      const d = draftData;
      if (!d) return;

      // Projects
      for (const id of dirtyRefs.current.projects) {
        const item = d.projects.find((p: any) => p.id === id);
        if (item) await updateProject(item);
      }
      // Certificates
      for (const id of dirtyRefs.current.certificates) {
        const item = d.certificates.find((c: any) => c.id === id);
        if (item) await updateCertificate(item);
      }
      // Experience
      for (const id of dirtyRefs.current.experience) {
        const item = d.experience.find((e: any) => e.id === id);
        if (item) await updateExperience(item);
      }
      // Skills
      for (const id of dirtyRefs.current.skills) {
        const item = d.skills.find((s: any) => s.id === id);
        if (item) await updateSkill(item);
      }
      // Settings
      for (const key of dirtyRefs.current.settings) {
        await updateSettings(key, d.settings[key]);
      }
      // Social
      for (const platform of dirtyRefs.current.socialLinks) {
        const item = d.socialLinks.find((s: any) => s.platform === platform);
        if (item) await updateSocialLink(platform, item.url);
      }
      // PageHeaders
      for (const page of dirtyRefs.current.pageHeaders) {
        await updatePageHeader(page as any, d.pageHeaders[page]);
      }
      // Philosophy
      for (const id of dirtyRefs.current.philosophy) {
        const item = d.philosophy.find((p: any) => p.line_number === id);
        if (item) await updateSettings('philosophy_update', { id, text: item.text });
      }
      // Animated Titles
      for (const id of dirtyRefs.current.animatedTitles) {
        const item = d.animatedTitles.find((t: any) => t.id === id);
        if (item) await updateSettings('animatedTitles_update', { id, title: item.title });
      }

      showToast('All changes saved successfully', 'success');
      setDraftData(null);
      setIsPaused(false);
      Object.values(dirtyRefs.current).forEach(s => s.clear());
    } catch (e) {
      console.error(e);
      showToast('Failed to save some changes', 'error');
    }
  };

  const handleLocalUpdate = (updater: (prev: any) => any) => {
    if (!draftData) {
      setDraftData(updater(globalData));
      setIsPaused(true);
    } else {
      setDraftData(updater(draftData));
    }
  };

  const patchList = (listName: 'projects' | 'certificates' | 'experience' | 'skills', item: any) => {
    dirtyRefs.current[listName].add(item.id);
    handleLocalUpdate((prev: any) => ({
      ...prev,
      [listName]: prev[listName].map((i: any) => i.id === item.id ? item : i)
    }));
  };

  const patchSettings = (key: string, value: any) => {
    dirtyRefs.current.settings.add(key);
    handleLocalUpdate((prev: any) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };

  const patchHeader = (page: 'about' | 'projects' | 'certificates' | 'contact' | 'experience' | 'skills', val: any) => {
    dirtyRefs.current.pageHeaders.add(page);
    handleLocalUpdate((prev: any) => ({
      ...prev,
      pageHeaders: { ...prev.pageHeaders, [page]: val }
    }));
  };


  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const wrapUpdate = async (fn: () => Promise<any>, successMsg: string = 'Changes saved') => {
    try {
      await fn();
      showToast(successMsg, 'success');
    } catch (error) {
      console.error(error);
      showToast('Operation failed', 'error');
    }
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        wrapUpdate(() => updateSettings('about_image', imageUrl), 'Portrait updated');
      } catch (e) {
        showToast("Portrait upload failed", 'error');
      }
    }
  };

  // Resume might still need a link or file? If it's a file, we upload it.
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Upload generic file
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
          body: formData
        });
        if (res.ok) {
          const d = await res.json();
          wrapUpdate(() => updateSettings('resume_url', d.imageUrl), 'Resume updated');
        } else {
          throw new Error("Upload failed");
        }
      } catch (e) {
        showToast("Resume upload failed", 'error');
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#020b1d] overflow-hidden font-sans text-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
        <div className="p-10">
          <h1 className="text-xl font-black tracking-tighter uppercase text-white">CMS <span className="text-blue-400/40 block text-[8px] tracking-[0.4em]">PRO EDITION</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.name as Section)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all group ${activeSection === item.name
                ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] translate-x-1'
                : 'hover:bg-white/5 text-gray-500 hover:text-white'
                }`}
              aria-label={`Go to ${item.name} section`}
            >
              <div className={activeSection === item.name ? 'text-white' : 'text-gray-600'}>{item.icon}</div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full mt-auto flex items-center gap-3 px-6 py-4 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 rounded-2xl transition-all"
            aria-label="Sign out of admin panel"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 relative">
        {isDirty && (
          <div className="sticky top-0 z-50 mb-8 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              <span className="font-bold uppercase tracking-widest text-xs">Unsaved Changes</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={discardChanges}
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-all"
                aria-label="Discard all unsaved changes"
              >
                Discard
              </button>
              <button
                onClick={saveChanges}
                className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg"
                aria-label="Save all changes to server"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto entrance-anim pb-24">

          {activeSection === 'Overview' && (
            <div className="space-y-12">
              <div className="flex justify-between items-end">
                <h2 className="text-4xl font-light text-white">System <span className="font-extrabold text-blue-400">Health</span></h2>
                <span className="text-[10px] uppercase tracking-widest font-black text-green-500 animate-pulse">● System Live</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Projects', val: data.projects.length },
                  { label: 'Experience', val: data.experience.length },
                  { label: 'Certificates', val: data.certificates.length },
                  { label: 'Skills', val: data.skills.length }
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 group">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 group-hover:text-blue-400 transition-colors">{s.label}</span>
                    <p className="text-5xl font-black mt-4 text-white">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Home Content' && (
            <div className="space-y-10">
              <h2 className="text-4xl font-light text-white">Hero & <span className="font-extrabold text-blue-400">Philosophy</span> Editor</h2>
              <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] space-y-10 border border-white/10 shadow-2xl">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Hero Headline</label>
                  <DebouncedInput
                    value={data.settings.hero_title || ""}
                    onDebouncedChange={(val) => patchSettings('hero_title', val)}
                    className="w-full text-3xl font-light border-b border-white/10 bg-transparent py-6 focus:border-blue-400 outline-none transition-all text-white"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Animated Role Titles</label>
                    <button
                      onClick={() => wrapUpdate(() => updateSettings('animatedTitles_add', ''), 'Title added')}
                      className="p-2 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.animatedTitles.map((title: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl group">
                        <DebouncedInput
                          value={title.title}
                          onDebouncedChange={(val) => {
                            dirtyRefs.current.animatedTitles.add(title.id);
                            handleLocalUpdate((prev: any) => ({ ...prev, animatedTitles: prev.animatedTitles.map((t: any) => t.id === title.id ? { ...t, title: val } : t) }));
                          }}
                          className="flex-1 bg-transparent text-sm font-bold tracking-widest outline-none border-b border-transparent focus:border-blue-400 transition-all text-white"
                        />
                        <button
                          onClick={() => wrapUpdate(() => updateSettings('animatedTitles_delete', title.id), 'Title deleted')}
                          className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-gray-400">
                    <FileUp className="w-5 h-5" />
                    <label className="text-[10px] uppercase tracking-widest font-black">Resume Document Upload</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                    >
                      <Upload className="w-4 h-4" /> Select File
                    </button>
                    <input type="file" ref={resumeInputRef} className="hidden" onChange={handleResumeUpload} />
                    {data.settings.resume_url && data.settings.resume_url !== '#' && (
                      <span className="text-[8px] uppercase font-black text-green-500">File Linked Successfully</span>
                    )}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Philosophy Typography Lines (7 parts)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.philosophy.map((line: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <label className="text-[8px] uppercase font-bold text-gray-300">Part {i + 1}</label>
                        <DebouncedInput
                          value={line.text}
                          onDebouncedChange={(val) => {
                            dirtyRefs.current.philosophy.add(line.line_number);
                            handleLocalUpdate((prev: any) => ({ ...prev, philosophy: prev.philosophy.map((p: any) => p.line_number === line.line_number ? { ...p, text: val } : p) }));
                          }}
                          className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 outline-none focus:border-blue-400 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'About Content' && (
            <div className="space-y-10">
              <h2 className="text-4xl font-light text-white">About <span className="font-extrabold text-blue-400">Narration</span></h2>
              <HeaderEditor
                pageKey="about"
                label="About"
                header={data.pageHeaders.about}
                onUpdate={(val) => patchHeader('about', val)}
              />

              <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] border border-white/10 shadow-2xl space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Portrait Image</label>
                    <div className="flex flex-col gap-4">
                      <div className="w-32 aspect-[3/4] bg-black/40 rounded-2xl overflow-hidden shadow-inner border border-white/5">
                        <img src={data.settings.about_image} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <button
                        onClick={() => portraitInputRef.current?.click()}
                        className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest w-fit hover:bg-blue-700 transition-all"
                      >
                        <Upload className="w-4 h-4" /> Upload New Portrait
                      </button>
                      <input type="file" ref={portraitInputRef} className="hidden" accept="image/*" onChange={handlePortraitUpload} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Mastery Badge Text</label>
                    <DebouncedInput
                      value={data.settings.years_of_mastery || ""}
                      onDebouncedChange={(val) => patchSettings('years_of_mastery', val)}
                      className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-4 focus:border-blue-400 outline-none transition-all text-white"
                      placeholder="e.g. 10+"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 block">Biography Body</label>
                  <DebouncedInput
                    textarea
                    value={data.settings.about_text || ""}
                    onDebouncedChange={(val) => patchSettings('about_text', val)}
                    className="w-full text-xl font-light border border-white/10 bg-black/20 p-8 rounded-2xl focus:border-blue-400 outline-none leading-relaxed text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Projects' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-light text-white">Project <span className="font-extrabold text-blue-400">Matrix</span></h2>
                <button
                  onClick={async () => {
                    const newP = await createProject({
                      title: 'New Project',
                      description: 'Project Description',
                      image_url: '',
                      stack: 'React',
                      featured: false,
                      live_url: '',
                      github_url: ''
                    });
                    if (draftData) handleLocalUpdate(prev => ({ ...prev, projects: [newP, ...prev.projects] }));
                    showToast('Project Created', 'success');
                  }}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
                >
                  + Create New Entry
                </button>
              </div>
              <HeaderEditor
                pageKey="projects"
                label="Projects"
                header={data.pageHeaders.projects}
                onUpdate={(val) => patchHeader('projects', val)}
              />
              <div className="grid grid-cols-1 gap-8">
                {data.projects.map((p: any) => (
                  <ProjectEditorItem
                    key={p.id}
                    project={p}
                    onUpdate={(updated) => patchList('projects', updated)}
                    onDelete={async (id) => {
                      await updateProject({ id, delete: true });
                      if (draftData) handleLocalUpdate((prev: any) => ({ ...prev, projects: prev.projects.filter((p: any) => p.id !== id) }));
                      showToast('Project Deleted', 'success');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Certificates' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-light text-white">Verified <span className="font-extrabold text-blue-400">Expertise</span></h2>
                <button
                  onClick={async () => {
                    const newC = await createCertificate({
                      title: 'New Certificate',
                      organization: 'Organization',
                      image_url: ''
                    });
                    if (draftData) handleLocalUpdate(prev => ({ ...prev, certificates: [newC, ...prev.certificates] }));
                    showToast('Certificate Added', 'success');
                  }}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
                >
                  + Add Certificate
                </button>
              </div>
              <HeaderEditor
                pageKey="certificates"
                label="Certificates"
                header={data.pageHeaders.certificates}
                onUpdate={(val) => patchHeader('certificates', val)}
              />
              <div className="grid grid-cols-1 gap-8">
                {data.certificates.map((c: any) => (
                  <CertificateEditorItem
                    key={c.id}
                    certificate={c}
                    onUpdate={(updated) => patchList('certificates', updated)}
                    onDelete={async (id) => {
                      await updateCertificate({ id, delete: true });
                      if (draftData) handleLocalUpdate((prev: any) => ({ ...prev, certificates: prev.certificates.filter((c: any) => c.id !== id) }));
                      showToast('Certificate Deleted', 'success');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Skills' && (
            <div className="space-y-10">
              <h2 className="text-4xl font-light text-white">Tooling & <span className="font-extrabold text-blue-400">Mastery</span></h2>
              <HeaderEditor
                pageKey="skills"
                label="Skills"
                header={data.pageHeaders.skills}
                onUpdate={(val) => patchHeader('skills', val)}
              />
              <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] border border-white/10 shadow-2xl space-y-8">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Current Arsenal</label>
                  <button
                    onClick={async () => {
                      const existingNames = data.skills.map((s: any) => s.name);
                      let name = 'New Skill';
                      let counter = 1;
                      while (existingNames.includes(name)) {
                        name = `New Skill ${counter++}`;
                      }

                      const newS = await createSkill({ name });
                      if (draftData) handleLocalUpdate(prev => ({ ...prev, skills: [...prev.skills, newS] }));
                      showToast('Skill Added', 'success');
                    }}
                    className="p-2 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition-all text-gray-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.skills.map((skill: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 p-4 rounded-2xl group">
                      <DebouncedInput
                        value={skill.name}
                        onDebouncedChange={(val) => patchList('skills', { ...skill, name: val })}
                        className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-widest outline-none border-b border-transparent focus:border-blue-400 text-white"
                        aria-label="Skill name"
                      />
                      <button
                        onClick={async () => {
                          await updateSkill({ id: skill.id, delete: true });
                          if (draftData) handleLocalUpdate((prev: any) => ({ ...prev, skills: prev.skills.filter((s: any) => s.id !== skill.id) }));
                          showToast('Skill Deleted', 'success');
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all"
                        aria-label="Delete skill"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Experience' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-light text-white">Career <span className="font-extrabold text-blue-400">Timeline</span></h2>
                <button
                  onClick={async () => {
                    const newE = await createExperience({
                      year_range: '2023',
                      role: 'Role',
                      company: 'Company',
                      description: 'Description'
                    });
                    if (draftData) handleLocalUpdate(prev => ({ ...prev, experience: [newE, ...prev.experience] }));
                    showToast('Experience Added', 'success');
                  }}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
                >
                  + Add Experience
                </button>
              </div>
              <HeaderEditor
                pageKey="experience"
                label="Experience"
                header={data.pageHeaders.experience}
                onUpdate={(val) => patchHeader('experience', val)}
              />
              <div className="space-y-6">
                {data.experience.map((exp: any) => (
                  <ExperienceEditorItem
                    key={exp.id}
                    experience={exp}
                    onUpdate={(updated) => patchList('experience', updated)}
                    onDelete={async (id) => {
                      await updateExperience({ id, delete: true });
                      if (draftData) handleLocalUpdate((prev: any) => ({ ...prev, experience: prev.experience.filter((e: any) => e.id !== id) }));
                      showToast('Experience Deleted', 'success');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Contact Info' && (
            <div className="space-y-10">
              <h2 className="text-4xl font-light text-white">Global <span className="font-extrabold text-blue-400">Meta</span></h2>
              <HeaderEditor
                pageKey="contact"
                label="Contact"
                header={data.pageHeaders.contact}
                onUpdate={(val) => patchHeader('contact', val)}
              />
              <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] space-y-10 border border-white/10 shadow-2xl max-w-2xl">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Admin Email</label>
                  <DebouncedInput
                    value={data.settings.email || ""}
                    onDebouncedChange={(val) => patchSettings('email', val)}
                    className="w-full text-2xl font-bold border-b border-white/10 bg-transparent py-4 focus:border-blue-400 outline-none transition-all text-white"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">HQ Location</label>
                  <DebouncedInput
                    value={data.settings.location || ""}
                    onDebouncedChange={(val) => patchSettings('location', val)}
                    className="w-full text-2xl font-bold border-b border-white/10 bg-transparent py-4 focus:border-blue-400 outline-none transition-all text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Social Links' && (
            <div className="space-y-10">
              <h2 className="text-4xl font-light text-white">Social <span className="font-extrabold text-blue-400">Presence</span></h2>
              <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] space-y-8 border border-white/10 shadow-2xl max-w-2xl">
                {["twitter", "linkedin", "github", "instagram", "email"].map(platform => {
                  const icon =
                    platform === "twitter" ? <Twitter className="w-5 h-5" /> :
                      platform === "linkedin" ? <Linkedin className="w-5 h-5" /> :
                        platform === "github" ? <Github className="w-5 h-5" /> :
                          platform === "instagram" ? <Instagram className="w-5 h-5" /> :
                            <Mail className="w-5 h-5" />;
                  return (
                    <div key={platform} className="space-y-4">
                      <div className="flex items-center gap-4 text-gray-400">
                        {icon}
                        <label className="text-[10px] uppercase tracking-widest font-black">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)} URL
                        </label>
                      </div>
                      <DebouncedInput
                        value={data.socialLinks.find((s: any) => s.platform === platform)?.url || ""}
                        onDebouncedChange={(val) => {
                          dirtyRefs.current.socialLinks.add(platform);
                          handleLocalUpdate((prev: any) => ({ ...prev, socialLinks: prev.socialLinks.map((s: any) => s.platform === platform ? { ...s, url: val } : s) }));
                        }}
                        className="w-full text-sm font-bold border-b border-white/10 bg-transparent py-2 focus:border-blue-400 outline-none transition-all text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;