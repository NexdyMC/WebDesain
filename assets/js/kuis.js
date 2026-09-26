$(function() {
  
  // ================= KONFIGURASI =================
  const KONFIG = {
    modeWaktu: 'countdown', // 'countdown' atau 'stopwatch'
    durasiDetik: 300,
    expBenar: 5,
    expSalah: 5,
    skorBenar: 10
  };
  let ALFABET = [];
  let state = {
    pk: buatStateAwal(),
    sk: buatStateAwal()
  };

  function buatStateAwal() {
    return {
      level: 1,
      exp: 0,
      score: 0,
      benar: 0,
      salah: 0,
      dijawab: 0,
      timerId: null,
      sisaDetik: KONFIG.durasiDetik,
      jalanDetik: 0,
      terkunci: false,
      aktif: false,
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

  function randomInt(n) {
    return Math.floor(Math.random() * n);
  }

  function expDibutuhkan(level) {
    return 30 + (level - 1) * 5;
  }
  // Ambil jendela 5 huruf sesuai pola level: L1 A-E, L2 C-G, L3 E-I, dst (siklus alfabet)
  function jendelaHuruf(level) {
    const mulai = ((level - 1) * 2) % 26;
    const hasil = [];
    for (let i = 0; i < 5; i++) hasil.push(ALFABET[(mulai + i) % 26]);
    return hasil;
  }
  
  // ================= LOCAL STORAGE (key: "kuis") =================
  function simpanProgress() {
    const data = [{
      mode: 'pilih kata',
      level: state.pk.level,
      exp: state.pk.exp,
      stopwatch: KONFIG.durasiDetik
    }, {
      mode: 'susun kata',
      level: state.sk.level,
      exp: state.sk.exp,
      stopwatch: KONFIG.durasiDetik
    }];
    localStorage.setItem('kuis', JSON.stringify(data));
  }

  function muatProgress() {
    try {
      const data = JSON.parse(localStorage.getItem('kuis'));
      if (Array.isArray(data)) {
        const pk = data.find(d => d.mode === 'pilih kata');
        const sk = data.find(d => d.mode === 'susun kata');
        if (pk) {
          state.pk.level = pk.level || 1;
          state.pk.exp = pk.exp || 0;
        }
        if (sk) {
          state.sk.level = sk.level || 1;
          state.sk.exp = sk.exp || 0;
        }
      }
    } catch (e) {
      /* localStorage kosong/rusak, pakai default */ }
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
    // 1) tampilkan hanya satu dari 3 screen utama
    $('#menu-screen, #play-screen, #end-screen').hide();
    $('#' + idHalaman).show();
    // 2) di dalam play-screen / end-screen, tampilkan hanya kartu sesuai modeGame
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
  
  // ================= TIMER =================
  function mulaiTimer(jenis) {
    const s = state[jenis];
    clearInterval(s.timerId);
    s.aktif = true;
    if (KONFIG.modeWaktu === 'countdown') s.sisaDetik = KONFIG.durasiDetik;
    else s.jalanDetik = 0;
    perbaruiTampilanWaktu(jenis);
    s.timerId = setInterval(function() {
      if (KONFIG.modeWaktu === 'countdown') {
        s.sisaDetik--;
        if (s.sisaDetik <= 0) {
          s.sisaDetik = 0;
          perbaruiTampilanWaktu(jenis);
          selesaikanSesi(jenis);
          return;
        }
      } else {
        s.jalanDetik++;
      }
      perbaruiTampilanWaktu(jenis);
    }, 1000);
  }

  function formatWaktu(total) {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const dt = Math.floor(total % 60).toString().padStart(2, '0');
    return m + ':' + dt;
  }

  function perbaruiTampilanWaktu(jenis) {
    const s = state[jenis];
    const nilai = KONFIG.modeWaktu === 'countdown' ? s.sisaDetik : s.jalanDetik;
    $(jenis === 'pk' ? '#timer-display-pk' : '#timer-display-sk').text(formatWaktu(nilai));
  }
  
  // ================= PILIHAN KATA (satu soal per saat, berjalan terus sampai waktu habis) =================
  function buatSatuSoalPK(level) {
    const jendela = jendelaHuruf(level);
    const benar = jendela[randomInt(jendela.length)];
    let kandidat = acak(jendela.filter(h => h.huruf !== benar.huruf));
    let distraktor = kandidat.slice(0, 3);
    while (distraktor.length < 3) {
      const c = ALFABET[randomInt(ALFABET.length)];
      if (c.huruf !== benar.huruf && !distraktor.find(d => d.huruf === c.huruf)) distraktor.push(c);
    }
    const opsi = acak([benar].concat(distraktor));
    return {
      gambar: benar.gambar,
      jawaban: benar.huruf,
      opsi: opsi.map(o => o.huruf)
    };
  }

  function mulaiSesiPK() {
    const s = state.pk;
    s.score = 0;
    s.benar = 0;
    s.salah = 0;
    s.dijawab = 0;
    s.terkunci = false;
    tampilkanSoalBaruPK();
    SectionScreen('play-screen', 'pk');
    mulaiTimer('pk');
  }

  function tampilkanSoalBaruPK() {
    const s = state.pk;
    s.soalSekarang = buatSatuSoalPK(s.level);
    perbaruiHudPK();
    $('#soal-gambar-pk').html('<img class="letter-img" src="' + s.soalSekarang.gambar + '" alt="isyarat">');
    $('.opsi-pk').each(function(i) {
      const huruf = s.soalSekarang.opsi[i];
      $(this).attr('data-jawaban', huruf).removeClass('opsi-benar opsi-salah').find('.teks-opsi').text('Isyarat ' + huruf);
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
  $(document).on('click', '.opsi-pk', function() {
    const s = state.pk;
    if (s.terkunci || !s.aktif) return;
    s.terkunci = true;
    const soal = s.soalSekarang;
    const dipilih = $(this).attr('data-jawaban');
    const benar = dipilih === soal.jawaban;
    $('.opsi-pk').each(function() {
      const h = $(this).attr('data-jawaban');
      if (h === soal.jawaban) {
        $(this).addClass('opsi-benar');
        $(this).find('.check-icon').css('opacity', 1);
      } else if (h === dipilih && !benar) {
        $(this).addClass('opsi-salah');
      }
    });
    prosesJawaban('pk', benar);
    setTimeout(function() {
      if (!s.aktif) return;
      tampilkanSoalBaruPK();
    }, 700);
  });
  
  // ================= SUSUN KATA (satu soal per saat, tipe soal/jawaban konsisten - tidak dicampur) =================
  function buatSatuSoalSK(level) {
    const jendela = jendelaHuruf(level);
    const panjang = 2 + randomInt(3); // 3..5 huruf
    const dipilih = acak(jendela).slice(0, panjang);
    const target = dipilih.slice().sort((a, b) => a.huruf.localeCompare(b.huruf));
    // Tipe soal & jawaban dipilih SEKALI per soal, lalu konsisten untuk semua kartu:
    // kalau soal berupa gambar -> semua kartu jawaban berupa teks, dan sebaliknya
    const tipeSoal = Math.random() < 0.5 ? 'gambar' : 'teks';
    const tipeJawaban = tipeSoal === 'gambar' ? 'teks' : 'gambar';
    const bank = acak(target);
    return {target, tipeSoal, tipeJawaban, bank};
  }

  function mulaiSesiSK() {
    const s = state.sk;
    s.score = 0;
    s.benar = 0;
    s.salah = 0;
    s.dijawab = 0;
    s.terkunci = false;
    tampilkanSoalBaruSK();
    SectionScreen('play-screen', 'sk');
    mulaiTimer('sk');
  }

  function buatElemenKartu(huruf, gambar, tipe) {
    const $el = $('<button type="button"></button>').addClass('kartu-kata px-3 py-2 sm:px-4 sm:py-3 text-2xl font-bold text-gray-900 transition-transform bg-white border-2 shadow-sm cursor-pointer border-amber-400 rounded-xl active:scale-95 flex items-center justify-center').attr('data-huruf', huruf);
    if (tipe === 'gambar') {
      $el.append('<img class="object-contain w-10 h-10 sm:w-12 sm:h-12 rounded-md" src="' + gambar + '" alt="' + huruf + '">');
    } else {
      $el.text(huruf);
    }
    return $el;
  }

  function tampilkanSoalBaruSK() {
    const s = state.sk;
    s.soalSekarang = buatSatuSoalSK(s.level);
    perbaruiHudSK();
    const soal = s.soalSekarang;
    const $target = $('#soal-target-sk').empty();
    if (soal.tipeSoal === 'gambar') {
      soal.target.forEach(h => {
        $target.append('<img class="object-contain w-12 h-12 p-1 bg-white border rounded-lg sm:w-16 sm:h-16 border-amber-300" src="' + h.gambar + '" alt="' + h.huruf + '">');
      });
    } else {
      $target.append('<span class="text-3xl font-extrabold tracking-widest text-gray-900 sm:text-4xl">' + soal.target.map(h => h.huruf).join(' ') + '</span>');
    }
    $('#bank-kata').empty();
    soal.bank.forEach(h => $('#bank-kata').append(buatElemenKartu(h.huruf, h.gambar, soal.tipeJawaban)));
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
      $('#btn-periksa').prop('disabled', false).removeClass('bg-gray-200 text-gray-400').addClass('bg-amber-500 text-white shadow-md active:scale-95');
    } else {
      $('#btn-periksa').prop('disabled', true).removeClass('bg-amber-500 text-white shadow-md active:scale-95').addClass('bg-gray-200 text-gray-400');
    }
  }

  $(document).on('click', '.kartu-kata', function() {
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
  $('#btn-periksa').on('click', function() {
    const s = state.sk;
    if (s.terkunci || $(this).is(':disabled') || !s.aktif) return;
    s.terkunci = true;
    const soal = s.soalSekarang;
    const susunanUser = $('#zona-jawaban .kartu-kata').map(function() {
      return $(this).attr('data-huruf');
    }).get().join('');
    const targetString = soal.target.map(h => h.huruf).join('');
    const benar = susunanUser === targetString && susunanUser.length === targetString.length;
    $('#zona-jawaban .kartu-kata').addClass(benar ? 'opsi-benar' : 'opsi-salah');
    prosesJawaban('sk', benar);
    setTimeout(function() {
      if (!s.aktif) return;
      tampilkanSoalBaruSK();
    }, 800);
  });
  
  // ================= EXP / SCORE / LEVEL BERSAMA =================
  function prosesJawaban(jenis, benar) {
    const s = state[jenis];
    s.dijawab++;
    if (benar) {
      s.benar++;
      s.score += KONFIG.skorBenar;
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
    simpanProgress();
  }
  
  // ================= AKHIR SESI (hanya saat waktu habis / Akhiri Sesi) =================
  function selesaikanSesi(jenis) {
    const s = state[jenis];
    s.aktif = false;
    clearInterval(s.timerId);
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
    // EXP direset ke 0 di layar akhir sesi, level tetap
    s.exp = 0;
    simpanProgress();
    SectionScreen('end-screen', jenis);
  }
  
  // ================= RESET LEVEL =================
  $('[data-reset]').on('click', function() {
    const jenis = $(this).data('reset'); // 'pk' atau 'sk'
    const label = jenis === 'pk' ? 'Test Pilih Kata' : 'Test Susun Kata';
    if (!window.confirm('Yakin ingin mereset Level & EXP "' + label + '" kembali ke Level 1?')) return;
    state[jenis].level = 1;
    state[jenis].exp = 0;
    state[jenis].score = 0;
    simpanProgress();
    perbaruiMenu();
  });
  
  // ================= EVENT TOMBOL =================
  $('[data-mulai="pilihan-kata"]').on('click', mulaiSesiPK);
  $('[data-mulai="susun-kata"]').on('click', mulaiSesiSK);
  $('#btn-exit-pk').on('click', () => selesaikanSesi('pk'));
  $('#btn-exit-sk').on('click', () => selesaikanSesi('sk'));
  $('#btn-retry-pk').on('click', mulaiSesiPK);
  $('#btn-retry-sk').on('click', mulaiSesiSK);
  $('#btn-dictionary-pk, #btn-dictionary-sk').on('click', function() {
    SectionScreen('menu-screen', null);
  });
  
  // ================= INIT =================
  SectionScreen('menu-screen', null);
  $.getJSON('data.json', function(data) {
    ALFABET = data.alfabet;
    muatProgress();
    perbaruiMenu();
    $('[data-mulai]').prop('disabled', false);
  }).fail(function() {
    console.error('Gagal memuat data.json. Pastikan file ini diakses lewat server lokal (bukan dibuka langsung sebagai file://).');
  });
});