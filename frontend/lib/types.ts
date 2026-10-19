export type Service = {
  id?: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  process: string[];
  featured?: boolean;
  startingPrice?: number;
  priceVisible?: boolean;
};

export type PortfolioProject = {
  id?: string;
  slug: string;
  title: string;
  client?: string;
  industry?: string;
  description: string;
  services: string[];
  technologies: string[];
  challenge?: string;
  solution?: string;
  results?: Array<{ label: string; value: string }>;
  imageUrl?: string;
};

export type PricingPackage = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  startingPrice?: number;
  currency: string;
  priceMode: "fixed" | "starting" | "contact";
  features: string[];
  recommended?: boolean;
  duration?: string;
};

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  publishedAt?: string;
  author?: string;
  imageUrl?: string;
};
