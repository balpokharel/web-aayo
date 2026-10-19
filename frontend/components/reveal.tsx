"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function Reveal({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
