import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Smile, TrendingUp, Calendar, Lightbulb, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface JournalEntry {
  id: number;
  mood: string;
  moodEmoji: string;
  moodLabel: string;
  moodScore: number;
  activities: string[];
  entry: string;
  date: string;
  time: string;
}

export default function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const moods = [
    { emoji: '😔', label: 'Sedih', value: 'sad', color: 'bg-blue-100', score: 1 },
    { emoji: '😰', label: 'Cemas', value: 'anxious', color: 'bg-purple-100', score: 2 },
    { emoji: '😐', label: 'Biasa Saja', value: 'neutral', color: 'bg-gray-100', score: 3 },
    { emoji: '🙂', label: 'Baik', value: 'good', color: 'bg-green-100', score: 4 },
    { emoji: '😊', label: 'Senang', value: 'happy', color: 'bg-yellow-100', score: 5 },
    { emoji: '😄', label: 'Sangat Senang', value: 'very-happy', color: 'bg-orange-100', score: 6 }
  ];

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = () => {
    try {
      const storedEntries = localStorage.getItem('educalm_mood_journal');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        setJournalEntries(parsedEntries);
      }
    } catch (error) {
      console.error('Error loading journal entries from localStorage:', error);
    }
  };

  const saveJournalEntries = (entries: JournalEntry[]) => {
    try {
      localStorage.setItem('educalm_mood_journal', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entries to localStorage:', error);
    }
  };

  const activities = [
    '📚 Belajar', '🎮 Bermain Game', '🎵 Mendengar Musik', '🏃 Olahraga',
    '👥 Berkumpul dengan Teman', '😴 Istirahat', '🎨 Hobi Kreatif', '📱 Media Sosial'
  ];

  const weeklyMoods = [
    { day: 'Sen', mood: '😊', date: '28 Okt' },
    { day: 'Sel', mood: '🙂', date: '29 Okt' },
    { day: 'Rab', mood: '😐', date: '30 Okt' },
    { day: 'Kam', mood: '😰', date: '31 Okt' },
    { day: 'Jum', mood: '😊', date: '1 Nov' },
    { day: 'Sab', mood: '😄', date: '2 Nov' },
    { day: 'Min', mood: '🙂', date: '3 Nov' }
  ];

  const handleToggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSaveJournal = () => {
    if (!selectedMood) {
      toast.error('Pilih mood-mu terlebih dahulu');
      return;
    }

    const moodInfo = moods.find(m => m.value === selectedMood);
    const newEntry: JournalEntry = {
      id: Date.now(), // Using timestamp for unique ID
      mood: selectedMood,
      moodEmoji: moodInfo?.emoji || '',
      moodLabel: moodInfo?.label || '',
      moodScore: moodInfo?.score || 0,
      activities: selectedActivities,
      entry: journalEntry,
      date: new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setJournalEntries([...journalEntries, newEntry]);
    toast.success('Journal berhasil disimpan! 📝');
    setSelectedMood('');
    setJournalEntry('');
    setSelectedActivities([]);
    saveJournalEntries([...journalEntries, newEntry]);
  };

  const handleDeleteEntry = (entryId: number) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
    toast.success('Journal berhasil dihapus! 🗑️');
    saveJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
  };

  const getWeeklyAnalysis = () => {
    const positiveCount = weeklyMoods.filter(m => ['😊', '😄', '🙂'].includes(m.mood)).length;
    const percentage = Math.round((positiveCount / weeklyMoods.length) * 100);

    if (percentage >= 70) {
      return {
        message: 'Hebat! Minggu ini mood-mu sangat positif 🌟',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        tips: [
          'Pertahankan hal-hal positif yang sudah kamu lakukan',
          'Terus jaga pola hidup sehat',
          'Bantu teman yang mungkin sedang down'
        ]
      };
    } else if (percentage >= 40) {
      return {
        message: 'Minggu ini ada naik turun mood ya. Itu wajar kok! 💙',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        tips: [
          'Coba identifikasi apa yang membuat mood-mu turun',
          'Luangkan waktu untuk self-care',
          'Berbicara dengan orang yang kamu percaya'
        ]
      };
    } else {
      return {
        message: 'Sepertinya minggu ini cukup berat ya. Kamu tidak sendirian 🤗',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        tips: [
          'Pertimbangkan untuk berbicara dengan konselor',
          'Luangkan waktu untuk aktivitas yang kamu sukai',
          'Jangan terlalu keras pada dirimu sendiri',
          'Ingat: ini hanya sementara, akan ada hari yang lebih baik'
        ]
      };
    }
  };

  const analysis = getWeeklyAnalysis();

  // Generate monthly mood data for chart
  const getMonthlyMoodData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'short' 
      });
      
      // Find entry for this date
      const dateFullStr = date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const entriesOnDate = journalEntries.filter(entry => entry.date === dateFullStr);
      
      let avgScore = 0;
      let moodEmoji = '';
      
      if (entriesOnDate.length > 0) {
        avgScore = entriesOnDate.reduce((sum, e) => sum + e.moodScore, 0) / entriesOnDate.length;
        // Get most recent entry's emoji
        moodEmoji = entriesOnDate[entriesOnDate.length - 1].moodEmoji;
      }
      
      last30Days.push({
        date: dateStr,
        score: avgScore,
        emoji: moodEmoji,
        hasData: entriesOnDate.length > 0
      });
    }
    
    return last30Days;
  };

  const monthlyData = getMonthlyMoodData();
  const hasAnyData = monthlyData.some(d => d.hasData);
  
  // Calculate monthly statistics
  const getMonthlyStats = () => {
    const dataWithScores = monthlyData.filter(d => d.hasData);
    
    if (dataWithScores.length === 0) {
      return {
        averageMood: 0,
        bestDay: null,
        worstDay: null,
        totalEntries: 0,
        moodTrend: 'stable' as 'up' | 'down' | 'stable'
      };
    }
    
    const avgMood = dataWithScores.reduce((sum, d) => sum + d.score, 0) / dataWithScores.length;
    const bestDay = dataWithScores.reduce((best, d) => d.score > best.score ? d : best);
    const worstDay = dataWithScores.reduce((worst, d) => d.score < worst.score ? d : worst);
    
    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(dataWithScores.length / 2);
    const firstHalf = dataWithScores.slice(0, midpoint);
    const secondHalf = dataWithScores.slice(midpoint);
    
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (secondAvg > firstAvg * 1.1) trend = 'up';
    else if (secondAvg < firstAvg * 0.9) trend = 'down';
    
    return {
      averageMood: Math.round(avgMood * 10) / 10,
      bestDay,
      worstDay,
      totalEntries: journalEntries.length,
      moodTrend: trend
    };
  };

  const monthlyStats = getMonthlyStats();

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].payload.hasData) {
      const data = payload[0].payload;
      const moodLabel = moods.find(m => m.score === Math.round(data.score))?.label || '';
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#266CA9]/30">
          <p className="text-sm text-gray-600 mb-1">{data.date}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{data.emoji}</span>
            <div>
              <p className="text-sm text-[#266CA9]">{moodLabel}</p>
              <p className="text-xs text-gray-500">Score: {data.score.toFixed(1)}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Smile className="w-8 h-8" />
            Mood Journal Harian
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Catat perasaanmu setiap hari dan lihat perkembangan emosimu
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Weekly Mood Tracker */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#266CA9]" />
            Mood Minggu Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyMoods.map((day, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#ADE1FB]/20 rounded-lg p-3 hover:bg-[#ADE1FB]/40 transition-colors">
                  <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                  <div className="text-3xl mb-2">{day.mood}</div>
                  <div className="text-xs text-gray-500">{day.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Analysis */}
      <Card className={`${analysis.bgColor} border-2`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${analysis.color}`}>
            <TrendingUp className="w-6 h-6" />
            Analisis Mingguan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-lg ${analysis.color}`}>{analysis.message}</p>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Tips Personal untuk Kamu:
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {analysis.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#266CA9] mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Today's Journal */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Catat Mood Hari Ini</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h4 className="text-sm mb-3">Bagaimana perasaanmu hari ini?</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    selectedMood === mood.value
                      ? 'bg-[#266CA9] text-white shadow-lg scale-110'
                      : `${mood.color} hover:scale-105`
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h4 className="text-sm mb-3">Apa yang kamu lakukan hari ini?</h4>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <Badge
                  key={activity}
                  variant={selectedActivities.includes(activity) ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    selectedActivities.includes(activity)
                      ? 'bg-[#266CA9]'
                      : 'border-[#266CA9] hover:bg-[#ADE1FB]/30'
                  }`}
                  onClick={() => handleToggleActivity(activity)}
                >
                  {activity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Journal Entry */}
          <div>
            <h4 className="text-sm mb-3">Ceritakan tentang harimu (opsional)</h4>
            <Textarea
              placeholder="Apa yang terjadi hari ini? Apa yang membuatmu merasa seperti ini?..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="min-h-[100px] resize-none border-[#266CA9]"
            />
          </div>

          <Button onClick={handleSaveJournal} className="w-full bg-[#266CA9] hover:bg-[#0F2573]">
            Simpan Journal Hari Ini
          </Button>
        </CardContent>
      </Card>

      {/* Journal History */}
      {journalEntries.length > 0 && (
        <Card className="border-[#266CA9]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Riwayat Journal ({journalEntries.length})</span>
              <Badge className="bg-[#266CA9]">{journalEntries.length} entri</Badge>
            </CardTitle>
            <CardDescription>Semua catatan mood dan perasaanmu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.slice().reverse().map((entry) => (
                <div 
                  key={entry.id} 
                  className="bg-gradient-to-r from-[#ADE1FB]/20 to-white rounded-lg p-4 border border-[#266CA9]/30 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-4xl">{entry.moodEmoji}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[#0F2573]">
                          Mood: <span className="text-[#266CA9]">{entry.moodLabel}</span>
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{entry.time}</span>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                            title="Hapus journal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{entry.date}</p>
                      
                      {entry.activities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-2">Aktivitas:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.activities.map((activity, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="text-xs border-[#266CA9]/50 text-[#266CA9]"
                              >
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {entry.entry && (
                        <div className="bg-white/60 rounded-md p-3 mt-2">
                          <p className="text-sm text-gray-700 italic">"{entry.entry}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Graph - Monthly Emotion Tracking */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#266CA9]" />
            Grafik Emosi Bulanan
          </CardTitle>
          <CardDescription>
            {hasAnyData 
              ? `Visualisasi perubahan mood-mu dalam 30 hari terakhir (${monthlyStats.totalEntries} entri)`
              : 'Mulai catat mood-mu untuk melihat perkembangan emosi'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Area */}
          <div className="bg-gradient-to-br from-[#ADE1FB]/10 to-white rounded-lg p-6 min-h-[300px]">
            {hasAnyData ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#266CA9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ADE1FB" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[0, 6]} 
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tick={{ fontSize: 12, fill: '#666' }}
                    label={{ value: 'Mood Score', angle: -90, position: 'insideLeft', style: { fill: '#666' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#266CA9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center text-gray-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Belum ada data mood</p>
                  <p className="text-xs mt-2">Catat mood pertamamu hari ini! 💙</p>
                </div>
              </div>
            )}
          </div>

          {/* Monthly Statistics */}
          {hasAnyData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#266CA9]/10 to-[#ADE1FB]/20 rounded-lg p-4 text-center border border-[#266CA9]/20">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl text-[#266CA9] mb-1">{monthlyStats.averageMood}</div>
                <div className="text-xs text-gray-600">Rata-rata Mood</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl mb-1">{monthlyStats.bestDay?.emoji || '🌟'}</div>
                <div className="text-sm text-green-700 mb-1">{monthlyStats.bestDay?.date || '-'}</div>
                <div className="text-xs text-gray-600">Hari Terbaik</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 text-center border border-blue-200">
                <div className="text-2xl mb-1">{monthlyStats.worstDay?.emoji || '💪'}</div>
                <div className="text-sm text-blue-700 mb-1">{monthlyStats.worstDay?.date || '-'}</div>
                <div className="text-xs text-gray-600">Perlu Perhatian</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 text-center border border-purple-200">
                <div className="text-2xl mb-1">
                  {monthlyStats.moodTrend === 'up' ? '📈' : monthlyStats.moodTrend === 'down' ? '📉' : '➡️'}
                </div>
                <div className="text-sm text-purple-700 mb-1">
                  {monthlyStats.moodTrend === 'up' ? 'Meningkat' : monthlyStats.moodTrend === 'down' ? 'Menurun' : 'Stabil'}
                </div>
                <div className="text-xs text-gray-600">Trend Bulan Ini</div>
              </div>
            </div>
          )}

          {/* Mood Legend */}
          {hasAnyData && (
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm text-gray-700 mb-3">Referensi Mood Score:</h4>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {moods.map((mood) => (
                  <div key={mood.value} className="flex items-center gap-2 text-xs">
                    <span className="text-xl">{mood.emoji}</span>
                    <div>
                      <p className="text-gray-700">{mood.label}</p>
                      <p className="text-gray-500">Score: {mood.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}