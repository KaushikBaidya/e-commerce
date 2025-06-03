import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Top Gradient Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-1/2 w-[72rem] -translate-x-1/2 rotate-[30deg] aspect-[1155/678] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:w-[108rem]"
          />
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-2xl py-28 sm:py-32 lg:py-32 text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-4 py-1 text-sm text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Our spring fine art auction is now live.{' '}
              <Link to="/shop/auction" className="font-medium text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Explore now <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <h1 className="text-5xl font-medium tracking-tight text-balance text-gray-900 sm:text-7xl">
            Own Timeless Artworks Through Live Auctions
          </h1>

          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl">
            Discover and bid on exclusive paintings and fine art photography from renowned and
            emerging artists. Collect beauty, invest in stories.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/shop/auction"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Bidding
            </Link>
            <Link to="/shop/auction" className="text-sm font-medium text-gray-900 hover:underline">
              Browse Collections <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Gradient Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-1/2 w-[72rem] -translate-x-1/2 aspect-[1155/678] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:w-[108rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
