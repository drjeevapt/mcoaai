import Link from "next/link";
import { BRANCHES_DATA } from "@/data/branches";
import { MapPin, Phone, Mail, Navigation, ArrowUpRight } from "lucide-react";

export function BranchesSection() {
  return (
    <section className="py-20 bg-mcoa-pearl/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-mcoa-amethyst font-montserrat">
            Physical Campus Network
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mcoa-midnight mt-2 font-montserrat">
            Our Centers Across Tamil Nadu
          </h2>
          <p className="text-sm text-gray-600 mt-2 font-inter">
            Walk into any of our state-of-the-art training centers for in-person counseling, physical classroom training, and lab chart access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES_DATA.map((branch) => (
            <div
              key={branch.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                branch.isHeadOffice
                  ? "border-mcoa-gold shadow-gold relative ring-2 ring-mcoa-gold/20"
                  : "border-gray-200/90 hover:border-mcoa-amethyst hover:shadow-md"
              }`}
            >
              <div>
                {branch.isHeadOffice && (
                  <div className="inline-block bg-mcoa-midnight text-mcoa-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 border border-mcoa-gold/40">
                    Academy Headquarters
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
                    {branch.name}
                  </h3>
                  <MapPin
                    className={`w-5 h-5 shrink-0 ${
                      branch.isHeadOffice ? "text-mcoa-gold" : "text-mcoa-amethyst"
                    }`}
                  />
                </div>

                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {branch.address}
                </p>

                <div className="mt-2 text-[11px] font-semibold text-mcoa-amethyst">
                  PIN: {branch.postalCode}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                <a
                  href={`tel:${branch.phone}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-mcoa-amethyst transition"
                >
                  <Phone className="w-3.5 h-3.5 text-mcoa-gold" />
                  <span>{branch.phone}</span>
                </a>

                <a
                  href={`mailto:${branch.email}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-mcoa-amethyst transition truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-mcoa-gold" />
                  <span className="truncate">{branch.email}</span>
                </a>

                <div className="pt-2">
                  <Link
                    href={`/contact?branch=${branch.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-mcoa-midnight hover:text-mcoa-amethyst transition"
                  >
                    <span>View Map & Directions</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
