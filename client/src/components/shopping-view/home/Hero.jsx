import { ArrowRight, Play, Sparkles, TrendingUp, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../../common/BlurText';

const Hero = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { label: 'Artworks Sold', value: '12.5K+', icon: Trophy },
    { label: 'Active Collectors', value: '8.2K+', icon: Users },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative isolate px-6 lg:px-8 bg-white">
      {/* Top Blobby Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[100rem]"
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl py-32 sm:py-32 lg:py-48">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-indigo-200 px-4 py-2 rounded-full text-sm text-gray-700 shadow-md">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Spring Collection 2025 is live —
            <Link
              to="/shop/auction"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Explore now <ArrowRight className="inline w-3 h-3" />
            </Link>
          </div>

          {/* Headline */}
          <BlurText
            text="Own Timeless Artworks"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-cormorantGaramond text-gray-900 tracking-tight leading-tight"
          />
          <BlurText
            text="Through Live Auctions"
            delay={300}
            animateBy="words"
            direction="top"
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-cormorantGaramond text-gray-900 tracking-tight leading-tight"
          />

          {/* Subtext */}
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 font-medium">
            Bid on rare and captivating works from emerging and established artists. Elevate your
            space and investment.
          </p>

          {/* CTAs */}
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
              className="group flex items-center gap-3 px-6 py-3 border border-purple-500 bg-white/60 backdrop-blur-xl rounded-xl font-medium text-gray-800 hover:scale-105 transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-white" />
              </div>
              Watch Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap justify-center gap-8">
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

      {/* Bottom Blobby Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-50rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[100rem]"
        />
      </div>
    </div>
  );
};

export default Hero;
