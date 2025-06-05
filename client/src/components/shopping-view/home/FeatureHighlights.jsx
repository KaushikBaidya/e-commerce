import AnimatedContent from '@/components/common/AnimatedContent';
import { Gavel, Search, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Live Bidding Experience',
    description:
      'Engage in real-time auctions and experience the thrill of bidding on rare, collectible artworks.',
    icon: Gavel,
  },
  {
    title: 'Curated Collections',
    description:
      'Browse a carefully selected gallery of fine art, including paintings, photography, and sculptures from around the world.',
    icon: Search,
  },
  {
    title: 'Authenticity Guaranteed',
    description:
      'Every artwork is verified and comes with provenance to ensure authenticity and peace of mind.',
    icon: ShieldCheck,
  },
  {
    title: 'Trusted Community',
    description:
      'Join a network of collectors and artists who value and support authentic art experiences.',
    icon: Gavel,
  },
  {
    title: 'Global Access',
    description: 'Bid and explore art from around the world, no matter where you are.',
    icon: Search,
  },
];

const FeatureHighlights = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight font-cormorantGaramond">
          Discover Why Collectors Choose Us
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          From timeless masterpieces to emerging talent, we offer a trusted and seamless way to
          build your art collection.
        </p>

        {/* Custom Layout */}
        <AnimatedContent
          distance={200}
          direction="vertical"
          reverse={false}
          duration={0.5}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.2}
          threshold={0.2}
          delay={0.1}
        >
          <div className="relative flex flex-col items-center space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:grid-rows-3 md:gap-8 justify-items-center">
            <div className="md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-1">
              <FeatureCard {...features[0]} />
            </div>
            <div className="md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-1">
              <FeatureCard {...features[1]} />
            </div>
            <div className="md:col-span-1 md:row-span-1 md:col-start-2 md:row-start-2 z-10">
              <FeatureCard {...features[2]} />
            </div>
            <div className="md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-3">
              <FeatureCard {...features[3]} />
            </div>
            <div className="md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-3">
              <FeatureCard {...features[4]} />
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
};

// Single Feature Card
const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="w-96 p-6 bg-white/70 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl hover:shadow-2xl hover:scale-105 transition duration-300">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default FeatureHighlights;
