"use client";

import { useState } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Heart,
  Target,
  Award,
  Globe,
  Lightbulb,
  Shield,
  Star,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import useAbout from "@/hooks/useAbout";

const CommonFeaturesSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const { data } = useAbout();
  const about = data || null;

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      question: "আমাদের শিক্ষার মান কেমন?",
      questionEn: "What is the quality of our education?",
      answer:
        "আমাদের প্রতিষ্ঠানে আধুনিক শিক্ষা পদ্ধতি ও আন্তর্জাতিক মানের পাঠ্যক্রম অনুসরণ করা হয়। অভিজ্ঞ শিক্ষকমণ্ডলী ও আধুনিক প্রযুক্তির সাহায্যে আমরা শিক্ষার্থীদের সর্বোচ্চ মানের শিক্ষা প্রদান করি।",
      answerEn:
        "We follow modern teaching methods with international standard curriculum. With experienced faculty and modern technology, we provide the highest quality education to our students.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      question: "শিক্ষকদের যোগ্যতা কী রকম?",
      questionEn: "What are the qualifications of our teachers?",
      answer:
        "আমাদের সকল শিক্ষক উচ্চ শিক্ষিত ও দক্ষ। তাঁরা নিয়মিত প্রশিক্ষণ গ্রহণ করেন এবং শিক্ষার্থীদের ব্যক্তিগত উন্নতিতে বিশেষ নজর রাখেন। প্রতিটি বিষয়ে বিশেষজ্ঞ শিক্ষক রয়েছেন।",
      answerEn:
        "All our teachers are highly qualified and skilled. They receive regular training and pay special attention to students' personal development. We have specialist teachers for each subject.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      question: "গ্রন্থাগারে কী কী সুবিধা আছে?",
      questionEn: "What facilities are available in the library?",
      answer:
        "আমাদের গ্রন্থাগারে হাজারো বই, জার্নাল, ম্যাগাজিন এবং ডিজিটাল রিসোর্স রয়েছে। ইন্টারনেট সুবিধা, পড়ার জন্য শান্ত পরিবেশ এবং গবেষণার জন্য প্রয়োজনীয় সব উপকরণ পাওয়া যায়।",
      answerEn:
        "Our library has thousands of books, journals, magazines and digital resources. Internet facilities, quiet study environment and all necessary materials for research are available.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      question: "খেলাধুলা ও সাংস্কৃতিক কার্যক্রম কেমন?",
      questionEn: "How are sports and cultural activities?",
      answer:
        "নিয়মিত খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান, বিতর্ক প্রতিযোগিতা এবং বিভিন্ন প্রতিযোগিতার আয়োজন করা হয়। এতে শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশ ঘটে এবং নেতৃত্বের গুণাবলী তৈরি হয়।",
      answerEn:
        "Regular sports, cultural programs, debate competitions and various contests are organized. This helps in physical and mental development of students and builds leadership qualities.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      question: "শিক্ষার্থীদের জন্য কী ধরনের সহায়তা আছে?",
      questionEn: "What kind of support is available for students?",
      answer:
        "একাডেমিক সমস্যা, ব্যক্তিগত সমস্যা এবং ক্যারিয়ার নিয়ে পরামর্শের জন্য বিশেষজ্ঞ কাউন্সেলর রয়েছেন। এছাড়া টিউটোরিয়াল ক্লাস, অতিরিক্ত সহায়তা এবং মানসিক স্বাস্থ্য সেবা প্রদান করা হয়।",
      answerEn:
        "Expert counselors are available for academic problems, personal issues and career guidance. Additionally, tutorial classes, extra support and mental health services are provided.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      question: "ক্যারিয়ার গাইডেন্স কীভাবে দেওয়া হয়?",
      questionEn: "How is career guidance provided?",
      answer:
        "বিশেষজ্ঞ ক্যারিয়ার কাউন্সেলর, বিভিন্ন পেশার মানুষদের সাথে সেমিনার, ইন্ডাস্ট্রি ভিজিট এবং ইন্টার্নশিপের ব্যবস্থা রয়েছে। শিক্ষার্থীরা তাদের আগ্রহ ও যোগ্যতা অনুযায়ী সঠিক পথ বেছে নিতে পারেন।",
      answerEn:
        "Expert career counselors, seminars with professionals, industry visits and internship arrangements are available. Students can choose the right path according to their interests and abilities.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      question: "বৃত্তি ও আর্থিক সহায়তার ব্যবস্থা কী?",
      questionEn:
        "What scholarship and financial assistance arrangements are there?",
      answer:
        "মেধাবী শিক্ষার্থীদের জন্য মেধা বৃত্তি, অসহায় শিক্ষার্থীদের জন্য আর্থিক সহায়তা এবং বিশেষ প্রতিভাবান শিক্ষার্থীদের জন্য বিশেষ বৃত্তির ব্যবস্থা রয়েছে। কিস্তিতে ফি পরিশোধের সুবিধাও আছে।",
      answerEn:
        "Merit scholarships for talented students, financial assistance for needy students and special scholarships for specially gifted students are available. Installment fee payment facility is also available.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      question: "প্রযুক্তিগত সুবিধা কেমন?",
      questionEn: "How are the technological facilities?",
      answer:
        "ডিজিটাল ক্লাসরুম, প্রজেক্টর, কম্পিউটার ল্যাব, হাই-স্পিড ইন্টারনেট এবং অনলাইন লার্নিং প্ল্যাটফর্ম রয়েছে। শিক্ষার্থীরা ঘরে বসেও ক্লাস করতে এবং অ্যাসাইনমেন্ট জমা দিতে পারেন।",
      answerEn:
        "Digital classrooms, projectors, computer labs, high-speed internet and online learning platforms are available. Students can attend classes and submit assignments from home.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      question: "গবেষণা ও উদ্ভাবনের সুযোগ কী?",
      questionEn: "What opportunities are there for research and innovation?",
      answer:
        "বিজ্ঞান গবেষণাগার, প্রকল্প কার্যক্রম, বিজ্ঞান মেলা এবং উদ্ভাবনী প্রতিযোগিতার আয়োজন করা হয়। শিক্ষার্থীরা নিজেদের সৃজনশীলতা ও গবেষণা দক্ষতা বিকাশ করতে পারেন।",
      answerEn:
        "Science laboratories, project programs, science fairs and innovation competitions are organized. Students can develop their creativity and research skills.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      question: "ক্যাম্পাসের নিরাপত্তা ব্যবস্থা কেমন?",
      questionEn: "How is the campus security system?",
      answer:
        "২৪/৭ নিরাপত্তা গার্ড, সিসিটিভি ক্যামেরা, নিয়ন্ত্রিত প্রবেশ ব্যবস্থা এবং জরুরি অবস্থার জন্য দ্রুত সাড়া দেওয়ার ব্যবস্থা রয়েছে। শিক্ষার্থী ও অভিভাবকদের নিরাপত্তা আমাদের প্রথম অগ্রাধিকার।",
      answerEn:
        "24/7 security guards, CCTV cameras, controlled access system and rapid response system for emergencies are in place. Safety of students and parents is our first priority.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mb-6 shadow-lg">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            প্রায়শই জিজ্ঞাসিত প্রশ্ন
          </h2>
          <h3 className="text-xl md:text-2xl text-slate-600 mb-6">
            Frequently Asked Questions
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-6 max-w-3xl mx-auto">
            আমাদের প্রতিষ্ঠান সম্পর্কে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলোর উত্তর
            জানুন
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600">
                        {feature.icon}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        {feature.question}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {feature.questionEn}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center transition-all duration-300 ${
                        openItems.includes(index)
                          ? "bg-blue-600 text-white rotate-180"
                          : "text-blue-600"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openItems.includes(index)
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="pl-16">
                      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border-l-4 border-blue-600">
                        <p className="text-slate-700 leading-relaxed mb-3">
                          {feature.answer}
                        </p>
                        <p className="text-slate-500 text-sm leading-relaxed italic">
                          {feature.answerEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              আমাদের গর্বের পরিসংখ্যান
            </h3>
            <p className="text-slate-600">Our Proud Statistics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {about?.stats?.student || "0"}+
              </div>
              <div className="text-slate-600 font-medium">শিক্ষার্থী</div>
              <div className="text-slate-500 text-sm">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {about?.stats?.teacher || "0"}+
              </div>
              <div className="text-slate-600 font-medium">শিক্ষক</div>
              <div className="text-slate-500 text-sm">Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {about?.stats?.passPercentage || "0"}%
              </div>
              <div className="text-slate-600 font-medium">পাসের হার</div>
              <div className="text-slate-500 text-sm">Pass Rate</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-600 mb-6">
            আরও কোনো প্রশ্ন আছে? আমাদের সাথে যোগাযোগ করুন
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-blue-900">
              <Link
                href={"/contact"}
                className="flex justify-center items-center"
              >
                {" "}
                যোগাযোগ করুন <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonFeaturesSection;
