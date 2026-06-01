import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const photos = [
  {
    src: "/images/food/oreo-chocolate-chip.jpg",
    alt: "Jealous Fork Chocolate Oreo Chip pancakes in Kendall Miami",
    title: "Chocolate Oreo Chip Pancakes",
  },
  {
    src: "/images/food/lemon-curd-blueberry.jpg",
    alt: "Jealous Fork lemon curd blueberry pancakes photo",
    title: "Lemon Curd & Blueberry Pancakes",
  },
  {
    src: "/images/food/peanut-butter-maple.jpg",
    alt: "Jealous Fork peanut butter maple pancakes photo",
    title: "Peanut Butter Maple Pancakes",
  },
  {
    src: "/images/food/banana-walnut-smoked-maple.jpg",
    alt: "Jealous Fork banana walnut smoked maple pancakes photo",
    title: "Banana Walnut Smoked Maple",
  },
  {
    src: "/images/food/viking-telle.jpg",
    alt: "Jealous Fork Viking Telle brunch plate photo",
    title: "Viking Telle Brunch Plate",
  },
  {
    src: "/images/food/jesse-james-burger.jpg",
    alt: "Jealous Fork Jesse James burger photo",
    title: "Jesse James Burger",
  },
  {
    src: "/images/about/Restaurant Telemundo National.jpg",
    alt: "Jealous Fork restaurant featured on Telemundo National",
    title: "Featured on Telemundo National",
  },
  {
    src: "/images/restaurant/interior.jpg",
    alt: "Jealous Fork Kendall restaurant interior photo",
    title: "Kendall Restaurant Interior",
  },
];

const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Jealous Fork Photos",
  description: "Photos of Jealous Fork pancakes, brunch plates, burgers, and the Kendall Miami restaurant.",
  url: "https://www.jealousfork.com/gallery",
  image: photos.map((photo) => `https://www.jealousfork.com${photo.src}`),
};

export default function GalleryPage() {
  return (
    <>
      <SEOHead
        title="Jealous Fork Photos | Pancakes & Brunch Gallery"
        description="See Jealous Fork photos of 4.7★ pancakes, brunch plates, burgers, and the Kendall Miami restaurant before you order pickup, delivery, or reserve a table."
        canonical="https://www.jealousfork.com/gallery"
        ogImage="https://www.jealousfork.com/images/og/jealous-fork-og.jpg"
        keywords="Jealous Fork photos, Jealous Fork gallery, pancakes photos Miami, brunch photos Kendall, Jealous Fork menu photos"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }} />
      <Navigation />

      <main className="bg-white">
        <section className="bg-gradient-to-br from-warm-amber/15 via-white to-gray-50 px-4 pb-14 pt-28 text-center">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-warm-amber">Jealous Fork photos</p>
            <h1 className="font-playfair text-4xl font-bold text-gray-950 md:text-6xl">
              Pancakes, brunch plates, burgers, and Kendall restaurant photos
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-700">
              Browse real Jealous Fork photos before you visit: signature pancakes, brunch favorites, burgers, and a look inside our Kendall Miami restaurant.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/full-menu">
                <Button size="lg" className="bg-warm-amber text-white hover:bg-warm-amber/90">View Full Menu</Button>
              </Link>
              <Link href="/breakfast-near-me">
                <Button size="lg" variant="outline">See Breakfast Favorites</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure key={photo.src} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <img src={photo.src} alt={photo.alt} className="h-72 w-full object-cover" loading="lazy" />
                <figcaption className="p-4">
                  <h2 className="text-lg font-semibold text-gray-950">{photo.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">Photo from Jealous Fork in Kendall, Miami.</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
