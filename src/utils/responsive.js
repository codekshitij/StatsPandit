import { useState, useEffect } from 'react';

// Custom hook for responsive design
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet };
};

// Responsive utility functions
export const getResponsiveSize = (mobileSize, tabletSize, desktopSize, isMobile, isTablet) => {
  if (isMobile) return mobileSize;
  if (isTablet) return tabletSize;
  return desktopSize;
};

export const getResponsivePadding = (isMobile) => 
  isMobile ? '15px' : '30px';

export const getResponsiveMargin = (isMobile) => 
  isMobile ? '10px' : '20px';

export const getResponsiveFontSize = (mobileSize, desktopSize, isMobile) => 
  isMobile ? mobileSize : desktopSize;
