import { FaInstagram, FaSquareXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="border-y-1 border-gray-200/70 px-8">
      <div className="border-x-1 border-gray-200/70">
        <footer className="flex justify-between p-6">
          <div>
            {/* <h3 className="font-semibold text-gray-900 text-xl">Nova</h3>
        <p className="text-sm text-gray-400 mt-2">
          Pendamping investasi yang tenang dan didukung AI, dirancang untuk
          membantu Anda merencanakan, melacak, dan memahami uang Anda tanpa
          gangguan.
        </p> */}
            <span className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Nova. All rights reserved.
            </span>
          </div>
          <div className="flex gap-4">
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
        </footer>
      </div>
    </div>
  );
}

export default Footer;
