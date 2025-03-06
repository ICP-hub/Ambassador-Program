import React from "react";
import Footer from "../footer/Footer";
import Navbar from "../modules/Navbar/Navbar";

export default function ParentComponent(props) {
  return (
    <>
      <div className="flex w-full px-2 flex-col items-center pb-5 bg-gradient-to-b from-[#1E0F33]/80 to-[#9173FF]/10">
        <Navbar />
        {props.children}
      </div>
      <Footer />
    </>
  );
}
