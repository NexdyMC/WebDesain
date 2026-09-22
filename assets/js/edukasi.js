$(function () {
  "use strict";

  let activeCategory = "semua";
  const $tabButtons = $(".tab-btn");
  const $items = $(".modul-item");
  const $searchInput = $("#searchInput");
  const $noResultsMsg = $("#noResultsMessage");
  const $resultCount = $("#modulCount");

  function updateClearButton() {
    const hasSearchValue = $searchInput.val().trim().length > 0;
    $("#clearSearchBtn").toggleClass("hidden", !hasSearchValue);
  }

  function applyFilters() {
    const searchValue = $searchInput.val().toLowerCase().trim();
    updateClearButton();
    let visibleCount = 0;

    $items.each(function () {
      const $card = $(this);
      const category = $card.data("category");
      const title = ($card.find(".modul-title").text() || "").toLowerCase();
      const desc = ($card.find(".modul-desc").text() || "").toLowerCase();
      const keywords = ($card.data("keywords") || "").toLowerCase();

      const matchesCategory =
        activeCategory === "semua" || category === activeCategory;
      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        desc.includes(searchValue) ||
        keywords.includes(searchValue);

      if (matchesCategory && matchesSearch) {
        $card.removeClass("hidden").addClass("flex");
        visibleCount++;
      } else {
        $card.addClass("hidden").removeClass("flex");
      }
    });

    if ($resultCount.length) {
      $resultCount.text(`${visibleCount} modul ditemukan`);
    }

    if (visibleCount === 0) {
      $noResultsMsg.removeClass("hidden");
    } else {
      $noResultsMsg.addClass("hidden");
    }
  }

  $tabButtons.on("click", function () {
    activeCategory = $(this).data("filter");

    $tabButtons
      .removeClass("bg-orange-600 text-white shadow-md shadow-orange-500/20")
      .addClass(
        "bg-white text-slate-700 hover:bg-orange-50 border border-slate-200",
      );

    $(this)
      .removeClass(
        "bg-white text-slate-700 hover:bg-orange-50 border border-slate-200",
      )
      .addClass("bg-orange-600 text-white shadow-md shadow-orange-500/20");

    applyFilters();
  });

  $searchInput.on("input", applyFilters);

  $("#clearSearchBtn").on("click", function () {
    $searchInput.val("").trigger("focus");
    applyFilters();
  });

  const $popupModal = $("#popupModal");
  const $modalTitle = $("#modalTitle");
  const $modalCategory = $("#modalCategory");
  const $modalImg = $("#modalImg");
  const $modalDescription = $("#modalDescription");
  const $modalCurriculum = $("#modalCurriculum");
  const $modalActionLink = $("#modalActionLink");
  let lastFocusedElement = null;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  function openModal($card) {
    const title = $card.find(".modul-title").text().trim();
    const category =
      $card.find(".modul-badge").text().trim() || $card.data("category");
    const imgSrc = $card.find("img").attr("src");
    const imgAlt = $card.find("img").attr("alt");
    const desc =
      $card.data("desc") ||
      "Pelajari materi ini secara bertahap dan terstruktur.";
    const curriculum = $card.find("template.curriculum-details").html() || "";
    const actionUrl = $card.data("action-url") || "kosakata.html";
    const actionText = $card.data("action-text") || "Buka Kamus Terkait &rarr;";

    $modalTitle.text(title);
    $modalCategory.text(category);
    $modalImg.attr("src", imgSrc).attr("alt", imgAlt);
    $modalDescription.html(desc);
    $modalCurriculum.html(curriculum);
    $modalActionLink.attr("href", actionUrl).html(actionText);

    $popupModal.removeClass("hidden").addClass("flex").attr({
      "aria-hidden": "false",
      role: "dialog",
      "aria-modal": "true",
    });
    $("body").addClass("overflow-hidden");
    $("#closeBtn").trigger("focus");
  }

  function closeModal() {
    $popupModal
      .addClass("hidden")
      .removeClass("flex")
      .attr("aria-hidden", "true");
    $("body").removeClass("overflow-hidden");

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      $(lastFocusedElement).trigger("focus");
    }
    lastFocusedElement = null;
  }

  $(document).on("click", ".modul-item", function () {
    lastFocusedElement = this;
    openModal($(this));
  });

  $(document).on("keydown", ".modul-item", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      lastFocusedElement = this;
      openModal($(this));
    }
  });

  $("#closeBtn, #closeModalAction").on("click", closeModal);

  $popupModal.on("click", function (e) {
    if ($(e.target).is("#popupModal")) {
      closeModal();
    }
  });

  $popupModal.on("keydown", function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key !== "Tab") return;

    const $focusableElements = $popupModal
      .find(focusableSelector)
      .filter(":visible");
    if (!$focusableElements.length) {
      e.preventDefault();
      $("#closeBtn").trigger("focus");
      return;
    }

    const firstElement = $focusableElements[0];
    const lastElement = $focusableElements[$focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      $(lastElement).trigger("focus");
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      $(firstElement).trigger("focus");
    }
  });

  let quizScore = 0;
  let answeredCount = 0;
  const totalQuestions = $(".quiz-question-card").length || 3;

  $(".quiz-option").on("click", function () {
    const $btn = $(this);
    const $parentCard = $btn.closest(".quiz-question-card");

    if ($parentCard.data("answered")) return;
    $parentCard.data("answered", true);

    const isCorrect =
      $btn.data("correct") === true || $btn.data("correct") === "true";
    const feedbackText =
      $btn.data("feedback") ||
      (isCorrect
        ? "Jawaban tepat! Hebat!"
        : "Kurang tepat, coba pelajari lagi materinya.");

    $parentCard.find(".quiz-option").addClass("pointer-events-none opacity-60");

    if (isCorrect) {
      $btn
        .removeClass("opacity-60 bg-white border-slate-200")
        .addClass(
          "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold",
        );
      $btn
        .find(".quiz-icon")
        .html(
          '<i class="fa-solid fa-circle-check text-emerald-500 text-base"></i>',
        );
      quizScore += 10;
    } else {
      $btn
        .removeClass("opacity-60 bg-white border-slate-200")
        .addClass("bg-rose-50 border-rose-500 text-rose-800 font-bold");
      $btn
        .find(".quiz-icon")
        .html(
          '<i class="fa-solid fa-circle-xmark text-rose-500 text-base"></i>',
        );

      $parentCard
        .find('.quiz-option[data-correct="true"]')
        .removeClass("opacity-60 bg-white border-slate-200")
        .addClass(
          "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold",
        );
    }

    $parentCard
      .find(".quiz-feedback")
      .html(
        `<div class="p-3.5 mt-3 rounded-2xl text-xs font-semibold ${isCorrect ? "bg-emerald-100/70 text-emerald-900" : "bg-rose-100/70 text-rose-900"}">${feedbackText}</div>`,
      )
      .removeClass("hidden");

    answeredCount++;
    $("#quizCurrentScore").text(quizScore);
    $("#quizProgress").text(`${answeredCount} dari ${totalQuestions} selesai`);

    if (answeredCount === totalQuestions) {
      $("#quizCompletionCard").removeClass("hidden");
      $("#finalScoreText").text(`${quizScore} Poin`);
    }
  });

  $("#resetQuizBtn").on("click", function () {
    quizScore = 0;
    answeredCount = 0;
    $("#quizCurrentScore").text("0");
    $("#quizProgress").text(`0 dari ${totalQuestions} selesai`);
    $("#quizCompletionCard").addClass("hidden");

    $(".quiz-question-card").each(function () {
      const $card = $(this);
      $card.removeData("answered");
      $card.find(".quiz-feedback").addClass("hidden").html("");
      $card
        .find(".quiz-option")
        .removeClass(
          "pointer-events-none opacity-60 bg-emerald-50 border-emerald-500 text-emerald-800 bg-rose-50 border-rose-500 text-rose-800 font-bold",
        )
        .addClass("bg-white border-slate-200 text-slate-700");
      $card
        .find(".quiz-icon")
        .html('<i class="fa-regular fa-circle text-slate-400"></i>');
    });
  });

  applyFilters();
});
