import { z } from 'zod';

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().nullable().optional(),
  stack: z.string().nullable().optional(),
  featured: z.preprocess((val) => (val === 1 ? true : val === 0 ? false : val), z.boolean().optional()),
  live_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional()
});

export const CertificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  image_url: z.string().nullable().optional()
});

export const ExperienceSchema = z.object({
  year_range: z.string().min(1, "Year range is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  description: z.string().nullable().optional()
});

export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required")
});

export const SocialLinkSchema = z.object({
  url: z.string().url("Must be a valid URL")
});

export const PageHeaderSchema = z.object({
  eyebrow: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional()
});

export const SettingsSchema = z.object({
  value: z.any() // Value can be string or anything depending on the setting key
});

export const AnimatedTitleSchema = z.object({
  title: z.string().min(1, "Title is required")
});

export const PhilosophyLineSchema = z.object({
  text: z.string().min(1, "Text is required")
});

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
