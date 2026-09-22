$(function () {
  "use strict";

  const modules = {
    alfabet: {
      badge: "Level 1: Dasar",
      title: "Alfabet BISINDO (A - Z)",
      lead: "Fondasi utama pembentukan ejaan jari (fingerspelling) untuk mengeja nama dan istilah baru.",
      duration: "26 Materi Huruf",
      sections: [
        [
          "Materi Detail",
          "Modul ini adalah langkah pertama dan paling krusial dalam mempelajari bahasa isyarat. Di sini, pengguna akan diajak mengenal bentuk dasar tangan untuk meragakan setiap huruf abjad dari A hingga Z. Menguasai ejaan jari (fingerspelling) sangat penting karena teknik ini digunakan secara luas untuk mengeja nama orang, nama tempat, atau kata-kata asing yang belum memiliki isyarat bakunya sendiri. Modul ini dirancang sangat perlahan agar pemula bisa mengingat posisi jari dengan tepat.",
        ],
        [
          "Fokus Pembelajaran",
          "Kenali bentuk tangan untuk huruf A sampai Z, mulai dari vokal hingga konsonan, dengan memperhatikan arah telapak, posisi ibu jari, dan jarak antarjari.",
        ],
        [
          "Cara Berlatih",
          "Pilih satu kata pendek, eja dengan perlahan, lalu ulangi tanpa melihat contoh. Rekam gerakanmu dari depan agar posisi tangan dapat dibandingkan dengan referensi.",
        ],
      ],
      callout:
        "Jangan mengejar kecepatan terlebih dahulu. Ketepatan bentuk dan konsistensi posisi tangan adalah fondasi yang lebih penting.",
      tips: [
        "Latih lima huruf per sesi.",
        "Gunakan nama sendiri sebagai latihan pertama.",
        "Berhenti sejenak di setiap huruf agar bentuknya jelas.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=abjad",
    },
    "angka-dasar": {
      badge: "Level 1: Angka",
      title: "Isyarat Angka (0 - 10)",
      lead: "Panduan visual bentuk jari tangan untuk membilang angka 0 sampai 10 secara teratur.",
      duration: "11 Materi Angka",
      sections: [
        [
          "Materi Detail",
          "Setelah mengenal huruf, pengguna akan beralih ke angka dasar. Modul ini fokus pada pengenalan angka nol hingga sepuluh. Angka merupakan elemen penting dalam komunikasi sehari-hari, mulai dari menunjukkan jumlah barang, urutan, hingga berhitung sederhana. Panduan visual yang disediakan akan memastikan bentuk tangan pengguna akurat dan mudah dipahami oleh teman Tuli.",
        ],
      ],
      callout:
        "Pastikan tangan berada di bidang pandang lawan bicara dan tidak tertutup oleh benda lain.",
      tips: [
        "Mulai dari angka 0 sampai 5.",
        "Bandingkan posisi ibu jari pada angka 6 sampai 9.",
        "Ulangi angka secara acak, bukan hanya berurutan.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=angka",
    },
    "bilangan-waktu": {
      badge: "Level 2: Angka",
      title: "Kombinasi Bilangan & Waktu",
      lead: "Mempelajari cara menyebutkan jam, umur, nomor telepon, dan nominal angka dalam percakapan.",
      duration: "8 Materi Lanjutan",
      sections: [
        [
          "Materi Detail",
          "Naik ke level selanjutnya, modul ini akan memandu pengguna merangkai angka-angka dasar menjadi informasi yang lebih kompleks. Pengguna akan belajar bagaimana mengisyaratkan informasi penting sehari-hari seperti memberitahukan pukul berapa sekarang, menyebutkan usia, membagikan nomor telepon, hingga menyebutkan nominal uang saat bertransaksi.",
        ],
      ],
      callout:
        "Berlatihlah dengan situasi nyata seperti menyebutkan jam bertemu atau nominal belanja.",
      tips: [
        "Gunakan kalender dan jam sebagai alat bantu.",
        "Ucapkan konteksnya sebelum memberi angka.",
        "Ulangi pola puluhan dengan tempo stabil.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=angka",
      quiz: "quiz.html",
    },
    "salam-ungkapan": {
      badge: "Level 2: Ungkapan",
      title: "Salam & Ungkapan Sopan",
      lead: "Kuasai gestur salam pembuka, terima kasih, permohonan maaf, dan permohonan tolong yang santun.",
      duration: "12 Kosakata Kunci",
      sections: [
        [
          "Materi Detail",
          "Membangun interaksi yang hangat dimulai dari salam. Modul ini membekali pengguna dengan ungkapan-ungkapan krusial untuk berinteraksi sosial. Mulai dari sapaan sehari-hari (seperti Halo, Selamat Pagi), hingga kata-kata ajaib penanda kesopanan seperti Terima kasih, Maaf, dan Tolong. Menguasai isyarat ini akan membuat komunikasi menjadi jauh lebih ramah dan natural.",
        ],
        [
          "Etika Komunikasi",
          "Jaga kontak mata secukupnya, gunakan gerakan yang jelas, dan beri ruang bagi lawan bicara untuk merespons.",
        ],
      ],
      callout:
        "Bahasa isyarat bukan hanya bentuk tangan. Arah pandang, ekspresi, dan sikap tubuh membantu pesan terasa lebih alami.",
      tips: [
        "Latih salam dengan ekspresi ramah.",
        "Gunakan gerakan yang tidak terlalu cepat.",
        "Praktikkan dalam dialog pendek.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=kata",
    },
    percakapan: {
      badge: "Level 3: Ungkapan",
      title: "Percakapan & Kalimat Tanya",
      lead: "Membentuk kalimat tanya, ekspresi alis/wajah (non-manual markers), dan dialog praktis.",
      duration: "10 Topik Dialog",
      sections: [
        [
          "Materi Detail",
          "Modul tingkat lanjut ini mengajak pengguna masuk ke dalam percakapan dua arah. Tidak hanya sekadar gerakan tangan, pengguna akan mempelajari pentingnya non-manual markers atau ekspresi wajah (seperti mengangkat atau mengerutkan alis) yang berfungsi sebagai penentu apakah suatu kalimat itu adalah pertanyaan atau pernyataan. Modul ini dilengkapi dengan simulasi dialog praktis untuk melatih kelancaran berkomunikasi.",
        ],
        [
          "Ekspresi Non-Manual",
          "Gerak alis, kepala, dan wajah membantu membedakan pertanyaan, penegasan, dan respons.",
        ],
        [
          "Latihan Dialog",
          "Buat dialog dua giliran: ajukan satu pertanyaan, beri jawaban singkat, lalu minta klarifikasi.",
        ],
      ],
      callout:
        "Percakapan yang baik memberi ruang untuk melihat, memahami, dan merespons. Jangan takut memakai jeda.",
      tips: [
        "Mulai dari pertanyaan satu kalimat.",
        "Gunakan ekspresi wajah yang sesuai.",
        "Latihan berpasangan akan lebih efektif.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=kata",
      quiz: "quiz.html",
    },
    keluarga: {
      badge: "Level 2: Sosial",
      title: "Keluarga & Relasi Sosial",
      lead: "Mengenal isyarat untuk Ayah, Ibu, Kakak, Adik, Kakek, Nenek, dan Teman akrab.",
      duration: "9 Isyarat Keluarga",
      sections: [
        [
          "Materi Detail",
          "Keluarga dan teman adalah orang-orang terdekat di sekitar kita. Modul ini mengajarkan kosakata isyarat yang berkaitan dengan silsilah keluarga dan hubungan sosial. Pengguna akan bisa dengan mudah memperkenalkan anggota keluarga mereka, menyebutkan status saudara, hingga menceritakan sahabat-sahabat akrab mereka dalam bahasa isyarat.",
        ],
        [
          "Membangun Kalimat",
          "Gabungkan kosakata keluarga dengan kata tanya sederhana untuk menceritakan relasi atau aktivitas bersama.",
        ],
      ],
      callout:
        "Kosakata akan lebih mudah diingat jika langsung dikaitkan dengan orang dan pengalaman yang dekat denganmu.",
      tips: [
        "Buat peta keluarga sederhana.",
        "Sebutkan nama anggota keluarga satu per satu.",
        "Latih dengan kalimat pendek.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=kata",
    },
    hewan: {
      badge: "Khusus Anak",
      title: "Dunia Hewan & Alam",
      lead: "Meniru ciri khas gerak dan karakteristik hewan seperti Kucing (kumis), Burung (sayap), dan Ikan.",
      duration: "10 Isyarat Hewan",
      sections: [
        [
          "Materi Detail",
          "Dirancang khusus agar menyenangkan bagi anak-anak maupun pemula yang menyukai visual interaktif. Modul ini mengajarkan isyarat nama-nama binatang dengan meniru karakteristik unik mereka. Misalnya, mengisyaratkan kucing dengan memperagakan kumisnya, atau burung dengan mengepakkan sayap. Pendekatan visual dan gerak ini membuat proses menghafal kosakata menjadi seperti permainan yang seru.",
        ],
        [
          "Aktivitas",
          "Pilih satu hewan, tunjukkan isyaratnya, lalu buat kalimat sederhana tentang warna, ukuran, atau habitatnya.",
        ],
      ],
      callout:
        "Belajar dengan cerita membuat kosakata lebih mudah melekat dan membuka ruang untuk berkreasi.",
      tips: [
        "Gunakan kartu gambar.",
        "Kelompokkan hewan berdasarkan habitat.",
        "Buat kuis tebak hewan bersama teman.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=kata",
    },
    "warna-benda": {
      badge: "Khusus Anak",
      title: "Warna & Benda di Rumah",
      lead: "Mempelajari isyarat warna (Merah, Kuning, Hijau, Biru) serta benda sehari-hari (Buku, Meja, Rumah).",
      duration: "12 Kosakata Visual",
      sections: [
        [
          "Materi Detail",
          "Modul yang sangat aplikatif untuk menggambarkan lingkungan sekitar. Pengguna akan diajarkan cara mengisyaratkan berbagai macam warna dasar dan juga benda-benda familiar yang ada di dalam rumah. Dengan menguasai modul ini, pengguna dapat dengan mudah mendeskripsikan suatu objek, misalnya buku merah atau meja biru.",
        ],
        [
          "Latihan Konteks",
          "Pilih lima benda di ruanganmu. Tunjukkan warna dan namanya, kemudian minta teman menebak benda yang dimaksud.",
        ],
      ],
      callout:
        "Lingkungan sekitar adalah media belajar yang selalu tersedia. Gunakan benda nyata agar latihan terasa relevan.",
      tips: [
        "Belajar lima kata per ruangan.",
        "Gunakan benda dengan warna berbeda.",
        "Ulangi kosakata saat melakukan aktivitas harian.",
      ],
      dictionary: "kosakata.html?bahasa=bisindo&kategori=kata",
    },
  };

  const params = new URLSearchParams(window.location.search);
  const moduleKey = params.get("modul") || "alfabet";
  const module = modules[moduleKey] || modules.alfabet;

  $("#articleBadge").text(module.badge);
  $("#articleTitle").text(module.title);
  $("#articleLead").text(module.lead);
  $("#articleDuration").text(module.duration);
  $("#articleDictionaryLink").attr("href", module.dictionary);
  if (module.quiz) $("#articleQuizLink").attr("href", module.quiz);
  document.title = `${module.title} - IsyaratOK`;

  const content = module.sections
    .map(function (section) {
      return `<h2>${section[0]}</h2><p>${section[1]}</p>`;
    })
    .join("");
  $("#articleContent").html(
    `${content}<div class="article-callout"><strong>Catatan penting:</strong> ${module.callout}</div>`,
  );
  $("#articleTips").html(
    module.tips
      .map(function (tip) {
        return `<li class="flex items-start gap-2"><i class="mt-1 text-orange-500 fa-solid fa-circle-check" aria-hidden="true"></i><span>${tip}</span></li>`;
      })
      .join(""),
  );
});
