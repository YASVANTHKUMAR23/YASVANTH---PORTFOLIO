import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'portfolio.db');

export class PortfolioDatabase {
  private db: DatabaseType;

  constructor(dbPath: string = DB_PATH) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
  }

  private sanitizeInput(data: any): any {
    const sanitized = { ...data };
    for (const key in sanitized) {
      if (sanitized[key] === undefined) {
        sanitized[key] = null;
      } else if (typeof sanitized[key] === 'boolean') {
        sanitized[key] = sanitized[key] ? 1 : 0;
      }
    }
    return sanitized;
  }

  // Projects
  public getAllProjects(): any[] {
    return this.db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  }

  public getProjectById(id: number): any {
    return this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  }

  public createProject(project: any): any {
    const sanitized = this.sanitizeInput(project);
    const stmt = this.db.prepare(`
      INSERT INTO projects
      (title, description, image_url, stack, featured, live_url, github_url)
      VALUES (@title, @description, @image_url, @stack, @featured, @live_url, @github_url)
    `);
    const result = stmt.run(sanitized);
    return this.getProjectById(Number(result.lastInsertRowid));
  }

  public updateProject(id: number, project: any): any {
    const sanitized = this.sanitizeInput({ ...project, id });
    const stmt = this.db.prepare(`
      UPDATE projects SET
        title = @title,
        description = @description,
        image_url = @image_url,
        stack = @stack,
        featured = @featured,
        live_url = @live_url,
        github_url = @github_url,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    stmt.run(sanitized);
    return this.getProjectById(id);
  }

  public deleteProject(id: number): void {
    this.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  }

  // Certificates
  public getAllCertificates(): any[] {
    return this.db.prepare('SELECT * FROM certificates ORDER BY created_at DESC').all();
  }

  public getCertificateById(id: number): any {
    return this.db.prepare('SELECT * FROM certificates WHERE id = ?').get(id);
  }

  public createCertificate(certificate: any): any {
    const sanitized = this.sanitizeInput(certificate);
    const stmt = this.db.prepare(`
      INSERT INTO certificates (title, organization, image_url)
      VALUES (@title, @organization, @image_url)
    `);
    const result = stmt.run(sanitized);
    return this.getCertificateById(Number(result.lastInsertRowid));
  }

  public updateCertificate(id: number, certificate: any): any {
    const sanitized = this.sanitizeInput({ ...certificate, id });
    const stmt = this.db.prepare(`
      UPDATE certificates SET
        title = @title,
        organization = @organization,
        image_url = @image_url,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    stmt.run(sanitized);
    return this.getCertificateById(id);
  }

  public deleteCertificate(id: number): void {
    this.db.prepare('DELETE FROM certificates WHERE id = ?').run(id);
  }

  // Experience
  public getAllExperience(): any[] {
    return this.db.prepare('SELECT * FROM experience ORDER BY created_at DESC').all();
  }

  public getExperienceById(id: number): any {
    return this.db.prepare('SELECT * FROM experience WHERE id = ?').get(id);
  }

  public createExperience(experience: any): any {
    const sanitized = this.sanitizeInput(experience);
    const stmt = this.db.prepare(`
      INSERT INTO experience (year_range, role, company, description)
      VALUES (@year_range, @role, @company, @description)
    `);
    const result = stmt.run(sanitized);
    return this.getExperienceById(Number(result.lastInsertRowid));
  }

  public updateExperience(id: number, experience: any): any {
    const sanitized = this.sanitizeInput({ ...experience, id });
    const stmt = this.db.prepare(`
      UPDATE experience SET
        year_range = @year_range,
        role = @role,
        company = @company,
        description = @description,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    stmt.run(sanitized);
    return this.getExperienceById(id);
  }

  public deleteExperience(id: number): void {
    this.db.prepare('DELETE FROM experience WHERE id = ?').run(id);
  }

  // Skills
  public getAllSkills(): any[] {
    return this.db.prepare('SELECT * FROM skills ORDER BY name').all();
  }

  public createSkill(name: string): any {
    const sanitized = this.sanitizeInput({ name });
    const existing = this.db.prepare('SELECT * FROM skills WHERE name = ?').get(name);
    if (existing) return existing;

    const stmt = this.db.prepare('INSERT INTO skills (name) VALUES (@name)');
    const result = stmt.run(sanitized);
    return this.getSkillById(Number(result.lastInsertRowid));
  }

  public getSkillById(id: number): any {
    return this.db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
  }

  public updateSkill(id: number, name: string): any {
    const sanitized = this.sanitizeInput({ id, name });
    const stmt = this.db.prepare('UPDATE skills SET name = @name WHERE id = @id');
    stmt.run(sanitized);
    return this.getSkillById(id);
  }

  public deleteSkill(id: number): void {
    this.db.prepare('DELETE FROM skills WHERE id = ?').run(id);
  }

  // Site Settings
  public getSiteSettings(): any {
    const settings: any = {};
    const rows = this.db.prepare('SELECT key, value FROM site_settings').all();
    rows.forEach((row: { key: string; value: string }) => {
      settings[row.key] = row.value;
    });
    return settings;
  }

  public updateSiteSetting(key: string, value: string): void {
    const sanitized = this.sanitizeInput({ key, value });
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO site_settings (key, value, updated_at)
      VALUES (@key, @value, CURRENT_TIMESTAMP)
    `);
    stmt.run(sanitized);
  }

  // Social Links
  public getAllSocialLinks(): any[] {
    return this.db.prepare('SELECT * FROM social_links').all();
  }

  public updateSocialLink(platform: string, url: string): void {
    const sanitized = this.sanitizeInput({ platform, url });
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO social_links (platform, url, updated_at)
      VALUES (@platform, @url, CURRENT_TIMESTAMP)
    `);
    stmt.run(sanitized);
  }

  // Page Headers
  public getPageHeader(pageName: string): any {
    return this.db.prepare('SELECT * FROM page_headers WHERE page_name = ?').get(pageName);
  }

  public updatePageHeader(pageName: string, header: any): void {
    const sanitized = this.sanitizeInput({
      pageName,
      eyebrow: header.eyebrow,
      title: header.title,
      description: header.description
    });
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO page_headers
      (page_name, eyebrow, title, description, updated_at)
      VALUES (@pageName, @eyebrow, @title, @description, CURRENT_TIMESTAMP)
    `);
    stmt.run(sanitized);
  }

  // Philosophy
  public getPhilosophy(): any[] {
    return this.db.prepare('SELECT * FROM philosophy ORDER BY line_number').all();
  }

  public updatePhilosophyLine(lineNumber: number, text: string): void {
    const sanitized = this.sanitizeInput({ lineNumber, text });
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO philosophy (line_number, text, updated_at)
      VALUES (@lineNumber, @text, CURRENT_TIMESTAMP)
    `);
    stmt.run(sanitized);
  }

  // Animated Titles
  public getAnimatedTitles(): any[] {
    return this.db.prepare('SELECT * FROM animated_titles ORDER BY order_index').all();
  }

  public addAnimatedTitle(title: string): void {
    const maxOrder = this.db.prepare('SELECT MAX(order_index) as maxOrder FROM animated_titles').get() as { maxOrder: number | null };
    const orderIndex = (maxOrder?.maxOrder ?? 0) + 1;
    const sanitized = this.sanitizeInput({ title, orderIndex });
    const stmt = this.db.prepare('INSERT INTO animated_titles (title, order_index) VALUES (@title, @orderIndex)');
    stmt.run(sanitized);
  }

  public updateAnimatedTitle(id: number, title: string): void {
    const sanitized = this.sanitizeInput({ id, title });
    const stmt = this.db.prepare('UPDATE animated_titles SET title = @title WHERE id = @id');
    stmt.run(sanitized);
  }

  public deleteAnimatedTitle(id: number): void {
    this.db.prepare('DELETE FROM animated_titles WHERE id = ?').run(id);
  }

  public close(): void {
    this.db.close();
  }
}

export const db = new PortfolioDatabase();