import { useEffect } from 'react';

interface ResyWidgetProps {
  className?: string;
}

declare global {
  interface Window {
    resyWidget: {
      addButton: (element: HTMLElement, config: {
        venueId: number;
        apiKey: string;
        replace: boolean;
      }) => void;
    };
  }
}

// Global function to open Resy widget
export const openResyWidget = () => {
  // Try to click the main Resy button first
  const mainButton = document.getElementById('resyButton-P9CmnE96lqIg1Nk1WphHD');
  if (mainButton) {
    mainButton.click();
    return;
  }
  
  // If main button not available, create temporary one
  const tempButton = document.createElement('a');
  tempButton.href = 'https://resy.com/cities/miami-fl/venues/jealous-fork';
  tempButton.id = 'temp-resy-button-' + Date.now();
  tempButton.style.display = 'none';
  document.body.appendChild(tempButton);
  
  // Wait for script to load if needed
  const initWidget = () => {
    if (window.resyWidget) {
      window.resyWidget.addButton(tempButton, {
        venueId: 90707,
        apiKey: "Xyco1xMNKGCe2FaoSs5GAcr5dVh5gvSA",
        replace: true
      });
      tempButton.click();
      setTimeout(() => {
        if (document.body.contains(tempButton)) {
          document.body.removeChild(tempButton);
        }
      }, 100);
    } else {
      // Fallback to direct link
      window.open('https://resy.com/cities/miami-fl/venues/jealous-fork', '_blank');
      if (document.body.contains(tempButton)) {
        document.body.removeChild(tempButton);
      }
    }
  };
  
  if (window.resyWidget) {
    initWidget();
  } else {
    // Wait a bit for script to load
    setTimeout(initWidget, 500);
  }
};

export default function ResyWidget({ className = "" }: ResyWidgetProps) {
  useEffect(() => {
    // Load Resy widget script if not already loaded
    if (!document.querySelector('script[src="https://widgets.resy.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widgets.resy.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initializeWidget();
      };
    } else {
      // Script already loaded, initialize widget
      initializeWidget();
    }

    function initializeWidget() {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const button = document.getElementById('resyButton-P9CmnE96lqIg1Nk1WphHD');
        if (button && window.resyWidget) {
          window.resyWidget.addButton(button, {
            venueId: 90707,
            apiKey: "Xyco1xMNKGCe2FaoSs5GAcr5dVh5gvSA",
            replace: true
          });
        }
      }, 100);
    }
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <a 
        href="https://resy.com/cities/miami-fl/venues/jealous-fork" 
        id="resyButton-P9CmnE96lqIg1Nk1WphHD"
        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
      >
        Book your Jealous Fork reservation on Resy
      </a>
    </div>
  );
}