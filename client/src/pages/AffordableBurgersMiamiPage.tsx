import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featuredLists = [
  {
    source: "Time Out Miami",
    title: "15 Best Burgers in Miami",
    names: "USBS, Over Under, Chug's, Blue Collar, Off Site, La Birra Bar, Motek, Proper Sausages, El Mago de las Fritas, Le Tub, Le Chick",
  },
  {
    source: "The Infatuation Miami",
    title: "The Best Burgers in Miami",
    names: "Sunny's, ViceVersa, Cowy Burger, The Gibson Room, Coney Burger, Edan Bistro, Over Under, Daniel's Miami, Cuento Sandwiches, Blue Collar",
  },
  {
    source: "Burger Beast",
    title: "Best Burgers in Miami",
    names: "Are You Hungry Grill, Babe's Meat & Counter, Blue Collar, La Birra Bar, Burgermeister, Cuento Sandwiches, Shorty's BBQ, Smoke & Dough, Ted's Burgers, USBS",
  },
  {
    source: "Boca Burger Battle",
    title: "Best Burgers in Miami Top 10",
    names: "Blue Collar, USBS, Coney Burger, Ted's Burgers, Cowy Burger, Burgermeister, Shadow Wagyu, El Rey de las Fritas",
  },
];

const comparisonRows = [
  {
    name: "Jealous Fork / Jealous Burger",
    area: "Kendall",
    listSignal: "Local value play",
    priceSignal: "The Classic starts at $13; specialty burgers mostly $16–$17",
    angle: "Best fit for diners who want a real restaurant burger in Kendall without Wynwood/Brickell pricing or travel.",
    highlight: true,
  },
  {
    name: "USBS",
    area: "Little River / The Citadel",
    listSignal: "Time Out, Burger Beast, Boca Burger Battle",
    priceSignal: "Published menu shows $7.50 single, $10 double, rotating specials around $14",
    angle: "The price benchmark for smash burgers citywide; not Kendall, but worth acknowledging honestly.",
  },
  {
    name: "Cowy Burger",
    area: "Wynwood",
    listSignal: "Infatuation, Boca Burger Battle, Yelp signal",
    priceSignal: "Often cited around $10–$13 in list pricing; verify direct menu before publishing hard claim",
    angle: "Aspirational award-winning Wynwood smash burger comparison.",
  },
  {
    name: "Ted's Burgers",
    area: "Wynwood",
    listSignal: "Burger Beast, Boca Burger Battle",
    priceSignal: "Boca Burger Battle cites roughly $8.99–$14.99",
    angle: "Strong smash-burger benchmark; useful in a citywide comparison, less direct for Kendall intent.",
  },
  {
    name: "Blue Collar",
    area: "MiMo / Biscayne",
    listSignal: "Time Out, Infatuation, Burger Beast, Boca Burger Battle",
    priceSignal: "Generally chef-driven / $$; verify current menu PDF for exact burger price",
    angle: "Prestige burger benchmark. Jealous Fork should not claim better — claim more accessible for Kendall/value.",
  },
  {
    name: "Smoke & Dough",
    area: "West Kendall",
    listSignal: "Burger Beast",
    priceSignal: "Burger Beast notes Smoked Brisket Burger at $24",
    angle: "Closest premium West Kendall burger contrast: BBQ/brisket destination vs Jealous Fork's $13–$17 burger lineup.",
  },
  {
    name: "Shorty's BBQ",
    area: "Kendall / Westchester",
    listSignal: "Burger Beast, Boca Burger Battle",
    priceSignal: "Boca Burger Battle cites under $15",
    angle: "Local classic/BBQ comparison; good for Kendall burger guide but less direct flavor/style overlap.",
  },
  {
    name: "Burgermeister",
    area: "Brickell / South Beach",
    listSignal: "Burger Beast, Boca Burger Battle",
    priceSignal: "Boca Burger Battle cites roughly $13.80–$14.95; site emphasizes 8oz made-to-order burgers",
    angle: "Similar affordability tier, but outside Kendall and more beer-hall/tourist-district positioning.",
  },
  {
    name: "Coney Burger",
    area: "Downtown",
    listSignal: "Infatuation, Boca Burger Battle",
    priceSignal: "Infatuation cites wagyu champ burger at $21; Boca puts Coney in $18–$21 range",
    angle: "Premium downtown counter-service burger; useful to show Jealous Fork's classic is materially lower priced.",
  },
  {
    name: "Shadow Wagyu",
    area: "Coral Gables",
    listSignal: "Boca Burger Battle, Yelp signal",
    priceSignal: "Boca Burger Battle cites $30+",
    angle: "Luxury/wagyu endpoint. Useful only as contrast, not direct competitor.",
  },
  {
    name: "El Rey de las Fritas / El Mago de las Fritas",
    area: "Little Havana / Miami",
    listSignal: "Time Out, Boca Burger Battle, Tripadvisor signal",
    priceSignal: "Fritas are usually lower-priced, but category is Cuban frita rather than gourmet restaurant burger",
    angle: "Great for a separate 'fritas vs burgers' explainer, not the primary affordability claim.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Affordable Burgers in Miami and Kendall",
  description: "A practical comparison of Jealous Fork's Kendall burger prices against burger spots featured in Miami best-burger lists.",
  itemListElement: comparisonRows.map((row, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: row.name,
  })),
};

export default function AffordableBurgersMiamiPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <SEOHead
        title="Affordable Burgers in Miami & Kendall | Jealous Fork Burger Comparison"
        description="Compare Jealous Fork's $13 Classic burger and $16–$17 specialty burgers with Miami burger spots featured by Time Out, Infatuation, Burger Beast, and Boca Burger Battle."
        canonical="https://www.jealousfork.com/best-affordable-burgers-miami"
        keywords="affordable burgers Miami, best burgers Kendall, burger comparison Miami, Jealous Fork burger, burgers under 15 Miami, Kendall burgers"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <Navigation />

      <main>
        <section className="relative overflow-hidden bg-stone-950 px-4 py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.18),transparent_30%)]" />
          <div className="relative mx-auto max-w-6xl pt-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">Miami burger comparison</p>
            <h1 className="max-w-4xl font-playfair text-4xl font-bold leading-tight md:text-6xl">
              One of Kendall's most affordable restaurant burgers starts at $13.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-stone-200 md:text-xl">
              Miami has elite burger destinations from Wynwood to MiMo. Jealous Fork's angle is simpler: a real Kendall restaurant burger lineup with The Classic at $13 and creative specialty burgers mostly at $16–$17.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/full-menu">
                <Button size="lg" className="bg-amber-400 text-stone-950 hover:bg-amber-300">Order Jealous Burger</Button>
              </Link>
              <Link href="/burgers">
                <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-stone-950">See Burger Menu</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-amber-200 bg-white">
              <CardHeader><CardTitle>$13</CardTitle></CardHeader>
              <CardContent className="text-stone-700">The Classic: cheddar, secret sauce, tomato, onion, spring greens.</CardContent>
            </Card>
            <Card className="border-amber-200 bg-white">
              <CardHeader><CardTitle>$16–$17</CardTitle></CardHeader>
              <CardContent className="text-stone-700">Most Jealous Fork specialty burgers, including Miami-flavored builds like Que Bola Meng.</CardContent>
            </Card>
            <Card className="border-amber-200 bg-white">
              <CardHeader><CardTitle>Kendall</CardTitle></CardHeader>
              <CardContent className="text-stone-700">No need to drive to Wynwood, Brickell, MiMo, or Coral Gables for a chef-minded burger.</CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Who appears in the best-burger lists?</p>
            <h2 className="mt-3 font-playfair text-3xl font-bold md:text-4xl">The broader Miami comp set</h2>
            <p className="mt-4 max-w-3xl text-stone-700">
              For this comparison, we looked at burger spots featured by Miami food guides and best-of lists. The goal is not to claim Jealous Fork beats every destination burger — it is to show where Jealous Fork wins on Kendall convenience and price accessibility.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {featuredLists.map((list) => (
                <Card key={list.source}>
                  <CardHeader>
                    <CardTitle className="text-xl">{list.source}</CardTitle>
                    <p className="text-sm text-stone-500">{list.title}</p>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-stone-700">{list.names}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Price + positioning</p>
          <h2 className="mt-3 font-playfair text-3xl font-bold md:text-4xl">How Jealous Fork should compare itself</h2>
          <div className="mt-8 grid gap-4">
            {comparisonRows.map((row) => (
              <Card key={row.name} className={row.highlight ? "border-2 border-amber-400 bg-amber-50" : "bg-white"}>
                <CardContent className="grid gap-4 p-5 md:grid-cols-[1.1fr_1fr_1.4fr] md:items-start">
                  <div>
                    <h3 className="text-lg font-bold">{row.name}</h3>
                    <p className="text-sm text-stone-500">{row.area} • {row.listSignal}</p>
                  </div>
                  <p className="text-sm font-medium text-stone-800">{row.priceSignal}</p>
                  <p className="text-sm leading-6 text-stone-700">{row.angle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-stone-950 px-4 py-14 text-white">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-playfair text-3xl font-bold md:text-4xl">Recommended comparison pages to build next</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["Best Affordable Burgers in Miami", "Lead with price tiers and mention list-featured spots; safest citywide entry page."],
                ["Best Burgers in Kendall Under $15", "Highest-converting local intent. Jealous Fork's $13 Classic is the hero."],
                ["Best Burgers in West Kendall", "Compare Jealous Fork, Smoke & Dough, Shorty's, Are You Hungry Grill, Rock That Burger, and Bricked Burgers."],
                ["Jealous Fork vs Miami's Best Burger Lists", "Meta page that says: if you want destination burgers, here are the names; if you want Kendall value, come here."],
              ].map(([title, body]) => (
                <Card key={title} className="border-white/10 bg-white/5 text-white">
                  <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                  <CardContent className="text-stone-200">{body}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
