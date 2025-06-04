import { useEffect, useState } from 'react';

import { CameraIcon, CurlyBracesIcon, EyeIcon, PaintbrushIcon, StarIcon } from 'lucide-react';
import PaintingImage from '../../../assets/paintings.jpg';
import PhotoImage from '../../../assets/photo.jpg';
import SculptureImage from '../../../assets/sculpture.jpg';

const tabData = {
  Paintings: {
    image: PaintingImage,
    heading: 'Discover Stunning Original Art',
    description:
      'Explore hand-picked paintings from new and emerging artists in our online auction.',
    features: [
      {
        name: 'Original Artwork',
        description: 'Each piece is uniquely crafted by emerging artists.',
        icon: PaintbrushIcon,
      },
      {
        name: 'High-Quality Preview',
        description: 'View detailed images of each painting before you buy or bid.',
        icon: EyeIcon,
      },
      {
        name: 'Curated Collection',
        description: 'Carefully selected pieces by our expert curators.',
        icon: StarIcon,
      },
    ],
  },
  Sculptures: {
    image: SculptureImage,
    heading: 'Experience Contemporary Sculpture',
    description: 'Our sculpture collection blends tradition with modern innovation.',
    features: [
      {
        name: '3D Detail',
        description: 'See every angle with 360° preview.',
        icon: CurlyBracesIcon,
      },
      {
        name: 'Artist Insight',
        description: 'Learn the story behind each piece from the creator.',
        icon: EyeIcon,
      },
      {
        name: 'Limited Editions',
        description: 'Sculptures come in rare, numbered editions.',
        icon: StarIcon,
      },
    ],
  },
  Photography: {
    image: PhotoImage,
    heading: 'Fine Art Photography',
    description: 'Dive into breathtaking photography captured by visionary artists.',
    features: [
      {
        name: 'Framed Prints',
        description: 'Professionally printed and ready to hang.',
        icon: CameraIcon,
      },
      {
        name: 'Color Accuracy',
        description: 'True-to-life tones and deep contrasts.',
        icon: EyeIcon,
      },
      {
        name: 'Curated Themes',
        description: 'Photographs grouped by emotion, place, and time.',
        icon: StarIcon,
      },
    ],
  },
};

export default function FeaturedGallery() {
  const tabKeys = Object.keys(tabData);
  const [activeTab, setActiveTab] = useState(tabKeys[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = tabKeys.indexOf(prevTab);
        const nextIndex = (currentIndex + 1) % tabKeys.length;
        return tabKeys[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [tabKeys]);

  const tab = tabData[activeTab];

  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div>
            <div className="w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-300">
              <img src={tab.image} alt={activeTab} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Content */}
          <div>
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`text-sm font-medium px-4 py-2 rounded transition ${
                    key === activeTab ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <h2 className="text-base font-medium text-indigo-600">{activeTab}</h2>
            <p className="mt-2 text-4xl font-semibold text-gray-900">{tab.heading}</p>
            <p className="mt-4 text-lg text-gray-600">{tab.description}</p>

            <div className="mt-8 space-y-6">
              {tab.features.map((feature) => (
                <div key={feature.name} className="flex items-start space-x-4">
                  <feature.icon
                    className="h-6 w-6 text-indigo-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
