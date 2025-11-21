import { Brain, MessageCircle, Calendar, Heart, BookOpen, Target, Mail, Users, FileText, HelpCircle, Video, Smile, Award, Shield, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HomepageProps {
  onNavigate: (tab: string) => void;
}

export default function Homepage({ onNavigate }: HomepageProps) {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-[#266CA9]" />,
      title: 'Tes Kecemasan',
      description: 'Cek tingkat kecemasanmu dengan kuis interaktif dan dapatkan saran personal',
      tab: 'test',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-[#0F2573]" />,
      title: 'Ruang Curhat Anonim',
      description: 'Ungkapkan perasaanmu tanpa khawatir. Semua curhat bersifat anonim dan bisa dilihat oleh semua device secara realtime',
      tab: 'confession',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <Calendar className="w-12 h-12 text-[#266CA9]" />,
      title: 'Kalender Ujian & Pengingat',
      description: 'Atur jadwal ujianmu dan dapatkan pengingat otomatis untuk relaksasi',
      tab: 'calendar',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <Heart className="w-12 h-12 text-[#0F2573]" />,
      title: 'Zona Tenang',
      description: 'Luangkan waktu untuk dirimu sendiri. Bernapas, tenang, dan rileks',
      tab: 'mindfulness',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <FileText className="w-12 h-12 text-[#266CA9]" />,
      title: 'Artikel',
      description: 'Baca tips belajar, strategi ujian, dan informasi bermanfaat untuk mendukung perjalanan akademikmu',
      tab: 'articles',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <Users className="w-12 h-12 text-[#0F2573]" />,
      title: 'Forum Teman Sebaya',
      description: 'Berbagi tips, pengalaman, dan motivasi dengan siswa lain secara realtime',
      tab: 'forum',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <Smile className="w-12 h-12 text-[#266CA9]" />,
      title: 'Mood Journal Harian',
      description: 'Catat perasaanmu setiap hari dan lihat perkembangan emosimu',
      tab: 'journal',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <Target className="w-12 h-12 text-[#0F2573]" />,
      title: 'Goal Tracker Akademik',
      description: 'Tetapkan target belajar dan pantau progresmu',
      tab: 'goals',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <Video className="w-12 h-12 text-[#0F2573]" />,
      title: 'Konseling',
      description: 'Pilih layanan konseling yang sesuai dengan kebutuhanmu',
      tab: 'counseling',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    },
    {
      icon: <HelpCircle className="w-12 h-12 text-[#041D56]" />,
      title: 'Bantuan',
      description: 'Punya pertanyaan? Kami siap membantu!',
      tab: 'help',
      color: 'bg-[#ADE1FB]/20 hover:bg-[#ADE1FB]/40'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-[#266CA9] via-[#0F2573] to-[#041D56] rounded-2xl p-12 text-white shadow-xl">
        <Heart className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl mb-4">Selamat Datang di EduCalm Space</h2>
        <p className="text-xl text-[#ADE1FB] max-w-2xl mx-auto">
          Tempat aman untuk kesehatan mentalmu. Kami di sini untuk mendukungmu menghadapi tantangan akademik dengan tenang dan percaya diri.
        </p>
        <div className="mt-6 flex gap-4 justify-center flex-wrap">
          <Button onClick={() => onNavigate('test')} className="bg-white text-[#266CA9] hover:bg-[#ADE1FB]/30">
            Mulai Tes Kecemasan
          </Button>
          <Button onClick={() => onNavigate('mindfulness')} className="bg-[#266CA9] hover:bg-[#0F2573]">
            Zona Tenang
          </Button>
        </div>
      </div>

      {/* About Us Section */}
      <Card className="bg-white border-2 border-[#266CA9]/30 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] p-6 text-white">
          <h3 className="text-2xl flex items-center gap-2">
            <Sparkles className="w-7 h-7" />
            Tentang EduCalm Space
          </h3>
        </div>
        <CardContent className="p-8">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong className="text-[#266CA9]">EduCalm Space</strong> adalah platform kesehatan mental yang dirancang khusus untuk siswa. Kami memahami bahwa perjalanan akademik tidak selalu mudah, dan setiap siswa membutuhkan dukungan untuk menghadapi tantangan dengan lebih tenang dan percaya diri.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center text-center p-6 bg-[#ADE1FB]/20 rounded-xl">
                <Heart className="w-12 h-12 text-[#266CA9] mb-3" />
                <h4 className="text-lg mb-2 text-[#0F2573]">Ruang Aman</h4>
                <p className="text-sm text-gray-600">
                  Berbagi cerita dan perasaan tanpa takut dihakimi
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-[#ADE1FB]/20 rounded-xl">
                <Shield className="w-12 h-12 text-[#0F2573] mb-3" />
                <h4 className="text-lg mb-2 text-[#0F2573]">Privasi Terjaga</h4>
                <p className="text-sm text-gray-600">
                  Data dan identitasmu aman bersama kami
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-[#ADE1FB]/20 rounded-xl">
                <Award className="w-12 h-12 text-[#266CA9] mb-3" />
                <h4 className="text-lg mb-2 text-[#0F2573]">Profesional</h4>
                <p className="text-sm text-gray-600">
                  Didampingi konselor berpengalaman dan terpercaya
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#ADE1FB]/10 p-6 rounded-xl mt-6">
              <h4 className="text-lg mb-3 text-[#0F2573] flex items-center gap-2">
                <Target className="w-5 h-5" />
                Misi Kami
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Membantu setiap siswa mengatasi kecemasan akademik, meningkatkan kesehatan mental, dan meraih potensi terbaiknya melalui layanan yang mudah diakses, ramah, dan berbasis bukti ilmiah.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Anxiety Education Section */}
      <Card className="bg-white border-2 border-[#266CA9]/30 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F2573] to-[#041D56] p-6 text-white">
          <h3 className="text-2xl flex items-center gap-2">
            <Brain className="w-7 h-7" />
            Memahami Kecemasan Akademik
          </h3>
        </div>
        <CardContent className="p-0">
          <Tabs defaultValue="definisi" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#ADE1FB]/20 rounded-none">
              <TabsTrigger value="definisi" className="data-[state=active]:bg-[#266CA9] data-[state=active]:text-white">Definisi</TabsTrigger>
              <TabsTrigger value="faktor" className="data-[state=active]:bg-[#266CA9] data-[state=active]:text-white">Faktor Penyebab</TabsTrigger>
              <TabsTrigger value="aspek" className="data-[state=active]:bg-[#266CA9] data-[state=active]:text-white">Aspek & Dimensi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="definisi" className="p-8">
              <div className="space-y-4">
                <h4 className="text-xl text-[#0F2573] flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Definisi Kecemasan Akademik
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Kecemasan akademik merupakan kondisi mental di mana individu merasa cemas dan tertekan terhadap situasi yang berkaitan dengan lingkungan sekolah atau perguruan tinggi <span className="text-sm text-gray-500">(Mahato & Jangir, 2012)</span>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Menurut Kaur, Grewal, dan Saini (2021), kecemasan akademik menggambarkan perasaan khawatir dan terancam yang dialami seseorang dalam menjalani aktivitas belajar di sekolah, baik karena guru, tugas, maupun mata pelajaran tertentu.
                </p>
                <div className="bg-[#ADE1FB]/20 p-5 rounded-xl mt-4">
                  <h5 className="text-lg text-[#0F2573] mb-3">Tanda-tanda Kecemasan:</h5>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#266CA9] mt-1">•</span>
                      <span>Tubuh yang terasa tegang</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#266CA9] mt-1">•</span>
                      <span>Munculnya rasa takut yang berlebihan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#266CA9] mt-1">•</span>
                      <span>Gugup dan detak jantung yang meningkat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#266CA9] mt-1">•</span>
                      <span>Kekhawatiran berlebih terhadap hal-hal yang belum atau akan terjadi</span>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm italic mt-4">
                  Kecemasan memiliki keterkaitan dengan sistem saraf, sehingga saat seseorang mengalaminya, fungsi sistem saraf lain dalam tubuh juga dapat terganggu <span className="text-gray-500">(Felisca & Riza, 2022)</span>.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="faktor" className="p-8">
              <div className="space-y-4">
                <h4 className="text-xl text-[#0F2573] flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Faktor-Faktor Penyebab
                </h4>
                <p className="text-gray-700">
                  Siswa dapat mengalami kecemasan akademik karena berbagai faktor determinan <span className="text-sm text-gray-500">(Prasetyaningtyas et al., 2022)</span>:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#ADE1FB]/10 p-5 rounded-xl border-l-4 border-[#266CA9]">
                    <h5 className="text-lg text-[#0F2573] mb-2">Tekanan untuk Berprestasi</h5>
                    <p className="text-sm text-gray-700">
                      Siswa merasa terbebani oleh tuntutan harapan dari orang tua, guru, maupun lingkungan sosial.
                    </p>
                  </div>
                  <div className="bg-[#ADE1FB]/10 p-5 rounded-xl border-l-4 border-[#0F2573]">
                    <h5 className="text-lg text-[#0F2573] mb-2">Ketakutan akan Kegagalan</h5>
                    <p className="text-sm text-gray-700">
                      Rasa cemas karena khawatir tidak lulus atau tidak mampu menyelesaikan ujian maupun tugas akademik dengan baik.
                    </p>
                  </div>
                  <div className="bg-[#ADE1FB]/10 p-5 rounded-xl border-l-4 border-[#266CA9]">
                    <h5 className="text-lg text-[#0F2573] mb-2">Perbandingan Sosial</h5>
                    <p className="text-sm text-gray-700">
                      Siswa cenderung membandingkan kemampuan dirinya dengan teman sebayanya dan merasa kurang kompeten secara akademis.
                    </p>
                  </div>
                  <div className="bg-[#ADE1FB]/10 p-5 rounded-xl border-l-4 border-[#0F2573]">
                    <h5 className="text-lg text-[#0F2573] mb-2">Kemampuan Akademik yang Rendah</h5>
                    <p className="text-sm text-gray-700">
                      Siswa merasa tidak memiliki kompetensi yang cukup untuk menghadapi tuntutan belajar dari guru.
                    </p>
                  </div>
                  <div className="bg-[#ADE1FB]/10 p-5 rounded-xl border-l-4 border-[#266CA9] md:col-span-2">
                    <h5 className="text-lg text-[#0F2573] mb-2">Kemampuan Mengelola Stres (Coping Stress)</h5>
                    <p className="text-sm text-gray-700">
                      Kesulitan siswa dalam menghadapi tekanan akademik dan menjaga keseimbangan antara kegiatan belajar dengan aktivitas lainnya.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="aspek" className="p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl text-[#0F2573] flex items-center gap-2 mb-4">
                    <Heart className="w-6 h-6" />
                    Aspek Kecemasan
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Menurut Calhoun dan Acocella <span className="text-sm text-gray-500">(Sobur, 2003)</span>, terdapat 3 aspek kecemasan:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#ADE1FB]/10 p-5 rounded-xl">
                      <h5 className="text-lg text-[#0F2573] mb-2">1. Reaksi Emosional</h5>
                      <p className="text-sm text-gray-700">
                        Berhubungan dengan persepsi individu serta melibatkan dampak psikologis, seperti munculnya perasaan khawatir, tegang, dan sedih.
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#ADE1FB]/10 p-5 rounded-xl">
                      <h5 className="text-lg text-[#0F2573] mb-2">2. Reaksi Kognitif</h5>
                      <p className="text-sm text-gray-700">
                        Respon yang dapat menimbulkan rasa takut atau cemas pada individu, yang berdampak pada kemampuan berpikir jernih. Hal ini dapat menghambat dan mengganggu individu dalam memecahkan masalah serta dalam menghadapi berbagai tuntutan dari lingkungan sekitarnya.
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#ADE1FB]/10 p-5 rounded-xl">
                      <h5 className="text-lg text-[#0F2573] mb-2">3. Reaksi Fisiologis</h5>
                      <p className="text-sm text-gray-700">
                        Respon tubuh terhadap sumber tekanan dan kecemasan. Reaksi ini melibatkan sistem saraf yang mengatur kerja otot dan kelenjar tubuh, sehingga memunculkan gejala fisik seperti detak jantung yang lebih cepat dan kuat, pernapasan yang meningkat, serta tekanan darah yang naik.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-[#ADE1FB]/40">
                  <h4 className="text-xl text-[#0F2573] flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6" />
                    Dimensi Kecemasan Akademik
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Menurut Otten <span className="text-sm text-gray-500">(Difa & Yolivia, 2023)</span>, terdapat empat dimensi:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-[#266CA9]/30 p-4 rounded-xl">
                      <h5 className="text-[#0F2573] mb-2">Pattern of Anxiety-Engendering Mental Activity</h5>
                      <p className="text-sm text-gray-600">Pola kecemasan yang memicu aktivitas mental tertentu</p>
                    </div>
                    <div className="bg-white border-2 border-[#266CA9]/30 p-4 rounded-xl">
                      <h5 className="text-[#0F2573] mb-2">Misdirected Attention</h5>
                      <p className="text-sm text-gray-600">Perhatian yang terarah pada hal-hal yang keliru</p>
                    </div>
                    <div className="bg-white border-2 border-[#266CA9]/30 p-4 rounded-xl">
                      <h5 className="text-[#0F2573] mb-2">Physiological Distress</h5>
                      <p className="text-sm text-gray-600">Tekanan atau ketegangan yang dialami secara fisik</p>
                    </div>
                    <div className="bg-white border-2 border-[#266CA9]/30 p-4 rounded-xl">
                      <h5 className="text-[#0F2573] mb-2">Inappropriate Behaviours</h5>
                      <p className="text-sm text-gray-600">Munculnya perilaku yang tidak sesuai sebagai respons terhadap kecemasan</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Mood Tracker */}
      <Card className="bg-gradient-to-r from-[#ADE1FB]/20 to-[#ADE1FB]/40 border-[#266CA9]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-6 h-6 text-[#266CA9]" />
            Bagaimana Perasaanmu Hari Ini?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              { emoji: '😔', label: 'Sedih', color: 'hover:bg-[#ADE1FB]/40' },
              { emoji: '😰', label: 'Cemas', color: 'hover:bg-[#ADE1FB]/50' },
              { emoji: '😐', label: 'Biasa Saja', color: 'hover:bg-gray-100' },
              { emoji: '🙂', label: 'Baik', color: 'hover:bg-green-100' },
              { emoji: '😊', label: 'Senang', color: 'hover:bg-yellow-100' }
            ].map((mood) => (
              <button
                key={mood.label}
                onClick={() => onNavigate('journal')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-white ${mood.color} transition-all border-2 border-transparent hover:border-[#266CA9] hover:shadow-md`}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-sm text-gray-600">{mood.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl mb-6 text-[#0F2573]">Fitur Kami</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.color} border-2 border-transparent hover:border-[#266CA9] cursor-pointer transition-all hover:shadow-lg`}
              onClick={() => onNavigate(feature.tab)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-gray-700">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardContent className="text-center py-8">
          <p className="text-2xl italic">
            "Kamu lebih kuat dari yang kamu kira. Setiap langkah kecil adalah kemajuan."
          </p>
          <p className="mt-4 text-[#ADE1FB]">- EduCalm Space Team</p>
        </CardContent>
      </Card>
    </div>
  );
}