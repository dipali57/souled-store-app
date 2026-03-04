import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-300 pb-6">
      <div className="text-center mb-12">
        <h3 className="text-lg text-white p-4 font-bold bg-red-500">
          HOMEGROWN INDIAN BRAND
        </h3>
        <p className="text-4xl bg-white text-black p-4">
          Over <span className="font-bold">6 Million</span> Happy Customers
        </p>
      </div>

      <div className="bg-gray-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Brand Section */}

        {/* Main Footer Content - Grid */}
        <div className="text-center m-12 p-12 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-3 mb-12 text-center lg:text-left">
          {/* Column 1 - Need Help */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">NEED HELP</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <Link to="/contact" className="hover:text-red-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-red-500 transition"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-red-500 transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-red-500 transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-red-500 transition">
                  My Account
                </Link>
              </li>
              <li className="text-red-600 mt-2">✓ COD Available</li>
              <li className="text-red-600">30 Days Easy Returns & Exchanges</li>
            </ul>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">COMPANY</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <Link to="/about" className="hover:text-red-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/investor-relations"
                  className="hover:text-red-500 transition"
                >
                  Investor Relation
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-red-500 transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/gift-vouchers"
                  className="hover:text-red-500 transition"
                >
                  Gift Vouchers
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-red-500 transition">
                  Community Initiatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - More Info */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">MORE INFO</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <Link to="/terms" className="hover:text-red-500 transition">
                  T&C
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-red-500 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-red-500 transition">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/notify" className="hover:text-red-500 transition">
                  Get Notified
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-red-500 transition">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Store Near Me */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">STORE NEAR ME</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <Link
                  to="/store/mumbai"
                  className="hover:text-red-500 transition"
                >
                  Mumbai
                </Link>
              </li>
              <li>
                <Link
                  to="/store/pune"
                  className="hover:text-red-500 transition"
                >
                  Pune
                </Link>
              </li>
              <li>
                <Link
                  to="/store/bangalore"
                  className="hover:text-red-500 transition"
                >
                  Bangalore
                </Link>
              </li>
              <li>
                <Link
                  to="/store/hubballi"
                  className="hover:text-red-500 transition"
                >
                  Hubballi
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="text-black font-semibold hover:underline transition"
                >
                  View More
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Empty or could be used for social media or other content */}
          <div>
            {/*  add social media links or other content here if needed */}
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-800 pt-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold">
                EXPERIENCE THE SOULED STORE APP
              </h4>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/app/android"
                className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded text-sm font-semibold transition"
              >
                GET IT ON Google Play
              </Link>
              <Link
                to="/app/ios"
                className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded text-sm font-semibold transition"
              >
                Download on the App Store
              </Link>
            </div>
          </div>
        </div>

        <div className="border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © The Souled Store 2026-27
        </div>
      </div>
    </footer>
  );
};
