// Mengatur event listener untuk memanggil fungsi stickyHeader() saat pengguna menggulir halaman
// (Fungsi stickyHeader() tidak ada dalam potongan kode yang diberikan, kemungkinan ada di bagian kode yang tidak tercantum)
const scrollWidget = document.querySelector(".scroll-widget");
const videos = document.querySelectorAll(".scroll-card-video");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const videoCount = videos.length;
let currentIndex = 1; // Mulai dengan indeks video pertama (di tengah)

// Event listener saat tombol panah kiri diklik untuk mengganti video ke sebelumnya
arrowLeft.addEventListener("click", function () {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = videoCount - currentIndex; // Kembali ke video terakhir
  }
  updateVideos();
});

// Event listener saat tombol panah kanan diklik untuk mengganti video ke berikutnya
arrowRight.addEventListener("click", function () {
  currentIndex++;
  if (currentIndex >= videoCount) {
    currentIndex = 0; // Kembali ke video pertama (di tengah)
  }
  updateVideos();
});

// Fungsi untuk memperbarui tampilan video-video di carousel
function updateVideos() {
  // Tentukan indeks video-video yang berada di sekitar video tengah
  const leftIndex = (currentIndex - 1 + videoCount) % videoCount;
  const rightIndex = (currentIndex + 1) % videoCount;

  videos.forEach((video, index) => {
    if (index === currentIndex) {
      video.classList.add("active");
      video.style.filter = "blur(0)"; // Video tengah ditampilkan tanpa efek blur
    } else if (index === leftIndex || index === rightIndex) {
      video.classList.add("active");
      video.style.filter = "blur(2px)"; // Video di sekitar video tengah diberi efek blur
    } else {
      video.classList.remove("active");
      video.style.filter = "blur(2px)"; // Video-video yang tidak aktif diberi efek blur
    }
  });

  const translateXValue = -currentIndex * 800;
  scrollWidget.style.transform = `translateX(${translateXValue}px)`; // Menggeser carousel ke video tengah
}

// Fungsi untuk memeriksa apakah suatu elemen berada dalam viewport
function isElementInViewport(element) {
  var bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Fungsi untuk melakukan animasi pada elemen-elemen saat pengguna menggulir halaman
function animateConElements() {
  var conElements = document.querySelectorAll(".video-container .conten");
  conElements.forEach((element) => {
    if (isElementInViewport(element)) {
      element.classList.add("animate-in");
      element.classList.remove("animate-out");
    } else {
      element.classList.add("animate-out");
      element.classList.remove("animate-in");
    }
  });
}

// Memanggil fungsi animateConElements() untuk pertama kali saat halaman dimuat
animateConElements();

// Menambahkan event listener untuk memanggil fungsi animateConElements() saat pengguna menggulir halaman
window.addEventListener("scroll", animateConElements);
