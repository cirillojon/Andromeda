import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Take control with <span className="text-blue-400">Andromeda</span>
          </h2>
          <p className="mb-4">
            Using Andromeda gives you the power to fully customize your project.
          </p>
          <p className="mb-8">Take advantage of transparent financing today.</p>
        </div>

        <hr className="border-gray-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p>Email: help@andromeda.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16">
            <div>
              <h3 className="text-lg font-bold mb-2">Andromeda</h3>
              <ul className="list-none space-y-2">
                <li>
                  <a href="/" aria-label="Home" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/FAQ" aria-label="FAQ" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    aria-label="Services"
                    className="hover:underline"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/mission"
                    aria-label="Mission"
                    className="hover:underline"
                  >
                    Mission
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Support</h3>
              <ul className="list-none space-y-2">
                <li>
                  <a
                    href="/contact"
                    aria-label="Contact Us"
                    className="hover:underline"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/FAQ"
                    aria-label="Newsletter"
                    className="hover:underline"
                  >
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Community</h3>
              <ul className="list-none space-y-2">
                <li>
                  <a
                    href="/"
                    aria-label="Instagram"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="/" aria-label="Twitter" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="/" aria-label="Youtube" className="hover:underline">
                    Youtube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Andromeda. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
