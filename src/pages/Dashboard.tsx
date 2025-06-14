import React, { useState, useRef } from 'react';
import { 
  Upload, Play, Square, Settings, Trash2, Clock, 
  Youtube, Facebook, Monitor, Smartphone, RotateCcw,
  CheckCircle, AlertCircle, Eye, Sparkles, Zap, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [rtmpPlatform, setRtmpPlatform] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [resolution, setResolution] = useState('1080p');
  const [mode, setMode] = useState('landscape');
  const [autoLoop, setAutoLoop] = useState(true);
  const [scheduledStop, setScheduledStop] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'idle' | 'starting' | 'live' | 'stopping'>('idle');
  const [showConfig, setShowConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolutions = [
    { value: '144p', label: '144p', premium: false },
    { value: '240p', label: '240p', premium: false },
    { value: '360p', label: '360p', premium: false },
    { value: '480p', label: '480p', premium: false },
    { value: '720p', label: '720p HD', premium: false },
    { value: '1080p', label: '1080p Full HD', premium: false },
    { value: '2k', label: '2K', premium: true },
    { value: '4k', label: '4K Ultra HD', premium: true },
  ];

  const platforms = [
    { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024 * 1024) { // 10GB
        alert('File terlalu besar. Maksimal 10GB');
        return;
      }
      
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleStartStream = async () => {
    if (!videoFile || !rtmpPlatform || !streamKey) {
      alert('Lengkapi semua field terlebih dahulu');
      return;
    }

    if (!user?.isPremium && user?.liveCount >= 7) {
      alert('Batas live streaming gratis (7x) telah tercapai. Upgrade ke premium untuk unlimited streaming.');
      return;
    }

    setStreamStatus('starting');
    setIsStreaming(true);
    
    // Simulate API call
    setTimeout(() => {
      setStreamStatus('live');
    }, 3000);
  };

  const handleStopStream = () => {
    setStreamStatus('stopping');
    setTimeout(() => {
      setStreamStatus('idle');
      setIsStreaming(false);
    }, 2000);
  };

  const handleDeleteVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canUseResolution = (resValue: string) => {
    const res = resolutions.find(r => r.value === resValue);
    return !res?.premium || user?.isPremium;
  };

  const isFormValid = videoFile && rtmpPlatform && streamKey;

  const getStatusColor = () => {
    switch (streamStatus) {
      case 'live': return 'text-green-500';
      case 'starting': return 'text-yellow-500';
      case 'stopping': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Dashboard Live Streaming
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Kelola live streaming 24/7 Anda dengan mudah
              </p>
            </div>
          </div>
          
          {/* Account Status */}
          <div className="card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  {user?.isPremium && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                      <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{user?.username}</p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Live Count: <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.liveCount || 0}/7</span>
                    {!user?.isPremium && ' (Gratis)'}
                  </p>
                </div>
              </div>
              
              <div className="text-left sm:text-right">
                {user?.isPremium ? (
                  <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Premium</span>
                  </div>
                ) : (
                  <div>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Akun Gratis
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max resolusi Full HD 1080p
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Video Upload */}
            <div className="dashboard-card">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                <span>Upload Video</span>
              </h2>
              
              {!videoFile ? (
                <div className="upload-zone">
                  <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Drag & drop video atau klik untuk upload
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-4 sm:mb-6">
                    Maksimal 10GB, format MP4/MOV/AVI
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary text-sm sm:text-base"
                  >
                    Pilih Video
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 sm:h-64 object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={handleDeleteVideo}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base">{videoFile.name}</p>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-300">
                        {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RTMP Configuration */}
            <div className="dashboard-card">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                <span>Konfigurasi RTMP</span>
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                    Platform
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <button
                          key={platform.value}
                          onClick={() => setRtmpPlatform(platform.value)}
                          className={`platform-card ${
                            rtmpPlatform === platform.value
                              ? 'platform-card-selected'
                              : 'platform-card-unselected'
                          }`}
                        >
                          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${platform.bgColor}`}>
                            <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${platform.color}`} />
                          </div>
                          <div className="text-center sm:text-left">
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                              {platform.label}
                            </span>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Live streaming
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="streamKey" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Stream Key
                  </label>
                  <input
                    id="streamKey"
                    type="password"
                    value={streamKey}
                    onChange={(e) => setStreamKey(e.target.value)}
                    className="input-modern text-sm sm:text-base"
                    placeholder="Masukkan stream key dari platform"
                  />
                </div>
              </div>
            </div>

            {/* Stream Settings */}
            <div className="dashboard-card">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                <span>Pengaturan Stream</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                    Resolusi
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="input-modern text-sm sm:text-base"
                  >
                    {resolutions.map((res) => (
                      <option 
                        key={res.value} 
                        value={res.value}
                        disabled={!canUseResolution(res.value)}
                      >
                        {res.label} {res.premium && !user?.isPremium ? '(Premium)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                    Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setMode('landscape')}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl flex flex-col items-center space-y-2 sm:space-y-3 transition-all duration-200 ${
                        mode === 'landscape'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                      <div className="text-center">
                        <p className="font-semibold text-sm sm:text-base">Landscape</p>
                        <p className="text-xs text-gray-500">16:9</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setMode('portrait')}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl flex flex-col items-center space-y-2 sm:space-y-3 transition-all duration-200 ${
                        mode === 'portrait'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400" />
                      <div className="text-center">
                        <p className="font-semibold text-sm sm:text-base">Portrait</p>
                        <p className="text-xs text-gray-500">9:16</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLoop}
                      onChange={(e) => setAutoLoop(e.target.checked)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
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
                    value={scheduledStop}
                    onChange={(e) => setScheduledStop(e.target.value)}
                    className="input-modern text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6 sm:space-y-8">
            {/* Stream Controls */}
            <div className="dashboard-card">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                <span>Kontrol Stream</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {!isStreaming ? (
                  <button
                    onClick={handleStartStream}
                    disabled={!isFormValid}
                    className={`control-button text-sm sm:text-base ${
                      isFormValid
                        ? 'control-button-start'
                        : 'control-button-disabled'
                    }`}
                  >
                    <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="font-bold">Start Live</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopStream}
                    className="control-button control-button-stop text-sm sm:text-base"
                  >
                    <Square className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="font-bold">Stop Live</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="btn-secondary flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Config</span>
                  </button>
                  <button className="btn-secondary flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Status</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Status */}
            <div className="dashboard-card">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                Status Stream
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
                  <span className="font-medium text-gray-600 dark:text-gray-400 text-sm sm:text-base">FFMPEG Status:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${
                      streamStatus === 'live' ? 'bg-green-500 animate-pulse' :
                      streamStatus === 'starting' ? 'bg-yellow-500 animate-pulse' :
                      streamStatus === 'stopping' ? 'bg-orange-500 animate-pulse' :
                      'bg-gray-500'
                    }`}></div>
                    <span className={`font-bold capitalize text-sm sm:text-base ${getStatusColor()}`}>
                      {streamStatus === 'live' ? 'Live' :
                       streamStatus === 'starting' ? 'Starting' :
                       streamStatus === 'stopping' ? 'Stopping' :
                       'Idle'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Platform:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {rtmpPlatform ? platforms.find(p => p.value === rtmpPlatform)?.label : '-'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Resolusi:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {resolution}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Mode:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize text-sm sm:text-base">
                      {mode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Display */}
            {showConfig && (
              <div className="dashboard-card">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                  Konfigurasi Aktif
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Video:</span>
                    <span className={`font-semibold text-sm sm:text-base ${videoFile ? 'text-green-600' : 'text-red-600'}`}>
                      {videoFile ? '✓ Uploaded' : '✗ Not uploaded'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Platform:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {rtmpPlatform || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Stream Key:</span>
                    <span className={`font-semibold text-sm sm:text-base ${streamKey ? 'text-green-600' : 'text-red-600'}`}>
                      {streamKey ? '✓ Set' : '✗ Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Auto Loop:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {autoLoop ? '24/7 ON' : 'OFF'}
                    </span>
                  </div>
                  {scheduledStop && (
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Stop Time:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        {new Date(scheduledStop).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;