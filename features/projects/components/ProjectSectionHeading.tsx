import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

export function ProjectSectionHeading({
  children,
  centered = false,
  rule = false,
  className = "",
  delay = 0,
  duration = 700,
}: {
  children: React.ReactNode;
  centered?: boolean;
  rule?: boolean;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <Reveal
      className={`${centered ? "text-center" : ""} ${className}`}
      delay={delay}
      distance="long"
      duration={duration}
    >
      <h2 className="text-[clamp(29px,3vw,48px)] leading-[1.04] font-bold tracking-[-0.04em] text-brand uppercase text-balance">
        {children}
      </h2>
      {rule && (
        <Image
          src="/images/projects/section-rule.png"
          alt=""
          width={1388}
          height={128}
          className={`mt-4 h-auto w-[min(350px,72vw)] ${centered ? "mx-auto" : ""}`}
          aria-hidden="true"
        />
      )}
    </Reveal>
  );
}
