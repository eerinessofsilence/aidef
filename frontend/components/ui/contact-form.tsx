"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

type ContactFormProps = {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  showDetails?: boolean;
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

const buildCountryOptions = (): CountryOption[] => {
  const intl = Intl as typeof Intl & {
    supportedValuesOf?: (key: string) => string[];
  };

  const canUseIntl =
    typeof intl.supportedValuesOf === "function" &&
    typeof Intl.DisplayNames === "function";

  if (canUseIntl) {
    try {
      const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
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

const productOptions: ProductOption[] = [
  { value: "all-products", label: "All products" },
  { value: "ax2ng-krakatit", label: "AX2NG KRAKATIT" },
  { value: "av-1-vtol", label: "AV-1 VTOL" },
  { value: "axq-quadrocopter", label: "AXQ QUADROCOPTER" },
  { value: "ground-control-station", label: "Ground Control Station" },
  { value: "ugv-150-dup", label: "UGV 150-DUP" },
  { value: "strategic-partnership", label: "Strategic partnership" },
];

export const ContactForm = ({
  onSubmit,
  showDetails = true,
}: ContactFormProps) => {
  const countryDatalistId = React.useId();

  const [countries, setCountries] = React.useState<CountryOption[]>(() =>
    buildCountryOptions(),
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
        setCountries(buildCountryOptions());
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Unable to load countries", error);
        setCountryError(
          "Не удалось обновить список стран, используем запасной список.",
        );
        setCountries(buildCountryOptions());
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCountries(false);
        }
      }
    };

    fetchCountries();
    return () => controller.abort();
  }, []);

  const inputClass =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-50/10";
  const selectClass = `${inputClass} appearance-none pr-12`;

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
    const match = selectedCountry ?? findCountryFromInput(countryQuery);
    if (!match) {
      setCountryError("Пожалуйста, выберите страну из подсказок.");
      return;
    }
    setSelectedCountry(match);
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
            <span className="flex items-center gap-1">
              First name <span className="text-red-500">*</span>
            </span>
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
            <span className="flex items-center gap-1">
              Last name <span className="text-red-500">*</span>
            </span>
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
            <span className="flex items-center gap-1">
              Email <span className="text-red-500">*</span>
            </span>
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
            <span className="flex items-center gap-1">
              Phone number <span className="text-red-500">*</span>
            </span>
            <input
              className={inputClass}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              required
            />
          </label>
          <label className="col-span-2 flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            <span className="flex items-center gap-1">
              Product / Strategic partnership
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
                  Select a product
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
          <label className="col-span-2 flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            <span className="flex items-center gap-1">
              Country <span className="text-red-500">*</span>
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
                  placeholder="Start typing a country"
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
                  Updating countries...
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
            <label className="col-span-2 flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
              <span className="flex items-center gap-1">
                Address line 1 <span className="text-red-500">*</span>
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
                    placeholder="State/province and city"
                    required={Boolean(selectedCountry)}
                    disabled={!selectedCountry}
                  />
                </div>
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 md:col-span-2 dark:text-neutral-100">
              <span className="flex items-center gap-1">
                Address line 2 <span className="text-red-500">*</span>
              </span>
              <input
                className={inputClass}
                name="addressLine1"
                type="text"
                autoComplete="address-line1"
                placeholder="123 Main Street"
                required={Boolean(selectedCountry)}
                disabled={!selectedCountry}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 md:col-span-2 dark:text-neutral-100">
              Address line 3 (optional)
              <input
                className={inputClass}
                name="addressLine2"
                type="text"
                autoComplete="address-line2"
                placeholder="Apartment, suite, etc."
                disabled={!selectedCountry}
              />
            </label>
          </div>
          <label className="col-span-2 flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            Website
            <input
              className={inputClass}
              name="website"
              type="text"
              autoComplete="website"
              placeholder="Add your website URL"
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
          <span className="flex items-center gap-1">
            Message <span className="text-red-500">*</span>
          </span>
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
