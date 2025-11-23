// memastikan script berjalan setelah halaman selesai
document.addEventListener("DOMContentLoaded", () => {
  
  const slider = document.getElementById("slider");

  // cek apakah slider ketemu
  console.log("Slider found:", slider);

  window.nextSlide = function() {
    slider.scrollBy({
      left: window.innerWidth,
      behavior: "smooth"
    });
  };

  window.prevSlide = function() {
    slider.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth"
    });
  };

});
