import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Heart, Share2, BookOpen, X } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  likes: number;
  image: string;
  featured: boolean;
  content?: string;
}

export default function ArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [articleLikes, setArticleLikes] = useState<{ [key: number]: number }>({
    1: 124,
    3: 89,
    4: 178,
    6: 145,
    7: 198,
    8: 267
  });

  const articleContents: { [key: number]: string } = {
    1: `
      <h2>5 CARA MENGATUR WAKTU SAAT UJIAN</h2>
      
      <h3>Susun Jadwal Belajar yang Teratur</h3>
      <p>Langkah awal menuju persiapan yang baik adalah membuat jadwal belajar yang jelas dan realistis. Tentukan waktu belajar setiap hari, terutama untuk mata pelajaran yang masih sulit kamu kuasai. Hindari belajar tanpa rencana karena bisa membuat kamu cepat bosan dan sulit fokus.</p>
      <p>Gunakan kalender, planner, atau aplikasi to-do list untuk mengatur kegiatan belajar. Belajar dalam waktu singkat namun rutin jauh lebih efektif dibanding belajar mendadak semalaman sebelum ujian.</p>

      <h3>Terapkan Metode Belajar Aktif</h3>
      <p>Jangan hanya membaca ulang atau menyalin catatan. Coba gunakan teknik belajar aktif yang membuatmu lebih memahami materi, seperti:</p>
      <ul>
        <li>Menjelaskan ulang pelajaran kepada teman atau keluarga</li>
        <li>Membuat mind map atau peta konsep</li>
        <li>Menggunakan flashcard untuk menghafal istilah penting</li>
        <li>Rutin mengerjakan latihan soal</li>
      </ul>
      <p>Metode aktif ini membantu otak bekerja lebih efektif karena kamu terlibat langsung dalam proses memahami materi.</p>

      <h3>Gunakan Teknologi dan Sumber Digital</h3>
      <p>Manfaatkan berbagai aplikasi belajar, platform edukasi online, atau kanal YouTube pendidikan untuk memperdalam pemahamanmu. Dengan belajar dari berbagai sumber, kamu bisa menemukan cara baru memahami topik yang sulit. Pastikan sumbernya kredibel dan penyampaiannya terstruktur agar pembelajaranmu tetap fokus.</p>

      <h3>Jaga Kesehatan dan Pola Istirahat</h3>
      <p>Keberhasilan ujian tidak hanya bergantung pada seberapa keras kamu belajar, tetapi juga pada kondisi tubuh dan pikiran. Tidurlah cukup 7–8 jam setiap malam, konsumsi makanan bergizi, dan minum air yang cukup. Sisihkan waktu untuk beristirahat atau melakukan hal yang menyenangkan agar tidak stres. Hindari begadang karena dapat menurunkan konsentrasi dan daya ingat saat ujian berlangsung.</p>

      <h3>Persiapkan Perlengkapan Belajar yang Tepat</h3>
      <p>Perangkat belajar yang andal juga berpengaruh besar. Laptop atau komputer yang lambat bisa menghambat proses belajar dan mengurangi efisiensi. Pilih perangkat dengan spesifikasi memadai untuk multitasking, penyimpanan cepat, dan tampilan layar yang nyaman agar belajar online maupun mengerjakan tugas terasa lebih lancar.</p>
    `,
    3: `
      <h2>TEKNIK POMODORO UNTUK BELAJAR LEBIH EFEKTIF</h2>
      
      <h3>Apa itu Pomodoro?</h3>
      <p>Teknik Pomodoro merupakan metode manajemen waktu yang dikembangkan oleh Francesco Cirillo pada akhir tahun 1980-an. Istilah Pomodoro yang berarti "tomat" dalam bahasa Spanyol diambil dari bentuk alat pengatur waktu berbentuk tomat yang digunakan Cirillo saat masih menjadi mahasiswa untuk membantu mengatur waktu belajarnya.</p>
      <p>Dalam penerapannya, teknik ini dilakukan dengan membagi waktu kerja ke dalam interval tertentu. Misalnya, seseorang diminta untuk fokus bekerja selama 25 menit, kemudian beristirahat selama 5 menit. Siklus ini diulang hingga empat kali, dan setelahnya dapat diambil waktu istirahat yang lebih panjang, namun tidak melebihi durasi waktu fokus.</p>

      <h3>Manfaat Teknik Pomodoro</h3>
      <p>Teknik Pomodoro terbukti memiliki manfaat apabila kamu menerapkannya saat belajar secara konsisten, di antaranya:</p>
      <ol>
        <li>Meningkatkan produktivitas dan konsentrasi</li>
        <li>Mencegah otak merasa lelah karena belajar terus menerus dalam waktu yang cukup lama</li>
        <li>Meningkatkan kualitas dan efektifitas pekerjaan</li>
        <li>Melatih diri untuk mengelola waktu dengan baik</li>
        <li>Mengurangi kebiasaan multitasking</li>
      </ol>

      <h3>Cara Menerapkan Pomodoro</h3>
      
      <h4>Hindari gangguan dan siapkan bahan belajar</h4>
      <p>Pastikan lingkungan belajarmu bebas dari distraksi. Nonaktifkan notifikasi di ponsel, aktifkan mode pesawat jika perlu, atau ubah ke mode senyap. Tutup semua tab atau aplikasi di laptop yang tidak relevan, dan siapkan hanya bahan yang akan digunakan, seperti latihan soal, slide presentasi, atau modul pembelajaran.</p>

      <h4>Tentukan durasi belajar dan mulai fokus</h4>
      <p>Gunakan alat bantu waktu seperti alarm, timer di ponsel, atau jam pasir untuk mengatur durasi belajar. Sesuaikan waktu fokus dengan kemampuan dan ritme belajarmu. Cirillo, pencipta teknik Pomodoro, merekomendasikan waktu 25 menit untuk satu sesi fokus. Kamu bisa menggunakan durasi tersebut sebagai permulaan, lalu melakukan penyesuaian berdasarkan pengalaman agar menemukan waktu fokus yang paling efektif.</p>

      <h4>Gunakan waktu istirahat untuk relaksasi ringan</h4>
      <p>Setelah menyelesaikan satu sesi belajar, gunakan waktu istirahat untuk melakukan hal-hal sederhana yang menyegarkan, seperti melakukan peregangan, berjalan sebentar, atau minum air. Aktivitas ringan selama dua hingga lima menit ini membantu tubuh dan pikiranmu lebih rileks sebelum kembali belajar.</p>

      <h4>Ulangi siklus</h4>
      <p>Terus ulangi siklus belajar dan istirahat ini hingga kamu menyelesaikan target belajar hari itu.</p>
    `,
    4: `
      <h2>MENGATASI BLANK SAAT UJIAN</h2>
      
      <p>Siapa yang tidak merasa panik mendengar kalimat menyeramkan seperti itu? Secara otomatis, tubuh akan menjadi tegang, cemas, dan pikiran terasa kosong. Semua hal yang sebelumnya sudah diingat tiba-tiba hilang begitu saja. Padahal, kamu sudah menyiapkan jawaban dan memahami soal-soalnya. Mengapa hal ini bisa terjadi?</p>

      <p>Ketika seseorang mengalami stres, bagian otak yang aktif adalah otak reptil — bagian yang berfungsi mengatur pernapasan, detak jantung, serta respon naluriah saat menghadapi bahaya. Sementara itu, proses belajar, menghafal, dan memahami informasi terjadi di neokorteks, yaitu pusat berpikir. Jadi, wajar saja ketika panik, informasi yang tersimpan di neokorteks sulit diakses karena otak reptil yang mengambil alih fungsi utama.</p>

      <p>Kondisi nge-blank bisa dialami siapa saja dan kapan saja. Kadang, bahkan di tengah mengerjakan ujian pun pikiran bisa tiba-tiba kosong dan tidak fokus. Sayang sekali, bukan? Sudah belajar keras, tetapi saat hari ujian justru tidak bisa mengingat apa pun. Lalu, bagaimana cara mengatasinya?</p>

      <h3>Tidur Cukup</h3>
      <p>Salah satu penyebab otak nge-blank adalah kurangnya asupan oksigen akibat kurang tidur. Maka dari itu, usahakan untuk tidur cukup, sekitar 7–8 jam sebelum ujian. Sebelum tidur, kamu bisa mandi air hangat, minum air hangat, dan menjauhkan diri dari gadget agar tidur lebih nyenyak dan berkualitas.</p>

      <h3>Atur Pernapasan dan Posisi Duduk</h3>
      <p>Rasa panik saat mulai mengerjakan soal juga dapat membuat otak menjadi blank. Untuk mengatasinya, cobalah menutup mata sejenak, tarik napas dalam-dalam, lalu duduk dengan posisi yang nyaman. Pastikan punggung bersandar tegak di kursi, karena posisi duduk yang baik juga membantu menenangkan diri.</p>

      <h3>Pijat Titik Relaksasi</h3>
      <p>Jika kepanikan mulai muncul, coba pijat lembut area di antara ibu jari dan telunjuk. Titik ini dipercaya dapat membantu tubuh lebih rileks dan pikiran lebih tenang.</p>

      <h3>Tulis Kata Kunci</h3>
      <p>Ketika otak terasa kosong, tulislah hal-hal yang berhubungan dengan soal, seperti gambar bagan bunga, rumus trigonometri, bentuk past tense, atau kata kunci lainnya. Dari hal-hal kecil itu, kembangkan ke topik yang terkait. Misalnya, jika menulis tentang bunga, lanjutkan dengan bagian-bagiannya seperti putik, kelopak, dan sebagainya. Cara ini membantu otak aktif kembali dan mencegah nge-blank.</p>

      <h3>Visualisasi Materi</h3>
      <p>Selain itu, kamu juga bisa memejamkan mata dan membayangkan kembali isi buku pelajaran yang telah dipelajari—mulai dari sampulnya, halaman demi halaman, hingga gambar atau rumus yang ada. Dengan begitu, otak akan memanggil kembali ingatan tentang materi yang pernah dipelajari.</p>

      <h3>Amati Lingkungan Sekitar</h3>
      <p>Jika masih merasa kosong, coba fokus sejenak pada teman di sekitarmu. Amati gerak-geriknya saat mengerjakan ujian. Hal ini bisa membuatmu ikut masuk dalam suasana ujian dan membantu otak beradaptasi, sehingga perlahan fokusmu kembali.</p>

      <h3>Persiapan Matang</h3>
      <p>Terakhir, pastikan segala persiapan untuk ujian sudah dilakukan sehari sebelumnya—baik dari sisi materi maupun perlengkapan. Datang lebih awal ke tempat ujian agar tidak terburu-buru atau stres karena terlambat. Dua hal sederhana ini dapat meningkatkan konsentrasi. Jangan lupa pula berdoa agar semua berjalan lancar.</p>
    `,
    6: `
      <h2>MAKANAN YANG MENINGKATKAN KONSENTRASI</h2>
      
      <h3>Air Putih</h3>
      <p>Lebih dari 70% komposisi tubuh manusia terdiri atas air, yang berperan penting dalam hampir seluruh fungsi fisiologis, termasuk aktivitas otak dan sistem saraf. Kekurangan asupan air dapat menyebabkan penurunan konsentrasi, kelelahan, gangguan memori, sakit kepala, serta gangguan tidur. Oleh karena itu, untuk mengoptimalkan fungsi otak, terutama dalam meningkatkan fokus dan konsentrasi, disarankan untuk mengonsumsi air putih minimal delapan gelas setiap hari.</p>

      <h3>Cokelat Hitam</h3>
      <p>Penelitian yang dilakukan oleh Montopoli dan rekan-rekan (2015) menunjukkan bahwa konsumsi cokelat hitam dengan kandungan kakao sebesar 60% dapat meningkatkan kewaspadaan dan perhatian otak. Selain itu, hasil studi tahun 2013 menunjukkan bahwa konsumsi dua cangkir cokelat per hari selama satu bulan dapat memperbaiki aliran darah ke otak, yang berdampak pada peningkatan kinerja dalam tugas-tugas memori. Kandungan cokelat hitam juga dapat meningkatkan kadar serotonin dan endorfin, yaitu neurotransmiter yang berperan dalam peningkatan konsentrasi dan fungsi kognitif.</p>

      <h3>Kafein</h3>
      <p>Koppelstätter (2005) menemukan bahwa konsumsi kafein dapat merangsang peningkatan aktivitas pada area otak yang terlibat dalam proses perencanaan, perhatian, pemantauan, serta konsentrasi. Namun, efek kafein terhadap peningkatan fokus bersifat individual dan umumnya hanya bertahan dalam jangka waktu singkat.</p>

      <h3>Pisang</h3>
      <p>Penelitian pada tahun 2008 mengungkapkan bahwa siswa yang mengonsumsi pisang sebelum ujian menunjukkan kinerja akademik yang lebih baik dibandingkan mereka yang tidak mengonsumsinya. Kandungan mineral kalium dalam pisang berperan penting dalam mendukung fungsi optimal otak, saraf, serta jantung.</p>

      <h3>Telur</h3>
      <p>Beberapa penelitian terdahulu menunjukkan bahwa asupan asam lemak omega-3 yang terkandung dalam telur dapat meningkatkan kinerja otak, termasuk dalam hal memori, fokus, dan kestabilan suasana hati. Selain itu, telur mengandung kolin, suatu senyawa yang berfungsi untuk menjaga kesehatan membran sel otak.</p>

      <h3>Ikan Salmon</h3>
      <p>Ikan salmon merupakan sumber asam lemak omega-3 yang berperan dalam pembentukan sel-sel otak, memperlambat penurunan fungsi kognitif, serta memperkuat hubungan sinaptik yang terkait dengan proses memori. Kandungan protein dalam ikan salmon juga membantu menjaga fokus dan mendukung performa kognitif dalam aktivitas sehari-hari.</p>

      <h3>Teh Hijau</h3>
      <p>Teh hijau mengandung kafein alami yang dapat meningkatkan fokus, meskipun dalam kadar yang lebih rendah dibandingkan kopi. Selain itu, teh hijau juga mengandung asam amino L-theanine, yang terbukti dapat meningkatkan konsentrasi dan ketenangan mental. Penelitian menunjukkan bahwa kombinasi kafein dan L-theanine dalam teh hijau memberikan efek sinergis terhadap peningkatan fokus dan perhatian.</p>

      <h3>Blueberry</h3>
      <p>Penelitian yang diterbitkan dalam Journal of Agricultural and Food Chemistry pada tahun 2010 menunjukkan bahwa konsumsi jus blueberry setiap hari selama dua bulan dapat meningkatkan kemampuan belajar dan memori secara signifikan. Kandungan antioksidan dalam blueberry berperan dalam mendukung kesehatan otak dengan mengaktifkan enzim pelindung yang membantu mempertahankan fungsi memori.</p>
    `,
    7: `
      <h2>CARA TIDUR BERKUALITAS SEBELUM UJIAN</h2>
      
      <h3>Pola Makan Sebelum Tidur</h3>
      <p>Disarankan untuk mengonsumsi makanan terakhir setidaknya dua jam sebelum waktu tidur. Kondisi perut yang terlalu kenyang dapat mengganggu kualitas tidur, khususnya ketika individu sedang mengalami tekanan kognitif seperti memikirkan ujian. Makanan berat, berminyak, padat, atau pedas sebaiknya dihindari karena lebih sulit dicerna dan dapat menimbulkan gangguan tidur. Selain itu, konsumsi jenis makanan tersebut berpotensi menimbulkan refluks asam lambung (heartburn) yang mengakibatkan terganggunya waktu istirahat. Sebaliknya, mengonsumsi camilan ringan menjelang tidur tidak menjadi masalah. Bahkan, apabila individu merasa lapar, disarankan untuk mengonsumsi camilan ringan agar dapat menghindari kesulitan tidur akibat perut kosong.</p>

      <h3>Asupan Makanan yang Mendukung Kualitas Tidur</h3>
      <p>Pilihlah makanan yang mengandung zat kimia alami yang dapat meningkatkan kualitas tidur. Berbeda dengan sebagian siswa yang mungkin bertahan dengan konsumsi minuman bersoda dan makanan ringan selama masa ujian, pendekatan yang lebih sehat dan cerdas adalah memilih makanan bergizi yang mendukung tidur nyenyak.</p>
      <p>Selada mengandung lactucarium, senyawa alami dengan efek menenangkan dan menyerupai obat penenang. Kacang almond dan kenari mengandung asam amino triptofan, yang berperan dalam meningkatkan produksi hormon serotonin dan melatonin sebagai pengatur ritme tidur. Pisang kaya akan kalium dan magnesium yang membantu relaksasi otot, sedangkan sereal gandum utuh mengandung vitamin B6 yang berkontribusi dalam sintesis melatonin, terutama bila dikombinasikan dengan susu. Selain itu, karbohidrat kompleks seperti nasi cokelat atau biskuit gandum utuh dapat membantu proses tidur, sedangkan karbohidrat sederhana seperti roti putih, pasta, atau makanan gorengan sebaiknya dihindari.</p>

      <h3>Minuman yang Membantu Relaksasi Sebelum Tidur</h3>
      <p>Selain pola makan, konsumsi minuman tertentu dapat berperan dalam meningkatkan kualitas tidur. Namun, minuman tersebut sebaiknya dikonsumsi beberapa waktu sebelum tidur agar tidak menyebabkan rasa penuh pada perut.</p>
      <p>Susu skim merupakan pilihan yang tepat karena mengandung triptofan dan kalsium yang dapat merangsang produksi hormon tidur, sekaligus memiliki kadar lemak lebih rendah sehingga tidak mengganggu sistem pencernaan. Teh kamomil mengandung glycine, yaitu asam amino dengan efek penenang ringan; dapat ditambahkan madu untuk meningkatkan kadar triptofan alami. Sementara itu, teh markisa mengandung alkaloid Harman yang diketahui mampu menenangkan sistem saraf dan mendukung proses tidur.</p>

      <h3>Pembatasan Konsumsi Kafeina dan Nikotin</h3>
      <p>Kafeina dan nikotin merupakan stimulan yang dapat menghambat proses tidur. Kafeina dapat bertahan dalam tubuh selama enam hingga empat belas jam, sedangkan nikotin dapat memerlukan waktu satu hingga sepuluh hari untuk sepenuhnya terurai. Oleh karena itu, disarankan untuk tidak mengonsumsi kafeina maupun merokok setelah siang hari, terutama menjelang waktu tidur. Jika konsumsi kafeina tidak dapat dihindari, sebaiknya memilih jenis minuman dengan kadar kafeina rendah seperti teh hijau, kopi tanpa kafeina (decaf), atau minuman bersoda ringan. Idealnya, konsumsi kafeina dihentikan paling lambat delapan jam sebelum tidur agar tidak mengganggu ritme istirahat malam.</p>

      <h3>Kehati-hatian dalam Penggunaan Obat Tidur</h3>
      <p>Penggunaan obat tidur sebaiknya dilakukan dengan penuh kehati-hatian. Bagi individu yang tidak terbiasa menggunakan obat tidur, malam sebelum ujian bukan waktu yang tepat untuk mencobanya. Sebagian besar obat tidur komersial mengandung antihistamin sebagai bahan aktif, yang dapat menimbulkan efek kantuk berkepanjangan hingga keesokan harinya. Kondisi ini dapat menurunkan kesiapan mental dan performa kognitif saat menghadapi ujian.</p>
    `,
    8: `
      <h2>GROWTH MINDSET: KUNCI SUKSES AKADEMIK</h2>
      
      <h3>Pengertian Growth Mindset</h3>
      <p>Istilah growth mindset pertama kali diperkenalkan oleh Dr. Carol S. Dweck, seorang profesor psikologi di Stanford University. Konsep ini merujuk pada pola pikir yang berasumsi bahwa kemampuan, kecerdasan, dan bakat individu bukanlah sifat bawaan yang statis, melainkan aspek yang dapat dikembangkan melalui usaha, pembelajaran, dan ketekunan.</p>
      <p>Sebaliknya, individu dengan fixed mindset meyakini bahwa kemampuan yang dimilikinya bersifat tetap dan tidak dapat diubah. Perbedaan mendasar antara kedua pola pikir tersebut berimplikasi pada cara seseorang menghadapi tantangan maupun kegagalan. Sebagai contoh, individu dengan fixed mindset cenderung menafsirkan kegagalan sebagai bukti kurangnya bakat, sedangkan individu dengan growth mindset memandang kegagalan sebagai peluang untuk belajar dan memperbaiki diri.</p>

      <h3>Growth Mindset sebagai Faktor Internal dalam Kesuksesan</h3>
      <p>Dalam konteks pencapaian kesuksesan, sebagian besar individu sering kali berfokus pada faktor eksternal seperti peluang, jaringan sosial, dan modal. Namun, penelitian menunjukkan bahwa faktor internal berupa growth mindset justru memainkan peranan penting dalam menentukan keberhasilan seseorang. Pola pikir ini berpengaruh signifikan terhadap cara individu merespons kegagalan, tantangan, dan peluang dalam kehidupan maupun karier.</p>
      <p>Lebih dari sekadar konsep psikologis, growth mindset merupakan landasan penting dalam proses perkembangan diri. Individu yang memiliki pola pikir ini tidak hanya berpotensi lebih besar untuk mencapai kesuksesan, tetapi juga mampu beradaptasi terhadap perubahan dan persaingan di era modern.</p>

      <h3>Signifikansi Growth Mindset terhadap Keberhasilan</h3>
      <p>Keberhasilan sering kali diasosiasikan dengan faktor keberuntungan atau bakat. Namun, bukti empiris menunjukkan bahwa pola pikir memiliki pengaruh yang lebih kuat terhadap pencapaian individu. Growth mindset berperan penting karena:</p>
      
      <h4>Meningkatkan Ketangguhan terhadap Kegagalan</h4>
      <p>Individu dengan growth mindset memandang kegagalan sebagai bagian dari proses pembelajaran, bukan sebagai akhir dari usaha.</p>

      <h4>Mendorong Pengembangan Diri yang Berkelanjutan</h4>
      <p>Pola pikir ini menumbuhkan rasa ingin tahu dan dorongan untuk terus belajar, sehingga individu menjadi lebih inovatif dan adaptif terhadap perubahan.</p>

      <h4>Meningkatkan Motivasi dan Ketekunan</h4>
      <p>Keyakinan bahwa hasil dapat dicapai melalui usaha membuat individu lebih termotivasi dan gigih dalam menghadapi hambatan.</p>

      <h4>Memperkuat Hubungan Interpersonal dan Kolaborasi</h4>
      <p>Individu dengan growth mindset cenderung terbuka terhadap masukan, menghargai perspektif orang lain, dan berfokus pada solusi daripada masalah.</p>

      <h3>Ciri-Ciri Fixed Mindset</h3>
      <p>Sebelum mengembangkan growth mindset, penting untuk mengenali tanda-tanda dari fixed mindset, seperti kecenderungan menghindari tantangan karena takut gagal, merasa terancam oleh kesuksesan orang lain, mudah menyerah saat menghadapi kesulitan, serta sering berkata "Aku tidak bisa" tanpa mencoba terlebih dahulu. Meskipun demikian, pola pikir bukanlah sifat permanen; individu dapat melatih diri untuk berubah melalui kesadaran dan pembiasaan.</p>

      <h3>Strategi Mengembangkan Growth Mindset</h3>
      <p>Beberapa langkah yang dapat dilakukan untuk menumbuhkan growth mindset antara lain:</p>

      <h4>1. Mengubah Persepsi terhadap Kegagalan</h4>
      <p>Kegagalan perlu dipahami sebagai sarana pembelajaran. Pertanyaan reflektif seperti "Apa yang dapat saya pelajari dari pengalaman ini?" dapat membantu proses pertumbuhan diri.</p>

      <h4>2. Berfokus pada Proses, Bukan Hasil Akhir</h4>
      <p>Menghargai proses belajar akan meningkatkan konsistensi dan ketahanan psikologis dalam menghadapi tantangan.</p>

      <h4>3. Membangun Lingkungan yang Mendukung Pertumbuhan</h4>
      <p>Berinteraksi dengan individu yang berpikiran positif dapat memperkuat motivasi untuk berkembang.</p>

      <h4>4. Menerima Kritik Secara Konstruktif</h4>
      <p>Kritik sebaiknya dipandang sebagai umpan balik yang berguna untuk perbaikan diri, bukan sebagai serangan terhadap kemampuan pribadi.</p>

      <h4>5. Mengapresiasi Kemajuan Kecil</h4>
      <p>Pengakuan terhadap pencapaian sekecil apa pun dapat memperkuat kepercayaan diri dan mempercepat proses perubahan positif.</p>

      <h3>Penerapan Growth Mindset dalam Kehidupan Sehari-Hari</h3>
      <p>Pola pikir growth mindset memiliki relevansi luas dalam berbagai aspek kehidupan. Dalam dunia kerja, pola pikir ini membantu individu menghadapi tantangan profesional dan meningkatkan kinerja. Dalam bidang pendidikan, growth mindset menjadikan proses belajar lebih efektif dan menyenangkan. Dalam hubungan interpersonal, pola pikir ini mendorong komunikasi yang sehat dan saling menghargai. Sementara dalam konteks bisnis, growth mindset berfungsi sebagai fondasi bagi inovasi dan keberlanjutan organisasi.</p>
    `
  };

  const articles: Article[] = [
    {
      id: 1,
      title: '5 Cara Mengatur Waktu Saat Ujian',
      excerpt: 'Tips praktis untuk mengatur waktu belajar dengan efektif tanpa merasa kewalahan',
      readTime: '3 menit',
      category: 'Tips Belajar',
      likes: 124,
      image: '📚',
      featured: false,
      content: articleContents[1]
    },
    {
      id: 3,
      title: 'Teknik Pomodoro untuk Belajar Lebih Efektif',
      excerpt: 'Metode belajar 25 menit fokus + 5 menit istirahat yang terbukti ampuh',
      readTime: '4 menit',
      category: 'Tips Belajar',
      likes: 89,
      image: '⏰',
      featured: false,
      content: articleContents[3]
    },
    {
      id: 4,
      title: 'Mengatasi Blank Saat Ujian',
      excerpt: 'Strategi praktis untuk tetap tenang dan fokus ketika pikiran tiba-tiba kosong',
      readTime: '3 menit',
      category: 'Tips Ujian',
      likes: 178,
      image: '🧠',
      featured: false,
      content: articleContents[4]
    },
    {
      id: 6,
      title: 'Makanan yang Meningkatkan Konsentrasi',
      excerpt: 'Apa yang kamu makan mempengaruhi kemampuan otakmu. Ini dia daftarnya!',
      readTime: '4 menit',
      category: 'Kesehatan',
      likes: 145,
      image: '🥗',
      featured: false,
      content: articleContents[6]
    },
    {
      id: 7,
      title: 'Cara Tidur Berkualitas Sebelum Ujian',
      excerpt: 'Begadang bukan solusi! Ini cara tidur yang benar untuk performa optimal',
      readTime: '3 menit',
      category: 'Kesehatan',
      likes: 198,
      image: '😴',
      featured: false,
      content: articleContents[7]
    },
    {
      id: 8,
      title: 'Growth Mindset: Kunci Sukses Akademik',
      excerpt: 'Mengapa mindset lebih penting dari IQ dalam kesuksesan belajar',
      readTime: '5 menit',
      category: 'Motivasi',
      likes: 267,
      image: '💪',
      featured: false,
      content: articleContents[8]
    }
  ];

  const categories = ['Semua', 'Tips Belajar', 'Tips Ujian', 'Kesehatan', 'Motivasi'];

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleLikeClick = (articleId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (likedArticles.has(articleId)) {
      setLikedArticles(prev => new Set([...prev].filter(id => id !== articleId)));
      setArticleLikes(prev => ({ ...prev, [articleId]: prev[articleId] - 1 }));
      toast.success('Like dibatalkan');
    } else {
      setLikedArticles(prev => new Set([...prev, articleId]));
      setArticleLikes(prev => ({ ...prev, [articleId]: prev[articleId] + 1 }));
      toast.success('❤️ Artikel disukai!');
    }
  };

  const handleShareClick = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const shareText = `${article.title} - ${article.excerpt}`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: window.location.href
      }).then(() => {
        toast.success('📤 Artikel berhasil dibagikan!');
      }).catch(() => {
        // Fallback to copy link
        copyToClipboard(article);
      });
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(article);
    }
  };

  const copyToClipboard = (article: Article) => {
    const shareText = `${article.title}\n\n${article.excerpt}\n\nBaca selengkapnya di EduCalm Space`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('📋 Link artikel berhasil disalin!');
    }).catch(() => {
      toast.error('Gagal menyalin link');
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#266CA9] to-[#0F2573] text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-8 h-8" />
            Artikel
          </CardTitle>
          <CardDescription className="text-[#ADE1FB]">
            Baca tips belajar, strategi ujian, dan informasi bermanfaat untuk mendukung perjalanan akademikmu
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Categories */}
      <Card className="border-[#266CA9]">
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#266CA9] text-white border-[#266CA9]'
                    : 'hover:bg-[#266CA9] hover:text-white border-[#266CA9]'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Articles */}
      <div>
        <h3 className="text-xl mb-4 text-[#0F2573]">Semua Artikel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.filter(a => (selectedCategory === 'Semua' || a.category === selectedCategory)).map((article) => (
            <Card 
              key={article.id} 
              className="hover:shadow-lg transition-shadow border-[#ADE1FB] cursor-pointer"
              onClick={() => handleArticleClick(article)}
            >
              <CardHeader>
                <div className="text-5xl mb-4">{article.image}</div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#266CA9]">{article.category}</Badge>
                  <Badge variant="outline" className="border-[#266CA9]">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readTime}
                  </Badge>
                </div>
                <CardTitle className="text-xl hover:text-[#266CA9] transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button 
                      className={`flex items-center gap-1 transition-colors ${
                        likedArticles.has(article.id) ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                      onClick={(e) => handleLikeClick(article.id, e)}
                    >
                      <Heart className={`w-4 h-4 ${likedArticles.has(article.id) ? 'fill-current' : ''}`} />
                      {articleLikes[article.id]}
                    </button>
                    <button 
                      className="flex items-center gap-1 hover:text-[#266CA9] transition-colors" 
                      onClick={(e) => handleShareClick(article, e)}
                    >
                      <Share2 className="w-4 h-4" />
                      Bagikan
                    </button>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Baca
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📹 Video Inspiratif
          </CardTitle>
          <CardDescription>Tips belajar dan video edukatif pilihan untuk mendukung perjalanan akademikmu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                title: 'The Learning Game: Belajar Bisa Asyik?! - Maudy Ayunda\'s Booklist', 
                duration: '5:32',
                thumbnail: 'https://lh3.googleusercontent.com/d/1cW2StpY-S0yXIN3pHbk82gJfE83DtLtk',
                url: 'https://youtu.be/p3GkTO7t3rU?si=gtVJJJbFMPeObi-m',
                channel: 'Maudy Ayunda'
              },
              { 
                title: 'Tips Belajar Efektif (Cara Memahami Apa yang Dipelajari)', 
                duration: '8:15',
                thumbnail: 'https://lh3.googleusercontent.com/d/1aqYsWm7xCGNzQo6Ea2LO-sDCouODDVrI',
                url: 'https://youtu.be/JzvMIGPFEqU?si=7dH6rCooQ_96NGZR',
                channel: 'Satu Persen - Indonesian Life School'
              },
              { 
                title: 'Afraid of Exam? | What Causes Anxiety? | How To Overcome Anxiety? | Dr Binocs Show | Peekaboo Kidz', 
                duration: '6:20',
                thumbnail: 'https://lh3.googleusercontent.com/d/1exK4WwMr4vf8sU_lkjMy1pttIvA1Jiax',
                url: 'https://youtu.be/p_KOXPC3dh4?si=P-yWinvXyGY7FlLn',
                channel: 'Peekaboo Kidz'
              }
            ].map((video, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (video.url) {
                    window.open(video.url, '_blank');
                  }
                }}
              >
                <div className="relative rounded-lg h-32 overflow-hidden mb-3">
                  <ImageWithFallback 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-l-8 border-l-purple-600 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <h4 className="text-sm mb-1">{video.title}</h4>
                {video.channel && (
                  <p className="text-xs text-[#266CA9] mb-1 flex items-center gap-1">
                    <span>📺</span>
                    {video.channel}
                  </p>
                )}
                <p className="text-xs text-gray-500">{video.duration}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4 border-b border-[#ADE1FB]/30 bg-gradient-to-r from-[#ADE1FB]/10 to-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-5xl mb-3">{selectedArticle?.image}</div>
                <DialogTitle className="text-2xl text-[#0F2573] mb-2">
                  {selectedArticle?.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Artikel lengkap tentang {selectedArticle?.title}
                </DialogDescription>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-[#266CA9]">{selectedArticle?.category}</Badge>
                  <Badge variant="outline" className="border-[#266CA9]">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedArticle?.readTime}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    {selectedArticle?.likes}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(85vh-180px)] px-6 py-4">
            <style dangerouslySetInnerHTML={{
              __html: `
                .prose h2 {
                  color: #0F2573;
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-top: 1.5rem;
                  margin-bottom: 1rem;
                }
                .prose h3 {
                  color: #266CA9;
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                }
                .prose h4 {
                  color: #266CA9;
                  font-size: 1.1rem;
                  font-weight: 600;
                  margin-top: 1.25rem;
                  margin-bottom: 0.5rem;
                }
                .prose p {
                  margin-bottom: 1rem;
                  text-align: justify;
                }
                .prose ul, .prose ol {
                  margin-left: 1.5rem;
                  margin-bottom: 1rem;
                }
                .prose li {
                  margin-bottom: 0.5rem;
                }
              `
            }} />
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedArticle?.content || '' }}
              style={{
                lineHeight: '1.8'
              }}
            />
          </ScrollArea>

          <div className="p-6 pt-4 border-t border-[#ADE1FB]/30 bg-gradient-to-r from-white to-[#ADE1FB]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 hover:text-red-500 transition-colors text-sm">
                  <Heart className="w-5 h-5" />
                  <span>Suka artikel ini</span>
                </button>
                <button className="flex items-center gap-2 hover:text-[#266CA9] transition-colors text-sm">
                  <Share2 className="w-5 h-5" />
                  <span>Bagikan</span>
                </button>
              </div>
              <Button 
                onClick={() => setSelectedArticle(null)}
                className="bg-[#266CA9] hover:bg-[#0F2573]"
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}