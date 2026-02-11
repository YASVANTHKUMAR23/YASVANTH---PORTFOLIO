-- Portfolio CMS Database Schema
-- Supabase Migration Script

-- 1. Hero Section Table
CREATE TABLE IF NOT EXISTS hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  tagline TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(500),
  background_image_url TEXT,
  profile_image_url TEXT,
  social_links JSONB, -- {github, linkedin, twitter, etc.}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_hero ON hero (is_active) WHERE is_active = true;

-- 2. About Section Table
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  skills JSONB, -- [{name, level, icon}]
  experience JSONB, -- [{company, role, duration, description}]
  education JSONB, -- [{institution, degree, year}]
  resume_url TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_about ON about (is_active) WHERE is_active = true;

-- 3. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  certificate_image_url TEXT,
  description TEXT,
  skills JSONB, -- [skill1, skill2, ...]
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_published ON certificates (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_certificates_featured ON certificates (is_featured);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  thumbnail_url TEXT,
  images JSONB, -- [url1, url2, ...]
  demo_url TEXT,
  github_url TEXT,
  technologies JSONB, -- [tech1, tech2, ...]
  category VARCHAR(100), -- web, mobile, ml, etc.
  status VARCHAR(50) DEFAULT 'completed', -- completed, in-progress, archived
  start_date DATE,
  end_date DATE,
  certificate_ids JSONB, -- [uuid1, uuid2, ...] - Related certificates
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);

-- 5. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown or HTML
  featured_image_url TEXT,
  author_name VARCHAR(255) DEFAULT 'Yasvanthkumar',
  category VARCHAR(100),
  tags JSONB, -- [tag1, tag2, ...]
  reading_time INTEGER, -- in minutes
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs (is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs (category);

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new', -- new, read, replied, archived
  ip_address INET,
  user_agent TEXT,
  is_spam BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact (email);

-- 7. Stats Table
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- admin, editor
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can view active hero') THEN
    CREATE POLICY "Public can view active hero" ON hero FOR SELECT USING (is_active = true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can view active about') THEN
    CREATE POLICY "Public can view active about" ON about FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can view published certificates') THEN
    CREATE POLICY "Public can view published certificates" ON certificates FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can view published projects') THEN
    CREATE POLICY "Public can view published projects" ON projects FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can view published blogs') THEN
    CREATE POLICY "Public can view published blogs" ON blogs FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Anyone can submit contact form') THEN
    CREATE POLICY "Anyone can submit contact form" ON contact FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Admin full access (requires authentication)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Authenticated admins full access hero') THEN
    CREATE POLICY "Authenticated admins full access hero" ON hero FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Authenticated admins full access about') THEN
    CREATE POLICY "Authenticated admins full access about" ON about FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Authenticated admins full access certificates') THEN
    CREATE POLICY "Authenticated admins full access certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Authenticated admins full access projects') THEN
    CREATE POLICY "Authenticated admins full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Authenticated admins full access blogs') THEN
    CREATE POLICY "Authenticated admins full access blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Authenticated admins full access contact') THEN
    CREATE POLICY "Authenticated admins full access contact" ON contact FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;
