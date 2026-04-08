"use client";

import Title from "@/components/shared/title";
import { Skeleton } from "@/components/ui/skeleton";
import useAbout from "@/hooks/useAbout";
import useOrganization from "@/hooks/useOrganization";
import Image from "next/image";

export default function AboutPage() {
  const { data: organization } = useOrganization();
  const { data: aboutData, isLoading } = useAbout();
  const about = aboutData || null;

  return (
    <main className="min-h-screen">
      {isLoading && <LoadingAboutPage />}

      {!isLoading && about && (
        <div>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50">
            <div className="container mx-auto px-4 py-8  ">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="mb-3">
                  <Title value={organization?.name || ""} />
                </h1>
                <p className="text-xl text-slate-700 leading-relaxed font-medium">
                  জ্ঞানই শক্তি — শিক্ষার আলো ছড়িয়ে দিতে অঙ্গীকারবদ্ধ
                </p>
              </div>
            </div>
          </section>

          {/* History Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative p-2 bg-gray-100">
                    {about?.image ? (
                      <Image
                        src={about.image}
                        alt="about image alt"
                        width={800}
                        height={500}
                        className="w-full h-[350px] lg:h-[500px] object-cover rounded-xl"
                        priority
                      />
                    ) : (
                      <div className="w-full h-[350px] lg:h-[500px] flex items-center justify-center bg-gray-200 rounded-xl text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="mb-8">
                      <Title value={"কলেজের ইতিহাস"} />
                    </h2>
                    <div className="space-y-6">
                      {about?.description || "description ..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h3 className="font-bold mb-4">
                  <Title value="আমাদের গর্বের পরিসংখ্যান" />
                </h3>
                <p className="text-slate-600 text-xl font-medium">
                  Our Proud Statistics
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* total students */}
                <div className="bg-white rounded-2xl p-10 shadow-md border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`text-5xl lg:text-6xl font-bold text-green-600 mb-4`}
                  >
                    {about?.stats?.student || "3000"}+
                  </div>
                  <div className="text-slate-800 font-semibold text-xl mb-2">
                    শিক্ষার্থী
                  </div>
                  <div className="text-slate-500 text-lg">Students</div>
                </div>

                {/* total teachers */}
                <div className="bg-white rounded-2xl p-10 shadow-md border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`text-5xl lg:text-6xl font-bold text-blue-600 mb-4`}
                  >
                    {about?.stats?.teacher || "50"}+
                  </div>
                  <div className="text-slate-800 font-semibold text-xl mb-2">
                    শিক্ষক
                  </div>
                  <div className="text-slate-500 text-lg">Teachers</div>
                </div>
                {/* total students */}
                <div className="bg-white rounded-2xl p-10 shadow-md border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`text-5xl lg:text-6xl font-bold text-red-600 mb-4`}
                  >
                    {about?.stats?.passPercentage || "98"}%
                  </div>
                  <div className="text-slate-800 font-semibold text-xl mb-2">
                    পাসের হার
                  </div>
                  <div className="text-slate-500 text-lg">Pass rate</div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-12 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="mb-8">
                  <Title value={"যোগাযোগ"} />
                </h2>
                <div className="space-y-3 text-slate-700">
                  <p className="text-xl font-medium">
                    {organization?.address || "no address"}
                  </p>
                  <p className="text-xl">
                    ইমেইল: {organization?.email || "no email"}
                  </p>
                  <p className="text-xl">
                    ফোন: {organization?.phone || "no phone"}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200   mx-auto">
                <iframe
                  src={
                    about?.mapUrl ||
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.8400584236975!2d89.3691893753125!3d24.364803978293966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc54b2c4a26b4d%3A0x589c299c1de7e2da!2sGovernment%20Azizul%20Haque%20College!5e0!3m2!1sen!2sbd!4v1692642848152"
                  }
                  width="100%"
                  height="450"
                  className="border-0 rounded-2xl w-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="College Location Map"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {!about && !isLoading && (
        <div className="flex justify-center items-center w-full h-[350px] bg-white shadow-xl rounded-xl container mx-auto mt-8">
          <div className="text-2xl">No Data Available</div>
        </div>
      )}
    </main>
  );
}

const LoadingAboutPage = () => (
  <div className="space-y-4 container mx-auto mt-8 px-4">
    <Skeleton className="bg-gray-300 max-w-4xl mx-auto h-10" />
    <Skeleton className="bg-gray-300 max-w-[300px] lg:max-w-3xl mx-auto h-10" />
    <div className="w-full h-[400px] flex flex-col lg:flex-row gap-4 py-4">
      <Skeleton className="bg-gray-300 w-full h-full" />
      <Skeleton className="bg-gray-300 w-full h-full" />
    </div>
    <Skeleton className="bg-gray-300 max-w-4xl mx-auto h-10" />
    <Skeleton className="bg-gray-300 max-w-[300px] lg:max-w-3xl mx-auto h-10" />
    <div className="w-full h-[400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      <Skeleton className="bg-gray-300 w-full h-full" />
      <Skeleton className="bg-gray-300 w-full h-full" />
      <Skeleton className="bg-gray-300 w-full h-full" />
    </div>
  </div>
);
