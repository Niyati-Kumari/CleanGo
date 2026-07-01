import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useBooking } from "../context/BookingContext";
import { detectCurrentCity } from "../utils/geolocation";

export default function HomePage() {
  const { city, setCity } = useBooking();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    api
      .getCatalog()
      .then(({ catalog: data }) => setCatalog(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    handleDetectLocation({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDetectLocation({ silent = false } = {}) {
    setDetectingLocation(true);
    setLocationError("");
    detectCurrentCity()
      .then((detectedCity) => setCity(detectedCity))
      .catch((err) => {
        if (!silent)
          setLocationError(err.message || "Unable to detect your location");
      })
      .finally(() => setDetectingLocation(false));
  }

  return (
    <div className="animate-fade-in">
      <section className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="animate-pulse-soft">🚀</span>
            <span>Swiggy for dry cleaning</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Clean clothes,
            <br />
            <span className="text-accent-300">delivered.</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Professional laundry & dry cleaning at your doorstep. Schedule
            pickup, track orders, and pay online.
          </p>
          <div className="flex max-w-lg flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/20 p-3 backdrop-blur-md border border-white/30">
              <button
                type="button"
                onClick={() => handleDetectLocation({ silent: false })}
                disabled={detectingLocation}
                title="Use my current location"
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-2xl disabled:opacity-60"
              >
                {detectingLocation ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                ) : (
                  "📍"
                )}
              </button>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/70 focus:outline-none text-lg"
                placeholder="Enter your city"
              />
            </div>
            <Link
              to="/cleaners"
              className="rounded-2xl bg-white px-8 py-3 font-semibold text-brand-600 hover:bg-white/90 transition-all shadow-lg hover:shadow-xl text-center"
            >
              Find Cleaners
            </Link>
          </div>
          {locationError && (
            <p className="mt-2 max-w-lg text-sm text-white/90">
              {locationError}
            </p>
          )}
        </div>
        <div className="absolute -right-20 -bottom-20 text-[200px] opacity-10">
          👔
        </div>
      </section>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          What do you need cleaned?
        </h2>
        <div className="flex gap-2">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse-soft" />
          <span className="flex h-2 w-2 rounded-full bg-brand-400" />
          <span className="flex h-2 w-2 rounded-full bg-brand-300" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((category, index) => (
            <Link
              key={category.id}
              to={`/services/${category.id}`}
              className="group animate-slide-in glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-4xl group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-slate-500">
                {category.items.length} services available
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="glass-card rounded-3xl p-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-50 text-3xl">
            🏪
          </div>
          <h2 className="mb-3 text-2xl font-bold text-slate-800">
            Own a dry cleaning shop?
          </h2>
          <p className="mb-6 text-slate-600">
            Join CleanGo as a partner — get online orders, digital payments,
            business analytics, and grow your customer base.
          </p>
          <Link
            to="/partner/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 font-semibold text-white hover:from-brand-700 hover:to-brand-600 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Become a Partner</span>
            <span>→</span>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-3xl">
            🛵
          </div>
          <h2 className="mb-3 text-2xl font-bold text-slate-800">
            Want to earn with deliveries?
          </h2>
          <p className="mb-6 text-slate-600">
            Join as a delivery partner — flexible hours, weekly payouts, and be
            your own boss.
          </p>
          <Link
            to="/delivery/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-400 px-6 py-3 font-semibold text-white hover:from-accent-600 hover:to-accent-500 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Join as Driver</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-white">
        <h2 className="mb-8 text-center text-3xl font-bold">
          How CleanGo Works
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              icon: "📱",
              title: "Select Items",
              desc: "Choose clothes & services",
            },
            {
              icon: "🏠",
              title: "Schedule Pickup",
              desc: "Pick a convenient time slot",
            },
            {
              icon: "✨",
              title: "Expert Cleaning",
              desc: "Professional care for your clothes",
            },
            {
              icon: "📦",
              title: "Doorstep Delivery",
              desc: "Clean clothes delivered to you",
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-4xl backdrop-blur-sm">
                {step.icon}
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-slate-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
