import FAQAccordion from '@/components/shopping-view/home/FAQAccordion';
import FeaturedGallery from '@/components/shopping-view/home/FeaturedGallery';
import FeatureHighlights from '@/components/shopping-view/home/FeatureHighlights';
import Hero from '@/components/shopping-view/home/Hero';
import NewArtists from '@/components/shopping-view/home/NewArtists';

const ShoppingHome = () => {
  return (
    <>
      <Hero />
      <FeatureHighlights />
      <NewArtists />
      <FeaturedGallery />
      <FAQAccordion />
    </>
  );
};

export default ShoppingHome;
