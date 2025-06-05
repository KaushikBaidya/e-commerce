import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Address */}
          <div>
            <img src={Logo} alt="Logo" className="h-10 mb-4" />
            <p className="text-sm text-gray-700 leading-relaxed">
              123 Art Street
              <br />
              Gallery City, AG 45678
              <br />
              Bangladesh
            </p>
          </div>

          {/* Menus */}
          <div className="md:col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Explore */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Explore</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/" className="hover:text-gray-800 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/galeria/announcements"
                    className="hover:text-gray-800 transition-colors"
                  >
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link to="/galeria/community" className="hover:text-gray-800 transition-colors">
                    Galería Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/about-us" className="hover:text-gray-800 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gray-800 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-gray-800 transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/faq" className="hover:text-gray-800 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-gray-800 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-gray-800 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} <span className="font-medium">Galería</span>. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
