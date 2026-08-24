$(document).ready(function () {
  $(".faq-header").on("click", function () {
    const $content = $(this).next("#abjadContent");
    const isOpening = !$content.is(":visible");

    $content.stop(true, true).slideToggle(300, function () {
      if (isOpening) {
        $content.removeClass("hidden");
      } else {
        $content.addClass("hidden").css("display", "");
      }
    });

    $(this).find("#faqArrow").toggleClass("rotate-90", isOpening);
    $(this).attr("aria-expanded", isOpening);
  });

  $("#searchInput").on("input", function () {
    const searchWords = $(this)
      .val()
      .toLowerCase()
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean);

    $("#searchResults .search-item").each(function () {
      const keywords = $(this).data("keywords").toLowerCase();
      const isMatch =
        searchWords.length === 0 ||
        searchWords.some((word) => keywords.includes(word));
      $(this).toggle(isMatch);
    });
  });
});


$("#menuBtn").on("click", function () {
  $("#mobileMenu, #iconOpen, #iconClose").toggleClass("hidden grid");
});

$("#mobileMenu a").on("click", function () {
  $("#mobileMenu").addClass("hidden").removeClass("grid");
  $("#iconOpen").addClass("grid").removeClass("hidden");
  $("#iconClose").addClass("hidden").removeClass("grid");
});