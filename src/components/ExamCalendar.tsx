import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar as CalendarIcon, Bell, Music, Plus, Trash2, Mail, X, Play } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  email: string;
  color: string;
}

export default function ExamCalendar() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    time: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateExams, setSelectedDateExams] = useState<Exam[]>([]);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<{
    title: string;
    youtubeId: string;
    mood: string;
  } | null>(null);

  // Playlist data with YouTube IDs
  const playlists = [
    { 
      title: 'Lo-fi Study Beats', 
      duration: '2:45:30', 
      mood: '🎵',
      youtubeId: 'jfKfPfyJRdk' // Lo-fi hip hop radio
    },
    { 
      title: 'Piano Relaxation', 
      duration: '1:30:00', 
      mood: '🎹',
      youtubeId: 'lTRiuFIWV54' // Beautiful Relaxing Music
    },
    { 
      title: 'Nature Sounds', 
      duration: '1:15:45', 
      mood: '🌿',
      youtubeId: 'eKFTSSKCzWA' // Forest Sounds
    }
  ];

  // Load exams from localStorage (personal data)
  useEffect(() => {
    loadExams();
  }, []);

  // Update selected date exams when exams or selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const examsOnDate = exams.filter(exam => exam.date === dateStr);
      setSelectedDateExams(examsOnDate);
    }
  }, [exams, selectedDate]);

  const loadExams = () => {
    try {
      const storedExams = localStorage.getItem('educalm_exams');
      if (storedExams) {
        const parsedExams = JSON.parse(storedExams);
        // Sort by date and time ascending (earliest first)
        const sortedExams = parsedExams.sort((a: Exam, b: Exam) => {
          const dateA = new Date(`${a.date}T${a.time}`).getTime();
          const dateB = new Date(`${b.date}T${b.time}`).getTime();
          return dateA - dateB;
        });
        setExams(sortedExams);
      }
    } catch (error) {
      console.error('Error loading exams from localStorage:', error);
    }
  };

  const saveExams = (examsToSave: Exam[]) => {
    try {
      localStorage.setItem('educalm_exams', JSON.stringify(examsToSave));
    } catch (error) {
      console.error('Error saving exams to localStorage:', error);
    }
  };

  const calculateDaysUntil = (dateStr: string, timeStr: string) => {
    const examDateTime = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diffTime = examDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddExam = async () => {
    if (!newExam.subject || !newExam.date || !newExam.time || !newExam.email) {
      toast.error('Lengkapi semua field terlebih dahulu');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newExam.email)) {
      toast.error('Format email tidak valid');
      return;
    }

    setLoading(true);

    try {
      // Create new exam object
      const examToAdd: Exam = {
        id: Date.now(),
        subject: newExam.subject,
        date: newExam.date,
        time: newExam.time,
        email: newExam.email,
        color: getRandomColor()
      };

      // Save to localStorage
      const updatedExams = [...exams, examToAdd];
      saveExams(updatedExams);
      setExams(updatedExams);

      // Send email notification via backend (optional, for reminder feature)
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ca759b54/exams`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(examToAdd)
          }
        );
        toast.success(`Ujian ${newExam.subject} berhasil ditambahkan! Email konfirmasi telah dikirim ke ${newExam.email}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        toast.success(`Ujian ${newExam.subject} berhasil ditambahkan!`);
      }

      setShowAddForm(false);
      setNewExam({ subject: '', date: '', time: '', email: '' });
    } catch (error) {
      console.error('Error adding exam:', error);
      toast.error('Terjadi kesalahan saat menambah ujian');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = (id: number, subject: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ujian ${subject}?`)) {
      return;
    }

    try {
      const updatedExams = exams.filter(exam => exam.id !== id);
      saveExams(updatedExams);
      setExams(updatedExams);
      toast.success(`Ujian ${subject} berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Terjadi kesalahan saat menghapus ujian');
    }
  };

  // Check if a date has exams
  const hasExamsOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return exams.some(exam => exam.date === dateStr);
  };

  // Get exam count for a date
  const getExamCountOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return exams.filter(exam => exam.date === dateStr).length;
  };

  // Custom day content for calendar with markers
  const renderDayContent = (day: Date) => {
    const hasExam = hasExamsOnDate(day);
    const examCount = getExamCountOnDate(day);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{day.getDate()}</span>
        {hasExam && (
          <div className="exam-marker">
            {Array.from({ length: Math.min(examCount, 3) }).map((_, i) => (
              <div
                key={i}
                className="exam-marker-dot"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CalendarIcon className="w-8 h-8" />
            Kalender Ujian & Pengingat Relaksasi
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Atur jadwal ujianmu dan dapatkan pengingat otomatis untuk relaksasi
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar Widget */}
        <div className="lg:col-span-1">
          <Card className="border-[#266CA9]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#266CA9]" />
                Kalender Interaktif
              </CardTitle>
              <CardDescription>
                Klik tanggal untuk melihat ujian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-[#ADE1FB]"
                modifiers={{
                  hasExam: (date) => hasExamsOnDate(date)
                }}
                modifiersStyles={{
                  hasExam: {
                    fontWeight: 'bold',
                    color: '#266CA9'
                  }
                }}
                components={{
                  DayContent: ({ date }) => renderDayContent(date)
                }}
              />
              
              {/* Selected Date Info */}
              {selectedDate && (
                <div className="mt-4 p-3 bg-[#ADE1FB]/20 rounded-lg">
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-[#0F2573]">
                      {selectedDate.toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </p>
                  
                  {selectedDateExams.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateExams.map((exam) => (
                        <div key={exam.id} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${exam.color}`}></div>
                            <span>{exam.subject}</span>
                          </div>
                          <span className="text-xs text-gray-500">{exam.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Tidak ada ujian di tanggal ini</p>
                  )}
                </div>
              )}
              
              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-[#ADE1FB]">
                <p className="text-xs text-gray-600 mb-2">Keterangan:</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-[#266CA9]"></div>
                    <div className="w-1 h-1 rounded-full bg-[#266CA9]"></div>
                    <div className="w-1 h-1 rounded-full bg-[#266CA9]"></div>
                  </div>
                  <span>Tanggal ada ujian</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Exam List & Other Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Calm Playlist */}
          <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-6 h-6 text-[#0F2573]" />
                Study Calm Playlist
              </CardTitle>
              <CardDescription>Musik instrumental untuk belajar dengan tenang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {playlists.map((playlist, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col items-start bg-white rounded-lg p-4 hover:shadow-lg hover:scale-105 transition-all border-2 hover:border-[#266CA9] active:scale-95"
                    onClick={() => {
                      setCurrentPlaylist(playlist);
                      setShowMusicPlayer(true);
                    }}
                  >
                    <div className="text-3xl mb-2">{playlist.mood}</div>
                    <h4 className="text-sm mb-1 font-semibold">{playlist.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {playlist.duration}
                    </p>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Exam Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl text-[#0F2573]">Daftar Ujian</h3>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#266CA9] hover:bg-[#0F2573]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Ujian
            </Button>
          </div>

          {/* Add Exam Form */}
          {showAddForm && (
            <Card className="border-[#266CA9]">
              <CardHeader>
                <CardTitle>Tambah Jadwal Ujian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Input
                    id="subject"
                    placeholder="Contoh: Matematika"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                    className="border-[#266CA9]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExam.date}
                      onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                      className="border-[#266CA9]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Waktu</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newExam.time}
                      onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                      className="border-[#266CA9]"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Contoh: email@example.com"
                    value={newExam.email}
                    onChange={(e) => setNewExam({ ...newExam, email: e.target.value })}
                    className="border-[#266CA9]"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email konfirmasi dan pengingat akan dikirim ke alamat ini
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddExam} className="flex-1 bg-[#266CA9] hover:bg-[#0F2573]" disabled={loading}>
                    Simpan
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1 border-[#266CA9] text-[#266CA9]">
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exam List */}
          <div className="space-y-4">
            {exams.length === 0 ? (
              <Card className="border-[#ADE1FB]">
                <CardContent className="pt-6 text-center text-gray-500">
                  <p>Belum ada jadwal ujian. Tambahkan jadwal ujianmu sekarang!</p>
                </CardContent>
              </Card>
            ) : (
              exams
                .sort((a, b) => {
                  const daysA = calculateDaysUntil(a.date, a.time);
                  const daysB = calculateDaysUntil(b.date, b.time);
                  return daysA - daysB;
                })
                .map((exam) => {
                  const daysUntil = calculateDaysUntil(exam.date, exam.time);
                  return (
                    <Card key={exam.id} className="border-[#ADE1FB] hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <div className={`w-3 h-3 rounded-full ${exam.color}`}></div>
                              <h4 className="text-lg">{exam.subject}</h4>
                              <Badge variant="outline" className="border-[#266CA9]">
                                {daysUntil <= 0 ? 'Hari ini!' : `${daysUntil} hari lagi`}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(exam.date).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })} • {exam.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Bell className="w-5 h-5 text-[#266CA9]" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExam(exam.id, exam.subject)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>

          {/* Reminder Settings */}
          <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#266CA9]" />
                Pengaturan Pengingat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>7 hari sebelum ujian: Pengingat mulai review materi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>3 hari sebelum ujian: Pengingat latihan relaksasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>1 hari sebelum ujian: Pengingat latihan napas & istirahat</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Music Player Dialog */}
      <Dialog open={showMusicPlayer} onOpenChange={setShowMusicPlayer}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{currentPlaylist?.mood}</span>
              <div>
                <h3 className="text-xl">{currentPlaylist?.title}</h3>
                <p className="text-sm text-gray-500">Study Calm Playlist</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Nikmati musik relaksasi untuk menemani waktu belajarmu
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentPlaylist?.youtubeId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}