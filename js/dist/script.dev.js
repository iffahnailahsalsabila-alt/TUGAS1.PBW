"use strict";

// =========================================================
// script.js
// Logika utama proyek. Mengambil data dari variabel global di data.js.
// =========================================================
// --- 1. Fungsi Greeting (untuk Dashboard) ---
function updateGreeting() {
  var time = new Date();
  var hour = time.getHours(); // Ambil nama dari local storage (disimpan saat login)

  var userName = localStorage.getItem('loggedInUser') || 'Pengguna';
  var greetingText = '';

  if (hour >= 5 && hour < 11) {
    greetingText = 'Selamat Pagi, ' + userName;
  } else if (hour >= 11 && hour < 15) {
    greetingText = 'Selamat Siang, ' + userName;
  } else if (hour >= 15 && hour < 18) {
    greetingText = 'Selamat Sore, ' + userName;
  } else {
    greetingText = 'Selamat Malam, ' + userName;
  }

  var greetingElement = document.getElementById('greetingMessage');

  if (greetingElement) {
    greetingElement.textContent = greetingText;
  }
} // --- 2. Fungsi Rendering Data Stok (untuk Stok.html) ---


function renderStokData() {
  var stokListContainer = document.getElementById('stokList');
  if (!stokListContainer) return;
  stokListContainer.innerHTML = ''; // dataBahanAjar diambil dari data.js

  if (typeof dataBahanAjar === 'undefined' || dataBahanAjar.length === 0) {
    stokListContainer.innerHTML = '<p>Data Bahan Ajar tidak ditemukan.</p>';
    return;
  }

  dataBahanAjar.forEach(function (item) {
    var card = document.createElement('div');
    card.className = 'data-card';
    card.innerHTML = "\n            <div class=\"card-header\">\n                <h4>Informasi Bahan Ajar</h4>\n            </div>\n            <div class=\"card-image\">\n                <img src=\"".concat(item.cover, "\" alt=\"Cover ").concat(item.namaBarang, "\" style=\"max-width: 100%; height: auto; border-radius: 4px;\">\n            </div>\n            <div class=\"card-detail\">\n                <div class=\"detail-row\"><span class=\"detail-label\">Kode Lokasi</span><span>").concat(item.kodeLokasi, "</span></div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Kode Barang</span><span>").concat(item.kodeBarang, "</span></div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Nama Barang</span><span>").concat(item.namaBarang, "</span></div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Jenis Barang</span><span>").concat(item.jenisBarang, "</span></div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Edisi</span><span>").concat(item.edisi, "</span></div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Stok</span><span>").concat(item.stok, "</span></div>\n            </div>\n        ");
    stokListContainer.appendChild(card);
  });
} // --- 3. Fungsi Menampilkan Hasil Tracking (untuk Tracking.html) ---


function displayTrackingResult(data, doNumber) {
  var trackingResult = document.getElementById('trackingResult');
  if (!trackingResult) return;
  var headerHtml = "\n    <div class=\"tracking-header\">\n        <p>No. DO/Billing</p>\n            <h3>".concat(doNumber, "</h3>\n            <p>Nama Mahasiswa: <strong>").concat(data.nama, "</strong></p>\n            <p>Status: <strong>").concat(data.status, "</strong></p>\n            <p>Detail Ekspedisi: ").concat(data.ekspedisi, " | Paket: ").concat(data.paket, "</p>\n            <p>Tanggal Kirim: ").concat(data.tanggalKirim, " | Total Pembayaran: ").concat(data.total, "</p>\n        </div>\n        <h4>Perjalanan Paket</h4>\n        <div class=\"timeline\">");
  var timelineHtml = data.perjalanan.map(function (item, index) {
    var isDeliveredClass = index === data.perjalanan.length - 1 && data.status === 'Dikirim' ? 'delivered' : '';
    return "\n            <div class=\"timeline-item ".concat(isDeliveredClass, "\">\n                <div class=\"timeline-content\">\n                    <p>").concat(item.keterangan, "</p>\n                    <span class=\"timeline-date\">").concat(item.waktu, "</span>\n                </div>\n            </div>\n        ");
  }).join('');
  trackingResult.innerHTML = headerHtml + timelineHtml + "</div>";
} // =========================================================
// EVENT LISTENERS UTAMA
// =========================================================


