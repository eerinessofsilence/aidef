export default function Footer() {
  return (
    <footer id="footer" className="border-border border-t py-12">
      <div className="container mx-auto max-md:px-8">
        <div className="mb-12 grid grid-cols-2 gap-12 max-md:grid-cols-1">
          <div className="space-y-6">
            <div>
              <div className="tracking-ultra-wide mb-4 text-xl uppercase">
                AI DEF
              </div>
              <a
                href="#"
                className="text-foreground hover:text-foreground/50 flex flex-col space-y-2 font-medium transition-colors duration-300"
              >
                Artificial Intelligence Definition
              </a>
            </div>
            <div className="flex gap-12">
              <div>
                <div className="tracking-ultra-wide text-text mb-4 text-xl uppercase">
                  CONTACT
                </div>
                <div className="flex flex-col space-y-2">
                  <a
                    href="#"
                    className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
                  >
                    office@ai-def.com
                  </a>
                  <a
                    href="#"
                    className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
                  >
                    +421 907 949 592
                  </a>
                  <a
                    href="#"
                    className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
                  >
                    Slovakia & Germany
                  </a>
                </div>
              </div>

              <div>
                <div className="tracking-ultra-wide text-text mb-4 text-xl uppercase">
                  FOCUS
                </div>
                <div className="flex flex-col space-y-2">
                  <a
                    href="#"
                    className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
                  >
                    Aviation & Drones
                  </a>
                  <a
                    href="#"
                    className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
                  >
                    Security & Defense
                  </a>
                  <a
                    href="#"
                    className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
                  >
                    AI & Automation
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="tracking-ultra-wide mb-4 text-xl uppercase">
              Get in touch
            </div>
            <form
              className="space-y-4 rounded-2xl border-2 border-white/10 bg-white/5 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:bg-white/7 hover:shadow-[0_6px_40px_rgba(0,0,0,0.5)]"
              action="#"
              method="post"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="footer-name"
                    className="font-medium tracking-wide uppercase"
                  >
                    Name
                  </label>
                  <input
                    id="footer-name"
                    name="name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                    className="bg-background/50 rounded-xl p-3"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="footer-email"
                    className="font-medium tracking-wide uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="bg-background/50 rounded-xl p-3"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="footer-phone"
                    className="font-medium tracking-wide uppercase"
                  >
                    Phone
                  </label>
                  <input
                    id="footer-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    className="bg-background/50 rounded-xl p-3"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="footer-message"
                  className="font-medium tracking-wide uppercase"
                >
                  Message
                </label>
                <textarea
                  id="footer-message"
                  name="message"
                  placeholder="Tell us about your project..."
                  rows={4}
                  required
                  className="bg-background/50 rounded-xl p-3 transition-all duration-500"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="tracking-ultra-wide text-text/50 text-sm uppercase">
                  We respond within two business days.
                </p>
                <button
                  type="submit"
                  className="border-foreground hover:bg-background/50 w-full rounded-xl border px-4 py-2 sm:w-auto"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-border text-text flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row">
          <div className="text-text/50">
            © AI DEF A.S. 2024 ALL RIGHTS RESERVED.
          </div>
          <div className="tracking-wide-caps flex gap-6 uppercase">
            <a
              href="#"
              className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-foreground hover:text-foreground/50 font-medium transition-colors duration-300"
            >
              Legal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
