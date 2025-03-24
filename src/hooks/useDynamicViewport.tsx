import { useEffect } from 'react';

export default function useDynamicViewport() {
  useEffect(() => {
    const updateDVH = () => {
      // Set the custom property to the viewport height in pixels
      const dvh = window.innerHeight;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
    };

    // Set initial value
    updateDVH();

    // Update on resize and orientation change
    window.addEventListener('resize', updateDVH);
    window.addEventListener('orientationchange', updateDVH);
    
    // Some mobile browsers need a small delay after orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDVH, 100);
    });

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', updateDVH);
      window.removeEventListener('orientationchange', updateDVH);
    };
  }, []);
}
