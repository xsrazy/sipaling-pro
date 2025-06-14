import React from 'react';
import { Book, ExternalLink, Code, Settings, Play, Sparkles, Zap, Shield } from 'lucide-react';

const Docs: React.FC = () => {
  const sections = [
    {
      id: 'getting-started',
      title: 'Memulai',
      icon: <Play className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      content: [
        {
          title: 'Pendaftaran Akun',
          description: 'Cara mendaftar dan mengaktifkan akun SiPaling.pro',
          steps: [
            'Kunjungi halaman registrasi',
            'Isi form dengan email @gmail.com',
            'Verifikasi email (jika diperlukan)',
            'Login ke dashboard'
          ]
        },
        {
          title: 'Upload Video Pertama',
          description: 'Langkah-langkah upload video untuk streaming',
          steps: [
            'Pilih video maksimal 10GB',
            'Format yang didukung: MP4, MOV, AVI',
            'Tunggu proses upload selesai',
            'Preview video akan muncul'
          ]
        }
      ]
    },
    {
      id: 'streaming',
      title: 'Live Streaming',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      content: [
        {
          title: 'Konfigurasi RTMP',
          description: 'Cara mengatur RTMP untuk YouTube dan Facebook',
          steps: [
            'Pilih platform (YouTube/Facebook)',
            'Dapatkan stream key dari platform',
            'Masukkan stream key di dashboard',
            'Pilih resolusi dan mode streaming'
          ]
        },
        {
          title: 'Pengaturan Stream',
          description: 'Opsi konfigurasi untuk streaming optimal',
          steps: [
            'Resolusi: 144p - 1080p (gratis), hingga 4K (premium)',
            'Mode: Landscape atau Portrait',
            'Auto Loop: ON/OFF',
            'Jadwal stop otomatis (opsional)'
          ]
        }
      ]
    },
    {
      id: 'api',
      title: 'API Documentation',
      icon: <Code className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      content: [
        {
          title: 'Authentication',
          description: 'Endpoint untuk autentikasi pengguna',
          steps: [
            'POST /api/auth/register - Registrasi pengguna baru',
            'POST /api/auth/login - Login pengguna',
            'GET /api/auth/validate - Validasi token',
            'POST /api/auth/logout - Logout pengguna'
          ]
        },
        {
          title: 'Streaming API',
          description: 'Endpoint untuk mengelola streaming',
          steps: [
            'POST /api/stream/start - Mulai streaming',
            'POST /api/stream/stop - Hentikan streaming',
            'GET /api/stream/status - Cek status streaming',
            'GET /api/stream/config - Lihat konfigurasi'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Book className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Dokumentasi SiPaling.pro
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Panduan lengkap penggunaan platform live streaming otomatis
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-500" />
                <span>Daftar Isi</span>
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="nav-link flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <div className={`p-2 bg-gradient-to-r ${section.color} rounded-lg text-white`}>
                      {section.icon}
                    </div>
                    <span className="font-medium">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-8">
                <div className="card p-8">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`p-4 bg-gradient-to-r ${section.color} rounded-2xl text-white`}>
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {section.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Panduan lengkap untuk {section.title.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {section.content.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-8 bg-gray-50 dark:bg-gray-700 rounded-r-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="space-y-4">
                          {item.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {stepIndex + 1}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            {/* External Links */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <h2 className="text-2xl font-bold">Butuh Bantuan Lebih Lanjut?</h2>
              </div>
              <p className="text-blue-100 mb-8 text-lg">
                Tim support kami siap membantu Anda 24/7 untuk semua kebutuhan streaming Anda.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <a
                  href="mailto:email@sipaling.pro"
                  className="flex items-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <ExternalLink className="h-6 w-6" />
                  <div>
                    <span className="font-bold">Hubungi Support</span>
                    <p className="text-sm text-blue-200">email@sipaling.pro</p>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;