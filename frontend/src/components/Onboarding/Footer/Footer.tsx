import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-indigo-400 to-indigo-100 text-white py-8" style={{bottom:0}}>
      <div className="container mx-auto px-4 text-black">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold mb-2">Take control with <span className="text-gradient text-blue-400">Andromeda</span></h2>
          <p>Using Andromeda gives you the power to fully customize your project.</p>
          <p className="mb-4">Take advantage of transparent financing today.</p>
          <div className="flex justify-left items-center space-x-4">
            <button className="bg-white py-2 px-4 rounded hover:bg-gray-600">
              Get Started
            </button>
			      <span className="font-bold">or</span>
            <button className="bg-white py-2 px-4 rounded hover:bg-gray-600">
              Contact Us
            </button>
          </div>
        </div>
        
        <hr className="border-gray-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p>Email: help@andromeda.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
          <div className="flex flex-col md:flex-row justify-end flex-1">
            <div className="mb-4 md:mb-0 mr-16">
              <h3 className="text-lg font-bold">Andromeda</h3>
              <ul className="list-none">
                <li><a href="/" aria-label="Home">Home</a></li>
                <li><a href="/FAQ" aria-label="FAQ">FAQ</a></li>
                <li><a href="/services" aria-label="Services">Services</a></li>
                <li><a href="/mission" aria-label="Mission">Mission</a></li>
              </ul>
            </div>
            <div className="mb-4 md:mb-0 mr-16">
              <h3 className="text-lg font-bold">Support</h3>
              <ul className="list-none">
                <li><a href="/contact" aria-label="Contact Us">Contact Us</a></li>
                <li><a href="/FAQ" aria-label="Newsletter">Newsletter</a></li>
              </ul>
            </div>
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">Community</h3>
              <ul className="list-none">
                <li><a href="/" aria-label="Instagram">Instagram</a></li>
                <li><a href="/" aria-label="Twitter">Twitter</a></li>
                <li><a href="/" aria-label="Youtube">Youtube</a></li>
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