$(function () {

  // ================= CONFIGURATION =================
  const KONFIG = {
    expBenar: 5,
    expSalah: 5,
    poinDasarBenar: 100,
    batasWaktuIdeal: 15,
    poinPerDetik: 10
  };

  let KOSAKATA = {};    // Loaded from assets/data/quiz.json.
  let LEVELS = [];      // Loaded from assets/data/level.json.

  let sistemAktif = 'BISINDO'; // Global selection; it can only change from the menu screen.

  // Store progress separately for each mode (pk/sk) and sign system (BISINDO/SIBI).
  let state = {
    pk: { BISINDO: buatStateAwal(), SIBI: buatStateAwal() },
    sk: { BISINDO: buatStateAwal(), SIBI: buatStateAwal() }
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

  // Return the mode state for the active sign system.
  // A session keeps its starting system so menu changes cannot affect an active game.
  function S(mode) {
    return state[mode][sistemAktif];
  }

  // ================= UTILITIES =================
  function acak(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function randomInt(n) { return Math.floor(Math.random() * n); }

  // ================= VOCABULARY DATA =================
  function daftarKosakata(sistem, jenis) {
    return (KOSAKATA[sistem] && KOSAKATA[sistem][jenis]) ? KOSAKATA[sistem][jenis] : [];
  }

  function cariItem(sistem, jenis, key) {
    return daftarKosakata(sistem, jenis).find(x => x.key === key);
  }

  // ================= LEVEL DATA =================
  function hitungExpTargetFallback(level) {
    return 30 + 5 * Math.floor((level - 1) / 2);
  }

  function hitungJendelaFallback(sistem, jenis, level) {
    const daftar = daftarKosakata(sistem, jenis);
    if (!daftar.length) return []; // Data may not be ready during the initial load.
    const mulai = ((level - 1) * 3) % daftar.length;
    const hasil = [];
    for (let i = 0; i < 5; i++) hasil.push(daftar[(mulai + i) % daftar.length].key);
    return hasil;
  }

  function ambilDataLevel(sistem, level) {
    const jenis = 'Alphabet'; // Only alphabet questions are currently enabled.
    const ada = LEVELS.find(l => l.sistem === sistem && l.level === level && l.jenis === jenis);
    if (ada) return ada;
    // Calculate levels beyond level.json automatically.
    return { level: level, sistem: sistem, jenis: jenis, soal: hitungJendelaFallback(sistem, jenis, level), exp: hitungExpTargetFallback(level) };
  }

  function hurufKeObjekGambar(sistem, jenis, hurufArr) {
    return hurufArr.map(k => cariItem(sistem, jenis, k)).filter(Boolean);
  }

  function expDibutuhkan(sistem, level) {
    return ambilDataLevel(sistem, level).exp;
  }

  // ================= LOCAL STORAGE =================
  function SaveLocalStorage() {
    const data = [];
    ['pk', 'sk'].forEach(mode => {
      ['BISINDO', 'SIBI'].forEach(sis => {
        const s = state[mode][sis];
        data.push({
          mode: mode === 'pk' ? 'pilih kata' : 'susun kata',
          sistem: sis,
          level: s.level, exp: s.exp, score: s.score
        });
      });
    });
    localStorage.setItem('kuis', JSON.stringify(data));
  }

  function LoadLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('kuis'));
      if (Array.isArray(data)) {
        data.forEach(d => {
          const mode = d.mode === 'pilih kata' ? 'pk' : (d.mode === 'susun kata' ? 'sk' : null);
          if (mode && state[mode][d.sistem]) {
            state[mode][d.sistem].level = d.level || 1;
            state[mode][d.sistem].exp = d.exp || 0;
            state[mode][d.sistem].score = d.score || 0;
          }
        });
      }
    } catch (e) { /* Use defaults when local storage is empty or invalid. */ }
  }

  function perbaruiMenu() {
    const pk = S('pk'), sk = S('sk');
    $('[data-level-for="pk"]').text(pk.level);
    $('[data-exp-for="pk"]').text(pk.exp);
    $('[data-exp-target-for="pk"]').text(expDibutuhkan(sistemAktif, pk.level));
    $('[data-score-for="pk"]').text(pk.score);
    $('[data-bar-for="pk"]').css('width', persenExpBar(sistemAktif, pk) + '%');

    $('[data-level-for="sk"]').text(sk.level);
    $('[data-exp-for="sk"]').text(sk.exp);
    $('[data-exp-target-for="sk"]').text(expDibutuhkan(sistemAktif, sk.level));
    $('[data-score-for="sk"]').text(sk.score);
    $('[data-bar-for="sk"]').css('width', persenExpBar(sistemAktif, sk) + '%');
  }

  function persenExpBar(sistem, s) {
    const butuh = expDibutuhkan(sistem, s.level);
    return Math.max(4, Math.min(100, Math.round((s.exp / butuh) * 100)));
  }

  // ================= SIGN SYSTEM TOGGLE =================
  $('.sistem-toggle-btn').on('click', function () {
    const pilihan = $(this).data('sistem');
    if (pilihan === sistemAktif) return;
    sistemAktif = pilihan;

    $('.sistem-toggle-btn').removeClass('bg-white shadow text-gray-900').addClass('text-gray-500');
    $(this).removeClass('text-gray-500').addClass('bg-white shadow text-gray-900');

    $('#quiz-app').toggleClass('theme-sibi', sistemAktif === 'SIBI');

    perbaruiMenu();
  });

  // ================= SCREEN SELECTION =================
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

  // ================= STOPWATCH =================
  function RunStopwatch(mode) {
    const s = S(mode);
    clearInterval(s.timerId);
    s.aktif = true;
    s.waktuBerjalan = 0;
    perbaruiTampilanWaktu(mode);
    s.timerId = setInterval(function () {
      s.waktuBerjalan++;
      perbaruiTampilanWaktu(mode);
    }, 1000);
  }

  function HentikanStopwatch(mode) {
    clearInterval(S(mode).timerId);
  }

  function formatWaktu(total) {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const dt = Math.floor(total % 60).toString().padStart(2, '0');
    return m + ':' + dt;
  }

  function perbaruiTampilanWaktu(mode) {
    $(mode === 'pk' ? '#timer-display-pk' : '#timer-display-sk').text(formatWaktu(S(mode).waktuBerjalan));
  }

  // ================= SCORE CALCULATION =================
  function MathScore(benar, waktuJawabDetik) {
    if (!benar) return 0;
    const bonus = Math.max(0, (KONFIG.batasWaktuIdeal - waktuJawabDetik) * KONFIG.poinPerDetik);
    return KONFIG.poinDasarBenar + bonus;
  }

  // ================= WORD CHOICE =================
  function buatSatuSoalPK(sistem, level) {
    const dataLevel = ambilDataLevel(sistem, level);
    const jendela = hurufKeObjekGambar(sistem, dataLevel.jenis, dataLevel.soal);
    const benar = jendela[randomInt(jendela.length)];
    let kandidat = acak(jendela.filter(h => h.key !== benar.key));
    let distraktor = kandidat.slice(0, 3);
    const semua = daftarKosakata(sistem, dataLevel.jenis);
    while (distraktor.length < 3 && semua.length) {
      const c = semua[randomInt(semua.length)];
      if (c.key !== benar.key && !distraktor.find(d => d.key === c.key)) distraktor.push(c);
    }
    const opsi = acak([benar].concat(distraktor));
    const tipeSoal = Math.random() < 0.5 ? 'gambar' : 'teks';
    const tipeJawaban = tipeSoal === 'gambar' ? 'teks' : 'gambar';
    return { jenis: dataLevel.jenis, tipeSoal: tipeSoal, tipeJawaban: tipeJawaban, benar: benar, opsi: opsi };
  }

  function mulaiSesiPK() {
    const s = S('pk');
    s.benar = 0; s.salah = 0; s.dijawab = 0; s.terkunci = false;
    $('html, body').animate({
      scrollTop: $('#play-screen').offset().top
    }, 50);
    tampilkanSoalBaruPK();
    SectionScreen('play-screen', 'pk');
    RunStopwatch('pk');
  }

  function tampilkanSoalBaruPK() {
    const s = S('pk');
    s.soalSekarang = buatSatuSoalPK(sistemAktif, s.level);
    s.waktuSoalMulai = s.waktuBerjalan;
    perbaruiHudPK();
    const soal = s.soalSekarang;
    $('#judul-quiz-pk').text(soal.jenis);

    if (soal.tipeSoal === 'gambar') {
      $('#soal-gambar-pk').html('<img class="letter-img" src="' + soal.benar.image + '" alt="isyarat">');
    } else {
      $('#soal-gambar-pk').html('<span class="text-6xl font-extrabold tema-text sm:text-7xl">' + soal.benar.key + '</span>');
    }

    $('.opsi-pk').each(function (i) {
      const item = soal.opsi[i];
      $(this).attr('data-jawaban', item.key).removeClass('opsi-benar opsi-salah');
      const $isi = $(this).find('.teks-opsi').empty();
      if (soal.tipeJawaban === 'gambar') {
        $isi.append('<img src="' + item.image + '" alt="' + item.key + '" class="object-contain w-14 h-14 sm:w-16 sm:h-16">');
      } else {
        $isi.text('Isyarat ' + item.key);
      }
      $(this).find('.check-icon').css('opacity', 0);
    });
    s.terkunci = false;
  }

  function perbaruiHudPK() {
    const s = S('pk');
    $('#level-live-pk').text(s.level);
    $('#exp-current-pk').text(s.exp);
    $('#exp-target-pk').text(expDibutuhkan(sistemAktif, s.level));
    $('#skor-live-pk').text(s.score);
    $('#progress-pk').css('width', persenExpBar(sistemAktif, s) + '%');
  }

  $(document).on('click', '.opsi-pk', function () {
    const s = S('pk');
    if (s.terkunci || !s.aktif) return;
    s.terkunci = true;
    const soal = s.soalSekarang;
    const dipilih = $(this).attr('data-jawaban');
    const benar = dipilih === soal.benar.key;

    $('.opsi-pk').each(function () {
      const h = $(this).attr('data-jawaban');
      if (h === soal.benar.key) { $(this).addClass('opsi-benar'); $(this).find('.check-icon').css('opacity', 1); }
      else if (h === dipilih && !benar) { $(this).addClass('opsi-salah'); }
    });

    prosesJawaban('pk', benar);

    setTimeout(function () {
      if (!s.aktif) return;
      tampilkanSoalBaruPK();
    }, 700);
  });

  // ================= WORD ORDER =================
  function buatSatuSoalSK(sistem, level) {
    const dataLevel = ambilDataLevel(sistem, level);
    const jendela = hurufKeObjekGambar(sistem, dataLevel.jenis, dataLevel.soal);
    const panjang = 2 + randomInt(3); // 3 to 5 letters
    const dipilih = acak(jendela).slice(0, panjang);
    const target = dipilih.slice().sort((a, b) => a.key.localeCompare(b.key));
    const tipeSoal = Math.random() < 0.5 ? 'gambar' : 'teks';
    const tipeJawaban = tipeSoal === 'gambar' ? 'teks' : 'gambar';
    const bank = acak(target);
    return { jenis: dataLevel.jenis, tipeSoal: tipeSoal, tipeJawaban: tipeJawaban, target: target, bank: bank };
  }

  function mulaiSesiSK() {
    const s = S('sk');
    $('html, body').animate({
      scrollTop: $('#play-screen').offset().top
    }, 50);
    s.benar = 0; s.salah = 0; s.dijawab = 0; s.terkunci = false;
    tampilkanSoalBaruSK();
    SectionScreen('play-screen', 'sk');
    RunStopwatch('sk');
  }

  function buatElemenKartu(item, tipe) {
    const $el = $('<button type="button"></button>')
      .addClass('kartu-kata tema-border flex items-center justify-center p-3 text-gray-900 transition-transform bg-white border-2 shadow-sm cursor-pointer rounded-xl active:scale-95')
      .attr('data-huruf', item.key);
    if (tipe === 'gambar') {
      $el.append('<img src="' + item.image + '" alt="' + item.key + '" class="object-contain w-12 h-12 sm:w-14 sm:h-14 rounded-md">');
    } else {
      $el.append('<span class="text-2xl font-bold sm:text-3xl">' + item.key + '</span>');
    }
    return $el;
  }

  function tampilkanSoalBaruSK() {
    const s = S('sk');
    s.soalSekarang = buatSatuSoalSK(sistemAktif, s.level);
    s.waktuSoalMulai = s.waktuBerjalan;
    perbaruiHudSK();
    const soal = s.soalSekarang;
    $('#judul-quiz-sk').text(soal.jenis);

    const $target = $('#soal-target-sk').empty();
    soal.target.forEach(h => {
      if (soal.tipeSoal === 'gambar') {
        $target.append('<img src="' + h.image + '" alt="' + h.key + '" class="object-contain w-14 h-14 p-1 bg-white border rounded-lg sm:w-16 sm:h-16 tema-border">');
      } else {
        $target.append('<span class="flex items-center justify-center w-12 h-12 text-2xl font-extrabold bg-white border rounded-lg sm:w-16 sm:h-16 sm:text-3xl tema-border tema-text">' + h.key + '</span>');
      }
    });

    $('#bank-kata').empty();
    soal.bank.forEach(h => $('#bank-kata').append(buatElemenKartu(h, soal.tipeJawaban)));

    $('#zona-jawaban').empty().append('<span class="m-auto text-sm text-gray-400 placeholder-zona">Susun kartu di sini sesuai urutan di atas</span>');
    perbaruiTombolPeriksa();
    s.terkunci = false;
  }

  function perbaruiHudSK() {
    const s = S('sk');
    $('#level-live-sk').text(s.level);
    $('#exp-current-sk').text(s.exp);
    $('#exp-target-sk').text(expDibutuhkan(sistemAktif, s.level));
    $('#skor-live-sk').text(s.score);
    $('#progress-sk').css('width', persenExpBar(sistemAktif, s) + '%');
  }

  function perbaruiTombolPeriksa() {
    const isi = $('#zona-jawaban').children('.kartu-kata').length > 0;
    if (isi) {
      $('#btn-periksa').prop('disabled', false)
        .removeClass('bg-gray-200 text-gray-400')
        .addClass('tema-solid text-white shadow-md active:scale-95');
    } else {
      $('#btn-periksa').prop('disabled', true)
        .removeClass('tema-solid text-white shadow-md active:scale-95')
        .addClass('bg-gray-200 text-gray-400');
    }
  }

  $(document).on('click', '.kartu-kata', function () {
    if (S('sk').terkunci || !S('sk').aktif) return;
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
    const s = S('sk');
    if (s.terkunci || $(this).is(':disabled') || !s.aktif) return;
    s.terkunci = true;
    const soal = s.soalSekarang;
    const susunanUser = $('#zona-jawaban .kartu-kata').map(function () { return $(this).attr('data-huruf'); }).get().join('');
    const targetString = soal.target.map(h => h.key).join('');
    const benar = susunanUser === targetString && susunanUser.length === targetString.length;

    $('#zona-jawaban .kartu-kata').addClass(benar ? 'opsi-benar' : 'opsi-salah');

    prosesJawaban('sk', benar);

    setTimeout(function () {
      if (!s.aktif) return;
      tampilkanSoalBaruSK();
    }, 800);
  });

  // ================= EXPERIENCE, SCORE, AND LEVEL =================
  function prosesJawaban(mode, benar) {
    const s = S(mode);
    s.dijawab++;
    const waktuJawab = Math.max(0, s.waktuBerjalan - s.waktuSoalMulai);
    s.score += MathScore(benar, waktuJawab);

    if (benar) {
      s.benar++;
      s.exp += KONFIG.expBenar;
    } else {
      s.salah++;
      s.exp = Math.max(0, s.exp - KONFIG.expSalah);
    }
    // Level up without changing screens; continue with questions for the new level.
    while (s.exp >= expDibutuhkan(sistemAktif, s.level)) {
      s.exp -= expDibutuhkan(sistemAktif, s.level);
      s.level++;
    }
    SaveLocalStorage();
  }

  // ================= SESSION END =================
  function selesaikanSesi(mode) {
    const s = S(mode);
    HentikanStopwatch(mode);
    s.aktif = false;

    const totalDijawab = s.dijawab;
    const akurasi = totalDijawab > 0 ? Math.round((s.benar / totalDijawab) * 100) : 0;
    const persenSalah = totalDijawab > 0 ? Math.round((s.salah / totalDijawab) * 100) : 0;

    $('#hasil-benar-' + mode).text(s.benar);
    $('#hasil-benar-detail-' + mode).text(s.benar);
    $('#hasil-total-' + mode).text(totalDijawab);
    $('#hasil-akurasi-' + mode).text(akurasi + '%');
    $('#hasil-persen-benar-' + mode).text(akurasi + '%');
    $('#hasil-persen-salah-' + mode).text(persenSalah + '%');
    $('#hasil-level-' + mode).text(s.level);
    $('#hasil-waktu-' + mode).text(formatWaktu(s.waktuBerjalan));

    // Keep level, EXP, and score for the next session.
    SaveLocalStorage();

    SectionScreen('end-screen', mode);
  }

  // ================= LEVEL RESET =================
  $('[data-reset]').on('click', function () {
    const mode = $(this).data('reset'); // 'pk' or 'sk'
    const label = mode === 'pk' ? 'Test Pilih Kata' : 'Test Susun Kata';
    if (!window.confirm('Yakin ingin mereset Level, EXP, dan Score "' + label + '" (' + sistemAktif + ') kembali ke awal?')) return;
    S(mode).level = 1;
    S(mode).exp = 0;
    S(mode).score = 0;
    SaveLocalStorage();
    perbaruiMenu();
  });

  // ================= BUTTON EVENTS =================
  $('[data-mulai="pilihan-kata"]').on('click', mulaiSesiPK);
  $('[data-mulai="susun-kata"]').on('click', mulaiSesiSK);

  $('#btn-exit-pk').on('click', () => selesaikanSesi('pk'));
  $('#btn-exit-sk').on('click', () => selesaikanSesi('sk'));

  $('#btn-retry-pk').on('click', mulaiSesiPK);
  $('#btn-retry-sk').on('click', mulaiSesiSK);

  $('#btn-dictionary-pk, #btn-dictionary-sk').on('click', function () {
    SectionScreen('menu-screen', null);
  });

  // ================= INITIALIZATION =================
  SectionScreen('menu-screen', null);
  $.when(
    $.getJSON('assets/data/quiz.json'),
    $.getJSON('assets/data/level.json')
  ).done(function (dataRes, levelRes) {
    KOSAKATA = dataRes[0];
    LEVELS = levelRes[0].levels;
    LoadLocalStorage();
    perbaruiMenu();
    $('[data-mulai]').prop('disabled', false);
  }).fail(function () {
    console.error('Gagal memuat assets/data/quiz.json / assets/data/level.json. Pastikan file ini diakses lewat server lokal (bukan dibuka langsung sebagai file://).');
  });

});