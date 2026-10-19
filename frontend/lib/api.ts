import { defaultPackages, defaultPosts, defaultServices } from "./site-content";
import type { BlogPost, PortfolioProject, PricingPackage, Service } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const revalidate = Number(process.env.API_REVALIDATE_SECONDS ?? 300);

type ApiResponse<T> = { success: boolean; data: T };

async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/api/v1${path}`, { next: { revalidate } });
    if (!response.ok) return fallback;
    const payload = await response.json() as ApiResponse<T>;
    return payload.success ? payload.data : fallback;
  } catch {
    return fallback;
  }
}

export const getServices = () => apiGet<Service[]>("/public/services", defaultServices);
export const getService = async (slug: string) => (await getServices()).find((item) => item.slug === slug) ?? null;
export const getPortfolio = () => apiGet<PortfolioProject[]>("/public/portfolio", []);
export const getProject = async (slug: string) => (await getPortfolio()).find((item) => item.slug === slug) ?? null;
export const getPackages = () => apiGet<PricingPackage[]>("/public/packages", defaultPackages);
export const getPosts = () => apiGet<BlogPost[]>("/public/blogs", defaultPosts);
export const getPost = async (slug: string) => (await getPosts()).find((item) => item.slug === slug) ?? null;
