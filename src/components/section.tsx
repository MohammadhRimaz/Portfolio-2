import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export const Section = ({ id, title, className, children }: Props) => (
  <section
    id={id}
    className={cn(
      "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 lg:px-6",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
        {title}
      </h2>
    </div>
    <div className="glass rounded-3xl border p-6 shadow-glass">{children}</div>
  </section>
);


