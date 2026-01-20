import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from '../db/supabase-database.ts';
import { login, authenticateToken } from './auth.ts';
import uploadRoutes from './uploadRoutes.ts';
import {
  ProjectSchema,
  CertificateSchema,
  ExperienceSchema,
  SkillSchema,
  SocialLinkSchema,
  PageHeaderSchema,
  LoginSchema,
  SettingsSchema,
  AnimatedTitleSchema
} from './schemas.ts';
import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

export const app = express();
const PORT: number = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), port: PORT });
});

// Auth Routes
app.post('/api/auth/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password } = LoginSchema.parse(req.body);
    const token = await login(password);

    if (token) {
      res.json({ token });
      return;
    }

    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    next(error);
  }
});

// Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Upload Routes
app.use('/api', uploadRoutes);

//
// ---------- READ ROUTES (Public) ----------
//
app.get('/api/projects', async (req, res, next) => {
  try {
    const projects = await db.getAllProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

app.get('/api/certificates', async (req, res, next) => {
  try {
    const certificates = await db.getAllCertificates();
    res.json(certificates);
  } catch (error) {
    next(error);
  }
});

app.get('/api/experience', async (req, res, next) => {
  try {
    const experience = await db.getAllExperience();
    res.json(experience);
  } catch (error) {
    next(error);
  }
});

app.get('/api/skills', async (req, res, next) => {
  try {
    const skills = await db.getAllSkills();
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

app.get('/api/settings', async (req, res, next) => {
  try {
    const settings = await db.getSiteSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.get('/api/social-links', async (req, res, next) => {
  try {
    const socialLinks = await db.getAllSocialLinks();
    res.json(socialLinks);
  } catch (error) {
    next(error);
  }
});

app.get('/api/page-headers', async (req, res, next) => {
  try {
    const headers = {
      about: await db.getPageHeader('about'),
      projects: await db.getPageHeader('projects'),
      certificates: await db.getPageHeader('certificates'),
      contact: await db.getPageHeader('contact'),
      experience: await db.getPageHeader('experience'),
      skills: await db.getPageHeader('skills')
    };
    res.json(headers);
  } catch (error) {
    next(error);
  }
});

app.get('/api/philosophy', async (req, res, next) => {
  try {
    const philosophy = await db.getPhilosophy();
    res.json(philosophy);
  } catch (error) {
    next(error);
  }
});

app.get('/api/animated-titles', async (req, res, next) => {
  try {
    const titles = await db.getAnimatedTitles();
    res.json(titles);
  } catch (error) {
    next(error);
  }
});

//
// ---------- WRITE ROUTES (Protected) ----------
//

// Settings
app.put('/api/settings/:key', authenticateToken, async (req, res, next) => {
  try {
    const key = req.params.key;
    const { value } = SettingsSchema.parse(req.body);

    // Additional validation based on key if necessary
    await db.updateSiteSetting(key, String(value));

    const updated = await db.getSiteSettings();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Projects
app.post('/api/projects', authenticateToken, async (req, res, next) => {
  try {
    const data = ProjectSchema.parse(req.body);
    const created = await db.createProject(data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = ProjectSchema.parse(req.body);
    const updated = await db.updateProject(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.deleteProject(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Certificates
app.post('/api/certificates', authenticateToken, async (req, res, next) => {
  try {
    const data = CertificateSchema.parse(req.body);
    const created = await db.createCertificate(data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

app.put('/api/certificates/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = CertificateSchema.parse(req.body);
    const updated = await db.updateCertificate(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/certificates/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.deleteCertificate(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Experience
app.post('/api/experience', authenticateToken, async (req, res, next) => {
  try {
    const data = ExperienceSchema.parse(req.body);
    const created = await db.createExperience(data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

app.put('/api/experience/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = ExperienceSchema.parse(req.body);
    const updated = await db.updateExperience(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/experience/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.deleteExperience(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Skills
app.post('/api/skills', authenticateToken, async (req, res, next) => {
  try {
    const data = SkillSchema.parse(req.body);
    const created = await db.createSkill(data.name);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

app.put('/api/skills/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = SkillSchema.parse(req.body);
    const updated = await db.updateSkill(id, data.name);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/skills/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.deleteSkill(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Social links
app.put('/api/social-links/:platform', authenticateToken, async (req, res, next) => {
  try {
    const platform = req.params.platform;
    const { url } = SocialLinkSchema.parse(req.body);
    await db.updateSocialLink(platform, url);
    const socialLinks = await db.getAllSocialLinks();
    res.json(socialLinks);
  } catch (error) {
    next(error);
  }
});

// Page headers
app.put('/api/page-headers/:pageName', authenticateToken, async (req, res, next) => {
  try {
    const pageName = req.params.pageName;
    const data = PageHeaderSchema.parse(req.body);
    await db.updatePageHeader(pageName, data);
    const updated = await db.getPageHeader(pageName);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Philosophy
app.put('/api/philosophy/:lineNumber', authenticateToken, async (req, res, next) => {
  try {
    const lineNumber = Number(req.params.lineNumber);
    const { text } = z.object({ text: z.string().min(1) }).parse(req.body);
    await db.updatePhilosophyLine(lineNumber, text);
    const updated = await db.getPhilosophy();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Animated titles
app.post('/api/animated-titles', authenticateToken, async (req, res, next) => {
  try {
    const { title } = AnimatedTitleSchema.parse(req.body);
    await db.addAnimatedTitle(title);
    const titles = await db.getAnimatedTitles();
    res.status(201).json(titles);
  } catch (error) {
    next(error);
  }
});

app.put('/api/animated-titles/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title } = AnimatedTitleSchema.parse(req.body);
    await db.updateAnimatedTitle(id, title);
    const titles = await db.getAnimatedTitles();
    res.json(titles);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/animated-titles/:id', authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.deleteAnimatedTitle(id);
    const titles = await db.getAnimatedTitles();
    res.json(titles);
  } catch (error) {
    next(error);
  }
});

//
// ---------- SSE Updates (Legacy - Preferred: Supabase Realtime) ----------
//
app.get('/api/updates', async (req, res) => {
  // NOTE: This route is now primarily used for local development if needed.
  // The frontend has switched to Supabase Realtime for better production stability.
  // SSE doesn't support headers easily for auth, usually done via cookie or query param.
  // We'll keep it public for now as it's just reading data.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  const sendInitialData = async () => {
    try {
      const data = {
        type: 'initial',
        data: {
          projects: await db.getAllProjects(),
          certificates: await db.getAllCertificates(),
          experience: await db.getAllExperience(),
          skills: await db.getAllSkills(),
          settings: await db.getSiteSettings(),
          socialLinks: await db.getAllSocialLinks(),
          pageHeaders: {
            about: await db.getPageHeader('about'),
            projects: await db.getPageHeader('projects'),
            certificates: await db.getPageHeader('certificates'),
            contact: await db.getPageHeader('contact'),
            experience: await db.getPageHeader('experience'),
            skills: await db.getPageHeader('skills')
          },
          philosophy: await db.getPhilosophy(),
          animatedTitles: await db.getAnimatedTitles()
        }
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to load initial data' })}\n\n`);
    }
  };

  await sendInitialData();

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`);
  }, 30000);

  req.on('close', () => clearInterval(interval));
});


//
// ---------- Error Handling Middleware ----------
//
// Contact form submission
app.post('/api/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const settings = await db.getSiteSettings();
    const adminEmail = process.env.ADMIN_EMAIL || settings.email || 'admin@portfolio.com';


    // Send email
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // Recommended to use SMTP user as from to avoid spam filters
      replyTo: email,
      to: adminEmail,
      subject: `Portfolio Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">New Message from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    // Also keep local log if not in production
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    if (!isProd) {
      const logEntry = `[${new Date().toISOString()}] EMAIL SENT FROM: ${name} (${email}) TO: ${adminEmail}\n`;
      fs.appendFileSync(path.join(process.cwd(), 'messages.log'), logEntry);
    }

    console.log(`Email successfully sent from ${name} to ${adminEmail}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Email Error:', error);
    // Log failures too
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    if (!isProd) {
      fs.appendFileSync(path.join(process.cwd(), 'messages.log'), `[${new Date().toISOString()}] EMAIL FAILED: ${error}\n`);
    }
    next(error);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    console.error('❌ Validation Error details:', JSON.stringify(err.issues, null, 2));
    res.status(400).json({ error: 'Validation Error', details: err.issues });
    return;
  }

  console.error(err); // Log full error
  const message = err.message || 'Something went wrong!';
  res.status(500).json({ error: message, details: err });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//
// ---------- Start Server ----------
//
// Only listen if this file is the main module (not imported for testing)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
  });
}

export default app;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.close();
  process.exit(0);
});