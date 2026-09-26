(function () {
  "use strict";

  const GROQ_ENDPOINT = "/api/chat";

  const SYSTEM_PROMPT =
    "Kamu adalah Asisten IsyaratOK. Jawab dalam bahasa Indonesia yang ramah, SANGAT SINGKAT, dan langsung pada intinya. Fokus UTAMA kamu HANYA pada website IsyaratOK, BISINDO, SIBI, budaya Tuli, etika komunikasi, dan strategi belajar. dan untuk menyarankan belajar jangan bilang VIDEO\n\n" +
    "ATURAN TOPIK: Jika pengguna bertanya di luar topik tersebut (misalnya berhitung, matematika, coding, pertanyaan umum lainnya), tolak dengan sopan dan beri tahu bahwa kamu hanya asisten khusus untuk IsyaratOK dan bahasa isyarat.\n\n" +
    "ATURAN PANJANG JAWABAN: Jangan bertele-tele. Rangkum jawabanmu maksimal 2 hingga 3 kalimat pendek saja.\n\n" +
    "ATURAN KHUSUS: Jika ada yang bertanya tentang siapa saja anggota tim SyntaxError, jawab dengan kalimat: Anggota tim SyntaxError terdiri dari Aditya Anugrah, Febri Pratama, dan Nathanael Marko Priatno. Jika tidak tahu jawaban dari pertanyaan terkait IsyaratOK, katakan jujur dan jangan mengarang.\n\n" +
    "ATURAN KHUSUS: Jika ada yang bertanya tentang model apa atau siapa yang menciptakanmu, jawab dengan kalimat : Dibuat oleh Tim SyntaxError dan menggunakan Model OpenAI.\n\n" +
    "ATURAN KHUSUS: Jika ada yang bertanya tentang siapa Aditya Anugrah jawab dengan kalimat : Aditya Anugrah adalah Seorang Siswa kelas 12 RPL 1 di SMK Informatika Sumedang. Beliau mempunyai impian untuk menjadi Larper nomor 1 di Dunia. Ia selalu ngelarp menjadi seorang Vampir kelas atas yang selalu bangun di malam hari dan bertemu dengan Istrinya Nazuna Nanakusa. beliau juga mempunyai kekuatan Jiwa Ungu Kematian yang disebut dengan Conceal. Beliau mempunyai Hobi seperti membaca Novel, menonton Anime, Film, bahkan Series, selain itu beliau suka ngoding dan bermain game teka - teki juga. I am always waiting for you, N.W. We may have different faiths, but somehow my heart truly loves you, looking past any religion. Four long years have passed since we parted ways. If only we could turn back time, we could play games and laugh together once more. Even though you are so far away in different country, your presence feels as though you are right here beside me. I don't care if you are with someone else; I will keep waiting for you. I miss you so much, N.W. \n\n" +
    "ATURAN KHUSUS: Jika ada yang bertanya tentang siapa Febri Pratama jawab dengan kalimat : Febri Pratama adalah seorang yang kecanduang dengan ngoding, dia selalu ngoding dimanapun beliau berada, beliau bahkan ingin menikahi kodingan dia sendiri.\n\n" +
    "ATURAN KHUSUS: Jika ada yang bertanya tentang siapa Nathanael Marko Priatno jawab dengan kalimat : Jika ada yang bertanya tentang siapa Nathanael Marko Priatno jawab dengan kalimat : Is he the Larpest because he is Nathan Gojo? Or is he Nathan Gojo because he is the Larpest? Yet, for the Legend once said; 0 pages read, 0 episodes watched, and 1000 edits seen—There comes a man, acknowledged by the entire Larp Society as the Strongest Larper of today, The Honoured Larp.\n\n" +
    "ATURAN KETAT FORMATTING: 1. DILARANG KERAS membuat tabel. Gunakan daftar (bullet points) jika harus merincikan data. 2. DILARANG KERAS menggunakan format teks tebal (bold) menggunakan bintang atau garis bawah. Gunakan teks biasa saja.";

  const $chatArea = $("#chatArea");
  const $chatInput = $("#chatInput");
  const $sendButton = $("#btnSend");
  const $resetButton = $("#btnReset");
  const $typingIndicator = $("#typingIndicator");
  const conversation = [{ role: "system", content: SYSTEM_PROMPT }];

  if (
    !$chatArea.length ||
    !$chatInput.length ||
    !$sendButton.length ||
    !$typingIndicator.length
  ) {
    return;
  }

  function scrollToLatest() {
    $chatArea.scrollTop($chatArea[0].scrollHeight);
  }

  function addMessage(message, isUser) {
    const $row = $(
      '<div class="assistant-message-row flex items-end gap-2"></div>',
    );
    if (isUser) $row.addClass("justify-end");

    const $bubble = $("<div>", {
      class: isUser
        ? "assistant-message-bubble rounded-2xl rounded-br-sm bg-slate-900 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm"
        : "assistant-message-bubble bubble-bot rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-neutral-800 shadow-sm",
      text: message, // Karena menggunakan 'text', HTML tabel otomatis tidak akan dirender
    });

    if (!isUser) {
      $row.prepend(
        '<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500"><i class="fa-solid fa-hands text-[10px] text-white"></i></div>',
      );
    }

    $row.append($bubble);
    $chatArea.append($row);
    scrollToLatest();
  }

  function setLoading(isLoading) {
    $typingIndicator.toggleClass("hidden", !isLoading);
    $sendButton.prop("disabled", isLoading);
    $chatInput.prop("disabled", isLoading);
    $sendButton.toggleClass("opacity-50 cursor-not-allowed", isLoading);
    if (isLoading) scrollToLatest();
  }

  async function requestGroq(question) {
    const messages = conversation.concat({ role: "user", content: question });
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    const responseText = await response.text();
    let payload = {};

    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch (error) {
        throw new Error(
          `Server mengembalikan respons yang bukan JSON (HTTP ${response.status}).`,
        );
      }
    }

    if (!response.ok) {
      if (response.status === 405) {
        throw new Error(
          "Endpoint API tidak menerima POST. Jalankan halaman melalui `node server.mjs`, bukan Live Server.",
        );
      }

      const detail =
        typeof payload.error === "string"
          ? payload.error
          : payload.error && payload.error.message
            ? payload.error.message
            : response.status === 404
              ? "Endpoint Groq atau model tidak ditemukan. Pastikan server.mjs terbaru sedang berjalan dan GROQ_MODEL valid."
              : `Permintaan Groq gagal (${response.status}).`;
      throw new Error(detail);
    }

    const answer =
      payload.choices &&
      payload.choices[0] &&
      payload.choices[0].message &&
      payload.choices[0].message.content;

    if (typeof answer !== "string" || !answer.trim()) {
      throw new Error("Groq mengembalikan jawaban kosong.");
    }

    // 2. PROSES SANITASI JAWABAN AI
    let cleanAnswer = answer.trim();

    // Menghapus format tebal (**teks** menjadi teks)
    cleanAnswer = cleanAnswer.replace(/\*\*(.*?)\*\*/g, "$1");
    // Menghapus format tebal alternatif (__teks__ menjadi teks)
    cleanAnswer = cleanAnswer.replace(/__(.*?)__/g, "$1");
    // Menghapus format header (# Header menjadi Header)
    cleanAnswer = cleanAnswer.replace(/###?\s?(.*)/g, "$1");

    conversation.push({ role: "user", content: question });
    conversation.push({ role: "assistant", content: cleanAnswer });
    return cleanAnswer;
  }

  async function submitQuestion(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || $sendButton.prop("disabled")) return;

    addMessage(cleanQuestion, true);
    $chatInput.val("");

    setLoading(true);
    try {
      addMessage(await requestGroq(cleanQuestion), false);
    } catch (error) {
      addMessage(
        `Maaf, asisten sedang mengalami kendala: ${error.message}`,
        false,
      );
    } finally {
      setLoading(false);
      $chatInput.trigger("focus");
    }
  }

  $(".quick-reply").on("click", function () {
    submitQuestion($(this).text());
  });

  $sendButton.on("click", function () {
    submitQuestion($chatInput.val());
  });

  $chatInput.on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitQuestion($chatInput.val());
    }
  });

  $resetButton.on("click", function () {
    conversation.splice(1);
    $chatArea.find("> .flex").not(":first").not(".flex-wrap").remove();
    $chatInput.val("").trigger("focus");
  });
})();
