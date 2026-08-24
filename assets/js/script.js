
$("#menuBtn").on("click", function () {
  $("#mobileMenu, #iconOpen, #iconClose").toggleClass("hidden grid");
});

$("#mobileMenu a").on("click", function () {
  $("#mobileMenu").addClass("hidden").removeClass("grid");
  $("#iconOpen").addClass("grid").removeClass("hidden");
  $("#iconClose").addClass("hidden").removeClass("grid");
});