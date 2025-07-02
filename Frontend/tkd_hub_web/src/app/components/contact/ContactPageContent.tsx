"use client";
import { useState } from "react";
import ContactLink from "./ContactLink";
import contactLinks from "./contactLinks";
import GenericButton from "../common/actionButtons/GenericButton";
import LabeledInput from "../common/inputs/LabeledInput";

export default function ContactPageContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you would send the form data to your API or email service
    setSubmitted(true);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 px-2 sm:px-4">
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl min-w-[320px] md:min-w-[500px] mx-auto bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-neutral-900">
          Contact Us
        </h1>
        {submitted ? (
          <div className="text-green-600 text-center font-semibold">
            Thank you for reaching out!
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <LabeledInput
              label="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <LabeledInput
              label="Your Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <LabeledInput
              label="Your Message"
              name="message"
              as="textarea"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              rows={4}
            />
            <GenericButton
              type="submit"
              variant="primary"
              className="px-4 py-2 font-semibold"
            >
              Send Message
            </GenericButton>
          </form>
        )}

        {/* Social/contact info */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3 text-center">
            Or reach us on:
          </h2>
          <div className="flex justify-center gap-6 text-2xl">
            {contactLinks.map((link) => (
              <ContactLink
                key={link.title}
                href={link.href}
                icon={link.icon}
                title={link.title}
                className={
                  "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
