// Fungsi async untuk mengambil daftar doa harian
async function fetchDoaList() {
    try {
        const response = await fetch('https://doa-doa-api-ahmadramadhan.fly.dev/api');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doa harian data:', error);
        return [];
    }
}

// Fungsi async untuk menampilkan daftar doa harian
async function displayDoaHarian() {
    const doaList = document.getElementById('doaList');
    const searchBox = document.getElementById('searchBox');
    searchBox.style.display = 'block'; // Tampilkan kotak pencarian

    const doaData = await fetchDoaList();

    // Hapus konten yang sudah ada
    while (doaList.firstChild) {
        doaList.removeChild(doaList.firstChild);
    }

    if (doaData.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'Tidak ada data doa harian saat ini.';
        doaList.appendChild(message);
    } else {
        const ul = document.createElement('ul');

        doaData.forEach(doa => {
            const li = document.createElement('li');

            const h2 = document.createElement('h2');
            h2.textContent = doa.doa;

            const p = document.createElement('p');
            p.textContent = doa.ayat;

            const h3 = document.createElement('h3');
            h3.textContent = doa.artinya;

            li.appendChild(h2);
            li.appendChild(p);
            li.appendChild(h3);

            ul.appendChild(li);
        });

        doaList.appendChild(ul);
    }

    doaList.style.display = 'block'; // Tampilkan daftar doa harian
    const doaTahlilList = document.getElementById('doaTahlilList');
    doaTahlilList.style.display = 'none'; // Sembunyikan daftar doa tahlil
}

// Fungsi async untuk mengambil daftar doa tahlil
async function fetchDoaTahlilList() {
    try {
        const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/tahlil');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching doa tahlil data:', error);
        return [];
    }
}

// Fungsi async untuk menampilkan daftar doa tahlil
async function displayDoaTahlil() {
    const searchBox = document.getElementById('searchBox');
    searchBox.style.display = 'none'; // Sembunyikan kotak pencarian

    const doaList = document.getElementById('doaList');
    const doaTahlilList = document.getElementById('doaTahlilList');
    const doaTahlilData = await fetchDoaTahlilList();

    // Hapus konten yang sudah ada
    while (doaTahlilList.firstChild) {
        doaTahlilList.removeChild(doaTahlilList.firstChild);
    }

    if (doaTahlilData.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'Tidak ada data doa tahlil saat ini.';
        doaTahlilList.appendChild(message);
    } else {
        const ul = document.createElement('ul');

        doaTahlilData.forEach(doaTahlil => {
            const li = document.createElement('li');

            const h2 = document.createElement('h2');
            h2.textContent = doaTahlil.title;

            const p = document.createElement('p');
            p.textContent = doaTahlil.arabic;

            const h3 = document.createElement('h3');
            h3.textContent = doaTahlil.translation;

            li.appendChild(h2);
            li.appendChild(p);
            li.appendChild(h3);

            ul.appendChild(li);
        });

        doaTahlilList.appendChild(ul);
    }

    doaList.style.display = 'none'; // Sembunyikan daftar doa harian
    doaTahlilList.style.display = 'block'; // Tampilkan daftar doa tahlil
}

// Fungsi async untuk menampilkan hasil pencarian
async function displaySearchResults(data) {
    const searchResults = document.getElementById('searchResults');

    // Hapus konten yang sudah ada
    while (searchResults.firstChild) {
        searchResults.removeChild(searchResults.firstChild);
    }

    if (data.length === 0) {
        const message = document.createElement('h6');
        message.textContent = 'Maaf doa yang kamu cari tidak ada. Pastikan untuk memasukkan keyword dengan benar!';
        searchResults.appendChild(message);
        searchResults.classList.add('no-results');
    } else {
        const ul = document.createElement('ul');

        data.forEach(doa => {
            const li = document.createElement('li');

            const h2 = document.createElement('h2');
            h2.textContent = doa.doa;

            const p = document.createElement('p');
            p.textContent = doa.ayat;

            const h3 = document.createElement('h3');
            h3.textContent = doa.artinya;

            li.appendChild(h2);
            li.appendChild(p);
            li.appendChild(h3);

            ul.appendChild(li);
        });

        searchResults.appendChild(ul);
        searchResults.classList.remove('no-results');
    }

    searchResults.style.display = 'block'; // Tampilkan hasil pencarian
    const doaList = document.getElementById('doaList');
    doaList.style.display = 'none'; // Sembunyikan daftar doa harian
    const doaTahlilList = document.getElementById('doaTahlilList');
    doaTahlilList.style.display = 'none'; // Sembunyikan daftar doa tahlil
}

// Fungsi async untuk mencari doa berdasarkan input pengguna
async function searchDoa() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (keyword === '') {
        return; // Jika input kosong, tidak melakukan pencarian
    }

    const doaData = await fetchDoaList();
    const matchingDoa = doaData.filter(doa => {
        const text = doa.doa.toLowerCase() + doa.ayat.toLowerCase() + doa.artinya.toLowerCase();
        return text.includes(keyword.toLowerCase());
    });

    displaySearchResults(matchingDoa);
}
