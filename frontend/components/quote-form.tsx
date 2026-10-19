"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postPublic } from "@/lib/client-api";
import { defaultServices } from "@/lib/site-content";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(100), businessName: z.string().max(120).optional(),
  email: z.string().email("Enter a valid email"), phone: z.string().min(7, "Enter a valid phone number").max(30), whatsapp: z.string().max(30).optional(),
  service: z.string().min(1, "Choose a service"), budgetRange: z.string().min(1, "Choose a budget range"), projectTimeline: z.string().min(1, "Choose a timeline"),
  currentWebsite: z.string().url("Enter a full URL, including https://").or(z.literal("")).optional(), projectDescription: z.string().min(30, "Tell us a little more about the project").max(3000),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]), companyWebsite: z.string().max(0).optional(),
});
type QuoteValues = z.infer<typeof schema>;

export function QuoteForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(1); const [result, setResult] = useState<{ leadId: string } | null>(null); const [serverError, setServerError] = useState("");
  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<QuoteValues>({ resolver: zodResolver(schema), defaultValues: { service: params.get("service") ?? "", preferredContactMethod: "email", companyWebsite: "" } });
  const next = async () => { const fields: Array<keyof QuoteValues> = step === 1 ? ["fullName", "email", "phone"] : ["service", "budgetRange", "projectTimeline"]; if (await trigger(fields)) setStep((value) => Math.min(3, value + 1)); };
  const submit = async (values: QuoteValues) => { setServerError(""); try { const response = await postPublic<{ leadId: string }>("/quotes", { ...values, source: params.get("utm_source") ?? "direct", landingPage: window.location.pathname, utm: { source: params.get("utm_source"), medium: params.get("utm_medium"), campaign: params.get("utm_campaign"), content: params.get("utm_content"), term: params.get("utm_term") } }); setResult(response); } catch (error) { setServerError(error instanceof Error ? error.message : "We could not send your request. Please try again."); } };
  if (result) return <div className="form-success" role="status"><CheckCircle2 size={34} /><p className="section-eyebrow">Request received</p><h2>Thanks. We’ll take it from here.</h2><p>Your reference is <strong>{result.leadId}</strong>. Our team will review the details and reply through your preferred contact method.</p></div>;
  return <form className="project-form" onSubmit={handleSubmit(submit)} noValidate>
    <div className="form-progress" aria-label={`Step ${step} of 3`}><span className={step >= 1 ? "active" : ""} /><span className={step >= 2 ? "active" : ""} /><span className={step >= 3 ? "active" : ""} /><p>Step {step} of 3</p></div>
    {step === 1 && <fieldset><legend>First, how can we reach you?</legend><p>We only use these details to respond to this project request.</p><div className="form-grid"><label>Full name<input {...register("fullName")} autoComplete="name" />{errors.fullName && <small>{errors.fullName.message}</small>}</label><label>Business name <em>Optional</em><input {...register("businessName")} autoComplete="organization" /></label><label>Email<input type="email" {...register("email")} autoComplete="email" />{errors.email && <small>{errors.email.message}</small>}</label><label>Phone<input {...register("phone")} autoComplete="tel" />{errors.phone && <small>{errors.phone.message}</small>}</label><label>WhatsApp <em>Optional</em><input {...register("whatsapp")} autoComplete="tel" /></label><label>Preferred contact<select {...register("preferredContactMethod")}><option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option></select></label></div></fieldset>}
    {step === 2 && <fieldset><legend>What are we building?</legend><p>A rough range is enough. We’ll shape the right scope together.</p><div className="form-grid"><label>Service<select {...register("service")}><option value="">Select a service</option>{defaultServices.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}</select>{errors.service && <small>{errors.service.message}</small>}</label><label>Budget range<select {...register("budgetRange")}><option value="">Select a range</option><option>Under Rs. 50,000</option><option>Rs. 50,000 – 150,000</option><option>Rs. 150,000 – 500,000</option><option>Rs. 500,000+</option><option>Not sure yet</option></select>{errors.budgetRange && <small>{errors.budgetRange.message}</small>}</label><label>Timeline<select {...register("projectTimeline")}><option value="">Select a timeline</option><option>As soon as practical</option><option>1–2 months</option><option>3–6 months</option><option>6+ months</option><option>Still planning</option></select>{errors.projectTimeline && <small>{errors.projectTimeline.message}</small>}</label><label>Current website <em>Optional</em><input type="url" placeholder="https://" {...register("currentWebsite")} />{errors.currentWebsite && <small>{errors.currentWebsite.message}</small>}</label></div></fieldset>}
    {step === 3 && <fieldset><legend>Tell us what success looks like.</legend><p>Useful context includes the problem, audience, must-haves and desired outcome.</p><label>Project description<textarea rows={8} {...register("projectDescription")} />{errors.projectDescription && <small>{errors.projectDescription.message}</small>}</label><label className="honey-field" aria-hidden="true">Company website<input tabIndex={-1} autoComplete="off" {...register("companyWebsite")} /></label></fieldset>}
    {serverError && <p className="form-error" role="alert">{serverError}</p>}
    <div className="form-actions">{step > 1 && <button className="button button-secondary" type="button" onClick={() => setStep((value) => value - 1)}>Back</button>}{step < 3 ? <button className="button" type="button" onClick={next}>Continue <ArrowRight size={17} /></button> : <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send project request"} <ArrowRight size={17} /></button>}</div>
  </form>;
}
