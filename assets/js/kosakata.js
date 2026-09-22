$(function () {
  "use strict";

  let currentCategory = "all";
  let currentLanguage = "bisindo";
  const expandedContainers = new Set();
  let hasInitializedFilters = false;
  let previousQuery = "";
  let previousCategory = "all";
  let previousLanguage = "bisindo";

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
          <div role="button" tabindex="0" data-language="sibi" data-category="abjad" data-keywords="sibi abjad huruf alfabet ${letter.toLowerCase()}" data-desc="Bentuk isyarat huruf ${letter} dalam Sistem Isyarat Bahasa Indonesia (SIBI)." data-tips="Ikuti posisi jari pada foto dan pastikan telapak tangan menghadap arah yang sesuai." class="flex flex-col p-3 text-center bg-white border shadow-sm cursor-pointer border-slate-100 rounded-2xl card-interactive hover:shadow-lg hover:border-sky-300 kosakata-card group">
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
    expandedContainers.clear();

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
    expandedContainers.clear();

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
    const filterChanged =
      hasInitializedFilters &&
      (query !== previousQuery ||
        currentCategory !== previousCategory ||
        currentLanguage !== previousLanguage);

    if (query) {
      expandedContainers.clear();
    }

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
      const $container = $(`#${containerId}`);
      const $cards = $(`#${containerId} .kosakata-card`);
      const $matchingCards = $cards.filter(function () {
        return $(this).data("matches-filter") === true;
      });
      const hasMatchingCards = $matchingCards.length > 0;
      const isExpanded = expandedContainers.has(containerId) && !query;
      const shouldLimit = !query && !isExpanded;
      const $sectionHeader = $container.prev(".section-category-header");
      const $showMoreWrapper = $button.parent();

      $sectionHeader.toggleClass("hidden", !hasMatchingCards);
      $container.toggleClass("hidden", !hasMatchingCards);

      $cards.addClass("hidden").removeClass("flex");
      $matchingCards.each(function (index) {
        if (!shouldLimit || index < 10) {
          const $card = $(this);
          $card.removeClass("hidden").addClass("flex");

          if (filterChanged) {
            $card
              .css("--filter-delay", `${Math.min(index, 8) * 35}ms`)
              .removeClass("filter-reveal");
            void $card[0].offsetWidth;
            $card.addClass("filter-reveal");
          }
        }
      });

      const canExpand = $matchingCards.length > 10 && !query;
      const shouldShowMore = hasMatchingCards && (canExpand || isExpanded);
      $showMoreWrapper.toggleClass("hidden", !shouldShowMore);
      $button.toggleClass("hidden", !shouldShowMore);
      $button.toggleClass("flex", shouldShowMore);

      if (filterChanged && shouldShowMore) {
        $showMoreWrapper
          .css(
            "--filter-delay",
            `${Math.min($matchingCards.length, 10) * 35 + 70}ms`,
          )
          .removeClass("catalog-control-reveal");
        void $showMoreWrapper[0].offsetWidth;
        $showMoreWrapper.addClass("catalog-control-reveal");
      } else if (!shouldShowMore) {
        $showMoreWrapper.removeClass("catalog-control-reveal");
      }

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

    hasInitializedFilters = true;
    previousQuery = query;
    previousCategory = currentCategory;
    previousLanguage = currentLanguage;
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

  $(document).on("click", ".kosakata-card", function () {
    lastFocusedElement = this;
    openModal($(this));
  });

  $(document).on("keydown", ".kosakata-card", function (e) {
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

  applyFilters();
});
