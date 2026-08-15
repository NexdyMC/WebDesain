// Navigasi Toggle For Android & iOS
$("#menuBtn").on("click", function () {
  $("#mobileMenu").toggleClass("hidden");
  $("#iconOpen").toggleClass("hidden");
  $("#iconClose").toggleClass("hidden");
});
$("#mobileMenu a").on("click", function () {
  $("#mobileMenu").toggleClass("hidden");
  $("#iconOpen").removeClass("hidden");
  $("#iconClose").toggleClass("hidden");
});

$(document).ready(function () {
  const $tabButtons = $(".tab-btn");
  const $items = $(".item");

  function setActiveTab(selectedFilter) {
    $tabButtons.each(function () {
      const isActive = $(this).data("filter") === selectedFilter;

      $(this)
        .toggleClass("active", isActive)
        .toggleClass(
          "bg-primary-500 text-white border-primary-500 font-semibold",
          isActive,
        )
        .toggleClass(
          "bg-white text-gray-700 border-gray-200 font-medium",
          !isActive,
        )
        .toggleClass("shadow-sm", isActive);
    });
  }

  function showAllItems() {
    $items.show();
    $items.css("opacity", "1").css("transform", "translateY(0)");
  }

  function applyFilter(filterValue) {
    if (filterValue === "semua") {
      showAllItems();
      return;
    }

    $items.hide();
    $items.filter('[data-category="' + filterValue + '"]').show();
    $items.filter('[data-category="' + filterValue + '"]').css({
      opacity: 1,
      transform: "translateY(0)",
    });
  }

  showAllItems();

  $tabButtons.on("click", function () {
    const filterValue = $(this).data("filter");
    setActiveTab(filterValue);
    applyFilter(filterValue);
  });
});
