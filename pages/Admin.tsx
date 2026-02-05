import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { PortfolioData, Project, BlogPost, Certificate, ContactInfo, Experience, Stat } from '../types';
import { Button, Input, TextArea, Card, SectionTitle, Toast } from '../components/Components';
import { Trash2, Plus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Login Page ---
export const Login = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin') { // Hardcoded for demo
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Restricted Access</h2>
          <p className="text-slate-400 text-sm">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Password" 
            type="password" 
            value={pass} 
            onChange={e => setPass(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-red-400 text-sm">Invalid password.</p>}
          <Button type="submit" className="w-full">Access Dashboard</Button>
        </form>
      </Card>
    </div>
  );
};

// --- Shared Hook for Data ---
const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const d = await db.get();
    setData(d);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async (newData: PortfolioData) => {
    setLoading(true);
    await db.update(newData);
    setData(newData);
    setLoading(false);
  };

  return { data, setData, save, loading };
};

// --- Admin Dashboard Home ---
export const AdminDashboard = () => {
  return (
    <div>
      <SectionTitle>Dashboard Overview</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-slate-400 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-white mt-2">3</p>
        </Card>
        <Card>
          <h3 className="text-slate-400 text-sm font-medium">Blog Posts</h3>
          <p className="text-3xl font-bold text-white mt-2">2</p>
        </Card>
        <Card>
          <h3 className="text-slate-400 text-sm font-medium">Certificates</h3>
          <p className="text-3xl font-bold text-white mt-2">2</p>
        </Card>
      </div>
      <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300">
        Welcome back, Admin. Select a section from the sidebar to start editing your portfolio content.
      </div>
    </div>
  );
};

