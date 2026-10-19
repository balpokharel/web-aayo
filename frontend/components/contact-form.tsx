"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postPublic } from "@/lib/client-api";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().max(30).optional(), subject: z.string().min(3), message: z.string().min(20).max(2500), companyWebsite: z.string().max(0).optional() });
type Values = z.infer<typeof schema>;
export function ContactForm() {
  const [sent, setSent] = useState(false); const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { companyWebsite: "" } });
  const submit = async (values: Values) => { setServerError(""); try { await postPublic("/contacts", { ...values, landingPage: window.location.pathname }); setSent(true); } catch (error) { setServerError(error instanceof Error ? error.message : "Unable to send your message."); } };
  if (sent) return <div className="form-success"><CheckCircle2 size={34} /><h2>Message received.</h2><p>Thanks for reaching out. We’ll review your note and get back to you shortly.</p></div>;
  return <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate><div className="form-grid"><label>Name<input {...register("name")} autoComplete="name" />{errors.name && <small>Please enter your name.</small>}</label><label>Email<input type="email" {...register("email")} autoComplete="email" />{errors.email && <small>Enter a valid email.</small>}</label><label>Phone <em>Optional</em><input {...register("phone")} autoComplete="tel" /></label><label>Subject<input {...register("subject")} />{errors.subject && <small>Please add a subject.</small>}</label></div><label>Message<textarea rows={7} {...register("message")} />{errors.message && <small>Please share at least a few details.</small>}</label><label className="honey-field">Website<input tabIndex={-1} {...register("companyWebsite")} /></label>{serverError && <p className="form-error">{serverError}</p>}<button className="button" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}<Send size={17} /></button></form>;
}
