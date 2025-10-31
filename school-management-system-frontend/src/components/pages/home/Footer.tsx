"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  School,
} from "lucide-react";
import useOrganization from "@/hooks/useOrganization";
import useAbout from "@/hooks/useAbout";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Notices", href: "/notices" },
  { name: "Contact", href: "/contact" },
];

const academicLinks = [
  { name: "Science", href: "/department" },
  { name: "Business Studies", href: "/department" },
  { name: "Humanities", href: "/department" },
  { name: "Results", href: "/result" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: organization } = useOrganization();
  const { data: about } = useAbout();

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* School Information */}
            <div>
              <div className="flex items-center mb-4 gap-4">
                <div className="w-12 h-12 p-1 bg-white rounded-xl flex items-center justify-center shadow-xl border-4 border-blue-400">
                  {organization?.logo ? (
                    <Image
                      src={organization.logo}
                      alt="School Logo"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <School className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {organization?.name || "School Name"}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {about?.description?.slice(0, 200) || "this is description"}...
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Departments
              </h3>
              <ul className="space-y-2">
                {academicLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Contact Info
              </h3>

              <div className="space-y-3">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-300">
                      {organization?.address || "this is address"}
                    </p>
                    <p className="text-sm text-slate-300">Bangladesh</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-300">
                      +{organization?.phone || "880 0000000"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-300">
                      {organization?.email || "this is email"}
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-300">
                      Sun - Thurs: 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Follow Us
                </h4>
                <div className="flex space-x-3">
                  <Link
                    href={
                      organization?.social?.facebook || "https://facebook.com"
                    }
                    className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  >
                    <Facebook className="w-4 h-4" />
                  </Link>
                  <Link
                    href={
                      organization?.social?.twitter || "https://twitter.com"
                    }
                    className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors duration-300"
                  >
                    <Twitter className="w-4 h-4" />
                  </Link>
                  <Link
                    href={
                      organization?.social?.instagram || "https://instagram.com"
                    }
                    className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-300"
                  >
                    <Instagram className="w-4 h-4" />
                  </Link>
                  <Link
                    href={
                      organization?.social?.youtube || "https://youtube.com"
                    }
                    className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                  >
                    <Youtube className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-300">
                © {currentYear} Govt Azizul Haque College. All rights reserved.
              </p>
            </div>

            {/* Powered By */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Powered by</span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://neexg.com/"
              >
                <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg">
                  <Image
                    src="/neexg-logo.png"
                    alt="Branta Tech"
                    width={20}
                    height={20}
                    className="rounded"
                  />
                  <span className="text-sm font-semibold text-white">
                    NeexG
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
