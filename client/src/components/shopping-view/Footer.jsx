import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png"; // adjust the path as needed

const Footer = () => {
	return (
		<footer className="bg-white text-gray-900 border-t">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Logo & Address */}
					<div className="col-span-1">
						<img src={Logo} alt="Logo" className="h-10 mb-4" />
						<p className="text-sm text-gray-700">
							123 Art Street
							<br />
							Gallery City, AG 45678
							<br />
							Bangladesh
						</p>
					</div>

					{/* Menus */}
					<div className="col-span-1 md:col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3">
								Explore
							</h3>
							<ul className="space-y-2 text-sm text-gray-400">
								<li>
									<Link to="/" className="hover:text-gray-600">
										Home
									</Link>
								</li>
								<li>
									<Link to="/paintings" className="hover:text-gray-600">
										Paintings
									</Link>
								</li>
								<li>
									<Link to="/pictures" className="hover:text-gray-600">
										Pictures
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3">
								Company
							</h3>
							<ul className="space-y-2 text-sm text-gray-400">
								<li>
									<Link to="/about" className="hover:text-gray-600">
										About Us
									</Link>
								</li>
								<li>
									<Link to="/contact" className="hover:text-gray-600">
										Contact
									</Link>
								</li>
								<li>
									<Link to="/careers" className="hover:text-gray-600">
										Careers
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold text-gray-600 mb-3">
								Support
							</h3>
							<ul className="space-y-2 text-sm text-gray-400">
								<li>
									<Link to="/faq" className="hover:text-gray-600">
										FAQ
									</Link>
								</li>
								<li>
									<Link to="/terms" className="hover:text-gray-600">
										Terms
									</Link>
								</li>
								<li>
									<Link to="/privacy" className="hover:text-gray-600">
										Privacy Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Disclaimer */}
				<div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500 uppercase">
					&copy; {new Date().getFullYear()} Galería. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
