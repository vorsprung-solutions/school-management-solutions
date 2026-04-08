"use client";

import { ContactForm } from "@/components/pages/contact/contact-form";
import { ContactInfo } from "@/components/pages/contact/contact-info";
import useOrganization from "@/hooks/useOrganization";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const { data } = useOrganization();
  const organization = data || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Ready to transform your school management? We&apos;re here to help
              you streamline operations, enhance communication, and improve
              educational outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Have questions about our school management system? Want to
                  schedule a demo? Fill out the form below and we&apos;ll get
                  back to you within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <ContactInfo
              icon={<MapPin className="h-6 w-6" />}
              title="Office Location"
              content={
                organization?.name || "Govt Azizul Haque College, Bogura"
              }
              subtitle="Visit us during school hours"
            />

            <ContactInfo
              icon={<Phone className="h-6 w-6" />}
              title="Phone Numbers"
              content={
                <div className="space-y-1">
                  <div>{organization?.phone || "02588831585"}</div>
                </div>
              }
              subtitle="Call us for immediate assistance"
            />

            <ContactInfo
              icon={<Mail className="h-6 w-6" />}
              title="Email Address"
              content={organization?.email || "ahcollege@gmail.com"}
              subtitle="We'll respond within 24 hours"
            />

            <ContactInfo
              icon={<Clock className="h-6 w-6" />}
              title="School Hours"
              content={
                <div className="space-y-1">
                  <div>Sunday - Thursday</div>
                  <div>Friday & Saturday: Closed</div>
                </div>
              }
              subtitle="Bangladesh Standard Time (BST)"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">
                We respond to all inquiries within 24 hours during business
                days.
              </p>
            </div>

            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Consultation</h3>
              <p className="text-gray-600">
                Schedule a free consultation to discuss your school&apos;s
                specific needs.
              </p>
            </div>

            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">On-site Support</h3>
              <p className="text-gray-600">
                We provide on-site training and support for seamless
                implementation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