// --- Editor: About & Hero ---
export const AdminAbout = () => {
  const { data, save, loading } = usePortfolioData();
  const [heroForm, setHeroForm] = useState(data?.hero);
  const [aboutForm, setAboutForm] = useState(data?.about);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (data) {
      setHeroForm(data.hero);
      setAboutForm(data.about);
    }
  }, [data]);

  if (!data || !heroForm || !aboutForm) return <div>Loading...</div>;

  const handleSave = async () => {
    await save({ ...data, hero: heroForm, about: aboutForm });
    setNotification({ message: 'Changes saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-8 relative">
      {notification && (
        <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-xl font-bold text-white">Hero & About</h2>
        <Button onClick={handleSave} loading={loading}>
          <Save size={18} className="mr-2"/> Save Changes
        </Button>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-white mb-6">Hero Section</h3>
        <div className="grid gap-6">
          <Input label="Title" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} />
          <Input label="Subtitle" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} />
          <Input label="Image URL" value={heroForm.imageUrl} onChange={e => setHeroForm({...heroForm, imageUrl: e.target.value})} />
          <Input label="CTA Text" value={heroForm.ctaText} onChange={e => setHeroForm({...heroForm, ctaText: e.target.value})} />
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-white mb-6">About Section</h3>
        <TextArea label="Bio" value={aboutForm.bio} onChange={e => setAboutForm({...aboutForm, bio: e.target.value})} />
        <Input 
          label="Skills (comma separated) - Used in Home Marquee" 
          value={aboutForm.skills.join(', ')} 
          onChange={e => setAboutForm({...aboutForm, skills: e.target.value.split(',').map(s => s.trim())})} 
        />
      </Card>
    </div>
  );
};

// --- Editor: Experience & Stats ---
export const AdminExperience = () => {
  const { data, save, loading } = usePortfolioData();
  const [expList, setExpList] = useState<Experience[]>([]);
  const [statsList, setStatsList] = useState<Stat[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => { 
    if (data) {
      setExpList(data.experience || []);
      setStatsList(data.stats || []);
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;

  const handleSave = async () => {
    await save({...data, experience: expList, stats: statsList});
    setNotification({ message: 'Experience & Stats saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  // Experience Handlers
  const handleUpdateExp = (index: number, field: keyof Experience, value: any) => {
    const updated = [...expList];
    updated[index] = { ...updated[index], [field]: value };
    setExpList(updated);
  };

  const addExp = () => {
    setExpList([...expList, {
      id: Date.now().toString(),
      role: 'New Role',
      company: 'Company Name',
      year: '2023 - Present',
      description: 'Description of responsibilities.'
    }]);
  };

  const removeExp = (index: number) => {
    setExpList(expList.filter((_, i) => i !== index));
  };

  // Stats Handlers
  const handleUpdateStat = (index: number, field: keyof Stat, value: any) => {
    const updated = [...statsList];
    updated[index] = { ...updated[index], [field]: value };
    setStatsList(updated);
  };

  const addStat = () => {
    setStatsList([...statsList, {
      id: Date.now().toString(),
      label: 'New Stat',
      value: '0+'
    }]);
  };

  const removeStat = (index: number) => {
    setStatsList(statsList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 relative">
       {notification && (
        <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-xl font-bold text-white">Experience & Stats</h2>
        <Button onClick={handleSave} loading={loading}><Save size={18} className="mr-2"/> Save Changes</Button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Experience Timeline</h3>
          <Button variant="secondary" onClick={addExp} size="sm"><Plus size={16} className="mr-2"/> Add Role</Button>
        </div>
        {expList.map((exp, index) => (
          <Card key={exp.id} className="relative">
             <button onClick={() => removeExp(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
              <Trash2 size={20} />
            </button>
            <h4 className="font-bold text-lg mb-4 text-indigo-300">Role #{index + 1}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Role" value={exp.role} onChange={e => handleUpdateExp(index, 'role', e.target.value)} />
              <Input label="Company" value={exp.company} onChange={e => handleUpdateExp(index, 'company', e.target.value)} />
              <Input className="md:col-span-2" label="Duration" value={exp.year} onChange={e => handleUpdateExp(index, 'year', e.target.value)} />
              <TextArea className="md:col-span-2" label="Description" value={exp.description} onChange={e => handleUpdateExp(index, 'description', e.target.value)} />
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6 pt-8 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Key Statistics</h3>
          <Button variant="secondary" onClick={addStat} size="sm"><Plus size={16} className="mr-2"/> Add Stat</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {statsList.map((stat, index) => (
            <Card key={stat.id} className="relative">
               <button onClick={() => removeStat(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
              <Input label="Label" value={stat.label} onChange={e => handleUpdateStat(index, 'label', e.target.value)} />
              <Input label="Value" value={stat.value} onChange={e => handleUpdateStat(index, 'value', e.target.value)} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Editor: Projects ---
export const AdminProjects = () => {
  const { data, save, loading } = usePortfolioData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => { if (data) setProjects(data.projects); }, [data]);

  if (!data) return <div>Loading...</div>;

  const handleSave = async () => {
    await save({...data, projects});
    setNotification({ message: 'Projects saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleTechStack = (index: number, val: string) => {
      const updated = [...projects];
      updated[index].techStack = val.split(',').map(s => s.trim());
      setProjects(updated);
  }

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now().toString(),
      title: 'New Project',
      description: '',
      techStack: [],
      imageUrl: '',
      demoUrl: '',
      repoUrl: ''
    }]);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  return (
    <div className="space-y-6 relative">
       {notification && (
        <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-xl font-bold text-white">Manage Projects</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addProject}><Plus size={18} className="mr-2"/> Add Project</Button>
          <Button onClick={handleSave} loading={loading}><Save size={18} className="mr-2"/> Save</Button>
        </div>
      </div>

      {projects.map((project, index) => (
        <Card key={project.id} className="relative">
          <button onClick={() => removeProject(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
            <Trash2 size={20} />
          </button>
          <h4 className="font-bold text-lg mb-4 text-indigo-300">Project #{index + 1}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Title" value={project.title} onChange={e => handleUpdate(index, 'title', e.target.value)} />
            <Input label="Image URL" value={project.imageUrl} onChange={e => handleUpdate(index, 'imageUrl', e.target.value)} />
            <TextArea className="md:col-span-2" label="Description" value={project.description} onChange={e => handleUpdate(index, 'description', e.target.value)} />
            <Input className="md:col-span-2" label="Tech Stack (comma separated)" value={project.techStack.join(', ')} onChange={e => handleTechStack(index, e.target.value)} />
            <Input label="Demo URL" value={project.demoUrl} onChange={e => handleUpdate(index, 'demoUrl', e.target.value)} />
            <Input label="Repo URL" value={project.repoUrl} onChange={e => handleUpdate(index, 'repoUrl', e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- Editor: Certificates ---
export const AdminCertificates = () => {
  const { data, save, loading } = usePortfolioData();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => { if (data) setCerts(data.certificates); }, [data]);

  if (!data) return <div>Loading...</div>;

  const handleSave = async () => {
    await save({...data, certificates: certs});
    setNotification({ message: 'Certificates saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = (index: number, field: keyof Certificate, value: any) => {
    const updated = [...certs];
    updated[index] = { ...updated[index], [field]: value };
    setCerts(updated);
  };

  const addCert = () => {
    setCerts([...certs, {
      id: Date.now().toString(),
      title: 'New Certificate',
      issuer: '',
      date: '',
      url: ''
    }]);
  };

  const removeCert = (index: number) => {
    const updated = certs.filter((_, i) => i !== index);
    setCerts(updated);
  };

  return (
    <div className="space-y-6 relative">
      {notification && (
        <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-xl font-bold text-white">Manage Certificates</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addCert}><Plus size={18} className="mr-2"/> Add Cert</Button>
          <Button onClick={handleSave} loading={loading}><Save size={18} className="mr-2"/> Save</Button>
        </div>
      </div>

      {certs.map((cert, index) => (
        <Card key={cert.id} className="relative">
          <button onClick={() => removeCert(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
            <Trash2 size={20} />
          </button>
          <h4 className="font-bold text-lg mb-4 text-indigo-300">Certificate #{index + 1}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Title" value={cert.title} onChange={e => handleUpdate(index, 'title', e.target.value)} />
            <Input label="Issuer" value={cert.issuer} onChange={e => handleUpdate(index, 'issuer', e.target.value)} />
            <Input label="Date" value={cert.date} onChange={e => handleUpdate(index, 'date', e.target.value)} />
            <Input label="URL" value={cert.url} onChange={e => handleUpdate(index, 'url', e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- Editor: Blog ---
export const AdminBlog = () => {
  const { data, save, loading } = usePortfolioData();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => { if (data) setBlogs(data.blogs); }, [data]);

  if (!data) return <div>Loading...</div>;

  const handleSave = async () => {
    await save({...data, blogs});
    setNotification({ message: 'Blog posts saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = (index: number, field: keyof BlogPost, value: any) => {
    const updated = [...blogs];
    updated[index] = { ...updated[index], [field]: value };
    setBlogs(updated);
  };

  const addPost = () => {
    setBlogs([...blogs, {
      id: Date.now().toString(),
      title: 'New Post',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read'
    }]);
  };

  const removePost = (index: number) => {
    const updated = blogs.filter((_, i) => i !== index);
    setBlogs(updated);
  };

  return (
    <div className="space-y-6 relative">
      {notification && (
        <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-xl font-bold text-white">Manage Blog</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addPost}><Plus size={18} className="mr-2"/> Add Post</Button>
          <Button onClick={handleSave} loading={loading}><Save size={18} className="mr-2"/> Save</Button>
        </div>
      </div>

      {blogs.map((post, index) => (
        <Card key={post.id} className="relative">
          <button onClick={() => removePost(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
            <Trash2 size={20} />
          </button>
          <h4 className="font-bold text-lg mb-4 text-indigo-300">Post #{index + 1}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Input className="md:col-span-2" label="Title" value={post.title} onChange={e => handleUpdate(index, 'title', e.target.value)} />
            <Input label="Date" value={post.date} onChange={e => handleUpdate(index, 'date', e.target.value)} />
            <Input label="Read Time" value={post.readTime} onChange={e => handleUpdate(index, 'readTime', e.target.value)} />
            <TextArea className="md:col-span-2" label="Excerpt" value={post.excerpt} onChange={e => handleUpdate(index, 'excerpt', e.target.value)} />
            <TextArea className="md:col-span-2 min-h-[200px]" label="Content" value={post.content} onChange={e => handleUpdate(index, 'content', e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- Editor: Contact ---
export const AdminContact = () => {
  const { data, save, loading } = usePortfolioData();
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => { if (data) setContact(data.contact); }, [data]);

  if (!data || !contact) return <div>Loading...</div>;

  const handleSave = async () => {
    await save({...data, contact});
    setNotification({ message: 'Contact info saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {notification && (
        <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-0 z-40">
        <h2 className="text-xl font-bold text-white">Contact Info</h2>
        <Button onClick={handleSave} loading={loading}><Save size={18} className="mr-2"/> Save</Button>
      </div>

      <Card>
        <div className="grid gap-4">
          <Input label="Email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
          <Input label="GitHub" value={contact.github} onChange={e => setContact({...contact, github: e.target.value})} />
          <Input label="LinkedIn" value={contact.linkedin} onChange={e => setContact({...contact, linkedin: e.target.value})} />
          <Input label="Twitter" value={contact.twitter} onChange={e => setContact({...contact, twitter: e.target.value})} />
        </div>
      </Card>
    </div>
  );
};