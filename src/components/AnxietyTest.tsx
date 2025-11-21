import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Brain, CheckCircle, AlertCircle, Info, FileText, ShieldCheck } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface AnxietyTestProps {
  onNavigate?: (tab: string) => void;
}

export default function AnxietyTest({ onNavigate }: AnxietyTestProps) {
  const [step, setStep] = useState<'intro' | 'consent' | 'test'>('intro');
  const [consentChecked, setConsentChecked] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { question: 'Saya kurang tidur karena khawatir akan tugas yang belum selesai' },
    { question: 'Saya khawatir kalau saya belum melakukan yang terbaik di sekolah/kuliah' },
    { question: 'Belajar saya terganggu oleh pikiran-pikiran kegagalan' },
    { question: 'Ketika ujian, saya mengalami kesulitan untuk mengingat apa yang telah saya pelajari' },
    { question: 'Saya cenderung berpikir bahwa saya pasti akan gagal' },
    { question: 'Ketika menghadapi tugas, saya memerlukan beberapa waktu untuk menenangkan diri saya sehingga saya dapat mulai berpikir dengan jernih' },
    { question: 'Pada awal mendapatkan tugas, saya merasa cemas sehingga tidak dapat berpikir jernih' },
    { question: 'Ketika saya berhadapan dengan ujian atau tugas yang sulit, saya merasa kalah sebelum memulai' },
    { question: 'Saya bertanya-tanya apakah teman-teman sekelas saya memiliki prestasi yang lebih baik dari saya' },
    { question: 'Saya cenderung tidak mampu berbuat apa-apa ketika menghadapi ujian atau tugas' },
    { question: 'Selama ujian atau mengerjakan tugas, saya menemukan diri saya memikirkan konsekuensi dari kegagalan' },
    { question: 'Ketika ujian, saya cemas hingga lupa akan materi yang saya sangat kuasai' },
    { question: 'Saya tidak mengerjakan tugas dengan maksimal' },
    { question: 'Pikiran saya menjadi kosong ketika saya merasa tertekan' },
    { question: 'Saya berpikir bahwa saya tidak terlalu cerdas' },
    { question: 'Rasa cemas membuat saya tidak memperhatikan kesalahan/kelalaian' },
    { question: 'Selama ujian, saya merasa bahwa saya tidak mengerjakannya dengan baik' },
    { question: 'Ketika mengerjakan soal ujian atau tugas, saya mengerjakan seadanya' },
    { question: 'Setelah mengerjakan tugas/ujian, saya merasa seharusnya saya bisa mengerjakannya dengan lebih baik' },
    { question: 'Nilai ujian/tugas saya membuat saya yakin kalau saya tidak pintar' },
    { question: 'Saya baru menyadari bahwa saya membuat kesalahan setelah saya selesai mengumpulkan tugas/ujian' },
    { question: 'Setelah menghadapi tugas/ujian yang sulit saya takut untuk melihat nilainya' },
    { question: 'Ketika nilai tugas/ujian saya bagus, itu berarti karena saya beruntung' },
    { question: 'Saya merasa nilai ujian/tugas itu diluar kendali saya' },
    { question: 'Saya cenderung pasrah saat berhadapan dengan tugas/ujian' }
  ];

  const options = [
    { value: 1, label: 'Tidak sesuai' },
    { value: 2, label: 'Cukup Sesuai' },
    { value: 3, label: 'Sesuai' },
    { value: 4, label: 'Sangat sesuai' }
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const total = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 4;
    const percentage = (total / maxScore) * 100;

    if (percentage < 30) {
      return {
        level: 'Rendah',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: <CheckCircle className="w-16 h-16 text-green-600" />,
        message: 'Kecemasanmu tergolong rendah! Kamu sudah mengelola stres dengan baik.',
        suggestions: [
          'Pertahankan rutinitas belajar yang sudah kamu lakukan',
          'Terus jaga pola tidur yang teratur',
          'Bantu teman-teman yang mungkin membutuhkan tips darimu'
        ]
      };
    } else if (percentage < 60) {
      return {
        level: 'Sedang',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <Info className="w-16 h-16 text-yellow-600" />,
        message: 'Kecemasanmu tergolong sedang — kamu butuh strategi manajemen waktu dan relaksasi!',
        suggestions: [
          'Buat jadwal belajar yang realistis dan konsisten',
          'Luangkan waktu 10-15 menit setiap hari untuk relaksasi',
          'Coba teknik pernapasan 4-7-8 saat merasa cemas',
          'Berbicara dengan teman atau konselor bisa sangat membantu'
        ]
      };
    } else {
      return {
        level: 'Tinggi',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: <AlertCircle className="w-16 h-16 text-red-600" />,
        message: 'Kecemasanmu tergolong tinggi. Jangan khawatir, kami di sini untuk membantumu!',
        suggestions: [
          'Sangat disarankan untuk berbicara dengan konselor',
          'Praktikkan meditasi dan mindfulness setiap hari',
          'Pecah tugas besar menjadi bagian-bagian kecil yang lebih mudah',
          'Jangan ragu untuk meminta bantuan dari guru atau orang tua',
          'Ingat: nilaimu bukan penentu nilai dirimu sebagai manusia'
        ]
      };
    }
  };

  const resetTest = () => {
    setStep('intro');
    setConsentChecked(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Intro Screen - Pengenalan Alat Tes
  if (step === 'intro') {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-lg border-2 border-[#266CA9]/30">
          <CardHeader className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-7 h-7" />
              Pengenalan Alat Tes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="bg-gradient-to-r from-[#ADE1FB]/20 to-[#ADE1FB]/10 rounded-xl p-6">
              <h3 className="text-xl text-[#0F2573] mb-4">Tentang Skala Kecemasan Akademik</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Skala untuk mengukur tingkat kecemasan akademik seseorang. Terdiri dari <strong>25 pernyataan</strong> yang harus dinilai sesuai skala <strong>1 sampai 4</strong>. Skor akan ditotal untuk mengetahui tingkat kecemasan (rendah, sedang, tinggi). 
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tingkat kecemasan yang tinggi menunjukkan perlu mempelajari strategi menghadapi stres saat mengerjakan tugas/ujian.
              </p>
              <div className="bg-white p-5 rounded-lg mt-4 border-l-4 border-[#266CA9]">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Skala ini diadaptasi dari skala kecemasan akademik yang dikembangkan oleh <strong>Jerrell C. Cassady, Ph.D.</strong>, Professor of Psychology, Dept. of Educational Psychology, Ball State, kemudian dimodifikasi oleh <strong>Hillary Witie Reandsi</strong>, mahasiswa program studi Bimbingan dan Konseling, UNIKA Atma Jaya Jakarta.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => setStep('consent')} 
                className="bg-[#266CA9] hover:bg-[#0F2573] text-white px-8 py-6 text-lg"
              >
                Lanjut ke Persetujuan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Consent Screen - Informed Consent
  if (step === 'consent') {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-lg border-2 border-[#266CA9]/30">
          <CardHeader className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldCheck className="w-7 h-7" />
              Informed Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="bg-gradient-to-r from-[#ADE1FB]/20 to-[#ADE1FB]/10 rounded-xl p-6">
              <h3 className="text-xl text-[#0F2573] mb-4">Apakah Anda bersedia mengisi kuesioner ini?</h3>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Data ini <strong className="text-[#0F2573]">bersifat rahasia dan terjaga dengan aman</strong>. Keikutsertaan dalam tes ini tidak akan berdampak pada apapun, tidak ada risiko apapun, dan seluruh data yang Anda berikan bersifat rahasia.
                </p>
                
                <div className="bg-white p-5 rounded-lg border-2 border-[#266CA9]/20 mt-6">
                  <p className="text-gray-700">
                    Jika Anda bersedia untuk mengisi kuesioner ini silakan berikan tanda centang pada pernyataan di bawah ini sebagai tanda persetujuan.
                  </p>
                  <p className="text-gray-700 mt-3">
                    Jika Anda tidak bersedia mengisi kuesioner ini, Anda tidak perlu melanjutkan mengisi kuesioner ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#ADE1FB]/10 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-gray-700 cursor-pointer leading-relaxed">
                  Saya telah membaca dan memahami informasi di atas. Saya dengan sukarela bersedia untuk mengisi kuesioner ini dengan jujur dan sesuai kondisi saya.
                </Label>
              </div>
            </div>

            <p className="text-center text-gray-600 italic">
              Terima kasih atas kesediaan Anda.
            </p>

            <div className="flex gap-4 justify-center flex-wrap pt-4">
              <Button 
                onClick={() => setStep('intro')} 
                variant="outline" 
                className="border-[#266CA9] text-[#266CA9] hover:bg-[#ADE1FB]/20"
              >
                Kembali
              </Button>
              <Button 
                onClick={() => setStep('test')}
                disabled={!consentChecked}
                className="bg-[#266CA9] hover:bg-[#0F2573] text-white px-8"
              >
                Mulai Tes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    const result = calculateResult();
    return (
      <div className="max-w-3xl mx-auto">
        <Card className={`${result.bgColor} border-2`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {result.icon}
            </div>
            <CardTitle className="text-3xl">Hasil Tes Kecemasan</CardTitle>
            <CardDescription className={`text-xl ${result.color}`}>
              Tingkat Kecemasan: {result.level}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-lg text-gray-700 text-center">{result.message}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg mb-4 text-[#0F2573]">Saran untuk Kamu:</h4>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#266CA9] mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={resetTest} variant="outline" className="border-[#266CA9] text-[#266CA9]">
                Ulangi Tes
              </Button>
              <Button 
                className="bg-[#266CA9] hover:bg-[#0F2573]"
                onClick={() => onNavigate?.('counseling')}
              >
                Chat dengan Konselor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test Screen
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white shadow-lg border-2 border-[#266CA9]/30">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#266CA9]" />
              Tes Kecemasan Akademik
            </CardTitle>
            <span className="text-sm text-gray-500">
              Pertanyaan {currentQuestion + 1} dari {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-xl text-gray-800">
              {questions[currentQuestion].question}
            </h3>
          </div>

          <RadioGroup 
            value={answers[currentQuestion]?.toString()} 
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 bg-[#ADE1FB]/20 rounded-lg p-4 hover:bg-[#ADE1FB]/40 transition-colors">
                <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                  <span className="mr-2">{option.value}.</span>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button 
              onClick={handlePrevious} 
              variant="outline"
              disabled={currentQuestion === 0}
              className="border-[#266CA9] text-[#266CA9]"
            >
              Sebelumnya
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="bg-[#266CA9] hover:bg-[#0F2573]"
            >
              {currentQuestion === questions.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}