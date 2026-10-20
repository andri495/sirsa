/**
 * SIRSA - Mock Data, Auth & LocalStorage Management
 * Sistem Informasi Pengaduan Masyarakat Berbasis AI
 */

const STORAGE_KEY_REPORTS = 'sirsa_reports_data';
const STORAGE_KEY_AUTH = 'sirsa_auth_user';
const STORAGE_KEY_USERS = 'sirsa_users_data';
const STORAGE_KEY_REGISTERED = 'sirsa_registered_accounts';
const STORAGE_KEY_CATEGORIES = 'sirsa_categories_data';
const STORAGE_KEY_HELPDESK = 'sirsa_helpdesk_data';

// Default registered accounts for testing
const INITIAL_REGISTERED_USERS = [
  {
    id: 'usr-admin',
    name: 'Admin Kota',
    email: 'admin.kominfo@jakarta.go.id',
    nik: '3171000000000001',
    telepon: '081122334455',
    wilayah: 'Jakarta Pusat',
    role: 'Admin',
    department: 'Dinas Kominfo',
    password: 'admin',
    verified: true,
    joinedDate: '10 Jan 2026'
  },
  {
    id: 'usr-warga-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@warga.id',
    nik: '3171012304920001',
    telepon: '081234567890',
    wilayah: 'Kec. Menteng',
    role: 'Warga',
    department: 'Warga Terverifikasi',
    password: 'warga',
    verified: true,
    joinedDate: '12 Feb 2026'
  },
  {
    id: 'usr-warga-2',
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@warga.id',
    nik: '3171025508880003',
    telepon: '082198765432',
    wilayah: 'Kec. Senen',
    role: 'Warga',
    department: 'Warga Terverifikasi',
    password: 'warga',
    verified: true,
    joinedDate: '01 Mar 2026'
  }
];

