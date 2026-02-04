import Link from "next/link";
import { Container } from "./container";
import { HeartIcon } from "@/components/icons/category-icons";

const footerLinks = {
  help: {
    title: "Get Help",
    links: [
      { name: "Submit a Request", href: "/request-help" },
      { name: "Browse Offers", href: "/offers" },
      { name: "Resource Directory", href: "/resources" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  volunteer: {
    title: "Volunteer",
    links: [
      { name: "Offer Help", href: "/offer-help" },
      { name: "View Requests", href: "/requests" },
      { name: "Upcoming Events", href: "/events" },
      { name: "Donate", href: "/donate" },
    ],
  },
  about: {
    title: "About",
    links: [
      { name: "Our Mission", href: "/about" },
      { name: "Meet the Team", href: "/about#team" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="size-9 rounded-xl bg-forest-500 flex items-center justify-center">
                  <HeartIcon className="size-5 text-white" />
                </div>
                <span className="font-semibold text-white">Mutual Aid</span>
              </Link>
              <p className="mt-4 text-sm text-stone-400 leading-relaxed">
                Neighbors helping neighbors. Together, we build a stronger
                community.
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-stone-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-stone-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-400">
            &copy; {currentYear} Mutual Aid Network. All rights reserved.
          </p>
          <p className="text-sm text-stone-500">
            Built with love for our community
          </p>
        </div>
      </Container>
    </footer>
  );
}
