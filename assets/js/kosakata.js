/**
 * IsyaratOK - Kosakata & Kamus Interaktif Script
 * Powered by jQuery
 */

$(function () {
  "use strict";

  let currentCategory = "all";

  // ==========================================
  // 1. TAB CATEGORY SWITCHER
  // ==========================================
  $(".category-tab").on("click", function () {
    const filter = $(this).data("filter");
    currentCategory = filter;

    // Update active tab styles
    $(".category-tab")
      .removeClass("bg-orange-600 text-white shadow-md shadow-orange-500/20")
      .addClass("bg-white text-slate-700 hover:bg-orange-50 border border-slate-200");

    $(this)
      .removeClass("bg-white text-slate-700 hover:bg-orange-50 border border-slate-200")
      .addClass("bg-orange-600 text-white shadow-md shadow-orange-500/20");

    applyFilters();
  });

  // ==========================================
  // 2. LIVE SEARCH & FILTER ENGINE
  // ==========================================
  const $searchInput = $("#searchInput");
  const $clearSearchBtn = $("#clearSearchBtn");
  const $noResultsMsg = $("#noResultsMessage");
  const $resultCount = $("#resultCount");

  function applyFilters() {
    const query = $searchInput.val().toLowerCase().trim();
    
    // Toggle clear button
    if (query.length > 0) {
      $clearSearchBtn.removeClass("hidden");
    } else {
      $clearSearchBtn.addClass("hidden");
    }

    let visibleCount = 0;

    $(".kosakata-card").each(function () {
      const $card = $(this);
      const cardCategory = $card.data("category"); // 'abjad', 'angka', 'kata'
      const title = ($card.find(".card-title").text() || "").toLowerCase();
      const keywords = ($card.data("keywords") || "").toLowerCase();
      const desc = ($card.data("desc") || "").toLowerCase();

      // Check category match
      const matchesCategory = (currentCategory === "all" || cardCategory === currentCategory);

      // Check search match
      const matchesSearch = !query || title.includes(query) || keywords.includes(query) || desc.includes(query);

      if (matchesCategory && matchesSearch) {
        $card.removeClass("hidden").addClass("flex");
        visibleCount++;
      } else {
        $card.addClass("hidden").removeClass("flex");
      }
    });

    // Update result count text
    if ($resultCount.length) {
      $resultCount.text(`${visibleCount} item ditemukan`);
    }

    // Toggle no results state
    if (visibleCount === 0) {
      $noResultsMsg.removeClass("hidden");
    } else {
      $noResultsMsg.addClass("hidden");
    }

    // Toggle Section Headers based on category
    if (currentCategory === "all" && !query) {
      $(".section-category-header").removeClass("hidden");
    } else {
      $(".section-category-header").addClass("hidden");
    }
  }

  $searchInput.on("input keyup", applyFilters);

  $clearSearchBtn.on("click", function () {
    $searchInput.val("").trigger("focus");
    applyFilters();
  });

  // ==========================================
  // 3. INTERACTIVE MODAL DETAIL PREVIEW
  // ==========================================
  const $popupModal = $("#popupModal");
  const $modalTitle = $("#modalTitle");
  const $modalCategory = $("#modalCategory");
  const $modalImg = $("#modalImg");
  const $modalDescription = $("#modalDescription");
  const $modalTips = $("#modalTips");

  function openModal($card) {
    const title = $card.find(".card-title").text().trim();
    const category = $card.find(".card-badge").text().trim() || $card.data("category");
    const imgSrc = $card.find("img").attr("src");
    const imgAlt = $card.find("img").attr("alt");
    const desc = $card.data("desc") || `Panduan gerakan isyarat untuk "${title}" dalam standar BISINDO.`;
    const tips = $card.data("tips") || "Pastikan posisi jari dan telapak tangan menghadap ke depan dengan rileks dan jelas.";

    $modalTitle.text(title);
    $modalCategory.text(category);
    $modalImg.attr("src", imgSrc).attr("alt", imgAlt);
    $modalDescription.text(desc);
    $modalTips.text(tips);

    $popupModal.removeClass("hidden").addClass("flex");
    $("body").addClass("overflow-hidden");
  }

  function closeModal() {
    $popupModal.addClass("hidden").removeClass("flex");
    $("body").removeClass("overflow-hidden");
  }

  // Open modal on clicking card or pressing Enter on focused card
  $(document).on("click", ".kosakata-card", function () {
    openModal($(this));
  });

  $(document).on("keydown", ".kosakata-card", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal($(this));
    }
  });

  $("#closeBtn, #closeModalAction").on("click", closeModal);

  $popupModal.on("click", function (e) {
    if ($(e.target).is("#popupModal")) {
      closeModal();
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $popupModal.is(":visible")) {
      closeModal();
    }
  });

  // Initial filter run
  applyFilters();
});