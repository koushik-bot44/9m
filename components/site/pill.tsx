import { ArrowUpRight } from "lucide-react";
import { wa } from "@/lib/site";
import { cn } from "@/lib/utils";

type PillProps = {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "paper" | "line";
  size?: "md" | "sm";
  arrow?: boolean;
  external?: boolean;
  className?: string;
};

/** The one button shape on the site: a pill, with a round arrow badge on the main actions. */
export function Pill({ href, children, tone = "ink", size = "md", arrow = tone !== "line", external, className }: PillProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full font-semibold whitespace-nowrap transition-colors",
        size === "md" ? "min-h-[3.3rem] py-1.5 text-base" : "min-h-10 py-1 text-[0.94rem]",
        arrow && size === "md" ? "pr-1.5 pl-6" : "px-5",
        tone === "ink" && "bg-foreground text-paper hover:bg-foreground/85",
        tone === "paper" && "bg-paper text-foreground hover:bg-secondary",
        tone === "line" && "ring-[1.5px] ring-current ring-inset hover:bg-foreground/5",
        className,
      )}
    >
      {children}
      {arrow && size === "md" ? (
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45",
            tone === "ink" ? "bg-paper text-foreground" : "bg-foreground text-paper",
          )}
        >
          <ArrowUpRight className="size-4" strokeWidth={2.4} />
        </span>
      ) : null}
    </a>
  );
}

/** Every enquiry goes to WhatsApp with the message already written. */
export function WaPill({ message, children = "Enquire on WhatsApp", ...rest }: Omit<PillProps, "href" | "children"> & { message?: string; children?: React.ReactNode }) {
  return (
    <Pill href={wa(message)} external {...rest}>
      {children}
    </Pill>
  );
}
