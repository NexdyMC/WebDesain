$(function () {
  "use strict";

  let currentCategory = "all";

  $(".category-tab").on("click", function () {
    const filter = $(this).data("filter");
    currentCategory = filter;

    $(".category-tab")
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

  const $searchInput = $("#searchInput");
  const $clearSearchBtn = $("#clearSearchBtn");
  const $noResultsMsg = $("#noResultsMessage");
  const $resultCount = $("#resultCount");

  function applyFilters() {
    const query = $searchInput.val().toLowerCase().trim();

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

      const matchesCategory =
        currentCategory === "all" || cardCategory === currentCategory;

      const matchesSearch =
        !query ||
        title.includes(query) ||
        keywords.includes(query) ||
        desc.includes(query);

      if (matchesCategory && matchesSearch) {
        $card.removeClass("hidden").addClass("flex");
        visibleCount++;
      } else {
        $card.addClass("hidden").removeClass("flex");
      }
    });

    if ($resultCount.length) {
      $resultCount.text(`${visibleCount} item ditemukan`);
    }

    if (visibleCount === 0) {
      $noResultsMsg.removeClass("hidden");
    } else {
      $noResultsMsg.addClass("hidden");
    }

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

  const $popupModal = $("#popupModal");
  const $modalTitle = $("#modalTitle");
  const $modalCategory = $("#modalCategory");
  const $modalImg = $("#modalImg");
  const $modalDescription = $("#modalDescription");
  const $modalTips = $("#modalTips");

  function openModal($card) {
    const title = $card.find(".card-title").text().trim();
    const category =
      $card.find(".card-badge").text().trim() || $card.data("category");
    const imgSrc = $card.find("img").attr("src");
    const imgAlt = $card.find("img").attr("alt");
    const desc =
      $card.data("desc") ||
      `Panduan gerakan isyarat untuk "${title}" dalam standar BISINDO.`;
    const tips =
      $card.data("tips") ||
      "Pastikan posisi jari dan telapak tangan menghadap ke depan dengan rileks dan jelas.";

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

  applyFilters();
});
