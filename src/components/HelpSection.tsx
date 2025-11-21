import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle, Send, MessageCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

export default function HelpSection() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmitQuestion = () => {
    if (!question.trim() || !email.trim()) {
      toast.error('Lengkapi email dan pertanyaan terlebih dahulu');
      return;
    }

    toast.success('Pertanyaan berhasil dikirim! Kami akan merespons dalam 1x24 jam.');
    setQuestion('');
    setEmail('');
  };

  const faqs = [
    {
      question: 'Apakah layanan konseling benar-benar gratis?',
      answer: 'Ya! Semua layanan konseling di EduCalm Space 100% gratis untuk siswa. Kami percaya bahwa kesehatan mental adalah hak semua orang.'
    },
    {
      question: 'Apakah data saya aman dan rahasia?',
      answer: 'Sangat aman! Semua data Anda terenkripsi dan dijaga kerahasiaannya. Konselor kami terikat kode etik profesional untuk menjaga privasi Anda.'
    },
    {
      question: 'Berapa lama sesi konseling berlangsung?',
      answer: 'Sesi konseling biasanya berlangsung 45-60 menit. Untuk chat konseling, Anda bisa berkomunikasi lebih fleksibel sesuai kebutuhan.'
    },
    {
      question: 'Apakah orang tua saya akan tahu jika saya konseling?',
      answer: 'Tidak, kecuali Anda yang meminta konselor untuk berkomunikasi dengan orang tua. Privasi Anda adalah prioritas kami.'
    },
    {
      question: 'Bagaimana cara membatalkan jadwal konseling?',
      answer: 'Anda bisa membatalkan jadwal minimal 2 jam sebelum sesi dimulai melalui menu "Konseling Online" atau hubungi kami melalui WhatsApp.'
    },
    {
      question: 'Apa bedanya tes kecemasan dengan konseling?',
      answer: 'Tes kecemasan adalah self-assessment untuk memahami tingkat kecemasan Anda. Konseling adalah sesi dengan profesional untuk mendiskusikan masalah lebih mendalam dan mencari solusi.'
    },
    {
      question: 'Apakah curhat anonim benar-benar anonim?',
      answer: 'Ya! Kami tidak menyimpan identitas Anda di fitur curhat anonim. Namun untuk konseling profesional, kami memerlukan data dasar untuk memberikan layanan terbaik.'
    },
    {
      question: 'Bagaimana jika saya mengalami krisis mental?',
      answer: 'Jika Anda mengalami krisis atau pikiran untuk menyakiti diri sendiri, segera hubungi hotline krisis di 119 ext 8 atau WhatsApp kami untuk bantuan darurat.'
    }
  ];

  const contacts = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      detail: '+62 812-3456-7890',
      description: 'Respon cepat 24/7',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      detail: 'help@educalmspace.com',
      description: 'Respon dalam 1x24 jam',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Hotline Darurat',
      detail: '119 ext 8',
      description: 'Untuk krisis mental',
      color: 'bg-red-50 border-red-200'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="w-8 h-8" />
            Pusat Bantuan
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Punya pertanyaan? Kami siap membantu!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contacts.map((contact, index) => (
          <Card key={index} className={`${contact.color} border-2`}>
            <CardHeader>
              <div className="text-[#266CA9] mb-2">{contact.icon}</div>
              <CardTitle className="text-base">{contact.title}</CardTitle>
              <CardDescription className="text-xs">{contact.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#0F2573]">{contact.detail}</p>
              <Button size="sm" className="w-full mt-3 bg-[#266CA9] hover:bg-[#0F2573] text-xs">
                Hubungi
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
          <CardDescription>Temukan jawaban untuk pertanyaan umum</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm hover:text-[#266CA9]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Ask Question */}
      <Card className="border-[#266CA9]">
        <CardHeader>
          <CardTitle>Masih Ada Pertanyaan?</CardTitle>
          <CardDescription>Kirim pertanyaan Anda dan kami akan merespons dalam 1x24 jam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="help-email">Email</Label>
            <Input
              id="help-email"
              type="email"
              placeholder="emailmu@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-[#266CA9]"
            />
          </div>
          <div>
            <Label htmlFor="help-question">Pertanyaan</Label>
            <Textarea
              id="help-question"
              placeholder="Tuliskan pertanyaanmu di sini..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] resize-none border-[#266CA9]"
            />
          </div>
          <Button onClick={handleSubmitQuestion} className="w-full bg-[#266CA9] hover:bg-[#0F2573]">
            <Send className="w-4 h-4 mr-2" />
            Kirim Pertanyaan
          </Button>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
        <CardHeader>
          <CardTitle>Link Berguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Panduan Menggunakan Website', link: '#' },
              { title: 'Tips Kesehatan Mental', link: '#' },
              { title: 'Kebijakan Privasi', link: '#' },
              { title: 'Syarat & Ketentuan', link: '#' },
              { title: 'Tentang Kami', link: '#' },
              { title: 'Feedback & Saran', link: '#' }
            ].map((item, index) => (
              <button
                key={index}
                className="text-left text-sm text-[#266CA9] hover:text-[#0F2573] hover:underline"
              >
                {item.title} →
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency */}
      <Card className="border-2 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Dalam Keadaan Darurat?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-red-900">
            Jika kamu atau seseorang yang kamu kenal mengalami krisis mental atau memiliki pikiran untuk menyakiti diri sendiri, segera hubungi:
          </p>
          <div className="bg-white rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Hotline Kesehatan Mental:</span>
              <span className="text-red-700">119 ext 8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WhatsApp Darurat:</span>
              <span className="text-red-700">+62 812-3456-7890</span>
            </div>
          </div>
          <p className="text-xs text-red-600 italic">
            Kamu tidak sendirian. Bantuan selalu tersedia. 💙
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
