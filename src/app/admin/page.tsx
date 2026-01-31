"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabaseClient";
import { Project } from "@/types";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  liveUrl: z.string().url(),
  repoUrl: z.string().url(),
  techStack: z.string().min(2),
  images: z.string().optional().default(""),
  published: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const isBusy = isSubmitting || deletingId !== null || uploading;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminPassRef = useRef<string>("");

  function normalizeProjectRow(row: Record<string, unknown>): Project {
    const images = row.images;
    const imagesArray = Array.isArray(images)
      ? (images as string[]).filter(
          (u): u is string => typeof u === "string" && u.length > 0,
        )
      : typeof images === "string" && images.trim()
      ? images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    return {
      id: String(row.id),
      title: String(row.title),
      description: String(row.description),
      techStack: Array.isArray(row.techStack)
        ? (row.techStack as string[])
        : [],
      liveUrl: String(row.liveUrl ?? row.liveurl ?? ""),
      repoUrl: String(row.repoUrl ?? row.repourl ?? ""),
      images: imagesArray,
      published: Boolean(row.published),
      inserted_at:
        row.inserted_at != null ? String(row.inserted_at) : undefined,
    } as Project;
  }

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { published: true, images: "" },
  });

  const loadProjects = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (data)
      setProjects((data as Record<string, unknown>[]).map(normalizeProjectRow));
  };

  useEffect(() => {
    if (authed) void loadProjects();
  }, [authed]);

  const onSubmit = async (values: FormData) => {
    if (!supabase) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        liveUrl: values.liveUrl,
        repoUrl: values.repoUrl,
        techStack: values.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        images: values.images
          ? values.images
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        published: Boolean(values.published),
      };
      if (editingId) {
        await supabase.from("projects").update(payload).eq("id", editingId);
      } else {
        await supabase.from("projects").insert(payload);
      }
      form.reset({
        title: "",
        description: "",
        liveUrl: "",
        repoUrl: "",
        techStack: "",
        images: "",
        published: true,
      });
      setEditingId(null);
      setFileInputKey((k) => k + 1);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadProjects();
    } finally {
      setIsSubmitting(false);
    }
  };

  const edit = (project: Project) => {
    setEditingId(project.id);
    const images = Array.isArray(project.images) ? project.images : [];
    form.reset({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl,
      repoUrl: project.repoUrl,
      techStack: (Array.isArray(project.techStack)
        ? project.techStack
        : []
      ).join(", "),
      images: images.join(", "),
      published: project.published,
    });
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    setDeletingId(id);
    try {
      await supabase.from("projects").delete().eq("id", id);
      await loadProjects();
    } finally {
      setDeletingId(null);
    }
  };

  const sorted = useMemo(() => [...projects], [projects]);

  const handleUpload = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!supabase) {
      setUploadError(
        "Supabase not configured. Add env vars and bucket project-images.",
      );
      return;
    }
    setUploadError("");
    const list = Array.from(files).slice(0, 4);
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of list) {
        const path = `project-images/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("project-images")
          .upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage
          .from("project-images")
          .getPublicUrl(path);
        if (data?.publicUrl) urls.push(data.publicUrl);
      }
      if (urls.length) {
        const existing = form.getValues("images") || "";
        const combined = [
          ...existing
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          ...urls,
        ].slice(0, 4);
        form.setValue("images", combined.join(", "));
      }
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Check bucket permissions.");
    } finally {
      setUploading(false);
    }
  };

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-4">
        <div className="glass w-full rounded-3xl border p-6 shadow-glass">
          <h1 className="text-2xl font-semibold">Admin Access</h1>
          <p className="text-sm text-slate-200">
            Enter the admin passphrase to manage projects.
          </p>
          <form
            className="mt-4 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const pass = new FormData(e.currentTarget)
                .get("pass")
                ?.toString();
              if (pass && pass === ADMIN_PASS) {
                setAuthError("");
                adminPassRef.current = pass;
                setAuthed(true);
              } else {
                setAuthError("Incorrect password. Try again.");
              }
            }}
          >
            <input
              name="pass"
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              placeholder="Admin password"
            />
            <button className="glass rounded-xl px-4 py-2 text-sm font-semibold">
              Enter
            </button>
          </form>
          {authError && (
            <p className="mt-2 text-xs text-rose-300">{authError}</p>
          )}
          {!ADMIN_PASS && (
            <p className="mt-2 text-xs text-rose-300">
              Set NEXT_PUBLIC_ADMIN_PASS env to enable authentication.
            </p>
          )}
          <a
            href="/#home"
            className="mt-4 inline-block text-sm text-cyan-200 underline"
          >
            ← Back
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Project Management</h1>
          <p className="text-sm text-slate-200">
            Create, edit, publish, or delete projects.
          </p>
        </div>
        <a
          href="/#home"
          className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-tight text-slate-200 transition hover:border-cyan-300"
        >
          ← Back
        </a>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5"
      >
        <input
          placeholder="Title"
          {...form.register("title")}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          disabled={isBusy}
        />
        <textarea
          placeholder="Description"
          {...form.register("description")}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
        />
        <input
          placeholder="Live URL"
          {...form.register("liveUrl")}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          disabled={isBusy}
        />
        <input
          placeholder="Repo URL"
          {...form.register("repoUrl")}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          disabled={isBusy}
        />
        <input
          placeholder="Tech stack (comma separated)"
          {...form.register("techStack")}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          disabled={isBusy}
        />
        <input type="hidden" {...form.register("images")} />
        <label className="text-xs text-slate-300">
          Upload up to 4 images (stored in Supabase bucket `project-images`)
          <input
            ref={fileInputRef}
            key={fileInputKey}
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-600 file:px-3 file:py-2 file:text-white"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading || isBusy}
          />
        </label>
        {uploadError && <p className="text-xs text-rose-300">{uploadError}</p>}
        <div className="flex flex-wrap gap-2">
          {form
            .watch("images")
            ?.split(",")
            .map((url) => url.trim())
            .filter(Boolean)
            .map((url) => (
              <div
                key={url}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs"
              >
                <span className="line-clamp-1 max-w-[180px]">{url}</span>
                <button
                  type="button"
                  className="text-rose-300"
                  onClick={() => {
                    const next = (form.getValues("images") || "")
                      .split(",")
                      .map((x) => x.trim())
                      .filter((x) => x && x !== url)
                      .join(", ");
                    form.setValue("images", next);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Controller
            control={form.control}
            name="published"
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                disabled={isBusy}
              />
            )}
          />
          Published
        </label>
        <p className="text-xs text-slate-300">
          Published makes the project visible on the public portfolio. Uncheck
          to keep it hidden (draft).
        </p>
        <button
          type="submit"
          disabled={isBusy}
          className="glass w-fit rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Uploading images…"
            : isSubmitting
            ? editingId
              ? "Updating…"
              : "Creating…"
            : editingId
            ? "Update project"
            : "Create project"}
        </button>
      </form>

      <div className="mt-8 grid gap-3">
        {sorted.map((project) => (
          <div
            key={project.id}
            className="glass rounded-2xl border p-4 shadow-glass"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{project.title}</p>
                <p className="text-xs text-cyan-200">
                  {project.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className="rounded-full bg-white/10 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => edit(project)}
                  disabled={isBusy}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-full bg-rose-500/80 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => remove(project.id)}
                  disabled={isBusy}
                >
                  {deletingId === project.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
