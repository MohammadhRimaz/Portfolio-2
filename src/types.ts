export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
  images: string[];
  featured?: boolean;
  published: boolean;
  order?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  avatar?: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  summary: string;
};





