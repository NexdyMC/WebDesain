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