import { FaInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="border-y-1 border-gray-200/70 px-8">
      <div className="border-x-1 border-gray-200/70">
        <footer className="md:grid md:grid-cols-3 gap-4 p-6">
          <div className="text-center md:text-left">
            <span className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Nova. All rights reserved.
            </span>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-400">
              By registering, I agree to{" "}
              <Link to="/terms" className="text-blue-500 hover:underline">
                Terms & Conditions
              </Link>
            </span>
          </div>
          <div className="flex gap-4 justify-center md:justify-end md:mt-0 mt-4">
            <a
              href="https://www.instagram.com/novainvest.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                size={20}
              />
            </a>
            <FaSquareXTwitter
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              size={20}
            />
          </div>
          <div className="text-sm text-gray-400 mt-4 md:mt-0 md:col-span-3 text-center">
            Risk Disclaimer: Nova AI does not guarantee profits, specific
            success rates, or prediction accuracy in the future.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
