import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { MessageCircle, Heart, Send, Sparkles, Trash2, RefreshCw, Wifi, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface Comment {
  id: number;
  confessionId: number;
  text: string;
  timestamp: string;
}

interface Confession {
  id: number;
  text: string;
  mood: string;
  moodLabel: string;
  timestamp: string;
  hearts: number;
  isLiked: boolean;
  comments?: Comment[];
  commentCount?: number;
}

export default function AnonymousConfession() {
  const [newConfession, setNewConfession] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [expandedConfession, setExpandedConfession] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: number]: boolean }>({});

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ca759b54`;

  const moods = [
    { emoji: '😔', label: 'Sedih', value: 'sad' },
    { emoji: '😰', label: 'Cemas', value: 'anxious' },
    { emoji: '😐', label: 'Biasa', value: 'neutral' },
    { emoji: '🙂', label: 'Baik', value: 'good' },
    { emoji: '😊', label: 'Senang', value: 'happy' }
  ];

  // Fetch confessions from server
  const fetchConfessions = async (showToast = false) => {
    try {
      const response = await fetch(`${API_URL}/confessions`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Fetch comment counts for each confession
        const confessionsWithCounts = await Promise.all(
          data.confessions.map(async (confession: Confession) => {
            const commentsResponse = await fetch(
              `${API_URL}/confessions/${confession.id}/comments`,
              {
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
              }
            );
            const commentsData = await commentsResponse.json();
            return {
              ...confession,
              commentCount: commentsData.success ? commentsData.comments.length : 0,
            };
          })
        );
        setConfessions(confessionsWithCounts);
        setIsConnected(true);
        setLastUpdate(new Date());
        if (showToast) {
          toast.success('Data berhasil diperbarui! 🔄');
        }
      }
    } catch (error) {
      console.error('Error fetching confessions:', error);
      setIsConnected(false);
      if (showToast) {
        toast.error('Gagal mengambil data dari server');
      }
    }
  };

  // Fetch comments for a specific confession
  const fetchComments = async (confessionId: number) => {
    try {
      setLoadingComments({ ...loadingComments, [confessionId]: true });
      const response = await fetch(
        `${API_URL}/confessions/${confessionId}/comments`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setConfessions(confessions.map(c => 
          c.id === confessionId 
            ? { ...c, comments: data.comments, commentCount: data.comments.length }
            : c
        ));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments({ ...loadingComments, [confessionId]: false });
    }
  };

  // Toggle expand/collapse comments
  const toggleComments = async (confessionId: number) => {
    if (expandedConfession === confessionId) {
      setExpandedConfession(null);
    } else {
      setExpandedConfession(confessionId);
      await fetchComments(confessionId);
    }
  };

  // Load confessions on mount
  useEffect(() => {
    fetchConfessions();
  }, []);

  // Auto-refresh every 5 seconds for realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConfessions();
      // Also refresh comments for expanded confession
      if (expandedConfession) {
        fetchComments(expandedConfession);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [expandedConfession]);

  const handleSubmit = async () => {
    if (!newConfession.trim()) {
      toast.error('Tuliskan perasaanmu terlebih dahulu');
      return;
    }
    if (!selectedMood) {
      toast.error('Pilih mood-mu hari ini');
      return;
    }

    const selectedMoodData = moods.find(m => m.value === selectedMood);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/confessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          text: newConfession,
          mood: selectedMoodData?.emoji || '😐',
          moodLabel: selectedMoodData?.label || 'Biasa',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Curhat berhasil terkirim! 💙', {
          description: 'Semua device sekarang bisa melihat curhatanmu secara realtime'
        });
        setNewConfession('');
        setSelectedMood('');
        await fetchConfessions();
      } else {
        throw new Error(data.error || 'Failed to send confession');
      }
    } catch (error) {
      console.error('Error sending confession:', error);
      toast.error('Gagal mengirim curhat. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (confessionId: number) => {
    const commentText = newComment[confessionId]?.trim();
    if (!commentText) {
      toast.error('Tulis komentar terlebih dahulu');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/confessions/${confessionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Komentar berhasil dikirim! 💬');
        setNewComment({ ...newComment, [confessionId]: '' });
        await fetchComments(confessionId);
        await fetchConfessions(); // Update comment count
      } else {
        toast.error('Gagal mengirim komentar');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Gagal mengirim komentar');
    }
  };

  const handleDeleteComment = async (confessionId: number, commentId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/confessions/${confessionId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Komentar berhasil dihapus');
        await fetchComments(confessionId);
        await fetchConfessions(); // Update comment count
      } else {
        toast.error('Gagal menghapus komentar');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Gagal menghapus komentar');
    }
  };

  const handleLike = async (id: number) => {
    const confession = confessions.find(c => c.id === id);
    if (!confession) return;

    const newIsLiked = !confession.isLiked;
    const newHearts = newIsLiked ? confession.hearts + 1 : confession.hearts - 1;

    // Optimistic update
    setConfessions(confessions.map(c => 
      c.id === id 
        ? { ...c, hearts: newHearts, isLiked: newIsLiked }
        : c
    ));

    try {
      const response = await fetch(`${API_URL}/confessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          hearts: newHearts,
          isLiked: newIsLiked,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        // Revert on error
        setConfessions(confessions.map(c => 
          c.id === id 
            ? confession
            : c
        ));
        toast.error('Gagal update like');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setConfessions(confessions.map(c => 
        c.id === id 
          ? confession
          : c
      ));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/confessions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Curhat berhasil dihapus');
        await fetchConfessions();
      } else {
        toast.error('Gagal menghapus curhat');
      }
    } catch (error) {
      console.error('Error deleting confession:', error);
      toast.error('Gagal menghapus curhat');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Hapus semua curhat? Tindakan ini tidak dapat dibatalkan dan akan menghapus curhat dari semua device.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/confessions`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Semua curhat berhasil dihapus');
        await fetchConfessions();
      } else {
        toast.error('Gagal menghapus semua curhat');
      }
    } catch (error) {
      console.error('Error deleting all confessions:', error);
      toast.error('Gagal menghapus semua curhat');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 5) return 'Baru saja';
    return `${seconds} detik yang lalu`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MessageCircle className="w-8 h-8" />
                Ruang Curhat Anonim
              </CardTitle>
              <CardDescription className="text-[#ADE1FB]">
                Ungkapkan perasaanmu tanpa khawatir. Semua curhat bersifat anonim dan bisa dilihat oleh semua device secara realtime
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchConfessions(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <p className="text-xs text-[#ADE1FB] mt-2">
            Update terakhir: {formatLastUpdate()} • Auto-refresh setiap 5 detik
          </p>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-[#266CA9]" />
            <p className="text-2xl text-[#0F2573]">{confessions.length}</p>
            <p className="text-sm text-gray-600">Total Curhat</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
          <CardContent className="pt-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-[#266CA9]" />
            <p className="text-2xl text-[#0F2573]">
              {confessions.reduce((sum, c) => sum + c.hearts, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Dukungan</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9] col-span-2 md:col-span-1">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#266CA9]" />
            <p className="text-2xl text-[#0F2573]">
              {confessions.reduce((sum, c) => sum + (c.commentCount || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Komentar</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracker */}
      <Card className="bg-[#ADE1FB]/20 border-[#266CA9]">
        <CardHeader>
          <CardTitle className="text-lg">Bagaimana Perasaanmu Hari Ini?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 justify-center flex-wrap">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  selectedMood === mood.value
                    ? 'bg-[#266CA9] text-white shadow-lg scale-110'
                    : 'bg-white hover:bg-[#ADE1FB]/30'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-sm">{mood.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Confession */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Tulis Curhatanmu</CardTitle>
          <CardDescription>Semua identitas akan tetap anonim dan aman. Curhatmu akan muncul di semua device secara realtime.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Tuliskan apa yang kamu rasakan... Jangan khawatir, ini anonim 💙&#10;&#10;Contoh: Aku lagi cemas banget sama ujian besok. Rasanya aku belum siap..."
            value={newConfession}
            onChange={(e) => setNewConfession(e.target.value)}
            className="min-h-[120px] resize-none border-[#266CA9] focus:border-[#0F2573]"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{newConfession.length} karakter</span>
            {selectedMood && (
              <span className="flex items-center gap-2">
                Mood: {moods.find(m => m.value === selectedMood)?.emoji} {moods.find(m => m.value === selectedMood)?.label}
              </span>
            )}
          </div>
          <Button 
            onClick={handleSubmit}
            className="w-full bg-[#266CA9] hover:bg-[#0F2573]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Curhat Anonim ke Semua Device
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Box */}
      {confessions.length === 0 && (
        <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#ADE1FB]/10 border-[#266CA9]">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-[#266CA9]" />
            <p className="text-gray-700 mb-2">Belum ada curhat yang terkirim</p>
            <p className="text-sm text-gray-600">
              Yuk mulai curhat dan ungkapkan perasaanmu! Curhatmu akan muncul di semua device secara realtime.
            </p>
          </CardContent>
        </Card>
      )}

      {/* All Confessions */}
      {confessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#0F2573]">Semua Curhat ({confessions.length})</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAll}
              className="text-xs border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Hapus Semua
            </Button>
          </div>
          <div className="space-y-4">
            {confessions.map((confession) => (
              <Card 
                key={confession.id} 
                className="hover:shadow-md transition-all border-[#ADE1FB] hover:border-[#266CA9]"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl flex-shrink-0">{confession.mood}</span>
                    <div className="flex-1">
                      <p className="text-gray-700 whitespace-pre-wrap break-words">{confession.text}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                        <button 
                          onClick={() => handleLike(confession.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            confession.isLiked 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'hover:text-red-500'
                          }`}
                        >
                          <Heart 
                            className={`w-4 h-4 ${confession.isLiked ? 'fill-current' : ''}`} 
                          />
                          {confession.hearts}
                        </button>
                        <button
                          onClick={() => toggleComments(confession.id)}
                          className="flex items-center gap-1 hover:text-[#266CA9] transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {confession.commentCount || 0} komentar
                        </button>
                        <span className="text-xs">{formatTimestamp(confession.timestamp)}</span>
                        <Badge variant="outline" className="border-[#266CA9] text-[#266CA9] text-xs">
                          {confession.moodLabel}
                        </Badge>
                        <button
                          onClick={() => {
                            if (confirm('Hapus curhat ini dari semua device?')) {
                              handleDelete(confession.id);
                            }
                          }}
                          className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedConfession === confession.id && (
                        <div className="mt-4 pt-4 border-t border-[#ADE1FB]">
                          {loadingComments[confession.id] ? (
                            <div className="text-center py-4">
                              <RefreshCw className="w-4 h-4 animate-spin mx-auto text-[#266CA9]" />
                            </div>
                          ) : (
                            <>
                              {/* Comments List */}
                              {confession.comments && confession.comments.length > 0 && (
                                <div className="space-y-3 mb-4">
                                  {confession.comments.map((comment) => (
                                    <div 
                                      key={comment.id}
                                      className="bg-[#ADE1FB]/10 rounded-lg p-3 flex items-start justify-between gap-2"
                                    >
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-700">{comment.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {formatTimestamp(comment.timestamp)}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          if (confirm('Hapus komentar ini?')) {
                                            handleDeleteComment(confession.id, comment.id);
                                          }
                                        }}
                                        className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add Comment */}
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Tulis komentar dukungan..."
                                  value={newComment[confession.id] || ''}
                                  onChange={(e) => setNewComment({ 
                                    ...newComment, 
                                    [confession.id]: e.target.value 
                                  })}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddComment(confession.id);
                                    }
                                  }}
                                  className="text-sm border-[#266CA9] focus:border-[#0F2573]"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(confession.id)}
                                  className="bg-[#266CA9] hover:bg-[#0F2573]"
                                >
                                  <Send className="w-3 h-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}