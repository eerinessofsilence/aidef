"use client";

import React from "react";

type ContactFormProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const inputClass =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-50/10";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Contact
        </p>
        <h3 className="mt-1 text-2xl font-semibold text-neutral-900 md:text-3xl dark:text-white">
          Tell us about your project
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          We will get back to you within one business day.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            First name
            <input
              className={inputClass}
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            Last name
            <input
              className={inputClass}
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            Email
            <input
              className={inputClass}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            Phone number
            <input
              className={inputClass}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 md:col-span-2 dark:text-neutral-100">
            Country
            <input
              className={inputClass}
              name="country"
              type="text"
              autoComplete="country-name"
              placeholder="United States"
              required
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
          Message
          <textarea
            className={`${inputClass} min-h-[140px] resize-none`}
            name="message"
            placeholder="Share a bit about what you need..."
            required
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:outline-none dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-50/30"
          >
            Send message
          </button>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            By submitting, you agree to be contacted about your request.
          </p>
        </div>
      </form>
    </div>
  );
};
