$(function () {
  "use strict";

  const modules = {
    alfabet: {
      badge: "Level 1: Dasar",
      title: "Alfabet BISINDO (A - Z)",
      lead: "Pelajari fondasi ejaan jari untuk mengeja nama, tempat, dan istilah baru dalam komunikasi sehari-hari.",
      duration: "26 huruf | 15 menit",
      sections: [
        [
          "Tujuan Belajar",
          "Setelah menyelesaikan modul ini, kamu dapat mengenali dan membentuk huruf A sampai Z dengan posisi tangan yang lebih stabil.",
        ],
        [
          "Materi Utama",
          "Mulailah dari vokal A, I, U, E, dan O. Setelah itu, lanjutkan ke konsonan secara bertahap. Perhatikan arah telapak, posisi ibu jari, dan jarak antarjari.",
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
      lead: "Kenali bentuk jari untuk angka 0 sampai 10 dan gunakan dalam konteks hitungan sederhana.",
      duration: "11 angka | 12 menit",
      sections: [
        [
          "Tujuan Belajar",
          "Kamu dapat menunjukkan angka dasar dengan telapak yang menghadap tepat dan bentuk jari yang mudah dibaca.",
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
      lead: "Susun angka belasan, puluhan, dan informasi waktu agar percakapan sehari-hari terasa lebih lengkap.",
      duration: "8 materi | 20 menit",
      sections: [
        [
          "Materi Utama",
          "Latih pola angka 11 sampai 19, puluhan, nomor telepon, umur, harga, serta penyebutan jam dan menit.",
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
      lead: "Pelajari gestur salam, terima kasih, maaf, dan tolong untuk membangun interaksi yang hangat dan santun.",
      duration: "12 kosakata | 15 menit",
      sections: [
        [
          "Materi Utama",
          "Mulai dari sapaan waktu, lalu lanjutkan ke ungkapan terima kasih, sama-sama, permisi, maaf, dan tolong. Ekspresi wajah ikut menyampaikan maksud.",
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
      lead: "Bangun percakapan dua arah dengan kata tanya, jawaban singkat, dan ekspresi non-manual yang tepat.",
      duration: "10 topik | 25 menit",
      sections: [
        [
          "Kata Tanya",
          "Latih Siapa, Apa, Kapan, Di Mana, Kenapa, dan Bagaimana dalam kalimat pendek.",
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
      lead: "Kenali kosakata untuk keluarga, teman, dan hubungan sosial yang sering muncul dalam percakapan sehari-hari.",
      duration: "9 isyarat | 15 menit",
      sections: [
        [
          "Materi Utama",
          "Pelajari Ayah, Ibu, Kakak, Adik, Kakek, Nenek, dan Teman dengan memperhatikan lokasi gerakan serta arah tangan.",
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
      badge: "Level 3: Anak",
      title: "Dunia Hewan & Alam",
      lead: "Belajar kosakata hewan dan alam melalui asosiasi visual yang menyenangkan untuk pembelajar muda maupun pemula.",
      duration: "8 kosakata | 15 menit",
      sections: [
        [
          "Materi Utama",
          "Hubungkan bentuk isyarat dengan gerak atau ciri khas hewan. Gunakan gambar sebagai pemantik, bukan pengganti pengamatan gerakan tangan.",
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
      badge: "Level 3: Anak",
      title: "Warna & Benda di Rumah",
      lead: "Kenali warna dan benda di sekitar rumah melalui latihan menunjuk, mengamati, dan menyusun kalimat sederhana.",
      duration: "10 kosakata | 15 menit",
      sections: [
        [
          "Materi Utama",
          "Mulai dari warna dasar, lalu hubungkan dengan benda seperti buku, meja, pintu, dan kursi yang ada di sekitarmu.",
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
