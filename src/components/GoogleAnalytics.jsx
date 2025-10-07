import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = ({ measurementId = 'G-XXXXXXXXXX' }) => {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.log('Google Analytics: Measurement ID not configured');
      return;
    }

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  return null;
};

export default GoogleAnalytics;
