import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Heart, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Progress } from './ui/progress';

export default function MindfulnessSpace() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [meditationTime, setMeditationTime] = useState(0);
  const [meditationActive, setMeditationActive] = useState(false);
  const [totalCalmTime, setTotalCalmTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Audio meditation tracks (menggunakan ambient nature sounds dan calm music dari berbagai sumber)
  const meditationTracks = [
    { 
      title: '5 Menit Meditasi Pagi', 
      duration: '5:00', 
      color: 'bg-orange-100',
      // Ambient morning nature sounds
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    { 
      title: 'Relaksasi Sebelum Tidur', 
      duration: '10:00', 
      color: 'bg-purple-100',
      // Calm sleep music
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    { 
      title: 'Meditasi Anti-Cemas', 
      duration: '7:30', 
      color: 'bg-blue-100',
      // Calming meditation music
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    { 
      title: 'Body Scan Relaxation', 
      duration: '8:00', 
      color: 'bg-green-100',
      // Relaxation ambient sounds
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    }
  ];

  const handleAudioPlayPause = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    // Pause all other audios
    audioRefs.current.forEach((otherAudio, otherIndex) => {
      if (otherAudio && otherIndex !== index && !otherAudio.paused) {
        otherAudio.pause();
      }
    });

    if (playingAudio === index) {
      audio.pause();
      setPlayingAudio(null);
    } else {
      audio.play();
      setPlayingAudio(index);
    }
  };

  useEffect(() => {
    // Handle audio ended event
    audioRefs.current.forEach((audio, index) => {
      if (audio) {
        audio.onended = () => {
          setPlayingAudio(null);
        };
      }
    });
  }, []);

  useEffect(() => {
    if (!breathingActive) return;

    const phases = [
      { name: 'inhale' as const, duration: 4000, message: 'Tarik napas...' },
      { name: 'hold' as const, duration: 7000, message: 'Tahan...' },
      { name: 'exhale' as const, duration: 8000, message: 'Hembuskan...' }
    ];

    const currentPhaseIndex = phases.findIndex(p => p.name === breathingPhase);
    const currentPhase = phases[currentPhaseIndex];

    const timer = setTimeout(() => {
      const nextIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathingPhase(phases[nextIndex].name);
      if (nextIndex === 0) {
        setBreathingCount(prev => prev + 1);
      }
    }, currentPhase.duration);

    return () => clearTimeout(timer);
  }, [breathingActive, breathingPhase]);

  useEffect(() => {
    if (!meditationActive) return;

    const timer = setInterval(() => {
      setMeditationTime(prev => prev + 1);
      setTotalCalmTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [meditationActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingMessage = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Tarik napas perlahan melalui hidung (4 detik)';
      case 'hold':
        return 'Tahan napasmu (7 detik)';
      case 'exhale':
        return 'Hembuskan napas perlahan melalui mulut (8 detik)';
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-8 h-8" />
            Zona Tenang - Mindfulness Space
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Luangkan waktu untuk dirimu sendiri. Bernapas, tenang, dan rileks
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Total Calm Time */}
      <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Waktu Tenangmu Hari Ini</p>
            <p className="text-4xl text-[#266CA9]">{formatTime(totalCalmTime)}</p>
            <p className="text-xs text-gray-500 mt-2">Luar biasa! Setiap menit berarti 💙</p>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Exercise 4-7-8 */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Latihan Napas 4-7-8 Interaktif</CardTitle>
          <CardDescription>
            Teknik pernapasan yang terbukti mengurangi kecemasan dan membantu tidur lebih nyenyak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div 
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#ADE1FB] to-[#266CA9] transition-all duration-1000 ease-in-out ${
                breathingActive ? getBreathingScale() : 'scale-100'
              } flex items-center justify-center shadow-lg`}
            >
              <Heart className="w-16 h-16 text-white animate-pulse" />
            </div>
            
            {breathingActive && (
              <div className="mt-6 text-center">
                <p className="text-lg text-[#0F2573]">{getBreathingMessage()}</p>
                <p className="text-sm text-gray-600 mt-2">Siklus ke-{breathingCount + 1}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setBreathingActive(!breathingActive);
                if (!breathingActive) {
                  setBreathingPhase('inhale');
                }
              }}
              className="bg-[#266CA9] hover:bg-[#0F2573]"
            >
              {breathingActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Jeda
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Mulai Latihan Napas
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setBreathingActive(false);
                setBreathingCount(0);
                setBreathingPhase('inhale');
              }}
              variant="outline"
              className="border-[#266CA9] text-[#266CA9]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {breathingCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-800">
                Kamu sudah menyelesaikan {breathingCount} siklus! Tetap lanjutkan 🌟
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Meditation */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-[#0F2573]" />
            Meditasi Audio Singkat
          </CardTitle>
          <CardDescription>Meditasi terpandu untuk menenangkan pikiran</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meditationTracks.map((meditation, index) => (
              <div 
                key={index} 
                className={`${meditation.color} rounded-lg p-4 hover:shadow-md transition-all border-2 ${
                  playingAudio === index ? 'border-[#266CA9] shadow-lg' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{meditation.title}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      {meditation.duration}
                    </p>
                  </div>
                  {playingAudio === index && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-[#266CA9] rounded animate-pulse"></div>
                      <div className="w-1 h-4 bg-[#266CA9] rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-3 bg-[#266CA9] rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <audio
                  ref={el => audioRefs.current[index] = el}
                  src={meditation.audioUrl}
                  className="hidden"
                />
                <Button
                  onClick={() => handleAudioPlayPause(index)}
                  className={`w-full ${
                    playingAudio === index 
                      ? 'bg-[#0F2573] hover:bg-[#041D56]' 
                      : 'bg-[#266CA9] hover:bg-[#0F2573]'
                  } text-white transition-all`}
                  size="sm"
                >
                  {playingAudio === index ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Jeda Audio
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Putar Audio
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
          {playingAudio !== null && (
            <div className="bg-[#ADE1FB]/20 border border-[#266CA9] rounded-lg p-4 text-center">
              <p className="text-sm text-[#0F2573]">
                🎵 Sedang memutar: <span className="font-medium">{meditationTracks[playingAudio].title}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">Tutup mata, tarik napas dalam, dan biarkan pikiranmu tenang</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timer Session */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Sesi Meditasi dengan Timer</CardTitle>
          <CardDescription>Mulai sesi meditasi dan lihat progresmu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="text-5xl text-[#266CA9] mb-2">{formatTime(meditationTime)}</div>
            <p className="text-sm text-gray-600">Waktu meditasi</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setMeditationActive(!meditationActive)}
              className="bg-[#266CA9] hover:bg-[#0F2573]"
            >
              {meditationActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Jeda
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Mulai Meditasi
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setMeditationActive(false);
                setMeditationTime(0);
              }}
              variant="outline"
              className="border-[#266CA9] text-[#266CA9]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {meditationTime >= 300 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-800">
                🎉 Luar biasa! Kamu sudah meditasi lebih dari 5 menit. Pertahankan!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle>Tips Mindfulness</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-[#ADE1FB]">
            <li>• Cari tempat yang tenang dan nyaman</li>
            <li>• Fokus pada napasmu, bukan pada pikiran yang lewat</li>
            <li>• Jangan memaksakan diri - mulai dari 2-3 menit saja</li>
            <li>• Praktikkan setiap hari untuk hasil terbaik</li>
            <li>• Ingat: tidak ada cara yang "salah" untuk bermeditasi</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}