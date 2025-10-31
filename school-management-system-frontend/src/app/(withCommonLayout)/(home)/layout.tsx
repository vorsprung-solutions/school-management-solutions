import Navbar from "@/components/nav/Navbar";
import SubNav from "@/components/nav/SubNav";
import Footer from "@/components/pages/home/Footer";
import ScrollToTop from "@/components/shared/scroll-to-top";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="mx-auto flex-grow">
        <SubNav />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default layout;
