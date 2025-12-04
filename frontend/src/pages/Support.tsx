import { type FormEvent, useState } from "react";

type FormValues = {
  name: string;
  subject: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function Support() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    subject: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (field: keyof FormValues, value: string) => {
    if (!value.trim()) {
      return "This field is required.";
    }

    if (field === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) {
        return "Enter a valid email address.";
      }
    }

    if (field === "message" && value.trim().length < 10) {
      return "Message should be at least 10 characters.";
    }

    return null;
  };

  const validateForm = (vals: FormValues) => {
    const nextErrors: FormErrors = {};
    (Object.keys(vals) as Array<keyof FormValues>).forEach((key) => {
      const error = validateField(key, vals[key]);
      if (error) {
        nextErrors[key] = error;
      }
    });
    return nextErrors;
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const fieldError = validateField(field, value);
      const next = { ...prev };
      if (fieldError) {
        next[field] = fieldError;
      } else {
        delete next[field];
      }
      return next;
    });
    setSubmitted(false);
  };

  const handleBlur = (field: keyof FormValues) => {
    const fieldError = validateField(field, values[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[field] = fieldError;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateForm(values);
    setErrors(validation);
    setSubmitted(Object.keys(validation).length === 0);
  };

  return (
    <section className="container mx-auto space-y-7.5 px-5 py-32 pt-64 max-lg:flex max-lg:flex-col max-lg:items-center max-md:py-16 max-md:pt-36">
      <div>
        <span className="border-border/35 rounded-full border bg-white/5 p-3 px-4 font-semibold uppercase backdrop-blur-lg">
          Be safe with us
        </span>
      </div>
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="space-y-7.5">
          <div className="space-y-7.5">
            <div className="w-[350px] max-md:w-[250px]">
              <img src="/logo-ai-def.svg" className="w-full" alt="" />
            </div>
            <div className="flex items-center gap-5">
              <div className="border/35 flex h-15 w-15 items-center justify-center rounded-2xl border bg-white/5">
                <img src="/mail.svg" alt="" />
              </div>
              <p className="text-lg font-semibold">office@ai-def.com</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="border/35 flex h-15 w-15 items-center justify-center rounded-2xl border bg-white/5">
                <img src="/mobile-phone.svg" alt="" />
              </div>
              <p className="text-lg font-semibold">+421 907 949 592</p>
            </div>
          </div>
          <div className="space-y-5">
            <p className="text-lg font-semibold uppercase">Adresses:</p>
            <div className="space-y-5">
              <div className="space-y-2.5">
                <p className="text-lg font-semibold uppercase">
                  MANAGEMENT AND ADMINISTRATION
                </p>
                <p className="max-w-[233px] text-lg text-pretty">
                  Vedecky park - Ilkovicova 8 841 02 Bratislava Slovakia
                </p>
              </div>
              <div className="space-y-2.5">
                <p className="text-lg font-semibold uppercase">
                  HEADQUARTERS & DEVELOPMENT CENTRE
                </p>
                <p className="max-w-[233px] text-lg text-pretty">
                  Staniná 267/21 906 13 Brezová pod Bradlom Slovakia
                </p>
              </div>
              <div className="space-y-2.5">
                <p className="text-lg font-semibold uppercase">
                  PROTOTYPE LABORATORY
                </p>
                <p className="max-w-[233px] text-lg text-pretty">
                  Nádrainá 75/2 907 01 Myjava Slovakia
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-start justify-end">
          <div className="w-full max-w-[500px] rounded-2xl border border-white/10 bg-linear-to-b from-white/10 via-white/5 to-white/0 p-10 shadow-[0_15px_30px_rgba(0,0,0,0.25)] backdrop-blur-2xl max-md:p-5">
            <div className="space-y-10 max-md:space-y-5">
              <p className="text-3xl font-semibold text-white max-md:text-2xl">
                Send Us a Message
              </p>
              <form
                className="space-y-10 max-md:space-y-5"
                onSubmit={handleSubmit}
                noValidate
              >
                <label className="block">
                  <span className="sr-only">First name</span>
                  <input
                    type="text"
                    placeholder="First name"
                    value={values.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`w-full rounded-2xl border bg-white/15 px-5 py-4 text-base font-medium text-white transition outline-none placeholder:text-white/65 ${
                      errors.name
                        ? "border-rose-400/80 focus:border-rose-400/80"
                        : "border-white/15 focus:border-white/35"
                    }`}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1 text-sm text-rose-200/90"
                    >
                      {errors.name}
                    </p>
                  )}
                </label>
                <label className="block">
                  <span className="sr-only">Subject</span>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={values.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    onBlur={() => handleBlur("subject")}
                    className={`w-full rounded-2xl border bg-white/15 px-5 py-4 text-base font-medium text-white transition outline-none placeholder:text-white/65 ${
                      errors.subject
                        ? "border-rose-400/80 focus:border-rose-400/80"
                        : "border-white/15 focus:border-white/35"
                    }`}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                      errors.subject ? "contact-subject-error" : undefined
                    }
                  />
                  {errors.subject && (
                    <p
                      id="contact-subject-error"
                      className="mt-1 text-sm text-rose-200/90"
                    >
                      {errors.subject}
                    </p>
                  )}
                </label>
                <label className="block">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full rounded-2xl border bg-white/15 px-5 py-4 text-base font-medium text-white transition outline-none placeholder:text-white/65 ${
                      errors.email
                        ? "border-rose-400/80 focus:border-rose-400/80"
                        : "border-white/15 focus:border-white/35"
                    }`}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1 text-sm text-rose-200/90"
                    >
                      {errors.email}
                    </p>
                  )}
                </label>
                <label className="block">
                  <span className="sr-only">Message</span>
                  <textarea
                    placeholder="Message"
                    value={values.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    className={`min-h-[150px] w-full resize-none rounded-2xl border bg-white/15 px-5 py-4 text-base font-medium text-white transition outline-none placeholder:text-white/65 ${
                      errors.message
                        ? "border-rose-400/80 focus:border-rose-400/80"
                        : "border-white/15 focus:border-white/35"
                    }`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="mt-1 text-sm text-rose-200/90"
                    >
                      {errors.message}
                    </p>
                  )}
                </label>
                <button
                  type="submit"
                  className="mt-2 w-full cursor-pointer rounded-2xl border border-white/20 bg-[#0a2348] px-6 py-4 text-base font-semibold text-white transition hover:border-white/30 hover:bg-[#0c2c58]"
                >
                  Send a message
                </button>
              </form>
              {submitted && (
                <p className="text-center text-sm font-medium text-white/80">
                  Thanks! Your message looks good.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
