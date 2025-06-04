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
];

const FeatureHighlights = () => {
  return (
    <section className="py-32 bg-gradient-to-br px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          Discover Why Collectors Choose Us
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          From timeless masterpieces to emerging talent, we offer a trusted and seamless way to
          build your art collection.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 bg-white shadow-xl rounded-2xl hover:shadow-2xl transition duration-300 text-left"
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
