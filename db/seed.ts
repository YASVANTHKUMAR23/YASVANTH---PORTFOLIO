import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'portfolio.db');

export class DatabaseSeeder {
  private db: DatabaseType;

  constructor(dbPath: string = DB_PATH) {
    this.db = new Database(dbPath);
  }

  public seedData(): void {
    console.log('Seeding database with initial data...');

    // Clear existing data (except migrations)
    this.clearData();

    // Insert sample projects
    this.seedProjects();

    // Insert sample certificates
    this.seedCertificates();

    // Insert sample experience
    this.seedExperience();

    // Insert sample skills
    this.seedSkills();
    this.seedMeta();
    console.log('Database seeding completed!');
  }

  private clearData(): void {
    // Don't clear migrations table
    const tablesToClear = [
      'projects', 'certificates', 'experience',
      'skills', 'social_links', 'page_headers',
      'philosophy', 'animated_titles', 'site_settings'
    ];

    for (const table of tablesToClear) {
      try {
        this.db.exec(`DELETE FROM ${table}`);
        if (table !== 'site_settings') {
          this.db.exec(`DELETE FROM sqlite_sequence WHERE name='${table}'`);
        }
      } catch (error) {
        console.warn(`Could not clear table ${table}:`, error);
      }
    }
  }
  private seedMeta(): void {
  // Site settings
  const settings = [
    ['hero_title', "I'm a Full Stack"],
    ['hero_subtitle', "DEVELOPER • ENGINEER • AI BUILDER"],
    ['about_text', "I am a digital architect obsessed with performance and minimalist aesthetics."],
    ['about_image', "https://picsum.photos/id/64/800/1200?grayscale"],
    ['years_of_mastery', "8+"],
    ['resume_url', "#"],
    ['email', "hello@yasvanth.dev"],
    ['location', "Srirangam, TN"]
  ];
  const settingsStmt = this.db.prepare(`INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)`);
  for (const [key, value] of settings) settingsStmt.run(key, value);

  // Social links
  const socials = [
    ['twitter', 'https://twitter.com/yasvanth'],
    ['linkedin', 'https://linkedin.com/in/yasvanth'],
    ['github', 'https://github.com/yasvanth'],
    ['instagram', 'https://instagram.com/yasvanth'],
    ['email', 'mailto:hello@yasvanth.dev']
  ];
  const socialStmt = this.db.prepare(`INSERT OR IGNORE INTO social_links (platform, url) VALUES (?, ?)`);
  for (const [platform, url] of socials) socialStmt.run(platform, url);

  // Page headers
  const headers = [
    ['about', 'Personal Narrative', 'Engineering Excellence Since 2018', 'I am a digital architect obsessed with performance and minimalist aesthetics.'],
    ['projects', 'Archive', 'Digital Artifacts', 'A comprehensive overview of engineering challenges tackled and elegance achieved.'],
    ['certificates', 'Validation', 'Verified Expertise', 'A verified list of professional credentials and academic milestones.'],
    ['contact', 'Get in touch', 'Contact Me', 'Whether you have a question, a project idea, or just want to say hi, my inbox is always open.'],
    ['experience', 'Career Journey', 'Professional Milestones', 'A timeline of technical leadership and product engineering.'],
    ['skills', 'Tooling & Mastery', 'Current Arsenal', 'A breakdown of the technologies I use to build the future.']
  ];
  const headerStmt = this.db.prepare(`
    INSERT OR REPLACE INTO page_headers (page_name, eyebrow, title, description)
    VALUES (?, ?, ?, ?)
  `);
  for (const [page_name, eyebrow, title, description] of headers) {
    headerStmt.run(page_name, eyebrow, title, description);
  }

  // Philosophy lines
  const philosophy = [
    [1, 'I am a'],
    [2, 'digital'],
    [3, 'architect'],
    [4, 'obsessed'],
    [5, 'with'],
    [6, 'performance'],
    [7, 'aesthetics.']
  ];
  const philosophyStmt = this.db.prepare(`INSERT OR IGNORE INTO philosophy (line_number, text) VALUES (?, ?)`);
  for (const [line_number, text] of philosophy) philosophyStmt.run(line_number, text);

  // Animated titles
  const titles = [
    ['Developer', 1],
    ['Engineer', 2],
    ['Architect', 3],
    ['Builder', 4]
  ];
  const titleStmt = this.db.prepare(`INSERT OR IGNORE INTO animated_titles (title, order_index) VALUES (?, ?)`);
  for (const [title, order_index] of titles) titleStmt.run(title, order_index);

  console.log('✓ Seeded site settings, social links, headers, philosophy, and animated titles');
}
  private seedProjects(): void {
    const projects = [
      {
        title: "AI Vision Analytics",
        description: "Real-time safety monitoring using computer vision and edge computing.",
        image_url: "https://picsum.photos/id/101/1200/800?grayscale",
        stack: "React,Python,OpenCV",
        featured: true,
        live_url: "#",
        github_url: "#"
      },
      {
        title: "EcoSphere",
        description: "Sustainability tracking platform for enterprise-level carbon footprint monitoring.",
        image_url: "https://picsum.photos/id/102/1200/800?grayscale",
        stack: "Next.js,D3.js,PostgreSQL",
        featured: true,
        live_url: "#",
        github_url: "#"
      },
      {
        title: "CryptoVault",
        description: "High-security decentralized wallet with multi-sig capabilities.",
        image_url: "https://picsum.photos/id/103/600/600?grayscale",
        stack: "Web3,Solidity,React",
        featured: false,
        live_url: "#",
        github_url: "#"
      }
    ];

    const stmt = this.db.prepare(`
      INSERT INTO projects (title, description, image_url, stack, featured, live_url, github_url)
      VALUES (@title, @description, @image_url, @stack, @featured, @live_url, @github_url)
    `);

    for (const project of projects) {
      stmt.run({
        title: project.title,
        description: project.description,
        image_url: project.image_url,
        stack: project.stack,
        featured: project.featured ? 1 : 0,
        live_url: project.live_url,
        github_url: project.github_url
      });
    }

    console.log(`✓ Seeded ${projects.length} projects`);
  }

