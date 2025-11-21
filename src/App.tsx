import { useState } from 'react';
import { Home, Heart, Calendar, Brain, MessageCircle, FileText, Users, BookOpen, Target, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import Homepage from './components/Homepage';
import AnxietyTest from './components/AnxietyTest';
import AnonymousConfession from './components/AnonymousConfession';
import ExamCalendar from './components/ExamCalendar';
import MindfulnessSpace from './components/MindfulnessSpace';
import OnlineCounseling from './components/OnlineCounseling';
import ArticlesSection from './components/ArticlesSection';
import CommunityForum from './components/CommunityForum';
import MoodJournal from './components/MoodJournal';
import GoalTracker from './components/GoalTracker';
import HelpSection from './components/HelpSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ADE1FB]/30 via-white to-[#ADE1FB]/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8" />
              <div>
                <h1 className="text-2xl">EduCalm Space</h1>
                <p className="text-sm text-[#ADE1FB]">Ruang Aman untuk Kesehatan Mentalmu</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-[#266CA9]/20 sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            <NavButton icon={<Home className="w-4 h-4" />} label="Beranda" value="home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavButton icon={<Brain className="w-4 h-4" />} label="Tes Kecemasan" value="test" active={activeTab === 'test'} onClick={() => setActiveTab('test')} />
            <NavButton icon={<MessageCircle className="w-4 h-4" />} label="Ruang Curhat" value="confession" active={activeTab === 'confession'} onClick={() => setActiveTab('confession')} />
            <NavButton icon={<Calendar className="w-4 h-4" />} label="Kalender Ujian" value="calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            <NavButton icon={<Heart className="w-4 h-4" />} label="Zona Tenang" value="mindfulness" active={activeTab === 'mindfulness'} onClick={() => setActiveTab('mindfulness')} />
            <NavButton icon={<FileText className="w-4 h-4" />} label="Artikel" value="articles" active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
            <NavButton icon={<Users className="w-4 h-4" />} label="Forum" value="forum" active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
            <NavButton icon={<BookOpen className="w-4 h-4" />} label="Mood Journal" value="journal" active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
            <NavButton icon={<Target className="w-4 h-4" />} label="Target Belajar" value="goals" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
            <NavButton icon={<MessageCircle className="w-4 h-4" />} label="Konseling" value="counseling" active={activeTab === 'counseling'} onClick={() => setActiveTab('counseling')} />
            <NavButton icon={<HelpCircle className="w-4 h-4" />} label="Bantuan" value="help" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && <Homepage onNavigate={setActiveTab} />}
        {activeTab === 'test' && <AnxietyTest onNavigate={setActiveTab} />}
        {activeTab === 'confession' && <AnonymousConfession />}
        {activeTab === 'calendar' && <ExamCalendar />}
        {activeTab === 'mindfulness' && <MindfulnessSpace />}
        {activeTab === 'counseling' && <OnlineCounseling />}
        {activeTab === 'articles' && <ArticlesSection />}
        {activeTab === 'forum' && <CommunityForum />}
        {activeTab === 'journal' && <MoodJournal />}
        {activeTab === 'goals' && <GoalTracker />}
        {activeTab === 'help' && <HelpSection />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#01082D] to-[#041D56] text-[#ADE1FB] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-[#ADE1FB]" />
            <p className="text-sm">© 2025 EduCalm Space - Kesehatan Mental adalah Prioritas</p>
            <p className="text-xs mt-2 text-[#ADE1FB]/80">Ingat: Kamu tidak sendirian. Kami ada untukmu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ icon, label, value, active, onClick }: { icon: React.ReactNode; label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
        active 
          ? 'bg-[#266CA9] text-white shadow-md' 
          : 'bg-[#ADE1FB]/30 text-[#0F2573] hover:bg-[#ADE1FB]/50'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}