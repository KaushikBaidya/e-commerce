import { ArrowRight, Play, Sparkles, TrendingUp, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../common/BlurText';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { label: 'Artworks Sold', value: '12.5K+', icon: Trophy },
    { label: 'Active Collectors', value: '8.2K+', icon: Users },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      <div className="relative z-10 px-6 pt-32 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="mb-10 inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-indigo-200 px-4 py-2 rounded-full text-sm text-gray-700 shadow-md">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Spring Collection 2025 is live —
            <Link
              to="/shop/auction"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Explore now <ArrowRight className="inline w-3 h-3" />
            </Link>
          </div>

          {/* Main Headline */}
          <BlurText
            text="Own Timeless Artworks"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-tight"
          />
          <BlurText
            text="Through Live Auctions"
            delay={300}
            animateBy="words"
            direction="top"
            className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-tight"
          />

          {/* Subtext */}
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 font-medium">
            Bid on rare and captivating works from emerging and established artists. Elevate your
            space and investment.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/shop/auction"
              className="relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition-all"
            >
              <span className="flex items-center gap-2 z-10 relative">
                Start Collecting <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 blur opacity-70 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"></div>
            </Link>

            <Link
              to="/shop/auction"
              className="group flex items-center gap-3 px-6 py-3 border border-gray-300 bg-white/60 backdrop-blur-xl rounded-xl font-medium text-gray-800 hover:scale-105 transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-white" />
              </div>
              Watch Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    currentStat === index ? 'scale-110 opacity-100' : 'opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentStat === index
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    } transition-all duration-500`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