  private seedCertificates(): void {
    const certificates = [
      {
        title: 'AWS Solutions Architect',
        organization: 'Amazon Web Services',
        image_url: 'https://picsum.photos/id/101/1200/800?grayscale'
      },
      {
        title: 'Professional Data Engineer',
        organization: 'Google Cloud',
        image_url: 'https://picsum.photos/id/102/1200/800?grayscale'
      }
    ];

    const stmt = this.db.prepare(`
      INSERT INTO certificates (title, organization, image_url)
      VALUES (@title, @organization, @image_url)
    `);

    for (const cert of certificates) {
      stmt.run({
        title: cert.title,
        organization: cert.organization,
        image_url: cert.image_url
      });
    }

    console.log(`✓ Seeded ${certificates.length} certificates`);
  }

  private seedExperience(): void {
    const experiences = [
      {
        year_range: '2022 — Present',
        role: 'Senior Lead Developer',
        company: 'TechFlow Global',
        description: 'Heading AI implementation and scalable cloud architecture for Fortune 500 clients.'
      },
      {
        year_range: '2020 — 2022',
        role: 'Full Stack Engineer',
        company: 'Nexus Systems',
        description: 'Developed high-performance distributed systems using Go and React.'
      },
      {
        year_range: '2018 — 2020',
        role: 'Frontend Architect',
        company: 'Pixel Studio',
        description: 'Pioneered creative web experiences and design systems for global brands.'
      }
    ];

    const stmt = this.db.prepare(`
      INSERT INTO experience (year_range, role, company, description)
      VALUES (@year_range, @role, @company, @description)
    `);

    for (const exp of experiences) {
      stmt.run({
        year_range: exp.year_range,
        role: exp.role,
        company: exp.company,
        description: exp.description
      });
    }

    console.log(`✓ Seeded ${experiences.length} experience entries`);
  }

  private seedSkills(): void {
    const skills = [
      'React', 'TypeScript', 'Node.js', 'Go', 'AWS',
      'TensorFlow', 'PostgreSQL', 'Docker', 'GraphQL',
      'Python', 'Tailwind', 'Next.js'
    ];

    const stmt = this.db.prepare(`
      INSERT INTO skills (name)
      VALUES (@name)
    `);

    for (const skill of skills) {
      stmt.run({ name: skill });
    }

    console.log(`✓ Seeded ${skills.length} skills`);
  }

  public close(): void {
    this.db.close();
  }
}

// Run seeder if this file is executed directly
const seeder = new DatabaseSeeder();
seeder.seedData();
seeder.close();

