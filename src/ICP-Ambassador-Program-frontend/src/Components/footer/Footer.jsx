import { Link } from "react-router-dom";
import { BsTwitterX } from "react-icons/bs";
import footerImg from "../../../public/footerImg.png";

export default function Footer() {
  return (
    <div className="flex flex-col h-[450px] items-center self-stretch px-20 pt-10 pb-12 mt-0 w-full text-xl font-medium leading-tight text-center text-violet-500 bg-[#1E0F33] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-10 px-20 py-5 max-w-full rounded-3xl text-[#9173FF] bg-[#150826] bg-opacity-50 w-[1314px] max-md:px-5">
        <Link to="#" className="grow shrink w-[134px]">
          Privacy Policy
        </Link>
        <Link to="#" className="grow shrink w-[131px]">
          Cookie Policy
        </Link>
        <Link to="#" className="grow shrink w-[117px]">
          Help Center
        </Link>
        <Link to="#" className="grow shrink w-[107px]">
          Contact Us
        </Link>
        <Link to={"https://x.com"} target="_blank">
          <BsTwitterX className="w-6 h-6" />
        </Link>
      </div>
      <img
        loading="lazy"
        src={footerImg} // "https://cdn.builder.io/api/v1/image/assets/TEMP/9e6cbb194662cfbb5fc834f0d9eaebd58ab3b760f55d64589fea9227159347a2?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
        alt="footer image"
        className="object-contain mt-9 w-full aspect-[5.75]  max-w-[1314px] max-md:max-w-full"
      />
    </div>
  );
}
