"use client";

import Link from "next/link";
import { ArrowRight, Check, Mic2, MoveUpRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { PointerEvent } from "react";

const notes = ["A clearer story", "A site people enjoy using", "Growth you can understand"];

export function PremiumHero() {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--ugc-x", `${((event.clientX - box.left) / box.width - .5) * 2}`);
    event.currentTarget.style.setProperty("--ugc-y", `${((event.clientY - box.top) / box.height - .5) * 2}`);
  };

  return <section className="ugc-hero" aria-labelledby="hero-heading" onPointerMove={move}>
    <div className="ugc-paper-noise" aria-hidden="true" />
    <div className="shell ugc-hero-inner">
      <motion.div className="ugc-copy" initial={reduced ? false : { opacity: 0, y: 22 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}>
        <h1 id="hero-heading">Real people.<br /><span>Sharp ideas.</span><br />Digital work that moves.</h1>
        <p className="ugc-lede">No mystery process and no handoff maze. Web Aayo works beside your team to turn rough ideas into websites, brands and growth systems people genuinely want to use.</p>
        <div className="ugc-actions"><Link className="ugc-button" href="/get-a-quote">Tell us what you’re building <ArrowRight /></Link><Link className="ugc-text-link" href="/work">See the work <MoveUpRight /></Link></div>
        <div className="ugc-proof">{notes.map((note) => <span key={note}><i><Check /></i>{note}</span>)}</div>
      </motion.div>

      <motion.div className="ugc-board" initial={reduced ? false : { opacity: 0, scale: .96, rotate: 1.5 }} animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .75, delay: .1, ease: [0.22, 1, 0.36, 1] }} aria-label="A behind-the-scenes look at the Web Aayo process">
        <div className="ugc-tape ugc-tape-top">behind the build</div>
        <article className="ugc-phone">
          <header><span>9:41</span><i /><i /><i /></header>
          <div className={`ugc-phone-video ${playing ? "is-playing" : ""}`}>
            <div className="ugc-video-label"><span>DAY 12</span><strong>Homepage review</strong></div>
            <div className="ugc-live-chip"><i />WORK IN PROGRESS</div>
            <div className="ugc-screen-card"><small>Today’s focus</small><strong>Make the first 5 seconds count.</strong><div className="ugc-highlight" /></div>
            <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause project update" : "Play project update"}><Play fill="currentColor" /></button>
            <p>{playing ? <>“Now we tighten the story,<br />then test every interaction.”</> : <>“Less filler. More clarity.<br />Let the strongest idea lead.”</>}</p>
          </div>
          <footer><span>web.aayo</span><div><i /><i /><i /></div></footer>
        </article>

        <article className="ugc-project-note">
          <p>WHAT WE’RE MAKING</p>
          <h2>From a messy brief to one clear digital story.</h2>
          <div className="ugc-note-list"><span><i>01</i>Find the useful idea</span><span><i>02</i>Make it easy to feel</span><span><i>03</i>Build it to perform</span></div>
          <div className="ugc-marker">simple beats impressive →</div>
        </article>

        <article className="ugc-voice-note"><span className="ugc-avatar">W</span><div><small>Quick project update</small><div className="ugc-wave" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <i key={index} />)}</div></div><strong>0:27</strong><Mic2 /></article>
        <div className="ugc-sticker">Made together,<br />not behind a curtain.</div>
        <div className="ugc-doodle" aria-hidden="true">↗</div>
      </motion.div>
    </div>
    <div className="ugc-edge-copy" aria-hidden="true">STRATEGY · DESIGN · BUILD · GROW ·</div>
  </section>;
}
