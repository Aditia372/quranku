const surahListContainer = document.querySelector(".surah-list");
const select = document.getElementById("quran");
const container = document.querySelector(".verses");
let activeAudio = null;
let currentAyahIndex = 0;
let isSurahListVisible = true;

// Fungsi untuk membuat daftar surah berdasarkan data dari API
const generateSurahList = (quranData) => {
  while (surahListContainer.firstChild) {
    surahListContainer.removeChild(surahListContainer.firstChild);
  }

  quranData.data.forEach((surah) => {
    // Membuat elemen div untuk setiap surah
    const surahElement = document.createElement("div");
    surahElement.classList.add("surah");

    // Membuat elemen paragraf untuk nomor surah
    const surahNumberElement = document.createElement("p");
    surahNumberElement.classList.add("surah-number");
    surahNumberElement.textContent = surah.nomor;
    surahElement.appendChild(surahNumberElement);

    // Membuat elemen paragraf untuk nama surah
    const surahNameElement = document.createElement("p");
    surahNameElement.classList.add("surah-name");
    surahNameElement.textContent = surah.nama;
    surahElement.appendChild(surahNameElement);

    // Membuat elemen paragraf untuk terjemahan nama surah
    const surahTranslationElement = document.createElement("p");
    surahTranslationElement.classList.add("surah-translation");
    surahTranslationElement.textContent = surah.arti;
    surahElement.appendChild(surahTranslationElement);

    // Menambahkan elemen surah ke dalam container daftar surah
    surahListContainer.appendChild(surahElement);

    // Menambahkan event listener saat surah dipilih
    surahElement.addEventListener("click", () => {
      fetchSurahData(surah.nomor);
    });

    // Menambahkan opsi surah ke dalam elemen <select>
    const option = document.createElement("option");
    option.value = surah.nomor;
    option.textContent = surah.nomor + ". " + surah.namaLatin;
    select.appendChild(option);
  });
};

// Memanggil API untuk mendapatkan data daftar surah
fetch("https://equran.id/api/v2/surat")
  .then((response) => response.json())
  .then((quranData) => {
    generateSurahList(quranData); // Panggil fungsi untuk pertama kali saat halaman dimuat

    // Menambahkan event listener untuk elemen <select> surah
    select.addEventListener("change", (event) => {
      const selectedSurahNumber = event.target.value;
      if (selectedSurahNumber) {
        fetchSurahData(selectedSurahNumber);
      } else {
        container.innerHTML = "";
        activeAudio = null;
      }
    });
  })
  .catch((err) => console.log(err));

// Fungsi untuk mendapatkan data surah berdasarkan nomor surah
const fetchSurahData = (surahNumber) => {
  // Hapus definisi tombol Back to Surah List di sini (jika ada)
  // const backButton = document.querySelector(".back-to-list-button");

  // Memanggil API untuk mendapatkan data surah berdasarkan nomor
  fetch(`https://equran.id/api/v2/surat/${surahNumber}`)
    .then((response) => response.json())
    .then((surahData) => {
      container.innerHTML = "";

      // Membuat elemen div untuk judul surah (nama, terjemahan, jenis, dan jumlah ayat)
      const titleDiv = document.createElement("div");
      titleDiv.classList = "title";
      const nameSurah = document.createElement("h2");
      nameSurah.classList = "surah-name";
      nameSurah.textContent = surahData.data.namaLatin;
      nameSurah.textContent = surahData.data.nama;
      titleDiv.appendChild(nameSurah);

      const translateName = document.createElement("p");
      translateName.classList = "surah-translation";
      translateName.textContent = surahData.data.arti;
      titleDiv.appendChild(translateName);

      const type = document.createElement("p");
      type.classList = "surah-type";
      type.textContent = "Golongan : " + surahData.data.tempatTurun;
      titleDiv.appendChild(type);

      const ayat = document.createElement("p");
      ayat.classList = "num-ayat";
      ayat.textContent = 'Jumlah ayat : ' +surahData.data.jumlahAyat + " Ayat";
      titleDiv.appendChild(ayat);

      container.appendChild(titleDiv);

      // Menambahkan elemen-ayat untuk setiap ayat dalam surah
      surahData.data.ayat.forEach((ayah, index) => {
        const ayahContainer = document.createElement("div");
        ayahContainer.classList = "ayah-container";
        container.appendChild(ayahContainer);

        // Menambahkan nomor ayat dalam surah
        const text = document.createElement("p");
        text.classList = "no";
        text.textContent = "Ayat ke - " + ayah.nomorAyat;
        ayahContainer.appendChild(text);

        // Menambahkan teks arab ayat
        const textArabic = document.createElement("p");
        textArabic.classList = "ayat";
        textArabic.textContent = ayah.teksArab;
        ayahContainer.appendChild(textArabic);

        // Menambahkan pemutar audio untuk ayat jika tersedia
        const audioPlayer = document.createElement("audio");
        audioPlayer.controls = true;
        const audioLink = ayah.audio["01"];
        if (audioLink) {
          audioPlayer.src = audioLink;
          ayahContainer.appendChild(audioPlayer);

          audioPlayer.addEventListener("play", () => {
            if (activeAudio && activeAudio !== audioPlayer) {
              activeAudio.pause();
            }
            activeAudio = audioPlayer;
          });
        }

        // Menambahkan teks terjemahan ayat
        const textIndonesia = document.createElement("p");
        textIndonesia.classList = "ayat-indonesia";
        textIndonesia.textContent = ayah.teksIndonesia;
        ayahContainer.appendChild(textIndonesia);
      });
    })
    .catch((err) => console.log(err));

  // Jika daftar surah masih terlihat, sembunyikan daftar surah
  if (isSurahListVisible) {
    surahListContainer.style.display = "none";
    isSurahListVisible = false;
  }
};

// Menambahkan event listener untuk tombol "Back to Surah List"
const backButton = document.querySelector(".back-to-list-button");
backButton.addEventListener("click", () => {
  // Tampilkan kembali daftar surah
  surahListContainer.style.display = "block";
  isSurahListVisible = true;

  // Hapus konten surah yang ditampilkan
  container.innerHTML = "";
  backButton.style.display = "none";
  activeAudio = null;

  // Memuat ulang daftar surah dari API
  fetch("https://equran.id/api/v2/surat")
    .then((response) => response.json())
    .then((quranData) => {
      generateSurahList(quranData);
    })
    .catch((err) => console.log(err));
});

// Fungsi untuk mengecek apakah suatu elemen berada dalam viewport
function isElementInViewport(element) {
  var bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Fungsi untuk menampilkan atau menyembunyikan elemen berdasarkan viewport
function animateConElements() {
  var conElements = document.querySelectorAll(".video-container .conten");
  conElements.forEach((element) => {
    if (isElementInViewport(element)) {
      element.classList.add("animate-in");
      element.classList.remove("animate-out");
      showSurahListButton.style.display = "none";
    } else {
      element.classList.add("animate-out");
      element.classList.remove("animate-in");
      showSurahListButton.style.display = "block"; // Tampilkan tombol saat elemen ayat muncul
    }
  });
}

// Menambahkan event listener untuk animasi saat scroll dan saat halaman dimuat
window.addEventListener("scroll", animateConElements);
window.addEventListener("load", animateConElements);
