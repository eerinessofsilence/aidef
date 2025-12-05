"use client";

import React from "react";

type ContactFormProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  showDetails?: boolean;
};

export const ContactForm = ({
  onSubmit,
  showDetails = true,
}: ContactFormProps) => {
  const inputClass =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-50/10";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <div className="w-full space-y-6">
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
            className="cursor-pointer rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:outline-none max-md:w-full dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-50/30"
          >
            Send message
          </button>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            By submitting, you agree to be contacted about your request.
          </p>
        </div>
      </form>
      {showDetails && (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Contact details
            </p>
            <div className="mt-4 space-y-4 text-neutral-900 dark:text-neutral-100">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-neutral-500 uppercase dark:text-neutral-400">
                  Phone
                </p>
                <a
                  href="tel:+421906949592"
                  className="text-lg font-semibold transition hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  +421 906 949 592
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-neutral-500 uppercase dark:text-neutral-400">
                  Email
                </p>
                <a
                  href="mailto:office@ai-def.com"
                  className="font-medium text-neutral-800 transition hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-200"
                >
                  office@ai-def.com
                </a>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[13px] font-semibold text-neutral-500 uppercase dark:text-neutral-400">
                Quick links
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="#"
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  Product
                </a>
                <a
                  href="#"
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Addresses
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-neutral-600 uppercase dark:text-neutral-300">
                  Management and administration
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Vedecký park - Ilkovičova, 8841 02 Bratislava Slovakia
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-neutral-600 uppercase dark:text-neutral-300">
                  Prototype laboratory
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Nádražná 75/2, 907 01 Myjava, Slovakia
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-[13px] font-semibold text-neutral-600 uppercase dark:text-neutral-300">
                  Headquarters & Development centre
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Staničná 267/21, 906 13 Brezová pod Bradlom
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
