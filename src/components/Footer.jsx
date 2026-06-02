import { FaInstagram, FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="border-y-1 border-gray-200/70 px-8">
      <div className="border-x-1 border-gray-200/70">
        <footer className="grid grid-cols-3 gap-4 p-6">
          <div>
            <span className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Nova. All rights reserved.
            </span>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-400">
              Dengan mendaftar, saya menyetujui{" "}
              <Link to="/terms" className="text-blue-500 hover:underline">
                Syarat & Ketentuan
              </Link>
            </span>
          </div>
          <div className="flex gap-4 justify-end">
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
          <div className="text-sm text-gray-400 col-span-3 text-center">
            Disclaimer Risiko: Nova AI tidak menjamin keuntungan, tingkat
            keberhasilan tertentu, ataupun akurasi prediksi di masa mendatang.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
