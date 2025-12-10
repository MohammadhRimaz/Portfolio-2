"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message should be at least 10 characters")
});

type FormData = z.infer<typeof schema>;

const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );

  const onSubmit = async (data: FormData) => {
    if (!formspreeEndpoint) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      setStatus(res.ok ? "sent" : "error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass flex flex-col gap-4 rounded-2xl border p-5 shadow-glass"
    >
      <div>
        <label className="text-sm">Name</label>
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          {...register("name")}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-xs text-rose-300">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm">Email</label>
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          {...register("email")}
          placeholder="you@example.com"
          type="email"
        />
        {errors.email && (
          <p className="text-xs text-rose-300">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm">Message</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-300"
          rows={4}
          {...register("message")}
          placeholder="Tell me about your project or role"
        />
        {errors.message && (
          <p className="text-xs text-rose-300">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="glass rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
      {status === "sent" && (
        <p className="text-xs text-emerald-300">Message sent! I'll reply soon.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-rose-300">
          Could not send. Please email rimaz@example.com directly.
        </p>
      )}
    </form>
  );
};