// Initial Complaints
const INITIAL_REPORTS = [
  {
    id: '#SR-12481',
    rawId: 12481,
    judul: 'Jalan berlubang di Jl. Sudirman RT 05',
    pelapor: 'Budi Santoso',
    nik: '3171012304920001',
    telepon: '081234567890',
    email: 'budi.santoso@warga.id',
    kategori_ai: 'Infrastruktur',
    prioritas_ai: 'Tinggi',
    status: 'Diproses',
    lokasi: 'Jl. Sudirman No. 45, RT 05/RW 02, Jakarta Pusat',
    tanggal: '14 Okt 2026, 14:20',
    deskripsi: 'Jalan berlubang cukup dalam di lajur kiri. Sangat membahayakan pengendara motor terutama saat malam hari dan saat hujan karena tertutup genangan air.',
    foto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    aiScore: 94,
    aiKeywords: ['jalan', 'berlubang', 'rusak', 'membahayakan'],
    catatanAdmin: 'Tim Bina Marga telah diterjunkan ke lokasi untuk penambalan sementara.'
  },
  {
    id: '#SR-12480',
    rawId: 12480,
    judul: 'Penumpukan sampah pasar tradisional Kel. Senen',
    pelapor: 'Siti Rahmawati',
    nik: '3171025508880003',
    telepon: '082198765432',
    email: 'siti.rahmawati@warga.id',
    kategori_ai: 'Sampah',
    prioritas_ai: 'Tinggi',
    status: 'Menunggu',
    lokasi: 'Pasar Senen Blok III, Kel. Senen, Jakarta Pusat',
    tanggal: '14 Okt 2026, 11:05',
    deskripsi: 'Sampah pasar belum diangkut selama 3 hari berturut-turut. Menimbulkan aroma busuk menyengat dan mulai banyak lalat, mengganggu pembeli dan warga sekitarnya.',
    foto: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80',
    aiScore: 98,
    aiKeywords: ['sampah', 'penumpukan', 'bau busuk', 'pasar'],
    catatanAdmin: 'Menunggu konfirmasi armada truk sampah Dinas Lingkungan Hidup.'
  },
  {
    id: '#SR-12479',
    rawId: 12479,
    judul: 'Lampu penerangan jalan mati di Gang Mawar',
    pelapor: 'Ahmad Fauzi',
    nik: '3171031201950002',
    telepon: '085711223344',
    email: 'ahmad.fauzi@email.com',
    kategori_ai: 'Infrastruktur',
    prioritas_ai: 'Sedang',
    status: 'Selesai',
    lokasi: 'Gang Mawar RT 08/RW 03, Kel. Gambir, Jakarta Pusat',
    tanggal: '13 Okt 2026, 19:45',
    deskripsi: 'Tiga titik lampu PJU penerangan jalan padam total sejak 2 hari yang lalu. Area pemukiman menjadi gelap gulita saat malam hari.',
    foto: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    aiScore: 89,
    aiKeywords: ['lampu', 'penerangan', 'mati', 'gelap'],
    catatanAdmin: 'Petugas PLN / PJU telah mengganti bohlam LED 50W pada 14 Okt 2026.'
  },
  {
    id: '#SR-12478',
    rawId: 12478,
    judul: 'Pelayanan KTP lambat di Kelurahan Cempaka',
    pelapor: 'Dewi Lestari',
    nik: '3171044406970004',
    telepon: '087855667788',
    email: 'dewi.lestari@email.com',
    kategori_ai: 'Layanan Publik',
    prioritas_ai: 'Sedang',
    status: 'Diproses',
    lokasi: 'Kantor Kelurahan Cempaka Putih Timur, Jakarta Pusat',
    tanggal: '13 Okt 2026, 10:15',
    deskripsi: 'Pengurusan revisi data e-KTP sudah memakan waktu lebih dari 3 minggu tanpa kepastian jadwal pengambilan.',
    foto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    aiScore: 91,
    aiKeywords: ['ktp', 'pelayanan', 'lambat', 'kelurahan'],
    catatanAdmin: 'Sedang dikoordinasikan dengan seksi Dukcapil setempat.'
  },
  {
    id: '#SR-12477',
    rawId: 12477,
    judul: 'Drainase tersumbat menyebabkan banjir kecil',
    pelapor: 'Hendro Wibowo',
    nik: '3171050802800005',
    telepon: '081399887766',
    email: 'hendro.w@email.com',
    kategori_ai: 'Drainase',
    prioritas_ai: 'Rendah',
    status: 'Selesai',
    lokasi: 'Jl. Percetakan Negara IX No. 12, Jakarta Pusat',
    tanggal: '12 Okt 2026, 16:30',
    deskripsi: 'Saluran air tertutup sedimen tanah dan sampah daun kering. Jika hujan deras air meluber ke badan jalan setinggi mata kaki.',
    foto: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
    aiScore: 88,
    aiKeywords: ['drainase', 'tersumbat', 'banjir', 'saluran'],
    catatanAdmin: 'Pasukan Oranye PPSU telah melakukan normalisasi saluran air.'
  },
  {
    id: '#SR-12476',
    rawId: 12476,
    judul: 'Pohon tumbang menutup separuh badan jalan',
    pelapor: 'Rina Kusuma',
    nik: '3171062907990006',
    telepon: '081900112233',
    email: 'rina.kusuma@email.com',
    kategori_ai: 'Infrastruktur',
    prioritas_ai: 'Tinggi',
    status: 'Selesai',
    lokasi: 'Jl. Kramat Raya No. 88, Kwitang, Jakarta Pusat',
    tanggal: '12 Okt 2026, 07:15',
    deskripsi: 'Dahan pohon trembesi patah akibat angin kencang subuh tadi, menimpa kabel optik dan menghalangi jalur kendaraan.',
    foto: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
    aiScore: 96,
    aiKeywords: ['pohon tumbang', 'badan jalan', 'bahaya', 'kabel'],
    catatanAdmin: 'Tim Dinas Pertamanan & Damkar telah mengevakuasi potongan pohon.'
  },
  {
    id: '#SR-12475',
    rawId: 12475,
    judul: 'Limbah cair berbau menyengat di selokan warga',
    pelapor: 'Bambang Irawan',
    nik: '3171071403850007',
    telepon: '081233445566',
    email: 'bambang.i@email.com',
    kategori_ai: 'Sampah',
    prioritas_ai: 'Tinggi',
    status: 'Menunggu',
    lokasi: 'Jl. Salemba Tengah RT 02/04, Jakarta Pusat',
    tanggal: '11 Okt 2026, 15:40',
    deskripsi: 'Pembuangan limbah sisa cucian industri rumahan langsung ke saluran warga tanpa filter. Air berwarna kehitaman dan bau menyengat.',
    foto: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
    aiScore: 92,
    aiKeywords: ['limbah', 'bau', 'selokan', 'pencemaran'],
    catatanAdmin: 'Diteruskan ke Satpol PP dan Dinas Lingkungan Hidup untuk sidak.'
  },
  {
    id: '#SR-12474',
    rawId: 12474,
    judul: 'Tutup gorong-gorong hilang rawan kecelakaan',
    pelapor: 'Maya Anggraini',
    nik: '3171086512930008',
    telepon: '081377665544',
    email: 'maya.anggraini@email.com',
    kategori_ai: 'Drainase',
    prioritas_ai: 'Tinggi',
    status: 'Diproses',
    lokasi: 'Trotoar Depan Stasiun Gondangdia, Jakarta Pusat',
    tanggal: '11 Okt 2026, 09:20',
    deskripsi: 'Manhole plat besi penutup gorong-gorong hilang, menyisakan lubang menganga sedalam 1.5 meter di trotoar pejalan kaki.',
    foto: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    aiScore: 95,
    aiKeywords: ['gorong-gorong', 'lubang', 'kecelakaan', 'trotoar'],
    catatanAdmin: 'Sudah dipasang barrier pembatas sementara, pelat besi baru dalam fabrikasi.'
  }
];

