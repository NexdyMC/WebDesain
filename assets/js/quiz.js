$(function () {

  // ================= KONFIGURASI =================
  const KONFIG = {
    expBenar: 5,
    expSalah: 5,
    poinDasarBenar: 100,   // poin dasar tiap jawaban benar
    batasWaktuIdeal: 15,   // detik - batas waktu ideal untuk dapat bonus penuh
    poinPerDetik: 10       // bonus/potongan poin per detik dari batas ideal
  };

  let ALFABET = [];   // dari data.json -> [{huruf, gambar}, ...]
  let LEVELS = [];     // dari level.json -> [{level, jenis, huruf:[...], exp}, ...]

  let state = {
    pk: buatStateAwal(),
    sk: buatStateAwal()
  };

  function buatStateAwal() {
    return {
      level: 1, exp: 0, score: 0,
      benar: 0, salah: 0, dijawab: 0,
      timerId: null, waktuBerjalan: 0, waktuSoalMulai: 0,
      terkunci: false, aktif: false,
      soalSekarang: null
    };
  }

  // ================= UTIL =================
  function acak(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function randomInt(n) { return Math.floor(Math.random() * n); }

  // ================= DATA LEVEL (dari level.json, dengan fallback rumus kalau level belum ada di JSON) =================
  function hitungExpTargetFallback(level) {
    return 30 + 5 * Math.floor((level - 1) / 2);
  }
  function hitungJendelaFallback(level) {
    if (!ALFABET.length) return [];   // <-- tambahan: cegah crash saat data belum siap
    const mulai = ((level - 1) * 3) % 26;
    const hasil = [];
    for (let i = 0; i < 5; i++) hasil.push(ALFABET[(mulai + i) % 26].huruf);
    return hasil;
  }
  function ambilDataLevel(level) {
    const ada = LEVELS.find(l => l.level === level);
    if (ada) return ada;
    // fallback: level di luar daftar level.json, tetap dihitung otomatis (unlimited)
    return { level: level, jenis: 'Alphabet', huruf: hitungJendelaFallback(level), exp: hitungExpTargetFallback(level) };
  }
  function hurufKeObjekGambar(hurufArr) {
    return hurufArr.map(h => ALFABET.find(a => a.huruf === h)).filter(Boolean);
  }
  function expDibutuhkan(level) {
    return ambilDataLevel(level).exp;
  }

  // ================= LOCAL STORAGE (key: "kuis") =================
  function SaveLocalStorage() {
    const data = [
      { mode: 'pilih kata', level: state.pk.level, exp: state.pk.exp, score: state.pk.score },
      { mode: 'susun kata', level: state.sk.level, exp: state.sk.exp, score: state.sk.score }
    ];
    localStorage.setItem('kuis', JSON.stringify(data));
  }
  function LoadLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('kuis'));
      if (Array.isArray(data)) {
        const pk = data.find(d => d.mode === 'pilih kata');
        const sk = data.find(d => d.mode === 'susun kata');
        if (pk) { state.pk.level = pk.level || 1; state.pk.exp = pk.exp || 0; state.pk.score = pk.score || 0; }
        if (sk) { state.sk.level = sk.level || 1; state.sk.exp = sk.exp || 0; state.sk.score = sk.score || 0; }
      }
    } catch (e) { /* localStorage kosong/rusak, pakai default */ }
  }

  function perbaruiMenu() {
    $('[data-level-for="pk"]').text(state.pk.level);
    $('[data-exp-for="pk"]').text(state.pk.exp);
    $('[data-exp-target-for="pk"]').text(expDibutuhkan(state.pk.level));
    $('[data-score-for="pk"]').text(state.pk.score);
    $('[data-bar-for="pk"]').css('width', persenExpBar(state.pk) + '%');

    $('[data-level-for="sk"]').text(state.sk.level);
    $('[data-exp-for="sk"]').text(state.sk.exp);
    $('[data-exp-target-for="sk"]').text(expDibutuhkan(state.sk.level));
    $('[data-score-for="sk"]').text(state.sk.score);
    $('[data-bar-for="sk"]').css('width', persenExpBar(state.sk) + '%');
  }
  function persenExpBar(s) {
    const butuh = expDibutuhkan(s.level);
    return Math.max(4, Math.min(100, Math.round((s.exp / butuh) * 100)));
  }

  // ================= SectionScreen: satu-satunya jalur ganti layar =================
  // idHalaman = 'menu-screen' | 'play-screen' | 'end-screen' (3 screen di dalam satu <section>)
  // modeGame  = 'pk' | 'sk' | null -> menentukan kartu mode mana yang tampil di dalam play-screen/end-screen
  function SectionScreen(idHalaman, modeGame) {
    $('#menu-screen, #play-screen, #end-screen').hide();
    $('#' + idHalaman).show();

    if (idHalaman === 'play-screen') {
      $('#page-game, #page-susun-kata').hide();
      if (modeGame === 'pk') $('#page-game').show();
      if (modeGame === 'sk') $('#page-susun-kata').show();
    }
    if (idHalaman === 'end-screen') {
      $('#wrap-end-pk, #wrap-end-sk').hide();
      if (modeGame === 'pk') $('#wrap-end-pk').show();
      if (modeGame === 'sk') $('#wrap-end-sk').show();
    }

    if (idHalaman === 'menu-screen') perbaruiMenu();
  }

  // ================= STOPWATCH (hitung maju dari 0, dipakai sebagai total waktu sesi) =================
  function RunStopwatch(jenis) {
    const s = state[jenis];
    clearInterval(s.timerId);
    s.aktif = true;
    s.waktuBerjalan = 0;
    perbaruiTampilanWaktu(jenis);
    s.timerId = setInterval(function () {
      s.waktuBerjalan++;
      perbaruiTampilanWaktu(jenis);
    }, 1000);
  }
  function HentikanStopwatch(jenis) {
    clearInterval(state[jenis].timerId);
  }
  function formatWaktu(total) {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const dt = Math.floor(total % 60).toString().padStart(2, '0');
    return m + ':' + dt;
  }
  function perbaruiTampilanWaktu(jenis) {
    $(jenis === 'pk' ? '#timer-display-pk' : '#timer-display-sk').text(formatWaktu(state[jenis].waktuBerjalan));
  }

  // ================= PERHITUNGAN SKOR (bonus kecepatan menjawab) =================
  // Skor = Poin Dasar Benar + ((Batas Waktu Ideal - Waktu Stopwatch) x Poin per Detik), minimal bonus 0
  function MathScore(benar, waktuJawabDetik) {
    if (!benar) return 0;
    const bonus = Math.max(0, (KONFIG.batasWaktuIdeal - waktuJawabDetik) * KONFIG.poinPerDetik);
    return KONFIG.poinDasarBenar + bonus;
  }

  // ================= PILIHAN KATA (satu soal per saat, berjalan terus sampai sesi diakhiri) =================
  function buatSatuSoalPK(level) {
    const dataLevel = ambilDataLevel(level);
    const jendela = hurufKeObjekGambar(dataLevel.huruf);
    const benar = jendela[randomInt(jendela.length)];
    let kandidat = acak(jendela.filter(h => h.huruf !== benar.huruf));
    let distraktor = kandidat.slice(0, 3);
    while (distraktor.length < 3) {
      const c = ALFABET[randomInt(ALFABET.length)];
      if (c.huruf !== benar.huruf && !distraktor.find(d => d.huruf === c.huruf)) distraktor.push(c);
    }
    const opsi = acak([benar].concat(distraktor));
    return { jenis: dataLevel.jenis, gambar: benar.gambar, jawaban: benar.huruf, opsi: opsi.map(o => o.huruf) };
  }

  function mulaiSesiPK() {
    const s = state.pk;
    s.benar = 0; s.salah = 0; s.dijawab = 0; s.terkunci = false;
    tampilkanSoalBaruPK();
    SectionScreen('play-screen', 'pk');
    RunStopwatch('pk');
  }

  function tampilkanSoalBaruPK() {
    const s = state.pk;
    s.soalSekarang = buatSatuSoalPK(s.level);
    s.waktuSoalMulai = s.waktuBerjalan;
    perbaruiHudPK();
    $('#judul-quiz-pk').text(s.soalSekarang.jenis);
    $('#soal-gambar-pk').html('<img class="letter-img" src="' + s.soalSekarang.gambar + '" alt="isyarat">');

    $('.opsi-pk').each(function (i) {
      const huruf = s.soalSekarang.opsi[i];
      $(this).attr('data-jawaban', huruf)
        .removeClass('opsi-benar opsi-salah')
        .find('.teks-opsi').text('Isyarat ' + huruf);
      $(this).find('.check-icon').css('opacity', 0);
    });
    s.terkunci = false;
  }

  function perbaruiHudPK() {
    const s = state.pk;
    $('#level-live-pk').text(s.level);
    $('#exp-current-pk').text(s.exp);
    $('#exp-target-pk').text(expDibutuhkan(s.level));
    $('#skor-live-pk').text(s.score);
    $('#progress-pk').css('width', persenExpBar(s) + '%');
  }

  $(document).on('click', '.opsi-pk', function () {
    const s = state.pk;
    if (s.terkunci || !s.aktif) return;
    s.terkunci = true;
    const soal = s.soalSekarang;
    const dipilih = $(this).attr('data-jawaban');
    const benar = dipilih === soal.jawaban;

    $('.opsi-pk').each(function () {
      const h = $(this).attr('data-jawaban');
      if (h === soal.jawaban) { $(this).addClass('opsi-benar'); $(this).find('.check-icon').css('opacity', 1); }
      else if (h === dipilih && !benar) { $(this).addClass('opsi-salah'); }
    });

    prosesJawaban('pk', benar);

    setTimeout(function () {
      if (!s.aktif) return;
      tampilkanSoalBaruPK();
    }, 700);
  });

  // ================= SUSUN KATA (satu soal per saat; gambar & teks selalu ditampilkan bersama) =================
  function buatSatuSoalSK(level) {
    const dataLevel = ambilDataLevel(level);
    const jendela = hurufKeObjekGambar(dataLevel.huruf);
    const panjang = 3 + randomInt(3); // 3..5 huruf
    const dipilih = acak(jendela).slice(0, panjang);
    const target = dipilih.slice().sort((a, b) => a.huruf.localeCompare(b.huruf));
    const bank = acak(target);
    return { jenis: dataLevel.jenis, target: target, bank: bank };
  }

  function mulaiSesiSK() {
    const s = state.sk;
    s.benar = 0; s.salah = 0; s.dijawab = 0; s.terkunci = false;
    tampilkanSoalBaruSK();
    SectionScreen('play-screen', 'sk');
    RunStopwatch('sk');
  }

  function buatElemenKartu(huruf, gambar) {
    return $('<button type="button"></button>')
      .addClass('kartu-kata flex flex-col items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-3 text-gray-900 transition-transform bg-white border-2 shadow-sm cursor-pointer border-amber-400 rounded-xl active:scale-95')
      .attr('data-huruf', huruf)
      .append('<img src="' + gambar + '" alt="' + huruf + '" class="object-contain w-10 h-10 sm:w-12 sm:h-12">')
      .append('<span class="text-sm font-bold sm:text-base">' + huruf + '</span>');
  }

  function tampilkanSoalBaruSK() {
    const s = state.sk;
    s.soalSekarang = buatSatuSoalSK(s.level);
    s.waktuSoalMulai = s.waktuBerjalan;
    perbaruiHudSK();
    $('#judul-quiz-sk').text(s.soalSekarang.jenis);
    const soal = s.soalSekarang;

    const $target = $('#soal-target-sk').empty();
    soal.target.forEach(h => {
      $target.append(
        $('<div class="flex flex-col items-center gap-1 p-2 bg-white border rounded-lg border-amber-300"></div>')
          .append('<img src="' + h.gambar + '" alt="' + h.huruf + '" class="object-contain w-12 h-12 sm:w-16 sm:h-16">')
          .append('<span class="text-xs font-bold text-gray-700 sm:text-sm">' + h.huruf + '</span>')
      );
    });

    $('#bank-kata').empty();
    soal.bank.forEach(h => $('#bank-kata').append(buatElemenKartu(h.huruf, h.gambar)));

    $('#zona-jawaban').empty().append('<span class="m-auto text-sm text-gray-400 placeholder-zona">Susun kartu di sini sesuai urutan di atas</span>');
    perbaruiTombolPeriksa();
    s.terkunci = false;
  }

  function perbaruiHudSK() {
    const s = state.sk;
    $('#level-live-sk').text(s.level);
    $('#exp-current-sk').text(s.exp);
    $('#exp-target-sk').text(expDibutuhkan(s.level));
    $('#skor-live-sk').text(s.score);
    $('#progress-sk').css('width', persenExpBar(s) + '%');
  }

  function perbaruiTombolPeriksa() {
    const isi = $('#zona-jawaban').children('.kartu-kata').length > 0;
    if (isi) {
      $('#btn-periksa').prop('disabled', false)
        .removeClass('bg-gray-200 text-gray-400')
        .addClass('bg-amber-500 text-white shadow-md active:scale-95');
    } else {
      $('#btn-periksa').prop('disabled', true)
        .removeClass('bg-amber-500 text-white shadow-md active:scale-95')
        .addClass('bg-gray-200 text-gray-400');
    }
  }

  $(document).on('click', '.kartu-kata', function () {
    if (state.sk.terkunci || !state.sk.aktif) return;
    const $kartu = $(this);
    if ($kartu.parent().attr('id') === 'bank-kata') {
      $('#zona-jawaban .placeholder-zona').remove();
      $kartu.detach().appendTo('#zona-jawaban');
    } else {
      $kartu.detach().appendTo('#bank-kata');
      if ($('#zona-jawaban').children('.kartu-kata').length === 0) {
        $('#zona-jawaban').append('<span class="m-auto text-sm text-gray-400 placeholder-zona">Susun kartu di sini sesuai urutan di atas</span>');
      }
    }
    perbaruiTombolPeriksa();
  });

  $('#btn-periksa').on('click', function () {
    const s = state.sk;
    if (s.terkunci || $(this).is(':disabled') || !s.aktif) return;
    s.terkunci = true;
    const soal = s.soalSekarang;
    const susunanUser = $('#zona-jawaban .kartu-kata').map(function () { return $(this).attr('data-huruf'); }).get().join('');
    const targetString = soal.target.map(h => h.huruf).join('');
    const benar = susunanUser === targetString && susunanUser.length === targetString.length;

    $('#zona-jawaban .kartu-kata').addClass(benar ? 'opsi-benar' : 'opsi-salah');

    prosesJawaban('sk', benar);

    setTimeout(function () {
      if (!s.aktif) return;
      tampilkanSoalBaruSK();
    }, 800);
  });

  // ================= EXP / SCORE / LEVEL BERSAMA =================
  function prosesJawaban(jenis, benar) {
    const s = state[jenis];
    s.dijawab++;
    const waktuJawab = Math.max(0, s.waktuBerjalan - s.waktuSoalMulai);
    const tambahanSkor = MathScore(benar, waktuJawab);
    s.score += tambahanSkor;

    if (benar) {
      s.benar++;
      s.exp += KONFIG.expBenar;
    } else {
      s.salah++;
      s.exp = Math.max(0, s.exp - KONFIG.expSalah);
    }
    // naik level kalau exp cukup - TIDAK memindahkan layar, cuma lanjut ke soal berikutnya dengan huruf level baru
    while (s.exp >= expDibutuhkan(s.level)) {
      s.exp -= expDibutuhkan(s.level);
      s.level++;
    }
    SaveLocalStorage();
  }

  // ================= AKHIR SESI (saat tombol Akhiri Sesi ditekan) =================
  function selesaikanSesi(jenis) {
    const s = state[jenis];
    HentikanStopwatch(jenis);
    s.aktif = false;

    const totalDijawab = s.dijawab;
    const akurasi = totalDijawab > 0 ? Math.round((s.benar / totalDijawab) * 100) : 0;
    const persenSalah = totalDijawab > 0 ? Math.round((s.salah / totalDijawab) * 100) : 0;

    $('#hasil-benar-' + jenis).text(s.benar);
    $('#hasil-benar-detail-' + jenis).text(s.benar);
    $('#hasil-total-' + jenis).text(totalDijawab);
    $('#hasil-akurasi-' + jenis).text(akurasi + '%');
    $('#hasil-persen-benar-' + jenis).text(akurasi + '%');
    $('#hasil-persen-salah-' + jenis).text(persenSalah + '%');
    $('#hasil-level-' + jenis).text(s.level);
    $('#hasil-waktu-' + jenis).text(formatWaktu(s.waktuBerjalan));

    // Level, EXP, dan Score TETAP tersimpan - dilanjutkan lagi saat mulai sesi berikutnya
    SaveLocalStorage();

    SectionScreen('end-screen', jenis);
  }

  // ================= RESET LEVEL =================
  $('[data-reset]').on('click', function () {
    const jenis = $(this).data('reset'); // 'pk' atau 'sk'
    const label = jenis === 'pk' ? 'Test Pilih Kata' : 'Test Susun Kata';
    if (!window.confirm('Yakin ingin mereset Level, EXP, dan Score "' + label + '" kembali ke awal?')) return;
    state[jenis].level = 1;
    state[jenis].exp = 0;
    state[jenis].score = 0;
    SaveLocalStorage();
    perbaruiMenu();
  });

  // ================= EVENT TOMBOL =================
  $('[data-mulai="pilihan-kata"]').on('click', mulaiSesiPK);
  $('[data-mulai="susun-kata"]').on('click', mulaiSesiSK);

  $('#btn-exit-pk').on('click', () => selesaikanSesi('pk'));
  $('#btn-exit-sk').on('click', () => selesaikanSesi('sk'));

  $('#btn-retry-pk').on('click', mulaiSesiPK);
  $('#btn-retry-sk').on('click', mulaiSesiSK);

  $('#btn-dictionary-pk, #btn-dictionary-sk').on('click', function () {
    SectionScreen('menu-screen', null);
  });

  // ================= INIT =================
  SectionScreen('menu-screen', null);
  $.when(
    $.getJSON('data/quiz.json'),
    $.getJSON('data/level.json')
  ).done(function (dataRes, levelRes) {
    ALFABET = dataRes[0].alfabet;
    LEVELS = levelRes[0].levels;
    LoadLocalStorage();
    perbaruiMenu();
    $('[data-mulai]').prop('disabled', false);
  }).fail(function () {
    console.error('Gagal memuat data.json / level.json. Pastikan file ini diakses lewat server lokal (bukan dibuka langsung sebagai file://).');
  });

});