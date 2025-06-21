import React, { useState, useEffect } from 'react';
import { FaGithub, FaXTwitter, FaDiscord } from 'react-icons/fa6';
import { SiCashapp } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // State for responsive columns (dynamic grid template)
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // State for hover effects on links and icons
  const [hoveredLink, setHoveredLink] = useState(null); // Stores the name of the hovered link
  const [hoveredSocial, setHoveredSocial] = useState(null); // Stores the label of the hovered social icon
  const [hoveredLogo, setHoveredLogo] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768);
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Set initial state
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define navigation links as an array of objects
  const navLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'About Us', href: '#about' },
  ];

  // Define social links as an array of objects
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/kshitijmishra', label: 'GitHub' },
    { icon: FaXTwitter, href: 'https://x.com/neuronMatrix', label: 'Twitter' },
    { icon: FaDiscord, href: 'https://discord.com/users/neural_octopus', label: 'Discord' },
  ];

  // --- Style Objects (similar to your LandingPage) ---

  const footerContainerStyle = {
    position: 'relative',
    marginTop: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black with opacity
    backdropFilter: 'blur(8px)', // For the blur effect
    color: 'white',
    borderTop: '1px solid rgba(0, 255, 255, 0.5)', // cyan-500/50
    padding: '3rem 1rem 2rem', // pt-12 pb-8 px-4
    zIndex: 50,
    overflow: 'hidden', // To contain the animated background
    fontFamily: "'Silkscreen', monospace" // Apply the font here as well
  };

  const cornerBracketStyle = {
    position: 'absolute',
    width: '2rem', // w-8
    height: '2rem', // h-8
    borderColor: 'rgba(0, 255, 255, 0.5)', // cyan-500/50
    opacity: 0.5,
  };

  const cornerBracketTopLeftStyle = {
    ...cornerBracketStyle,
    top: 0,
    left: 0,
    borderTop: '2px solid',
    borderLeft: '2px solid',
  };

  const cornerBracketBottomRightStyle = {
    ...cornerBracketStyle,
    bottom: 0,
    right: 0,
    borderBottom: '2px solid',
    borderRight: '2px solid',
  };

  const animatedBackgroundStyle = {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    opacity: 0.1,
    background: 'radial-gradient(circle at top left, rgba(0,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at bottom right, rgba(255,0,255,0.1) 0%, transparent 50%)',
    // Animation will be handled via a global <style> tag or a CSS file if inline is not feasible
  };

  const footerContentWrapperStyle = {
    maxWidth: '80rem', // max-w-7xl (approximately)
    margin: '0 auto', // mx-auto
    position: 'relative',
    zIndex: 10, // Higher than animatedBackground
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMediumScreen ? 'repeat(4, 1fr)' : '1fr', // Dynamic columns
    gap: '2rem', // gap-8
    textAlign: isMediumScreen ? 'left' : 'center',
  };

  const columnHeadingStyle = {
    fontWeight: 'bold',
    color: '#00ffff', // cyan-400
    letterSpacing: '0.05em', // tracking-wider
    textTransform: 'uppercase',
    fontSize: '0.875rem', // text-sm
    marginBottom: '1rem', // mb-4
  };

  const brandLogoStyle = {
    fontSize: '1.875rem', // text-3xl
    fontWeight: '800', // font-extrabold
    background: 'linear-gradient(to right, #00ffff, #ff00ff)', // from-cyan-400 to-pink-500
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent', // Fallback
    transform: hoveredLogo ? 'scale(1.05)' : 'scale(1)', // Hover effect
    transition: 'transform 0.3s ease-in-out', // transition-transform duration-300
    display: 'inline-block', // Required for transform
    gridColumn: isMediumScreen ? (isLargeScreen ? 'span 1' : 'span 2') : 'auto', // Responsive span
  };

  const brandTaglineStyle = {
    color: '#a0aec0', // gray-500
    fontSize: '0.875rem', // text-sm
    marginTop: '0.5rem', // mt-2
  };

  const copyrightStyle = {
    color: '#cbd5e0', // gray-400
    fontSize: '0.75rem', // text-xs
    marginTop: '1.5rem', // mt-6
  };

  const linkListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMediumScreen ? 'flex-start' : 'center', // Responsive alignment
    gap: '0.75rem', // space-y-3
  };

  const linkStyle = (linkName) => ({
    fontSize: '0.875rem', // text-sm
    color: hoveredLink === linkName ? '#00ffff' : '#d1d5db', // cyan-400 : gray-300
    textDecoration: 'none',
    transition: 'color 0.2s ease-in-out', // transition-colors duration-200
    outline: 'none', // Reset default outline
    boxShadow: hoveredLink === linkName ? '0 0 0 2px rgba(0, 255, 255, 0.5)' : 'none', // Focus ring
    borderRadius: '2px', // Small radius for the ring
  });

  const socialIconStyleDynamic = (socialLabel) => ({
    fontSize: '1.5rem', // text-2xl
    color: hoveredSocial === socialLabel ? 'white' : '#cbd5e0', // white : gray-400
    transform: hoveredSocial === socialLabel ? 'scale(1.1)' : 'scale(1)', // Hover effect
    transition: 'all 0.3s ease-in-out', // transition-all duration-300
    display: 'inline-block', // For scale transform
    outline: 'none', // Reset default outline
    boxShadow: hoveredSocial === socialLabel ? '0 0 0 2px rgba(0, 255, 255, 0.5)' : 'none', // Focus ring
    borderRadius: '50%', // Make the focus ring circular for icons
  });

  const socialLinksContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem', // space-x-6
    marginTop: '0.75rem', // mt-3
  };

  const taglineStyle = {
    color: '#a0aec0', // gray-500
    fontSize: '0.75rem', // text-xs
    marginTop: '1.5rem', // mt-6
    fontStyle: 'italic',
  };

  const columnBaseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMediumScreen ? 'flex-start' : 'center', // Responsive alignment
  };

  const columnEndStyle = {
    ...columnBaseStyle,
    alignItems: isMediumScreen ? 'flex-end' : 'center', // Responsive alignment for the last column
  };

  return (
    <footer style={footerContainerStyle}>
      {/* Background Video (from LandingPage example - usually not in footer but included for structure consistency) */}
      {/* Assuming the video is a full-page background from LandingPage and not duplicated here */}
      {/* <video ref={videoRef} style={videoStyle} autoPlay muted loop playsInline>
        <source src="/Whisk_cauajgfjztbimtixltbmmzqtndc2zc05njuyltk.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      {/* Dark Overlay (from LandingPage example - usually not in footer) */}
      {/* <div style={overlayStyle}></div> */}

      {/* Decorative Corner Brackets */}
      <div style={cornerBracketTopLeftStyle}></div>
      <div style={cornerBracketBottomRightStyle}></div>
      
      {/* Subtle animated background element (animation will need a global <style> tag) */}
      <div style={animatedBackgroundStyle}></div>

      {/* The @keyframes for pulse-bg needs to be in a global CSS file or <style> tag */}
      {/* If you absolutely cannot use a global style, you'd need a JS animation library or complex JS timing */}
      {/* For now, assuming a global <style> or CSS file for this specific animation */}
      <style>{`
        @keyframes pulse-bg {
          0% { opacity: 0.1; }
          50% { opacity: 0.15; }
          100% { opacity: 0.1; }
        }
      `}</style>
      
      {/* Global font import (if not already done elsewhere) */}
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
      `}</style>

      <div style={footerContentWrapperStyle}>
        <div style={gridContainerStyle}>
          
          {/* Column 1: Branding & Copyright */}
          <div style={{ ...columnBaseStyle, ...(isMediumScreen ? (isLargeScreen ? {} : { gridColumn: 'span 2' }) : {}) }}>
            <span 
              style={brandLogoStyle}
              onMouseOver={() => setHoveredLogo(true)}
              onMouseOut={() => setHoveredLogo(false)}
            >
              🎮 GameOver
            </span>
            <p style={brandTaglineStyle}>The Ultimate Quiz Arena</p>
            <p style={copyrightStyle}>
              &copy; {currentYear} GameOver. All rights reserved.
            </p>
            <p style={{ ...copyrightStyle, marginTop: '0.5rem', fontSize: '0.7rem' }}>
              Developed by Kshitij Mishra
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div style={columnBaseStyle}>
            <h3 style={columnHeadingStyle}>Navigate</h3>
            <ul style={linkListStyle}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    style={linkStyle(link.name)}
                    onMouseOver={() => setHoveredLink(link.name)}
                    onMouseOut={() => setHoveredLink(null)}
                    onFocus={() => setHoveredLink(link.name)} // For keyboard accessibility
                    onBlur={() => setHoveredLink(null)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div style={columnBaseStyle}>
            <h3 style={columnHeadingStyle}>Resources</h3>
            <ul style={linkListStyle}>
              <li>
                <a 
                  href="#faq" 
                  style={linkStyle('FAQ')}
                  onMouseOver={() => setHoveredLink('FAQ')}
                  onMouseOut={() => setHoveredLink(null)}
                  onFocus={() => setHoveredLink('FAQ')}
                  onBlur={() => setHoveredLink(null)}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  style={linkStyle('Blog')}
                  onMouseOver={() => setHoveredLink('Blog')}
                  onMouseOut={() => setHoveredLink(null)}
                  onFocus={() => setHoveredLink('Blog')}
                  onBlur={() => setHoveredLink(null)}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#support" 
                  style={linkStyle('Support')}
                  onMouseOver={() => setHoveredLink('Support')}
                  onMouseOut={() => setHoveredLink(null)}
                  onFocus={() => setHoveredLink('Support')}
                  onBlur={() => setHoveredLink(null)}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Links & Newsletter/Tagline */}
          <div style={columnEndStyle}>
            <h3 style={columnHeadingStyle}>Connect</h3>
            <div style={socialLinksContainerStyle}>
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.label}
                  style={socialIconStyleDynamic(social.label)}
                  onMouseOver={() => setHoveredSocial(social.label)}
                  onMouseOut={() => setHoveredSocial(null)}
                  onFocus={() => setHoveredSocial(social.label)}
                  onBlur={() => setHoveredSocial(null)}
                >
                  <social.icon />
                </a>
              ))}
            </div>

            <p style={taglineStyle}>
              Level up your knowledge, one quiz at a time.
            </p>
          </div>

        </div>

        {/* Buy me a coffee banner */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '0.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
            animation: 'shimmer 3s ease-in-out infinite'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: '#ffd700',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              ☕ Enjoyed the quiz? Buy me a coffee!
            </p>
            <p style={{
              margin: 0,
              fontSize: '0.8rem',
              color: '#cbd5e0',
              marginBottom: '0.5rem'
            }}>
              Support the development of more awesome quizzes
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0.25rem',
              border: '1px solid rgba(255, 215, 0, 0.5)'
            }}>
              <a 
                href="https://cash.app/$kshitij27" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: '#ffd700',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.color = '#ffd700';
                }}
              >
                <SiCashapp style={{ fontSize: '1.5rem', color: '#00d632' }} />
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  Support via CashApp
                </span>
              </a>
            </div>
          </div>
          
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      </div>
    </footer>
  );
};

export default Footer;