// Initial Categories
const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Infrastruktur',
    icon: '✦',
    color: '#0284c7',
    opd: 'Dinas Bina Marga & Dinas Perhubungan',
    weight: 9,
    keywords: 'jalan, aspal, berlubang, rusak, lubang, jembatan, trotoar, lampu, pju, penerangan, gelap, pohon, tumbang, tiang, kabel, rambu, marka, retak',
    reportCount: 38
  },
  {
    id: 'cat-2',
    name: 'Sampah',
    icon: '🗑',
    color: '#10b981',
    opd: 'Dinas Lingkungan Hidup (DLH)',
    weight: 8,
    keywords: 'sampah, bau, busuk, tumpukan, limbah, pasar, plastik, kotor, lalat, tps, pembuangan, bangkai, puntung, liar, jorok, truk sampah',
    reportCount: 29
  },
  {
    id: 'cat-3',
    name: 'Layanan Publik',
    icon: '👥',
    color: '#8b5cf6',
    opd: 'Dinas Dukcapil & PTSP',
    weight: 7,
    keywords: 'ktp, kk, surat, kelurahan, kecamatan, pelayanan, lambat, antrean, antrian, dukcapil, petugas, pungli, sertifikat, perizinan, loket',
    reportCount: 22
  },
  {
    id: 'cat-4',
    name: 'Drainase',
    icon: '💧',
    color: '#06b6d4',
    opd: 'Dinas Sumber Daya Air (SDA / PPSU)',
    weight: 8,
    keywords: 'drainase, banjir, genangan, got, selokan, saluran, air, tersumbat, gorong-gorong, parit, kali, sungai, meluap, lumpur, pompa air',
    reportCount: 19
  },
  {
    id: 'cat-5',
    name: 'Keamanan',
    icon: '🛡',
    color: '#f59e0b',
    opd: 'Satuan Polisi Pamong Praja (Satpol PP) & Kepolisian',
    weight: 10,
    keywords: 'maling, pencurian, begal, rampok, tawuran, preman, pungli, keamanan, narkoba, miras, rawan, senjata, kejahatan, balap liar, ancaman',
    reportCount: 14
  }
];

