import { supabase } from '../lib/supabase.ts';

/**
 * A drop-in replacement for PortfolioDatabase that uses Supabase (PostgreSQL).
 */
export class SupabaseDatabase {
    constructor() {
        // Supabase client is already initialized in lib/supabase.ts
    }

    // Projects
    public async getAllProjects(): Promise<any[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    public async getProjectById(id: number): Promise<any> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    public async createProject(project: any): Promise<any> {
        const { data, error } = await supabase
            .from('projects')
            .insert([project])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async updateProject(id: number, project: any): Promise<any> {
        const { data, error } = await supabase
            .from('projects')
            .update({ ...project, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteProject(id: number): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Certificates
    public async getAllCertificates(): Promise<any[]> {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    public async getCertificateById(id: number): Promise<any> {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    public async createCertificate(certificate: any): Promise<any> {
        const { data, error } = await supabase
            .from('certificates')
            .insert([certificate])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async updateCertificate(id: number, certificate: any): Promise<any> {
        const { data, error } = await supabase
            .from('certificates')
            .update({ ...certificate, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteCertificate(id: number): Promise<void> {
        const { error } = await supabase
            .from('certificates')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Experience
    public async getAllExperience(): Promise<any[]> {
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    public async getExperienceById(id: number): Promise<any> {
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    public async createExperience(experience: any): Promise<any> {
        const { data, error } = await supabase
            .from('experience')
            .insert([experience])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async updateExperience(id: number, experience: any): Promise<any> {
        const { data, error } = await supabase
            .from('experience')
            .update({ ...experience, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteExperience(id: number): Promise<void> {
        const { error } = await supabase
            .from('experience')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Skills
    public async getAllSkills(): Promise<any[]> {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    }

    public async createSkill(name: string): Promise<any> {
        const { data: existing, error: findError } = await supabase
            .from('skills')
            .select('*')
            .eq('name', name)
            .maybeSingle();

        if (existing) return existing;

        const { data, error } = await supabase
            .from('skills')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async getSkillById(id: number): Promise<any> {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    public async updateSkill(id: number, name: string): Promise<any> {
        const { data, error } = await supabase
            .from('skills')
            .update({ name })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteSkill(id: number): Promise<void> {
        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Site Settings
    public async getSiteSettings(): Promise<any> {
        const { data, error } = await supabase
            .from('site_settings')
            .select('key, value');

        if (error) throw error;

        const settings: any = {};
        data?.forEach((row: { key: string; value: string }) => {
            settings[row.key] = row.value;
        });
        return settings;
    }

    public async updateSiteSetting(key: string, value: string): Promise<void> {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;
    }

    // Social Links
    public async getAllSocialLinks(): Promise<any[]> {
        const { data, error } = await supabase
            .from('social_links')
            .select('*');

        if (error) throw error;
        return data || [];
    }

    public async updateSocialLink(platform: string, url: string): Promise<void> {
        const { error } = await supabase
            .from('social_links')
            .upsert({ platform, url, updated_at: new Date().toISOString() }, { onConflict: 'platform' });

        if (error) throw error;
    }

    // Page Headers
    public async getPageHeader(pageName: string): Promise<any> {
        const { data, error } = await supabase
            .from('page_headers')
            .select('*')
            .eq('page_name', pageName)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    public async updatePageHeader(pageName: string, header: any): Promise<void> {
        const { error } = await supabase
            .from('page_headers')
            .upsert({
                page_name: pageName,
                eyebrow: header.eyebrow,
                title: header.title,
                description: header.description,
                updated_at: new Date().toISOString()
            }, { onConflict: 'page_name' });

        if (error) throw error;
    }

    // Philosophy
    public async getPhilosophy(): Promise<any[]> {
        const { data, error } = await supabase
            .from('philosophy')
            .select('*')
            .order('line_number');

        if (error) throw error;
        return data || [];
    }

    public async updatePhilosophyLine(lineNumber: number, text: string): Promise<void> {
        const { error } = await supabase
            .from('philosophy')
            .upsert({ line_number: lineNumber, text, updated_at: new Date().toISOString() }, { onConflict: 'line_number' });

        if (error) throw error;
    }

    // Animated Titles
    public async getAnimatedTitles(): Promise<any[]> {
        const { data, error } = await supabase
            .from('animated_titles')
            .select('*')
            .order('order_index');

        if (error) throw error;
        return data || [];
    }

    public async addAnimatedTitle(title: string): Promise<void> {
        // Get max order_index
        const { data, error: maxError } = await supabase
            .from('animated_titles')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1);

        const orderIndex = (data?.[0]?.order_index || 0) + 1;

        const { error } = await supabase
            .from('animated_titles')
            .insert([{ title, order_index: orderIndex }]);

        if (error) throw error;
    }

    public async updateAnimatedTitle(id: number, title: string): Promise<void> {
        const { error } = await supabase
            .from('animated_titles')
            .update({ title, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    }

    public async deleteAnimatedTitle(id: number): Promise<void> {
        const { error } = await supabase
            .from('animated_titles')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    public async close(): Promise<void> {
        // Supabase client doesn't need explicit closing like better-sqlite3
    }
}

export const db = new SupabaseDatabase();
