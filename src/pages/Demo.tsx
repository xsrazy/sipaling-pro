import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, Play, Square, Settings, Trash2, Clock, 
  Youtube, Facebook, Monitor, Smartphone, RotateCcw,
  AlertTriangle, ArrowRight, Sparkles, Zap, Shield
} from 'lucide-react';

const Demo: React.FC = () => {
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Play className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Demo Dashboard SiPaling.pro
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Lihat preview fitur dashboard tanpa perlu login
              </p>
            </div>
          </div>
          
          {/* Demo Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                Mode Demo - Fitur upload dan streaming dinonaktifkan
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Upload */}
            <div className="dashboard-card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
                <Upload className="h-6 w-6 text-blue-500" />
                <span>Upload Video</span>
              </h2>
              
              <div className="upload-zone opacity-50">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Drag & drop video atau klik untuk upload
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Maksimal 10GB, format MP4/MOV/AVI
                </p>
                <button
                  disabled
                  className="px-8 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed font-semibold"
                >
                  Pilih Video (Demo Mode)
                </button>
              </div>
            </div>

            {/* RTMP Configuration */}
            <div className="dashboard-card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
                <Settings className="h-6 w-6 text-purple-500" />
                <span>Konfigurasi RTMP</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Platform
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="platform-card platform-card-selected">
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                        <Youtube className="h-8 w-8 text-red-500" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          YouTube
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Live streaming
                        </p>
                      </div>
                    </div>
                    <div className="platform-card platform-card-unselected opacity-50">
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <Facebook className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          Facebook
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Live streaming
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="streamKey" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Stream Key
                  </label>
                  <input
                    id="streamKey"
                    type="password"
                    value="demo-stream-key-placeholder"
                    disabled
                    className="input-modern opacity-50 cursor-not-allowed"
                    placeholder="Masukkan stream key dari platform"
                  />
                </div>
              </div>
            </div>

            {/* Stream Settings */}
            <div className="dashboard-card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span>Pengaturan Stream</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Resolusi
                  </label>
                  <select
                    value="4k"
                    disabled
                    className="input-modern opacity-50 cursor-not-allowed"
                  >
                    <option value="4k">4K Ultra HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex flex-col items-center space-y-3">
                      <Monitor className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      <div className="text-center">
                        <p className="font-semibold">Landscape</p>
                        <p className="text-xs text-gray-500">16:9</p>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center space-y-3 opacity-50">
                      <Smartphone className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      <div className="text-center">
                        <p className="font-semibold">Portrait</p>
                        <p className="text-xs text-gray-500">9:16</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl opacity-50">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Auto Looping 24/7
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label htmlFor="scheduledStop" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Jadwal Stop (Opsional)
                  </label>
                  <input
                    id="scheduledStop"
                    type="datetime-local"
                    disabled
                    className="input-modern opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-8">
            {/* Stream Controls */}
            <div className="dashboard-card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-500" />
                <span>Kontrol Stream</span>
              </h2>
              
              <div className="space-y-4">
                <button
                  disabled
                  className="control-button control-button-disabled"
                >
                  <Play className="h-6 w-6" />
                  <span className="text-lg font-bold">Start Live (Demo Mode)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled
                    className="btn-secondary opacity-50 cursor-not-allowed flex items-center justify-center space-x-2 py-3"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Config</span>
                  </button>
                  <button 
                    disabled
                    className="btn-secondary opacity-50 cursor-not-allowed flex items-center justify-center space-x-2 py-3"
                  >
                    <Clock className="h-5 w-5" />
                    <span>Status</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Status */}
            <div className="dashboard-card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Status Stream
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="font-medium text-gray-600 dark:text-gray-400">FFMPEG Status:</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                    <span className="font-bold text-gray-600">Demo Mode</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      YouTube (Demo)
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Resolusi:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      4K Ultra HD
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Landscape
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <h3 className="text-2xl font-bold">
                  Siap Mulai Streaming?
                </h3>
              </div>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Memudahkan siapa saja untuk memulai siaran langsung kapan saja dan di mana saja tanpa batas!
              </p>
              <div className="space-y-3">
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  <span>Daftar Gratis</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="w-full flex items-center justify-center py-4 px-6 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Sudah Punya Akun?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;