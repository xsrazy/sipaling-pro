import React from 'react';
import { Mail, Globe, Instagram, Facebook, Send, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Beranda', href: '/' },
        { name: 'Demo', href: '/demo' },
        { name: 'Dokumentasi', href: '/docs' },
        { name: 'Daftar Gratis', href: '/register' }
      ]
    },
    {
      title: 'Fitur',
      links: [
        { name: 'Live Streaming 24/7', href: '#' },
        { name: 'Auto Loop Video', href: '#' },
        { name: 'Multi Platform', href: '#' },
        { name: 'HD Quality', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: 'mailto:email@sipaling.pro' },
        { name: 'Status Page', href: '#' },
        { name: 'API Docs', href: '/docs' }
      ]
    }
  ];

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/xsrazy', 
      icon: Instagram,
      className: 'social-icon social-icon-instagram'
    },
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/xsrazy', 
      icon: Facebook,
      className: 'social-icon social-icon-facebook'
    },
    { 
      name: 'Telegram', 
      href: 'https://t.me/xsrazy', 
      icon: Send,
      className: 'social-icon social-icon-telegram'
    },
    { 
      name: 'GitHub', 
      href: 'https://github.com/xsrazy', 
      icon: Github,
      className: 'social-icon social-icon-github'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and description - aligned with footer links on desktop */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="./assets/SPP.png" 
                  alt="SiPaling.pro" 
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl shadow-lg"
                  loading="lazy"
                />
                <div>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SiPaling.pro
                  </span>
                  <p className="text-xs sm:text-sm text-gray-400">Live Streaming Platform</p>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Solusi terdepan untuk live streaming otomatis 24/7. Teknologi canggih yang memungkinkan Anda hadir online tanpa henti dengan kualitas profesional.
              </p>

              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  <a href="mailto:email@sipaling.pro" className="hover:text-blue-400 transition-colors text-sm sm:text-base">
                    email@sipaling.pro
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Indonesia</span>
                </div>
              </div>
            </div>

            {/* Footer links - aligned properly on desktop */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {footerLinks.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {section.title}
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a 
                            href={link.href}
                            className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <span>{link.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base text-gray-400">
                © {currentYear} SiPaling.pro. Semua hak dilindungi.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Platform live streaming terbaik Indonesia
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-400 text-xs sm:text-sm">Follow us:</span>
              <div className="flex space-x-2 sm:space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={social.className}
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;