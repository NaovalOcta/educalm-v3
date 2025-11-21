import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Target, Plus, CheckCircle, Trophy, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Goal {
  id: number;
  title: string;
  target: number;
  completed: number;
  duration: string;
  subject: string;
  emoji: string;
  createdAt: string;
  lastUpdated: string;
}

interface DailyProgress {
  date: string;
  tasksCompleted: number;
  goalsAchieved: number;
}

export default function GoalTracker() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    duration: 'week'
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState<DailyProgress[]>([]);
  const [statistics, setStatistics] = useState({
    targetsCompleted: 0,
    dailyStreak: 0,
    totalPoints: 0,
    weeklyConsistency: 0,
    trend: 'up' as 'up' | 'down' | 'stable'
  });

  useEffect(() => {
    loadGoals();
    loadWeeklyProgress();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [goals, weeklyProgress]);

  const loadGoals = () => {
    try {
      const storedGoals = localStorage.getItem('educalm_goals');
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals);
        const sortedGoals = parsedGoals.sort((a: Goal, b: Goal) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setGoals(sortedGoals);
      }
    } catch (error) {
      console.error('Error loading goals from localStorage:', error);
    }
  };

  const saveGoals = (goalsToSave: Goal[]) => {
    try {
      localStorage.setItem('educalm_goals', JSON.stringify(goalsToSave));
    } catch (error) {
      console.error('Error saving goals to localStorage:', error);
    }
  };

  const loadWeeklyProgress = () => {
    try {
      const storedProgress = localStorage.getItem('educalm_weekly_progress');
      if (storedProgress) {
        const parsedProgress = JSON.parse(storedProgress);
        const sortedProgress = parsedProgress.sort((a: DailyProgress, b: DailyProgress) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setWeeklyProgress(sortedProgress);
      } else {
        // Initialize empty progress for last 7 days
        const initialProgress = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          initialProgress.push({
            date: dateStr,
            tasksCompleted: 0,
            goalsAchieved: 0
          });
        }
        setWeeklyProgress(initialProgress);
        saveWeeklyProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading weekly progress from localStorage:', error);
    }
  };

  const saveWeeklyProgress = (progressToSave: DailyProgress[]) => {
    try {
      localStorage.setItem('educalm_weekly_progress', JSON.stringify(progressToSave));
    } catch (error) {
      console.error('Error saving weekly progress to localStorage:', error);
    }
  };

  const updateDailyProgress = (tasksAdded: number, goalCompleted: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedProgress = [...weeklyProgress];
    
    let todayProgress = updatedProgress.find(p => p.date === today);
    
    if (!todayProgress) {
      todayProgress = {
        date: today,
        tasksCompleted: 0,
        goalsAchieved: 0
      };
      updatedProgress.push(todayProgress);
    }
    
    todayProgress.tasksCompleted += tasksAdded;
    if (goalCompleted) {
      todayProgress.goalsAchieved += 1;
    }
    
    // Keep only last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const filtered = updatedProgress.filter(p => 
      new Date(p.date) >= sevenDaysAgo
    );
    
    setWeeklyProgress(filtered);
    saveWeeklyProgress(filtered);
  };

  const calculateStatistics = () => {
    const completedGoals = goals.filter(g => g.completed >= g.target).length;
    const totalTasks = goals.reduce((sum, g) => sum + g.completed, 0);
    const points = totalTasks * 10;
    const streak = calculateStreak(weeklyProgress);
    const totalPossibleTasks = goals.reduce((sum, g) => sum + g.target, 0);
    const totalCompleted = goals.reduce((sum, g) => sum + g.completed, 0);
    const consistency = totalPossibleTasks > 0 
      ? Math.round((totalCompleted / totalPossibleTasks) * 100) 
      : 0;
    const trend = calculateTrend(weeklyProgress);
    
    setStatistics({
      targetsCompleted: completedGoals,
      dailyStreak: streak,
      totalPoints: points,
      weeklyConsistency: consistency,
      trend
    });
  };

  const calculateStreak = (progress: DailyProgress[]) => {
    if (progress.length === 0) return 0;
    
    const sorted = [...progress].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    
    for (let i = 0; i < sorted.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (sorted[i].date === expectedDateStr && sorted[i].tasksCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateTrend = (progress: DailyProgress[]) => {
    if (progress.length < 3) return 'stable';
    
    const sorted = [...progress].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const last3Days = sorted.slice(0, 3).reduce((sum, p) => sum + p.tasksCompleted, 0);
    const prev3Days = sorted.slice(3, 6).reduce((sum, p) => sum + p.tasksCompleted, 0);
    
    if (last3Days > prev3Days * 1.1) return 'up';
    if (last3Days < prev3Days * 0.9) return 'down';
    return 'stable';
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target) {
      toast.error('Lengkapi semua field terlebih dahulu');
      return;
    }

    setLoading(true);

    const durationMap: { [key: string]: string } = {
      'day': 'Hari ini',
      'week': 'Minggu ini',
      'month': 'Bulan ini'
    };

    const subjectEmojis = ['📐', '⚡', '📚', '🧪', '🌍', '💻', '🎨', '🎭', '🎵', '⚽', '🔬', '📝', '🗣️', '🧮', '📊'];
    const randomEmoji = subjectEmojis[Math.floor(Math.random() * subjectEmojis.length)];

    try {
      const goalToAdd: Goal = {
        id: Date.now(),
        title: newGoal.title,
        target: parseInt(newGoal.target),
        completed: 0,
        duration: durationMap[newGoal.duration],
        subject: 'Custom',
        emoji: randomEmoji,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      const updatedGoals = [...goals, goalToAdd];
      saveGoals(updatedGoals);
      setGoals(updatedGoals);

      toast.success('Target belajar berhasil ditambahkan! 🎯');
      setShowAddForm(false);
      setNewGoal({ title: '', target: '', duration: 'week' });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Gagal menambah target belajar');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = (goalId: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || goal.completed >= goal.target) return;

    const newCompleted = goal.completed + 1;
    const goalWillBeCompleted = newCompleted === goal.target;
    
    setLoading(true);

    try {
      const updatedGoals = goals.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            completed: newCompleted,
            lastUpdated: new Date().toISOString()
          };
        }
        return g;
      });

      saveGoals(updatedGoals);
      setGoals(updatedGoals);

      // Update daily progress
      updateDailyProgress(1, goalWillBeCompleted);

      if (goalWillBeCompleted) {
        toast.success('🎉 Selamat! Kamu telah menyelesaikan target ini!', {
          description: getMotivationalQuote()
        });
      } else {
        toast.success(`Progress updated! ${Math.round((newCompleted / goal.target) * 100)}% selesai 💪`);
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Gagal update progress');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = (goalId: number) => {
    if (!confirm('Apakah kamu yakin ingin menghapus target ini?')) {
      return;
    }

    setLoading(true);

    try {
      const updatedGoals = goals.filter(g => g.id !== goalId);
      saveGoals(updatedGoals);
      setGoals(updatedGoals);
      toast.success('Target berhasil dihapus');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Gagal menghapus target');
    } finally {
      setLoading(false);
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
      'Kamu luar biasa! Tetap semangat!',
      'Konsistensi adalah kunci kesuksesan!',
      'Setiap langkah kecil adalah kemajuan!',
      'Kamu membuktikan bahwa kamu bisa!',
      'Terus pertahankan momentum ini!',
      'Kamu adalah inspirasi!'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="w-8 h-8" />
            Goal Tracker Akademik
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Tetapkan target belajar pribadi dan pantau progresmu
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#266CA9]" />
              Konsistensi Minggu Ini
            </CardTitle>
            <Badge className="bg-[#266CA9] text-lg px-4 py-1">
              {statistics.weeklyConsistency}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={statistics.weeklyConsistency} className="h-3" />
          <p className="text-sm text-gray-700">
            Kamu sudah {statistics.weeklyConsistency}% konsisten minggu ini! 
            {statistics.weeklyConsistency >= 80 ? ' Luar biasa! 🌟' : ' Ayo tingkatkan lagi! 💪'}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-xl text-[#0F2573]">Target Belajar Aktif</h3>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#266CA9] hover:bg-[#0F2573]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Target
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-[#266CA9]">
          <CardHeader>
            <CardTitle>Buat Target Belajar Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Target Belajar</Label>
              <Input
                id="goal-title"
                placeholder="Contoh: Belajar Matematika 30 menit setiap hari"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="border-[#266CA9]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-target">Jumlah Target</Label>
                <Input
                  id="goal-target"
                  type="number"
                  placeholder="7"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  className="border-[#266CA9]"
                />
              </div>
              <div>
                <Label htmlFor="goal-duration">Durasi</Label>
                <select
                  id="goal-duration"
                  value={newGoal.duration}
                  onChange={(e) => setNewGoal({ ...newGoal, duration: e.target.value })}
                  className="w-full h-10 rounded-md border border-[#266CA9] px-3 text-sm"
                >
                  <option value="day">Hari ini</option>
                  <option value="week">Minggu ini</option>
                  <option value="month">Bulan ini</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddGoal} className="flex-1 bg-[#266CA9] hover:bg-[#0F2573]">
                Simpan Target
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1 border-[#266CA9] text-[#266CA9]">
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.round((goal.completed / goal.target) * 100);
          const isCompleted = goal.completed === goal.target;

          return (
            <Card 
              key={goal.id} 
              className={`border-2 transition-all ${
                isCompleted 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-blue-100 hover:shadow-md'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{goal.emoji}</span>
                      <div className="flex-1">
                        <CardTitle className={`text-lg ${isCompleted ? 'text-green-700 line-through' : ''}`}>
                          {goal.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-teal-300">
                            {goal.duration}
                          </Badge>
                          <span className="text-xs">
                            {goal.completed} / {goal.target} selesai
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className={`${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {isCompleted ? (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm text-green-800">Target tercapai!</p>
                      <p className="text-xs text-green-600 mt-1">{getMotivationalQuote()}</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleCompleteTask(goal.id)}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tandai 1 Sesi Selesai
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Pencapaian Minggu Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏆', label: 'Target Selesai', value: statistics.targetsCompleted.toString() },
              { icon: '🔥', label: 'Streak Harian', value: `${statistics.dailyStreak} hari` },
              { icon: '⭐', label: 'Poin', value: statistics.totalPoints.toString() },
              { icon: '🎯', label: 'Konsistensi', value: `${statistics.weeklyConsistency}%` }
            ].map((stat, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-4 text-center backdrop-blur">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-xs text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-700 italic">
              "Kesuksesan adalah hasil dari konsistensi kecil yang dilakukan setiap hari"
            </p>
            <p className="text-xs text-gray-500 mt-2">Tetap semangat! 💙</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}