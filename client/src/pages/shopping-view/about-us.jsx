import { Heart, Palette, Sparkles, Trophy, Users } from 'lucide-react';
import logo from '../../assets/logo.png';

const ourvalues = [
  {
    id: 1,
    text: 'Over 5,000 rare art pieces have found new homes through our platform, connecting collectors with extraordinary works from established masters.',
  },
  {
    id: 2,
    text: 'We have launched the careers of 300+ rookie artists, providing them with the exposure and recognition they deserve in the competitive art world.',
  },
  {
    id: 3,
    text: 'Our expert authentication team ensures every rare piece meets the highest standards of provenance and quality verification.',
  },
  {
    id: 4,
    text: 'We believe in the power of art to inspire and uplift, and our platform serves as a platform for artists to showcase their talent.',
  },
  {
    id: 5,
    text: 'Monthly featured artist showcases highlight emerging talent, giving rookie artists unprecedented visibility to serious collectors.',
  },
  {
    id: 6,
    text: 'We are committed to fostering a vibrant community of collectors, artists, and enthusiasts who share a passion for rare art.',
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Banner */}
      <div className="relative bg-gradient-to-r from-purple-50 to-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 text-lg">
            <div className="flex-1">
              <div className="text-5xl font-bold text-gray-900 mb-6">
                <div className="flex flex-row items-start justify-start gap-2">
                  <img src={logo} alt="logo" className="h-24" />
                </div>
                <span className="block text-4xl font-semibold text-purple-700 mt-2 font-cormorantGaramond">
                  Art Auction House
                </span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Discover extraordinary rare art pieces and support emerging rookie artists in our
                curated marketplace. We bridge the gap between seasoned collectors and fresh talent,
                creating a vibrant ecosystem where art appreciation meets investment opportunity.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Since our inception, we've been committed to democratizing art collecting while
                preserving the exclusivity and prestige that makes rare art so captivating. Every
                piece tells a story, and every artist deserves recognition.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 h-64 rounded-lg flex items-center justify-center">
                  <Palette className="w-24 h-24 text-purple-600" />
                </div>
                <p className="text-center mt-4 text-gray-600 font-medium">
                  Curating Excellence Since 2019
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Stats Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 gap-8">
            {ourvalues.map((value) => (
              <div key={value.id} className="bg-gray-100 rounded p-6 border-l-8 border-purple-600">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">0{value.id}</h3>
                <p className="text-lg text-gray-600">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-100 text-lg mb-4">
              Launched in 2019, ArtVault has become the premier destination for rare art auctions
              and rookie artist discovery, fostering a community where passion meets investment and
              talent finds its audience.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-7xl font-bold text-white mb-2">25K+</div>
              <div className="text-purple-200">Active Collectors</div>
            </div>
            <div>
              <div className="text-7xl font-bold text-white mb-2">8.5K+</div>
              <div className="text-purple-200">Artworks Sold</div>
            </div>
            <div>
              <div className="text-7xl font-bold text-white mb-2">45</div>
              <div className="text-purple-200">Countries Served</div>
            </div>
            <div>
              <div className="text-7xl font-bold text-white mb-2">98%</div>
              <div className="text-purple-200">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-16 font-cormorantGaramond">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preserve Artistic Heritage</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in preserving the world's artistic heritage while making it accessible.
                Every rare piece we auction carries history, culture, and the irreplaceable vision
                of master artists.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nurture Emerging Talent</h3>
              <p className="text-gray-600 leading-relaxed">
                We champion rookie artists by providing them with premium exposure. Our platform
                connects fresh talent with discerning collectors, fostering the next generation of
                artistic excellence.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Democratize Art Collection</h3>
              <p className="text-gray-600 leading-relaxed">
                Art collecting shouldn't be limited to the elite. We make both rare masterpieces and
                promising rookie works accessible to passionate collectors at every level, building
                a diverse artistic community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Trophy className="w-16 h-16 text-purple-600 mx-auto mb-8" />
          <h2 className="text-5xl font-bold text-gray-900 mb-8 font-cormorantGaramond">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            To create the world's most trusted and vibrant marketplace where rare art treasures find
            their perfect homes and rookie artists launch their careers with confidence and
            recognition.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We envision a future where every collector can discover their next prized piece, every
            artist can reach their audience, and the art world continues to flourish through
            thoughtful curation, authentic relationships, and unwavering dedication to excellence.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-cormorantGaramond">
            Join Our Artistic Community
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Whether you're seeking rare masterpieces or discovering the next great artist, ArtVault
            is your gateway to extraordinary art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200">
              Explore Auctions
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors duration-200">
              Submit Your Art
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
