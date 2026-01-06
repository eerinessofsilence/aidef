"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

type ContactFormProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  showDetails?: boolean;
  variant?: "default" | "support";
};

type CountryOption = {
  code: string;
  name: string;
};

type ProductOption = {
  value: string;
  label: string;
};

type RestCountry = {
  cca2?: string;
  name?: { common?: string };
};

const fallbackCountries: CountryOption[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "FI", name: "Finland" },
  { code: "DK", name: "Denmark" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "KE", name: "Kenya" },
  { code: "NG", name: "Nigeria" },
];

const buildCountryOptions = (language = "en"): CountryOption[] => {
  const intl = Intl as typeof Intl & {
    supportedValuesOf?: (key: string) => string[];
  };

  const canUseIntl =
    typeof intl.supportedValuesOf === "function" &&
    typeof Intl.DisplayNames === "function";

  if (canUseIntl) {
    try {
      const displayNames = new Intl.DisplayNames([language], { type: "region" });
      return intl
        .supportedValuesOf("region")
        .filter((code) => /^[A-Z]{2}$/.test(code))
        .map((code) => ({
          code,
          name: displayNames.of(code) ?? code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      // Fallback for environments without full Intl coverage.
    }
  }

  return fallbackCountries;
};

const getCountryOptionLabel = (country: CountryOption) =>
  `${country.name} (${country.code})`;


export const ContactForm = ({
  onSubmit,
  showDetails = true,
  variant = "default",
}: ContactFormProps) => {
  const { t, i18n } = useTranslation();
  const isSupportForm = variant === "support";
  const countryDatalistId = React.useId();

  const [countries, setCountries] = React.useState<CountryOption[]>(() =>
    buildCountryOptions(i18n.language),
  );
  const [countryQuery, setCountryQuery] = React.useState("");
  const [selectedCountry, setSelectedCountry] =
    React.useState<CountryOption | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = React.useState(false);
  const [countryError, setCountryError] = React.useState<string | null>(null);

  const [cityQuery, setCityQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState("");

  const filteredCountries = React.useMemo(() => {
    if (!countryQuery) {
      return countries;
    }
    const query = countryQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query),
    );
  }, [countries, countryQuery]);

  const findCountryFromInput = React.useCallback(
    (value: string) => {
      const normalized = value.trim().toLowerCase();
      return (
        countries.find((country) => {
          const label = getCountryOptionLabel(country).toLowerCase();
          return (
            label === normalized ||
            country.name.toLowerCase() === normalized ||
            country.code.toLowerCase() === normalized
          );
        }) ?? null
      );
    },
    [countries],
  );

  React.useEffect(() => {
    if (isSupportForm) {
      return;
    }
    const controller = new AbortController();
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      setCountryError(null);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2",
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }
        const payload = (await response.json()) as RestCountry[];
        const dynamicCountries = Array.isArray(payload)
          ? payload
              .filter(
                (
                  item,
                ): item is RestCountry & {
                  cca2: string;
                  name: { common: string };
                } => Boolean(item?.name?.common && item?.cca2),
              )
              .map((item) => ({
                code: item.cca2.toUpperCase(),
                name: item.name.common,
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];
        if (dynamicCountries.length > 0) {
          setCountries(dynamicCountries);
          return;
        }
        setCountries(buildCountryOptions(i18n.language));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Unable to load countries", error);
        setCountryError(t("contactForm.errors.countryLoad"));
        setCountries(buildCountryOptions(i18n.language));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCountries(false);
        }
      }
    };

    fetchCountries();
    return () => controller.abort();
  }, [i18n.language, isSupportForm, t]);

  const inputClass = isSupportForm
    ? "text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:ring-foreground/40 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base transition focus:ring-2 focus:outline-none"
    : "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-50/10";
  const selectClass = `${inputClass} appearance-none pr-12`;
  const formKicker = isSupportForm
    ? t("contactForm.support.kicker")
    : t("contactForm.default.kicker");
  const formTitle = isSupportForm
    ? t("contactForm.support.title")
    : t("contactForm.default.title");
  const messageLabel = isSupportForm
    ? t("contactForm.support.messageLabel")
    : t("contactForm.default.messageLabel");
  const messagePlaceholder = isSupportForm
    ? t("contactForm.support.messagePlaceholder")
    : t("contactForm.default.messagePlaceholder");
  const formClass = isSupportForm ? "flex flex-col gap-y-5" : "space-y-5";
  const labelClass = isSupportForm
    ? "flex flex-col gap-y-1 text-sm"
    : "flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100";
  const labelSpanClass = isSupportForm
    ? "text-foreground/70 flex items-center gap-1"
    : "flex items-center gap-1";
  const kickerClass = isSupportForm
    ? "text-foreground/60 text-xs font-semibold tracking-wide uppercase"
    : "text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400";
  const titleClass = isSupportForm
    ? "mt-1 text-3xl font-bold max-md:text-2xl"
    : "mt-1 text-2xl font-semibold text-neutral-900 md:text-3xl dark:text-white";
  const descriptionClass = isSupportForm
    ? "mt-2 text-foreground/70 leading-relaxed"
    : "mt-2 text-sm text-neutral-600 dark:text-neutral-400";
  const submitButtonClass = isSupportForm
    ? "cursor-pointer group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
    : "cursor-pointer rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:outline-none max-md:w-full dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-50/30";
  const submitNoteClass = isSupportForm
    ? "text-foreground/60 text-xs"
    : "text-xs text-neutral-500 dark:text-neutral-400";

  const handleCountryInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setCountryQuery(value);
    setCountryError(null);

    const match = findCountryFromInput(value);
    setSelectedCountry(match);
  };

  const handleCountryBlur = () => {
    const match = findCountryFromInput(countryQuery);
    if (match) {
      setSelectedCountry(match);
      setCountryQuery(match.name);
    }
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSupportForm) {
      const match = selectedCountry ?? findCountryFromInput(countryQuery);
      if (!match) {
        setCountryError(t("contactForm.errors.countryRequired"));
        return;
      }
      setSelectedCountry(match);
    }
    onSubmit?.(event);
  };

  const productOptions: ProductOption[] = [
    { value: "all-products", label: t("contactForm.products.all") },
    { value: "ax2ng-krakatit", label: "AX2NG KRAKATIT" },
    { value: "av-1-vtol", label: "AV-1 VTOL" },
    { value: "axq-quadrocopter", label: "AXQ QUADROCOPTER" },
    { value: "ground-control-station", label: "Ground Control Station" },
    { value: "ugv-150-dup", label: "UGV 150-DUP" },
    {
      value: "strategic-partnership",
      label: t("contactForm.products.partnership"),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <p className={kickerClass}>{formKicker}</p>
        <h3 className={titleClass}>{formTitle}</h3>
        <p className={descriptionClass}>
          {t("contactForm.description")}
        </p>
      </div>
      <form className={formClass} onSubmit={handleSubmit}>
        {isSupportForm ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.firstName")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder={t("contactForm.placeholders.firstName")}
                  required
                />
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.lastName")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder={t("contactForm.placeholders.lastName")}
                  required
                />
              </label>
              <label className={`md:col-span-2 ${labelClass}`}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.email")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("contactForm.placeholders.email")}
                  required
                />
              </label>
            </div>
            <label className={labelClass}>
              <span className={labelSpanClass}>
                {messageLabel} <span className="text-red-500">*</span>
              </span>
              <textarea
                className={`${inputClass} min-h-[140px] resize-none`}
                name="message"
                placeholder={messagePlaceholder}
                required
              />
            </label>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.firstName")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder={t("contactForm.placeholders.firstName")}
                  required
                />
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.lastName")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder={t("contactForm.placeholders.lastName")}
                  required
                />
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.email")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("contactForm.placeholders.email")}
                  required
                />
              </label>
              <label className={labelClass}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.phone")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputClass}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("contactForm.placeholders.phone")}
                  required
                />
              </label>
              <label className={`col-span-2 ${labelClass}`}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.product")}
                  <span className="text-red-500">*</span>
                </span>
                <div className="relative">
                  <select
                    className={selectClass}
                    name="product"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="" disabled>
                      {t("contactForm.placeholders.selectProduct")}
                    </option>
                    {productOptions.map((product) => (
                      <option key={product.value} value={product.value}>
                        {product.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                </div>
              </label>
              <label className={`col-span-2 ${labelClass}`}>
                <span className={labelSpanClass}>
                  {t("contactForm.fields.country")}{" "}
                  <span className="text-red-500">*</span>
                </span>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      className={inputClass}
                      name="countryName"
                      type="text"
                      value={countryQuery}
                      onChange={handleCountryInputChange}
                      onBlur={handleCountryBlur}
                      autoComplete="country-name"
                      placeholder={t("contactForm.placeholders.country")}
                      list={countryDatalistId}
                      required
                    />
                    <datalist id={countryDatalistId}>
                      {filteredCountries.slice(0, 50).map((country) => (
                        <option
                          key={country.code}
                          value={getCountryOptionLabel(country)}
                        />
                      ))}
                    </datalist>
                    <input
                      type="hidden"
                      name="country"
                      value={selectedCountry?.code ?? ""}
                    />
                  </div>
                  {countryError ? (
                    <p className="text-xs text-red-500">{countryError}</p>
                  ) : isLoadingCountries ? (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t("contactForm.status.updatingCountries")}
                    </p>
                  ) : null}
                </div>
              </label>
              <div
                className={`col-span-2 grid gap-4 overflow-hidden transition-all duration-300 ease-out md:grid-cols-2 ${
                  selectedCountry
                    ? "max-h-[640px] translate-y-0 opacity-100"
                    : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
                }`}
                aria-hidden={!selectedCountry}
              >
                <label className={`col-span-2 ${labelClass}`}>
                  <span className={labelSpanClass}>
                    {t("contactForm.fields.addressLine1")}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        className={inputClass}
                        name="city"
                        type="text"
                        value={cityQuery}
                        onChange={(event) => setCityQuery(event.target.value)}
                        autoComplete="address-line1"
                        placeholder={t("contactForm.placeholders.addressLine1")}
                        required={Boolean(selectedCountry)}
                        disabled={!selectedCountry}
                      />
                    </div>
                  </div>
                </label>
                <label className={`md:col-span-2 ${labelClass}`}>
                  <span className={labelSpanClass}>
                    {t("contactForm.fields.addressLine2")}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <input
                    className={inputClass}
                    name="addressLine1"
                    type="text"
                    autoComplete="address-line1"
                    placeholder={t("contactForm.placeholders.addressLine2")}
                    required={Boolean(selectedCountry)}
                    disabled={!selectedCountry}
                  />
                </label>
                <label className={`md:col-span-2 ${labelClass}`}>
                  {t("contactForm.fields.addressLine3Optional")}
                  <input
                    className={inputClass}
                    name="addressLine2"
                    type="text"
                    autoComplete="address-line2"
                    placeholder={t("contactForm.placeholders.addressLine3")}
                    disabled={!selectedCountry}
                  />
                </label>
              </div>
              <label className={`col-span-2 ${labelClass}`}>
                {t("contactForm.fields.website")}
                <input
                  className={inputClass}
                  name="website"
                  type="text"
                  autoComplete="website"
                  placeholder={t("contactForm.placeholders.website")}
                />
              </label>
            </div>
            <label className={labelClass}>
              <span className={labelSpanClass}>
                {messageLabel} <span className="text-red-500">*</span>
              </span>
              <textarea
                className={`${inputClass} min-h-[140px] resize-none`}
                name="message"
                placeholder={messagePlaceholder}
                required
              />
            </label>
          </>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={submitButtonClass}>
            {t("contactForm.actions.send")}
          </button>
          <p className={submitNoteClass}>
            {t("contactForm.disclaimer")}
          </p>
        </div>
      </form>
      {showDetails && (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {t("contactForm.details.title")}
            </p>
            <div className="mt-4 space-y-4 text-neutral-900 dark:text-neutral-100">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-neutral-500 uppercase dark:text-neutral-400">
                  {t("contactForm.fields.email")}
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
                {t("contactForm.details.quickLinks")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="#"
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  {t("contactForm.details.links.product")}
                </a>
                <a
                  href="#"
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  {t("contactForm.details.links.services")}
                </a>
                <a
                  href="#"
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  {t("contactForm.details.links.support")}
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {t("contactForm.details.addresses")}
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-neutral-600 uppercase dark:text-neutral-300">
                  {t("contactForm.details.managementTitle")}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t("contactForm.details.managementAddress")}
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-[13px] font-semibold text-neutral-600 uppercase dark:text-neutral-300">
                  {t("contactForm.details.hqTitle")}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {t("contactForm.details.hqAddress")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
