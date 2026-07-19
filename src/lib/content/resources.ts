import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

export type ResourceMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  excerpt: string;
};

export function getAllResources(): ResourceMeta[] {
  const files = fs.readdirSync(RESOURCES_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(RESOURCES_DIR, file), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      excerpt: data.excerpt,
    } as ResourceMeta;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResourceBySlug(slug: string) {
  const filePath = path.join(RESOURCES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      excerpt: data.excerpt,
    } as ResourceMeta,
    content,
  };
}
