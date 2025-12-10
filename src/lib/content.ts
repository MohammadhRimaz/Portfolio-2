import { supabase } from "./supabaseClient";
import { fallbackProjects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { experiences } from "@/data/experience";
import { Project, Testimonial, Experience } from "@/types";

export const getProjects = async (): Promise<Project[]> => {
  if (!supabase) return fallbackProjects;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("inserted_at", { ascending: false });
  if (error || !data) return fallbackProjects;
  return data as Project[];
};

export const getTestimonials = async (): Promise<Testimonial[]> =>
  testimonials;

export const getExperiences = async (): Promise<Experience[]> => experiences;


