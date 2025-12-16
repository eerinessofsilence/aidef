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
  { code: "CN", name: "China" },
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

const citiesByCountry: Record<string, string[]> = {
  AE: [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Al Ain",
    "Umm Al Quwain",
    "Khor Fakkan",
    "Other / Not listed",
  ],
  AR: [
    "Buenos Aires",
    "Cordoba",
    "Rosario",
    "Mendoza",
    "La Plata",
    "Salta",
    "Mar del Plata",
    "San Miguel de Tucuman",
    "Bariloche",
    "Other / Not listed",
  ],
  AU: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Canberra",
    "Hobart",
    "Darwin",
    "Gold Coast",
    "Other / Not listed",
  ],
  BR: [
    "Sao Paulo",
    "Rio de Janeiro",
    "Brasilia",
    "Salvador",
    "Belo Horizonte",
    "Fortaleza",
    "Curitiba",
    "Recife",
    "Porto Alegre",
    "Other / Not listed",
  ],
  CA: [
    "Toronto",
    "Vancouver",
    "Montreal",
    "Calgary",
    "Ottawa",
    "Edmonton",
    "Winnipeg",
    "Quebec City",
    "Victoria",
    "Other / Not listed",
  ],
  CN: [
    "Beijing",
    "Shanghai",
    "Shenzhen",
    "Guangzhou",
    "Chengdu",
    "Xi'an",
    "Wuhan",
    "Hangzhou",
    "Nanjing",
    "Other / Not listed",
  ],
  DE: [
    "Berlin",
    "Munich",
    "Hamburg",
    "Frankfurt",
    "Cologne",
    "Stuttgart",
    "Dusseldorf",
    "Leipzig",
    "Dresden",
    "Other / Not listed",
  ],
  DK: [
    "Copenhagen",
    "Aarhus",
    "Odense",
    "Aalborg",
    "Esbjerg",
    "Randers",
    "Kolding",
    "Horsens",
    "Vejle",
    "Other / Not listed",
  ],
  EG: [
    "Cairo",
    "Alexandria",
    "Giza",
    "Sharm El Sheikh",
    "Luxor",
    "Aswan",
    "Hurghada",
    "Port Said",
    "Suez",
    "Other / Not listed",
  ],
  ES: [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Seville",
    "Bilbao",
    "Zaragoza",
    "Malaga",
    "Murcia",
    "Palma de Mallorca",
    "Other / Not listed",
  ],
  FI: [
    "Helsinki",
    "Espoo",
    "Tampere",
    "Oulu",
    "Turku",
    "Vantaa",
    "Jyvaskyla",
    "Lahti",
    "Kuopio",
    "Other / Not listed",
  ],
  FR: [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Bordeaux",
    "Lille",
    "Nantes",
    "Strasbourg",
    "Other / Not listed",
  ],
  GB: [
    "London",
    "Manchester",
    "Birmingham",
    "Edinburgh",
    "Glasgow",
    "Bristol",
    "Leeds",
    "Liverpool",
    "Belfast",
    "Other / Not listed",
  ],
  IE: [
    "Dublin",
    "Cork",
    "Galway",
    "Limerick",
    "Waterford",
    "Kilkenny",
    "Sligo",
    "Wexford",
    "Drogheda",
    "Other / Not listed",
  ],
  IN: [
    "Mumbai",
    "Bengaluru",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Other / Not listed",
  ],
  IT: [
    "Rome",
    "Milan",
    "Florence",
    "Turin",
    "Naples",
    "Bologna",
    "Genoa",
    "Verona",
    "Venice",
    "Other / Not listed",
  ],
  JP: [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Yokohama",
    "Sapporo",
    "Nagoya",
    "Fukuoka",
    "Kobe",
    "Hiroshima",
    "Other / Not listed",
  ],
  KE: [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Thika",
    "Malindi",
    "Naivasha",
    "Machakos",
    "Other / Not listed",
  ],
  MX: [
    "Mexico City",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "Merida",
    "Cancun",
    "Leon",
    "Queretaro",
    "Other / Not listed",
  ],
  NG: [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Ibadan",
    "Benin City",
    "Enugu",
    "Kano",
    "Uyo",
    "Aba",
    "Other / Not listed",
  ],
  NL: [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Groningen",
    "Tilburg",
    "Nijmegen",
    "Maastricht",
    "Other / Not listed",
  ],
  NO: [
    "Oslo",
    "Bergen",
    "Trondheim",
    "Stavanger",
    "Drammen",
    "Fredrikstad",
    "Kristiansand",
    "Tromso",
    "Sandnes",
    "Other / Not listed",
  ],
  NZ: [
    "Auckland",
    "Wellington",
    "Christchurch",
    "Hamilton",
    "Dunedin",
    "Tauranga",
    "Napier",
    "Queenstown",
    "Nelson",
    "Other / Not listed",
  ],
  SA: [
    "Riyadh",
    "Jeddah",
    "Dammam",
    "Medina",
    "Mecca",
    "Khobar",
    "Tabuk",
    "Abha",
    "Yanbu",
    "Other / Not listed",
  ],
  SE: [
    "Stockholm",
    "Gothenburg",
    "Malmo",
    "Uppsala",
    "Vasteras",
    "Orebro",
    "Linkoping",
    "Helsingborg",
    "Jonkoping",
    "Other / Not listed",
  ],
  SG: ["Singapore", "Other / Not listed"],
  US: [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Chicago",
    "Seattle",
    "Austin",
    "Boston",
    "Denver",
    "Atlanta",
    "Other / Not listed",
  ],
  ZA: [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "Polokwane",
    "East London",
    "Stellenbosch",
    "Other / Not listed",
  ],
  default: [
    "Doha",
    "Zurich",
    "Vienna",
    "Warsaw",
    "Prague",
    "Krakow",
    "Budapest",
    "Lisbon",
    "Athens",
    "Other / Not listed",
  ],
};

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

export const ContactForm = ({
  onSubmit,
  showDetails = true,
}: ContactFormProps) => {
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");

  const countryOptions = React.useMemo(() => buildCountryOptions(), []);
  const availableCities = React.useMemo(
    () =>
      selectedCountry
        ? (citiesByCountry[selectedCountry] ?? citiesByCountry.default)
        : [],
    [selectedCountry],
  );

  const inputClass =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-50/10";
  const selectClass = `${inputClass} appearance-none pr-12`;

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

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
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            <span className="flex items-center gap-1">
              Country <span className="text-red-500">*</span>
            </span>
            <div className="relative">
              <select
                className={selectClass}
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                autoComplete="country-name"
                required
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100">
            <span className="flex items-center gap-1">
              City <span className="text-red-500">*</span>
            </span>
            <div className="relative">
              <select
                className={`${selectClass} ${selectedCountry ? "" : "contrast-90"}`}
                name="city"
                value={selectedCity}
                onChange={handleCityChange}
                autoComplete="address-level2"
                required
                disabled={!selectedCountry}
              >
                <option value="" disabled>
                  {selectedCountry ? "Select a city" : "Select a country first"}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 md:col-span-2 dark:text-neutral-100">
            <span className="flex items-center gap-1">
              Address line 1 <span className="text-red-500">*</span>
            </span>
            <input
              className={inputClass}
              name="addressLine1"
              type="text"
              autoComplete="address-line1"
              placeholder="123 Main Street"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 md:col-span-2 dark:text-neutral-100">
            Address line 2 (optional)
            <input
              className={inputClass}
              name="addressLine2"
              type="text"
              autoComplete="address-line2"
              placeholder="Apartment, suite, etc."
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-800 md:col-span-2 dark:text-neutral-100">
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
