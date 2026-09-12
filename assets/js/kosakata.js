$(function () {
  "use strict";

  let currentCategory = "all";
  let currentLanguage = "bisindo";
  const expandedContainers = new Set();

  const sibiLetterImages = {
    A: "A (4).jpg",
    B: "B (4).jpg",
    C: "C (2).jpg",
    D: "D (3).jpg",
    E: "E (2).jpg",
    F: "F (3).jpg",
    G: "G (3).jpg",
    H: "H (4).jpg",
    I: "I (1).jpg",
    J: "J (3).jpg",
    K: "K (3).jpg",
    L: "L (3).jpg",
    M: "M (3).jpg",
    N: "N (4).jpg",
    O: "O (4).jpg",
    P: "P (4).jpg",
    Q: "Q (4).jpg",
    R: "R (5).jpg",
    S: "S (3).jpg",
    T: "T (3).jpg",
    U: "U (3).jpg",
    V: "V (3).jpg",
    W: "W (3).jpg",
    X: "X (3).jpg",
    Y: "Y (3).jpg",
    Z: "Z (4).jpg",
  };

  $("#sibiAbjadContainer").html(
    Object.entries(sibiLetterImages)
      .map(function ([letter, fileName]) {
        const imagePath = `assets/images/SIBI/${encodeURIComponent(fileName)}`;
        return `
          <div role="button" tabindex="0" data-language="sibi" data-category="abjad" data-keywords="sibi abjad huruf alfabet ${letter.toLowerCase()}" data-desc="Bentuk isyarat huruf ${letter} dalam Sistem Isyarat Bahasa Indonesia (SIBI)." data-tips="Ikuti posisi jari pada foto dan pastikan telapak tangan menghadap arah yang sesuai." class="flex flex-col p-3 text-center bg-white border shadow-xs cursor-pointer border-slate-100 rounded-2xl card-interactive hover:shadow-lg hover:border-sky-300 kosakata-card group">
            <div class="relative mb-2.5 overflow-hidden rounded-xl aspect-square bg-slate-50">
              <img src="${imagePath}" alt="Isyarat huruf ${letter} dalam SIBI" class="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" />
              <span class="absolute top-1.5 right-1.5 px-2 py-0.5 text-[10px] font-bold text-sky-900 bg-sky-100 rounded-md card-badge">Abjad</span>
            </div>
            <p class="text-base font-bold text-slate-900 group-hover:text-sky-600 card-title">${letter}</p>
            <span class="text-xs font-medium text-slate-500">SIBI</span>
          </div>`;
      })
      .join(""),
  );

  $(".language-tab").on("click", function () {
    currentLanguage = $(this).data("language");
    const isSibi = currentLanguage === "sibi";

    $(".language-tab")
      .removeClass("bg-orange-600 text-white shadow-sm")
      .addClass("text-slate-600 hover:bg-white")
      .attr("aria-selected", "false");

    $(this)
      .removeClass("text-slate-600 hover:bg-white")
      .addClass("bg-orange-600 text-white shadow-sm")
      .attr("aria-selected", "true");

    $("#bisindoCollection").toggleClass("hidden", isSibi);
    $("#sibiCollection").toggleClass("hidden", !isSibi);
    $(".language-name").text(isSibi ? "SIBI" : "BISINDO");
    $("#languageDescription").text(
      isSibi
        ? "SIBI adalah Sistem Isyarat Bahasa Indonesia yang dikembangkan sebagai sistem resmi pembelajaran."
        : "BISINDO berkembang secara alami dalam komunitas Tuli di Indonesia.",
    );
    $("#languageStatus").html(
      `<i class="fa-solid fa-circle-info" aria-hidden="true"></i> Standar ${isSibi ? "SIBI" : "BISINDO"}`,
    );

    currentCategory = "all";
    $('.category-tab[data-filter="all"]').trigger("click");
  });

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
  const $sibiNoResultsMsg = $("#sibiNoResultsMessage");
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
      const cardLanguage = $card.data("language") || "bisindo";
      const title = ($card.find(".card-title").text() || "").toLowerCase();
      const keywords = ($card.data("keywords") || "").toLowerCase();
      const desc = ($card.data("desc") || "").toLowerCase();

      const matchesCategory =
        currentCategory === "all" || cardCategory === currentCategory;
      const matchesLanguage = cardLanguage === currentLanguage;

      const matchesSearch =
        !query ||
        title.includes(query) ||
        keywords.includes(query) ||
        desc.includes(query);

      const matchesFilter = matchesLanguage && matchesCategory && matchesSearch;
      $card.data("matches-filter", matchesFilter);

      if (matchesFilter) {
        visibleCount++;
      }
    });

    $(".show-more-cards").each(function () {
      const $button = $(this);
      const containerId = $button.data("target");
      const $cards = $(`#${containerId} .kosakata-card`);
      const $matchingCards = $cards.filter(function () {
        return $(this).data("matches-filter") === true;
      });
      const isExpanded = expandedContainers.has(containerId);
      const shouldLimit = !query && !isExpanded;

      $cards.addClass("hidden").removeClass("flex");
      $matchingCards.each(function (index) {
        if (!shouldLimit || index < 10) {
          $(this).removeClass("hidden").addClass("flex");
        }
      });

      const canExpand = $matchingCards.length > 10 && !query;
      $button.toggleClass("hidden", !canExpand && !isExpanded);
      $button.toggleClass("flex", canExpand || isExpanded);
      $button.attr("aria-expanded", String(isExpanded));
      $button.html(
        isExpanded
          ? 'Tampilkan Lebih Sedikit <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>'
          : 'Tampilkan Selengkapnya <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>',
      );
    });

    if ($resultCount.length) {
      $resultCount.text(`${visibleCount} item ditemukan`);
    }

    $noResultsMsg.toggleClass(
      "hidden",
      currentLanguage !== "bisindo" || visibleCount !== 0,
    );
    $sibiNoResultsMsg.toggleClass(
      "hidden",
      currentLanguage !== "sibi" || visibleCount !== 0,
    );

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

  $(document).on("click", ".show-more-cards", function () {
    const containerId = $(this).data("target");
    if (expandedContainers.has(containerId)) {
      expandedContainers.delete(containerId);
    } else {
      expandedContainers.add(containerId);
    }
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
    const language = $card.data("language") || "bisindo";
    const imgSrc = $card.find("img").attr("src");
    const imgAlt = $card.find("img").attr("alt");
    const desc =
      $card.data("desc") ||
      `Panduan gerakan isyarat untuk "${title}" dalam standar ${language.toUpperCase()}.`;
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
