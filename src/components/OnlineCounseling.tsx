import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Video, MessageCircle, Clock, CheckCircle, Phone, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { counselorPhotos } from '../assets/images';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function OnlineCounseling() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);

  const counselors = [
    {
      id: 1,
      name: 'Sephia Uswatun Hasanah Iswadi',
      specialty: 'Psikolog Klinis',
      experience: '5 tahun',
      available: true,
      rating: 4.9,
      sessions: 150,
      initials: 'SU',
      photo: counselorPhotos.sephia,
      whatsapp: '6287710578744'
    },
    {
      id: 2,
      name: 'Divka Aulia Kusumawardhani',
      specialty: 'Psikolog Klinis',
      experience: '5 tahun',
      available: true,
      rating: 4.9,
      sessions: 150,
      initials: 'DA',
      photo: counselorPhotos.divka,
      whatsapp: '6287879597005'
    },
    {
      id: 3,
      name: 'Haichal Agus Arifin',
      specialty: 'Psikolog Klinis',
      experience: '5 tahun',
      available: true,
      rating: 4.9,
      sessions: 150,
      initials: 'HA',
      photo: counselorPhotos.haichal,
      whatsapp: '6285742379042'
    },
    {
      id: 4,
      name: 'Zulvania Fahira Rahmadani',
      specialty: 'Psikolog Klinis',
      experience: '5 tahun',
      available: true,
      rating: 4.9,
      sessions: 150,
      initials: 'ZF',
      photo: counselorPhotos.zulvania,
      whatsapp: '6283147991531'
    }
  ];

  const availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const handleBooking = () => {
    if (!selectedCounselor || !selectedTime) {
      toast.error('Pilih konselor dan waktu terlebih dahulu');
      return;
    }

    const counselor = counselors.find(c => c.id === selectedCounselor);
    toast.success(`Sesi konseling dengan ${counselor?.name} berhasil dijadwalkan untuk ${selectedTime}!`);
  };

  const handleChatBooking = () => {
    if (!selectedCounselor || !selectedTime) {
      toast.error('Pilih konselor dan waktu terlebih dahulu');
      return;
    }

    const counselor = counselors.find(c => c.id === selectedCounselor);
    const dateStr = selectedDate?.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const message = `Halo ${counselor?.name}, saya ingin booking sesi konseling pada:\n\nTanggal: ${dateStr}\nWaktu: ${selectedTime}\nDurasi: 60 menit\n\nTerima kasih!`;
    
    const whatsappUrl = `https://wa.me/${counselor?.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success(`Menghubungkan ke WhatsApp ${counselor?.name}...`);
  };

  const handleContactRS = (method: string) => {
    if (method === 'phone') {
      window.open('tel:0341561666');
    } else if (method === 'whatsapp') {
      window.open('https://wa.me/081216207426');
    } else if (method === 'email') {
      window.open('mailto:@ummhospital');
    }
  };

  const handleContactPLP = (method: string) => {
    if (method === 'phone') {
      window.open('tel:0341464318');
    } else if (method === 'whatsapp') {
      window.open('https://wa.me/6285704126860');
    } else if (method === 'email') {
      window.open('mailto:profesipsikologi@umm.ac.id');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Video className="w-8 h-8" />
            Konseling
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Pilih layanan konseling yang sesuai dengan kebutuhanmu
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="sebaya" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#ADE1FB]/20">
          <TabsTrigger value="sebaya" className="data-[state=active]:bg-[#266CA9] data-[state=active]:text-white">
            Konseling Sebaya
          </TabsTrigger>
          <TabsTrigger value="plp" className="data-[state=active]:bg-[#266CA9] data-[state=active]:text-white">
            PLP UMM
          </TabsTrigger>
          <TabsTrigger value="rs" className="data-[state=active]:bg-[#266CA9] data-[state=active]:text-white">
            RS UMM
          </TabsTrigger>
        </TabsList>

        {/* Tab Content - Konseling Sebaya */}
        <TabsContent value="sebaya" className="space-y-6 mt-6">
          {/* Counselors List */}
          <div>
            <h3 className="text-xl mb-4 text-[#0F2573]">Pilih Konselor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {counselors.map((counselor) => (
                <Card
                  key={counselor.id}
                  className={`cursor-pointer transition-all ${
                    selectedCounselor === counselor.id
                      ? 'border-2 border-[#266CA9] shadow-lg'
                      : 'border-[#ADE1FB] hover:border-[#266CA9]'
                  } ${!counselor.available ? 'opacity-50' : ''}`}
                  onClick={() => counselor.available && setSelectedCounselor(counselor.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Avatar className="w-16 h-16 bg-[#266CA9]">
                        {counselor.photo && (
                          <AvatarImage 
                            src={counselor.photo} 
                            alt={counselor.name}
                            className="object-cover"
                            style={{ objectPosition: '50% 50%' }}
                          />
                        )}
                        <AvatarFallback className="text-white text-lg">
                          {counselor.initials}
                        </AvatarFallback>
                      </Avatar>
                      {counselor.available ? (
                        <Badge className="bg-green-500">Tersedia</Badge>
                      ) : (
                        <Badge variant="secondary">Tidak Tersedia</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{counselor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{counselor.sessions} sesi selesai</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span>Rating: {counselor.rating}/5.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Section */}
          {selectedCounselor && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card className="border-[#266CA9]">
                <CardHeader>
                  <CardTitle>Pilih Tanggal</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-[#266CA9]"
                    disabled={(date) => date < new Date()}
                  />
                </CardContent>
              </Card>

              {/* Time Selection */}
              <Card className="border-[#266CA9]">
                <CardHeader>
                  <CardTitle>Pilih Waktu</CardTitle>
                  <CardDescription>
                    {selectedDate?.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        className={selectedTime === time ? 'bg-[#266CA9]' : 'border-[#266CA9]'}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>

                  {selectedTime && (
                    <div className="mt-6 space-y-4">
                      <div className="bg-[#ADE1FB]/20 border border-[#266CA9] rounded-lg p-4">
                        <h4 className="text-sm mb-2">Detail Booking:</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>• Konselor: {counselors.find(c => c.id === selectedCounselor)?.name}</p>
                          <p>• Waktu: {selectedTime}</p>
                          <p>• Durasi: 60 menit</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleBooking}
                          className="flex-1 bg-[#266CA9] hover:bg-[#0F2573]"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Book Video Call
                        </Button>
                        <Button
                          onClick={handleChatBooking}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Book Chat
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info */}
          <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
            <CardHeader>
              <CardTitle>Tentang Layanan Konseling Sebaya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="mb-2">Apa yang bisa dikonsultasikan?</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Kecemasan akademik</li>
                    <li>• Manajemen stress</li>
                    <li>• Motivasi belajar</li>
                    <li>• Masalah pribadi</li>
                    <li>• Perencanaan karir</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Keamanan & Privasi</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 100% rahasia dan aman</li>
                    <li>• Konselor bersertifikat</li>
                    <li>• Data terenkripsi</li>
                    <li>• Tidak ada judgement</li>
                    <li>• Gratis untuk siswa</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Content - PLP UMM */}
        <TabsContent value="plp" className="space-y-6 mt-6">
          <Card className="border-[#266CA9] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="bg-gradient-to-br from-[#ADE1FB]/20 to-[#266CA9]/10 p-6 flex items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/d/1-hMrUQZOnD2pidWWB1c042JhqrMfQJuz"
                  alt="PLP UMM - Pusat Layanan Psikologi UMM"
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400/266CA9/FFFFFF?text=PLP+UMM';
                  }}
                />
              </div>

              {/* Info Section */}
              <div className="p-6 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-2xl text-[#0F2573] mb-2 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-[#266CA9]" />
                    Pusat Layanan Psikologi UMM
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Pusat Layanan Psikologi Universitas Muhammadiyah Malang menyediakan layanan konseling profesional untuk membantu mengatasi berbagai permasalahan psikologis.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card className="bg-[#ADE1FB]/10 border-[#266CA9]/30">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-[#266CA9] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Telepon</p>
                            <p className="text-[#0F2573]">(0341) 464318</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">WhatsApp</p>
                            <p className="text-[#0F2573]">+62 857-0412-6860</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-[#266CA9] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-[#0F2573]">profesipsikologi@umm.ac.id</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleContactPLP('phone')}
                      className="bg-[#266CA9] hover:bg-[#0F2573] w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Hubungi via Telepon
                    </Button>
                    <Button
                      onClick={() => handleContactPLP('whatsapp')}
                      className="bg-green-600 hover:bg-green-700 w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat via WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleContactPLP('email')}
                      variant="outline"
                      className="border-[#266CA9] text-[#266CA9] hover:bg-[#ADE1FB]/20 w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Kirim Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
            <CardHeader>
              <CardTitle>Layanan PLP UMM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="mb-2">Layanan yang Tersedia</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Konseling individual</li>
                    <li>• Konseling keluarga</li>
                    <li>• Asesmen psikologi</li>
                    <li>• Terapi psikologi</li>
                    <li>• Pelatihan & workshop</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Keunggulan</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Ditangani psikolog profesional</li>
                    <li>• Fasilitas lengkap</li>
                    <li>• Terjangkau & berkualitas</li>
                    <li>• Terakreditasi</li>
                    <li>• Konsultasi gratis pertama</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Content - RS UMM */}
        <TabsContent value="rs" className="space-y-6 mt-6">
          <Card className="border-[#266CA9] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="bg-gradient-to-br from-[#ADE1FB]/20 to-[#266CA9]/10 p-6 flex items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/d/18NSvTmj3y5o8NwBUIACAoNQLHTvuy48o"
                  alt="RS UMM - Rumah Sakit Universitas Muhammadiyah Malang"
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400/266CA9/FFFFFF?text=RS+UMM';
                  }}
                />
              </div>

              {/* Info Section */}
              <div className="p-6 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-2xl text-[#0F2573] mb-2 flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-[#266CA9]" />
                    Rumah Sakit UMM
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Rumah Sakit Universitas Muhammadiyah Malang menyediakan layanan kesehatan mental dan psikiatri dengan fasilitas modern dan tim medis yang berpengalaman.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card className="bg-[#ADE1FB]/10 border-[#266CA9]/30">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-[#266CA9] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Telepon</p>
                            <p className="text-[#0F2573]">0341-561666</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">WhatsApp</p>
                            <p className="text-[#0F2573]">0812-1620-7426</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-[#266CA9] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-[#0F2573]">@ummhospital</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleContactRS('phone')}
                      className="bg-[#266CA9] hover:bg-[#0F2573] w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Hubungi via Telepon
                    </Button>
                    <Button
                      onClick={() => handleContactRS('whatsapp')}
                      className="bg-green-600 hover:bg-green-700 w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat via WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleContactRS('email')}
                      variant="outline"
                      className="border-[#266CA9] text-[#266CA9] hover:bg-[#ADE1FB]/20 w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Kirim Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="bg-gradient-to-r from-[#ADE1FB]/30 to-[#266CA9]/10 border-[#266CA9]">
            <CardHeader>
              <CardTitle>Layanan Kesehatan Mental RS UMM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="mb-2">Layanan yang Tersedia</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Poliklinik Jiwa</li>
                    <li>• Konsultasi psikiatri</li>
                    <li>• Terapi medis</li>
                    <li>• Rawat jalan & rawat inap</li>
                    <li>• Emergency 24 jam</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Keunggulan</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Dokter spesialis berpengalaman</li>
                    <li>• Fasilitas medis lengkap</li>
                    <li>• Pelayanan 24/7</li>
                    <li>• Terintegrasi dengan universitas</li>
                    <li>• Berbagai metode pembayaran</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}