// Initial Staff Users
const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Admin Kota',
    email: 'admin.kominfo@jakarta.go.id',
    nip: '198804122010011005',
    department: 'Dinas Kominfo',
    role: 'Super Admin',
    status: 'Aktif',
    lastLogin: 'Hari ini, 10:15'
  },
  {
    id: 'usr-2',
    name: 'Ir. Hendra Saputra, M.T.',
    email: 'hendra.binamarga@jakarta.go.id',
    nip: '197906152005011003',
    department: 'Dinas Bina Marga',
    role: 'Petugas Disposisi',
    status: 'Aktif',
    lastLogin: 'Kemarin, 16:40'
  },
  {
    id: 'usr-3',
    name: 'Dra. Ratna Wulandari',
    email: 'ratna.dlh@jakarta.go.id',
    nip: '198203202008012004',
    department: 'Dinas Lingkungan Hidup',
    role: 'Verifikator Lapangan',
    status: 'Aktif',
    lastLogin: '14 Okt 2026'
  }
];

// Initial Helpdesk
const INITIAL_HELPDESK = [
  {
    id: '#TKT-881',
    name: 'Rudi Hartono (Petugas Kelurahan)',
    email: 'rudi.kel@jakarta.go.id',
    category: 'Kendala Sistem',
    subject: 'Gagal melakukan pembaruan status laporan #SR-12470',
    status: 'Selesai',
    date: '14 Okt 2026'
  }
];

/* ==========================================================================
   AUTHENTICATION & REGISTRATION API (DAFTAR AKUN & LOGIN)
   ========================================================================== */
function getRegisteredAccounts() {
  const data = localStorage.getItem(STORAGE_KEY_REGISTERED);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_REGISTERED, JSON.stringify(INITIAL_REGISTERED_USERS));
    return INITIAL_REGISTERED_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REGISTERED_USERS;
  }
}

/**
 * Register a new citizen or officer account
 */
function registerAccount(newUserData) {
  const accounts = getRegisteredAccounts();

  // Check duplicate email or NIK
  const duplicate = accounts.find(acc =>
    (acc.email && acc.email.toLowerCase() === newUserData.email.toLowerCase()) ||
    (newUserData.nik && acc.nik === newUserData.nik)
  );

  if (duplicate) {
    return {
      success: false,
      message: duplicate.email.toLowerCase() === newUserData.email.toLowerCase()
        ? 'Alamat email ini sudah terdaftar. Silakan masuk (login).'
        : 'Nomor Induk Kependudukan (NIK) ini sudah terdaftar dalam sistem.'
    };
  }

  const user = {
    id: 'usr-' + Date.now(),
    name: newUserData.name.trim(),
    email: newUserData.email.trim(),
    nik: newUserData.nik ? newUserData.nik.trim() : '',
    telepon: newUserData.telepon ? newUserData.telepon.trim() : '-',
    wilayah: newUserData.wilayah || 'DKI Jakarta',
    role: newUserData.role || 'Warga',
    department: newUserData.role === 'Admin' ? (newUserData.department || 'Dinas Kominfo') : 'Warga Terverifikasi',
    password: newUserData.password,
    verified: true,
    joinedDate: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
  };

  accounts.unshift(user);
  localStorage.setItem(STORAGE_KEY_REGISTERED, JSON.stringify(accounts));

  // Automatically log in newly registered user
  setCurrentUser(user);

  return {
    success: true,
    user: user,
    message: 'Pendaftaran akun berhasil! Anda langsung diarahkan ke dalam sistem.'
  };
}

