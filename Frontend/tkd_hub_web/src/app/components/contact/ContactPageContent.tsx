"use client";
import { useState } from "react";
import ContactLink from "./ContactLink";
import contactLinks from "./contactLinks";


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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-xl sm:max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
          Contact Us
        </h1>
        {submitted ? (
          <div className="text-green-600 text-center font-semibold">
            Thank you for reaching out!
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="message"
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        )}


        {/* Social/contact info */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            Or reach us on:
          </h2>
          <div className="flex justify-center gap-6 text-2xl">
            {contactLinks.map((link) => (
              <ContactLink
                key={link.title}
                href={link.href}
                icon={link.icon}
                title={link.title}
                className={link.className}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
