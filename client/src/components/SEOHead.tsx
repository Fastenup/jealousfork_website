import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string;
}

export default function SEOHead({ 
  title, 
  description, 
  canonical, 
  ogImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630",
  keywords = "pancakes Miami, artisan pancakes, gourmet burgers, Miami restaurant, Instagram food, pancake restaurant, food truck, Miami dining"
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Set meta tags
    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    const setMetaProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    
    // Open Graph tags
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:url', canonical);
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:image', ogImage);
    
    // Twitter Card tags
    setMetaProperty('twitter:card', 'summary_large_image');
    setMetaProperty('twitter:url', canonical);
    setMetaProperty('twitter:title', title);
    setMetaProperty('twitter:description', description);
    setMetaProperty('twitter:image', ogImage);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
    
  }, [title, description, canonical, ogImage, keywords]);

  return null;
}