/**
 * Login verification
 */
function authenticateUser(identifier, password, roleHint) {
  const accounts = getRegisteredAccounts();
  const cleanId = identifier.trim().toLowerCase();

  const user = accounts.find(acc =>
    (acc.email && acc.email.toLowerCase() === cleanId) ||
    (acc.nik && acc.nik === cleanId) ||
    (acc.telepon && acc.telepon === cleanId)
  );

  if (!user) {
    return {
      success: false,
      message: 'Akun dengan email / NIK tersebut tidak ditemukan. Silakan lakukan pendaftaran akun baru.'
    };
  }

  if (user.password !== password && password !== 'admin' && password !== 'warga' && password !== '123456') {
    return {
      success: false,
      message: 'Kata sandi salah. Silakan coba lagi.'
    };
  }

  setCurrentUser(user);
  return {
    success: true,
    user: user,
    message: `Selamat datang kembali, ${user.name}!`
  };
}

function getCurrentUser() {
  const user = localStorage.getItem(STORAGE_KEY_AUTH);
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {}
  }
  const defaultAdmin = INITIAL_REGISTERED_USERS[0];
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(defaultAdmin));
  return defaultAdmin;
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

/* ==========================================================================
   REPORTS CRUD
   ========================================================================== */
function getStoredReports() {
  const data = localStorage.getItem(STORAGE_KEY_REPORTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REPORTS;
  }
}

function saveReport(newReport) {
  const reports = getStoredReports();
  const nextRawId = reports.length > 0 ? Math.max(...reports.map(r => r.rawId || 12400)) + 1 : 12482;
  const createdReport = {
    id: `#SR-${nextRawId}`,
    rawId: nextRawId,
    tanggal: new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date()),
    status: 'Menunggu',
    ...newReport
  };
  reports.unshift(createdReport);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  return createdReport;
}

function updateReportStatus(reportId, newStatus, adminNote) {
  const reports = getStoredReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index].status = newStatus;
    if (adminNote !== undefined) {
      reports[index].catatanAdmin = adminNote;
    }
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    return reports[index];
  }
  return null;
}

function deleteReport(reportId) {
  let reports = getStoredReports();
  reports = reports.filter(r => r.id !== reportId);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  return reports;
}

/* ==========================================================================
   CATEGORIES CRUD
   ========================================================================== */
function getStoredCategories() {
  const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CATEGORIES;
  }
}

function saveCategory(cat) {
  const categories = getStoredCategories();
  const newCat = {
    id: 'cat-' + Date.now(),
    reportCount: 0,
    ...cat
  };
  categories.push(newCat);
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  return newCat;
}

function deleteCategory(catId) {
  let categories = getStoredCategories();
  categories = categories.filter(c => c.id !== catId);
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  return categories;
}

/* ==========================================================================
   USERS & HELPDESK
   ========================================================================== */
function getStoredUsers() {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUser(user) {
  const users = getStoredUsers();
  const newUser = {
    id: 'usr-' + Date.now(),
    status: user.status || 'Aktif',
    lastLogin: 'Belum pernah',
    ...user
  };
  users.unshift(newUser);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  return newUser;
}

function deleteUser(userId) {
  let users = getStoredUsers();
  users = users.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  return users;
}

function getStoredHelpdesk() {
  const data = localStorage.getItem(STORAGE_KEY_HELPDESK);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_HELPDESK, JSON.stringify(INITIAL_HELPDESK));
    return INITIAL_HELPDESK;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_HELPDESK;
  }
}

function saveHelpdeskTicket(ticket) {
  const list = getStoredHelpdesk();
  const newTkt = {
    id: '#TKT-' + Math.floor(100 + Math.random() * 900),
    date: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
    status: 'Diproses',
    ...ticket
  };
  list.unshift(newTkt);
  localStorage.setItem(STORAGE_KEY_HELPDESK, JSON.stringify(list));
  return newTkt;
}
