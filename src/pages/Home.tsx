import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Shield, Zap, Users, CheckCircle, ArrowRight, Youtube, Facebook, Monitor, Smartphone, Star, Sparkles, Clock, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Play className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Pengulangan Video Otomatis',
      description: 'Sistem loop video canggih yang memungkinkan konten Anda tayang 24/7 tanpa interupsi, sempurna untuk channel yang ingin selalu aktif',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Keamanan Tinggi',
      description: 'Infrastruktur server yang aman dengan enkripsi end-to-end, backup otomatis, dan perlindungan dari gangguan eksternal',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Performa Cepat',
      description: 'Teknologi RTMP terdepan dengan server global yang menjamin streaming stabil, kualitas HD konsisten, dan latensi minimal',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Multi Platform',
      description: 'Kompatibilitas penuh dengan YouTube Live, Facebook Live, dan semua platform streaming yang mendukung protokol RTMP',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const freeFeatures = [
    'Maksimal 7x live streaming per akun',
    'Resolusi hingga Full HD 1080p',
    'Auto loop video tanpa batas',
    'Support YouTube & Facebook',
    'Dashboard user-friendly',
    'Streaming 24/7 nonstop'
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: <Users className="h-4 w-4 sm:h-6 sm:w-6" /> },
    { number: '50K+', label: 'Hours Streamed', icon: <Clock className="h-4 w-4 sm:h-6 sm:w-6" /> },
    { number: '99.9%', label: 'Uptime', icon: <Globe className="h-4 w-4 sm:h-6 sm:w-6" /> },
    { number: '24/7', label: 'Support', icon: <Shield className="h-4 w-4 sm:h-6 sm:w-6" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 animate-fade-in-up text-center lg:text-left">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
                  <span>Platform Live Streaming Terdepan</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  Platform Live Streaming
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    Terbaik Indonesia
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Revolusi cara Anda melakukan live streaming! Platform canggih yang memungkinkan streaming otomatis 24/7 dengan kualitas HD hingga 4K. Sempurna untuk content creator, bisnis, dan siapa saja yang ingin hadir online tanpa henti.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-sm sm:text-base"
                >
                  <Play className="h-4 w-4 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Lihat Demo
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl sm:rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-xl text-sm sm:text-base"
                >
                  Daftar Gratis
                  <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 ml-2 sm:ml-3" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2 text-yellow-300">
                      {stat.icon}
                    </div>
                    <div className="text-lg sm:text-2xl font-bold">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-300 mt-8 lg:mt-0">
              <div className="glass dark:glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard Preview</h3>
                    <div className="flex space-x-2 sm:space-x-3">
                      <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <Youtube className="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
                      </div>
                      <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Facebook className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-lg">Video Upload</p>
                          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base">Max 10GB, WebP preview</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm">
                        <Monitor className="h-6 w-6 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-green-500" />
                        <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-base">Landscape</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">16:9 Format</p>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm">
                        <Smartphone className="h-6 w-6 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-purple-500" />
                        <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-base">Portrait</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">9:16 Format</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 sm:px-4 py-1 sm:py-2 text-blue-700 dark:text-blue-300 font-medium text-xs sm:text-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Fitur Unggulan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
              Fitur Unggulan SiPaling.pro
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Platform streaming dengan teknologi terdepan untuk kebutuhan live streaming 24/7 Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card group"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 rounded-full px-3 sm:px-4 py-1 sm:py-2 text-green-700 dark:text-green-300 font-medium text-xs sm:text-sm">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>100% Gratis</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  Fitur Gratis Lengkap
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  Nikmati fitur streaming profesional tanpa biaya. Perfect untuk content creator yang ingin siaran 24/7!
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="card p-6 sm:p-8 shadow-2xl">
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 sm:px-4 py-1 sm:py-2 text-blue-700 dark:text-blue-300 font-medium mb-3 sm:mb-4 text-xs sm:text-sm">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Paket Gratis</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Akun Gratis
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Mulai streaming sekarang juga
                    </p>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Live Streaming</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg">7x per akun</span>
                    </div>
                    <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Resolusi Maksimal</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg">Full HD 1080p</span>
                    </div>
                    <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Auto Loop</span>
                      <span className="font-bold text-green-600 dark:text-green-400 text-base sm:text-lg">24/7 Nonstop</span>
                    </div>
                    <div className="flex justify-between items-center py-3 sm:py-4">
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Platform Support</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg">YouTube & Facebook</span>
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className="btn-primary w-full text-center text-base sm:text-lg flex items-center justify-center"
                  >
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-60 h-60 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-60 h-60 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
              <span>Bergabung Sekarang</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
              Siap Memulai Live Streaming 24/7?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Bergabung dengan ribuan content creator yang sudah mempercayai SiPaling.pro 
              untuk kebutuhan live streaming nonstop mereka.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-base sm:text-lg"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl sm:rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-xl text-base sm:text-lg"
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Lihat Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;