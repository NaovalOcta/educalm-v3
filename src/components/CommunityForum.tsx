import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Users, MessageCircle, ThumbsUp, Send, RefreshCw, Wifi, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface ForumComment {
  id: number;
  postId: number;
  text: string;
  authorName: string;
  initials: string;
  timestamp: string;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  authorName: string;
  initials: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments?: ForumComment[];
  commentCount?: number;
}

export default function CommunityForum() {
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tips Belajar');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [commentAuthorName, setCommentAuthorName] = useState<{ [key: number]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: number]: boolean }>({});
  const [filterCategory, setFilterCategory] = useState('Semua');

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ca759b54`;

  const categories = ['Tips Belajar', 'Diskusi', 'Motivasi', 'Tanya Jawab', 'Pengalaman'];

  // Load saved author name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('forumAuthorName');
    if (savedName) {
      setAuthorName(savedName);
    }
  }, []);

  // Fetch posts from server
  const fetchPosts = async (showToast = false) => {
    try {
      const response = await fetch(`${API_URL}/forum/posts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Fetch comment counts for each post
        const postsWithCounts = await Promise.all(
          data.posts.map(async (post: ForumPost) => {
            const commentsResponse = await fetch(
              `${API_URL}/forum/posts/${post.id}/comments`,
              {
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
              }
            );
            const commentsData = await commentsResponse.json();
            return {
              ...post,
              commentCount: commentsData.success ? commentsData.comments.length : 0,
            };
          })
        );
        setPosts(postsWithCounts);
        setIsConnected(true);
        setLastUpdate(new Date());
        if (showToast) {
          toast.success('Data berhasil diperbarui! 🔄');
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsConnected(false);
      if (showToast) {
        toast.error('Gagal mengambil data dari server');
      }
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId: number) => {
    try {
      setLoadingComments({ ...loadingComments, [postId]: true });
      const response = await fetch(
        `${API_URL}/forum/posts/${postId}/comments`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, comments: data.comments, commentCount: data.comments.length }
            : p
        ));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments({ ...loadingComments, [postId]: false });
    }
  };

  // Toggle expand/collapse comments
  const toggleComments = async (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      await fetchComments(postId);
    }
  };

  // Load posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Auto-refresh every 5 seconds for realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts();
      // Also refresh comments for expanded post
      if (expandedPost) {
        fetchComments(expandedPost);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [expandedPost]);

  const handleSubmitPost = async () => {
    if (!newPostTitle.trim() || !newPost.trim()) {
      toast.error('Lengkapi judul dan isi postingan');
      return;
    }
    if (!authorName.trim()) {
      toast.error('Masukkan nama kamu terlebih dahulu');
      return;
    }

    setIsLoading(true);

    try {
      // Save author name to localStorage
      localStorage.setItem('forumAuthorName', authorName);

      const response = await fetch(`${API_URL}/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPost,
          category: selectedCategory,
          authorName: authorName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Postingan berhasil dipublikasikan! 🎉', {
          description: 'Semua device sekarang bisa melihat postinganmu'
        });
        setNewPost('');
        setNewPostTitle('');
        await fetchPosts();
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Gagal membuat postingan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (postId: number) => {
    const commentText = newComment[postId]?.trim();
    const commentAuthor = commentAuthorName[postId]?.trim() || authorName.trim();

    if (!commentText) {
      toast.error('Tulis komentar terlebih dahulu');
      return;
    }
    if (!commentAuthor) {
      toast.error('Masukkan nama kamu terlebih dahulu');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ 
          text: commentText,
          authorName: commentAuthor 
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Komentar berhasil dikirim! 💬');
        setNewComment({ ...newComment, [postId]: '' });
        await fetchComments(postId);
        await fetchPosts(); // Update comment count
      } else {
        toast.error('Gagal mengirim komentar');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Gagal mengirim komentar');
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/forum/posts/${postId}/comments/${commentId}`,
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
        await fetchComments(postId);
        await fetchPosts(); // Update comment count
      } else {
        toast.error('Gagal menghapus komentar');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Gagal menghapus komentar');
    }
  };

  const handleLike = async (id: number) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const newIsLiked = !post.isLiked;
    const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;

    // Optimistic update
    setPosts(posts.map(p => 
      p.id === id 
        ? { ...p, likes: newLikes, isLiked: newIsLiked }
        : p
    ));

    try {
      const response = await fetch(`${API_URL}/forum/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          likes: newLikes,
          isLiked: newIsLiked,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        // Revert on error
        setPosts(posts.map(p => 
          p.id === id 
            ? post
            : p
        ));
        toast.error('Gagal update like');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setPosts(posts.map(p => 
        p.id === id 
          ? post
          : p
      ));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/forum/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Postingan berhasil dihapus');
        await fetchPosts();
      } else {
        toast.error('Gagal menghapus postingan');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Gagal menghapus postingan');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Hapus semua postingan? Tindakan ini tidak dapat dibatalkan dan akan menghapus postingan dari semua device.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/forum/posts`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Semua postingan berhasil dihapus');
        await fetchPosts();
      } else {
        toast.error('Gagal menghapus semua postingan');
      }
    } catch (error) {
      console.error('Error deleting all posts:', error);
      toast.error('Gagal menghapus semua postingan');
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

  const filteredPosts = filterCategory === 'Semua' 
    ? posts 
    : posts.filter(p => p.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-8 h-8" />
                Forum Komunitas "Teman Sebaya"
                <Badge className={`ml-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                  <Wifi className="w-3 h-3 mr-1" />
                  {isConnected ? 'Online' : 'Offline'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-[#ADE1FB]">
                Berbagi tips, pengalaman, dan motivasi dengan siswa lain secara realtime
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchPosts(true)}
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
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-[#266CA9]" />
            <p className="text-2xl text-[#0F2573]">{posts.length}</p>
            <p className="text-sm text-gray-600">Total Postingan</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
          <CardContent className="pt-6 text-center">
            <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-[#266CA9]" />
            <p className="text-2xl text-[#0F2573]">
              {posts.reduce((sum, p) => sum + p.likes, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Likes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-[#266CA9]" />
            <p className="text-2xl text-[#0F2573]">
              {posts.reduce((sum, p) => sum + (p.commentCount || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Balasan</p>
          </CardContent>
        </Card>
      </div>

      {/* New Post */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Buat Postingan Baru</CardTitle>
          <CardDescription>Berbagi tips, pengalaman, atau ajukan pertanyaan. Postinganmu akan muncul dengan namamu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Nama kamu (wajib diisi)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="border-[#266CA9]"
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              placeholder="Judul postingan..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="border-[#266CA9]"
              disabled={isLoading}
            />
          </div>
          <Textarea
            placeholder="Tulis sesuatu yang ingin kamu bagikan dengan teman-teman..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] resize-none border-[#266CA9]"
            disabled={isLoading}
          />
          <div>
            <p className="text-sm text-gray-600 mb-2">Pilih Kategori:</p>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Badge 
                  key={cat} 
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-[#266CA9] text-white' 
                      : 'hover:bg-[#266CA9] hover:text-white border-[#266CA9]'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleSubmitPost} 
            className="w-full bg-[#266CA9] hover:bg-[#0F2573]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Memposting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Posting
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Filter/Categories */}
      <Card className="bg-[#ADE1FB]/20 border-[#266CA9]">
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <Badge 
              className={`cursor-pointer ${
                filterCategory === 'Semua' ? 'bg-[#266CA9]' : 'bg-gray-400'
              }`}
              onClick={() => setFilterCategory('Semua')}
            >
              Semua
            </Badge>
            {categories.map((cat) => (
              <Badge 
                key={cat}
                variant="outline" 
                className={`cursor-pointer border-[#266CA9] ${
                  filterCategory === cat 
                    ? 'bg-[#266CA9] text-white' 
                    : 'hover:bg-[#ADE1FB]/30'
                }`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-[#0F2573]">
            {filterCategory === 'Semua' ? 'Postingan Terbaru' : `Postingan: ${filterCategory}`} ({filteredPosts.length})
          </h3>
          {posts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAll}
              className="text-xs border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Hapus Semua
            </Button>
          )}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#ADE1FB]/10 border-[#266CA9]">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-[#266CA9]" />
              <p className="text-gray-700 mb-2">
                {posts.length === 0 ? 'Belum ada postingan' : `Belum ada postingan di kategori ${filterCategory}`}
              </p>
              <p className="text-sm text-gray-600">
                Jadilah yang pertama membuat postingan!
              </p>
            </CardContent>
          </Card>
        )}

        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow border-[#ADE1FB]">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 bg-[#266CA9]">
                  <AvatarFallback className="text-white">{post.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm">{post.authorName}</span>
                    <span className="text-xs text-gray-500">• {formatTimestamp(post.timestamp)}</span>
                    <Badge variant="outline" className="text-xs border-[#266CA9]">{post.category}</Badge>
                    <button
                      onClick={() => {
                        if (confirm('Hapus postingan ini dari semua device?')) {
                          handleDelete(post.id);
                        }
                      }}
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <CardDescription className="text-gray-700 whitespace-pre-wrap">{post.content}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    post.isLiked 
                      ? 'text-[#266CA9]' 
                      : 'hover:text-[#266CA9]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 hover:text-[#266CA9] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentCount || 0} balasan</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && (
                <div className="mt-4 pt-4 border-t border-[#ADE1FB]">
                  {loadingComments[post.id] ? (
                    <div className="text-center py-4">
                      <RefreshCw className="w-4 h-4 animate-spin mx-auto text-[#266CA9]" />
                    </div>
                  ) : (
                    <>
                      {/* Comments List */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.comments.map((comment) => (
                            <div 
                              key={comment.id}
                              className="bg-[#ADE1FB]/10 rounded-lg p-3"
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <Avatar className="w-8 h-8 bg-[#266CA9] flex-shrink-0">
                                  <AvatarFallback className="text-white text-xs">
                                    {comment.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{comment.authorName}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatTimestamp(comment.timestamp)}
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (confirm('Hapus komentar ini?')) {
                                          handleDeleteComment(post.id, comment.id);
                                        }
                                      }}
                                      className="ml-auto text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.text}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="space-y-2">
                        <Input
                          placeholder="Nama kamu (wajib diisi)"
                          value={commentAuthorName[post.id] || authorName}
                          onChange={(e) => setCommentAuthorName({ 
                            ...commentAuthorName, 
                            [post.id]: e.target.value 
                          })}
                          className="text-sm border-[#266CA9] focus:border-[#0F2573]"
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Tulis balasan..."
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment({ 
                              ...newComment, 
                              [post.id]: e.target.value 
                            })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                            className="text-sm border-[#266CA9] focus:border-[#0F2573]"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            className="bg-[#266CA9] hover:bg-[#0F2573]"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Guidelines */}
      <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
        <CardHeader>
          <CardTitle>Panduan Komunitas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Hormati pendapat dan pengalaman orang lain</li>
            <li>✅ Berikan dukungan dan motivasi positif</li>
            <li>✅ Bagikan tips yang berguna dan terverifikasi</li>
            <li>❌ Jangan melakukan bullying atau body shaming</li>
            <li>❌ Jangan menyebarkan informasi yang salah</li>
            <li>❌ Jangan membagikan informasi pribadi orang lain</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}