document.addEventListener('DOMContentLoaded', function () {
  // --- A. Login (index.html) ---
  var loginForm = document.getElementById('loginForm');
  var forgotPasswordLink = document.getElementById('forgotPasswordLink');
  var registerLink = document.getElementById('registerLink');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      var isAuthenticated = false;
      var userName = ''; // KOREKSI LOGIN: Loop melalui dataPengguna dari data.js

      for (var i = 0; i < dataPengguna.length; i++) {
        if (dataPengguna[i].email === email && dataPengguna[i].password === password) {
          isAuthenticated = true;
          userName = dataPengguna[i].nama;
          localStorage.setItem('loggedInUser', userName);
          break;
        }
      }

      if (isAuthenticated) {
        window.location.href = 'dashboard.html';
      } else {
        alert('email/password yang anda masukkan salah');
      }
    });
  } // Event listener untuk link Lupa Password dan Daftar


  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Fitur Lupa Password akan ditampilkan dalam bentuk Modal Box');
    });
  }

  if (registerLink) {
    registerLink.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Fitur Pendaftaran (Daftar) akan ditampilkan dalam bentuk Modal Box');
    });
  } // Panggil fungsi greeting jika ada elemennya di halaman


  updateGreeting(); // --- B. Tracking (tracking.html) ---

  var searchButton = document.getElementById('searchButton');
  var doNumberInput = document.getElementById('doNumber');

  if (searchButton) {
    searchButton.addEventListener('click', function () {
      var doNumber = doNumberInput.value.trim();
      var trackingResult = document.getElementById('trackingResult');

      if (doNumber === '') {
        alert('Nomor DO tidak boleh kosong!');
        trackingResult.innerHTML = '<p class="placeholder-text">Silahkan masukkan nomor DO yang valid.</p>';
        return;
      } // KOREKSI TRACKING: Menggunakan dataTracking dari data.js


      var data = dataTracking[doNumber];

      if (data) {
        displayTrackingResult(data, doNumber);
      } else {
        alert('Nomor DO tidak ditemukan atau salah!');
        trackingResult.innerHTML = '<p class="placeholder-text">Nomor DO/Billing tidak ditemukan. Coba Nomor: 2023001234 atau 2023005678</p>';
      }
    });
  } // --- C. Stok (stok.html) ---


  var tambahStokBtn = document.getElementById('tambahStokBtn');
  var addStokForm = document.getElementById('addStokForm');
  var submitStokBtn = document.getElementById('submitStokBtn');

  if (tambahStokBtn) {
    renderStokData(); // Panggil rendering data awal saat di halaman stok

    tambahStokBtn.addEventListener('click', function () {
      if (addStokForm.style.display === 'none') {
        addStokForm.style.display = 'block';
        tambahStokBtn.textContent = 'Sembunyikan Form';
      } else {
        addStokForm.style.display = 'none';
        tambahStokBtn.textContent = 'Tambahkan Stok Baru';
      }
    });
  }

  if (submitStokBtn) {
    submitStokBtn.addEventListener('click', function () {
      var newStok = {
        kodeLokasi: document.getElementById('inputKodeLokasi').value,
        kodeBarang: document.getElementById('inputKodeBarang').value,
        namaBarang: document.getElementById('inputNamaBarang').value,
        jenisBarang: document.getElementById('inputJenisBarang').value,
        edisi: document.getElementById('inputEdisi').value,
        stok: parseInt(document.getElementById('inputStok').value),
        cover: "assets/default_new.jpg"
      };

      if (Object.values(newStok).some(function (val) {
        return val === "" || typeof val === 'number' && isNaN(val);
      })) {
        alert("Harap lengkapi semua data dengan benar!");
        return;
      }

      dataBahanAjar.push(newStok);
      renderStokData(); // Reset form

      document.getElementById('inputKodeLokasi').value = '';
      document.getElementById('inputKodeBarang').value = '';
      document.getElementById('inputNamaBarang').value = '';
      document.getElementById('inputJenisBarang').value = '';
      document.getElementById('inputEdisi').value = '';
      document.getElementById('inputStok').value = '';
      alert("Data ".concat(newStok.namaBarang, " berhasil ditambahkan!"));
      addStokForm.style.display = 'none';
      tambahStokBtn.textContent = 'Tambahkan Stok Baru';
    });
  }
});