/**
 * SIRSA - Master Application Controller
 * Sistem Informasi Pengaduan Masyarakat Berbasis AI
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Global Application State
const AppState = {
  currentView: 'dashboard',
  currentUser: null,
  reports: [],
  categories: [],
  users: [],
  helpdesk: [],
  filters: {
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all'
  },
  dashTablePage: 1,
  dashPageSize: 5,
  uploadedPhotoBase64: null,
  activeDetailReportId: null
};

/**
 * Initialize Application
 */
function initApp() {
  AppState.currentUser = getCurrentUser();
  AppState.reports = getStoredReports();
  AppState.categories = getStoredCategories();
  AppState.users = getStoredUsers();
  AppState.helpdesk = getStoredHelpdesk();

  updateUserInterfaceProfile();
  setupNavigation();
  setupMobileDrawer();
  setupAIFormListeners();
  setupModals();
  setupCategoryManagement();
  setupUserManagement();
  setupHelpdeskManagement();
  setupAnalyticsSimulation();
  setupAuthModals();

  handleRoute();
  autoFillUserToForms();
}

/**
 * Route handling
 */
function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  switchView(hash);
}

/**
 * Switch Active View
 */
function switchView(viewName) {
  const validViews = ['dashboard', 'daftar', 'form', 'kategori', 'analitik', 'pengguna', 'bantuan', 'auth'];
  if (!validViews.includes(viewName)) {
    viewName = 'dashboard';
  }
  AppState.currentView = viewName;
  window.location.hash = viewName;

  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.style.display = 'none';
  });

  const activeSection = document.getElementById(`view-${viewName}`);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  closeMobileDrawer();

  if (viewName === 'dashboard') {
    renderDashboard();
  } else if (viewName === 'daftar') {
    renderDaftarPage();
  } else if (viewName === 'form') {
    renderFullFormPage();
  } else if (viewName === 'kategori') {
    renderCategoriesView();
  } else if (viewName === 'analitik') {
    renderAnalyticsView();
  } else if (viewName === 'pengguna') {
    renderUsersView();
  } else if (viewName === 'bantuan') {
    renderHelpdeskView();
  } else if (viewName === 'auth') {
    renderAuthPortalView();
  }
}

/**
 * Update UI for current user
 */
function updateUserInterfaceProfile() {
  const user = AppState.currentUser || getCurrentUser();
  const headerName = document.getElementById('header-user-name');
  if (headerName) {
    headerName.textContent = `${user.name} • ${user.department || user.role || 'Warga'}`;
  }

  const headerAvatar = document.getElementById('header-avatar-circle');
  if (headerAvatar) {
    headerAvatar.textContent = user.role === 'Admin' ? '👨‍💼' : '👤';
  }

  const sidebarName = document.getElementById('sidebar-user-name');
  if (sidebarName) {
    sidebarName.textContent = `Halo, ${user.name.split(' ')[0]}`;
  }

  const sidebarDept = document.getElementById('sidebar-user-dept');
  if (sidebarDept) {
    sidebarDept.textContent = user.department || (user.role === 'Admin' ? 'Dinas Kominfo - Kota' : 'Warga Terverifikasi');
  }

  const sidebarAvatar = document.querySelector('.sidebar-user-avatar');
  if (sidebarAvatar) {
    sidebarAvatar.textContent = user.role === 'Admin' ? '👨‍💼' : '👤';
  }

  // Dashboard Welcome Status Card
  const dashName = document.getElementById('dashboard-user-name');
  if (dashName) dashName.textContent = user.name;

  const dashEmail = document.getElementById('dashboard-user-email');
  if (dashEmail) dashEmail.textContent = user.email || 'Email tidak disetel';

  const dashNik = document.getElementById('dashboard-user-nik');
  if (dashNik) {
    dashNik.textContent = user.nik ? `NIK: ${user.nik}` : (user.role === 'Admin' ? 'NIP: 198504122008011002' : 'NIK: Terverifikasi');
  }

  const dashRoleBadge = document.getElementById('dashboard-user-role-badge');
  if (dashRoleBadge) {
    dashRoleBadge.textContent = user.role || 'Warga';
    dashRoleBadge.className = user.role === 'Admin' ? 'status-pill' : 'status-pill active-pill';
  }

  const dashAvatar = document.getElementById('dashboard-user-avatar');
  if (dashAvatar) dashAvatar.textContent = user.role === 'Admin' ? '👨‍💼' : '👤';
}

/**
 * Auto-fill current user data to forms
 */
function autoFillUserToForms() {
  const user = AppState.currentUser || getCurrentUser();
  if (!user || user.role === 'Admin') return;

  // Auto fill dashboard quick form
  const dashNama = document.getElementById('dash-form-nama');
  const dashNik = document.getElementById('dash-form-nik');
  if (dashNama && !dashNama.value) dashNama.value = user.name;
  if (dashNik && !dashNik.value && user.nik) dashNik.value = user.nik;

  // Auto fill full form
  const fullNama = document.getElementById('full-form-nama');
  const fullNik = document.getElementById('full-form-nik');
  const fullTel = document.getElementById('full-form-telepon');
  const fullEmail = document.getElementById('full-form-email');
  if (fullNama && !fullNama.value) fullNama.value = user.name;
  if (fullNik && !fullNik.value && user.nik) fullNik.value = user.nik;
  if (fullTel && !fullTel.value && user.telepon) fullTel.value = user.telepon;
  if (fullEmail && !fullEmail.value && user.email) fullEmail.value = user.email;
}

/**
 * Setup Navigation
 */
function setupNavigation() {
  window.addEventListener('hashchange', handleRoute);

  document.querySelectorAll('.nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const view = trigger.dataset.view;
      if (view) {
        e.preventDefault();
        switchView(view);
      }
    });
  });

  const btnTambah = document.getElementById('btn-tambah-laporan-header');
  if (btnTambah) {
    btnTambah.addEventListener('click', () => {
      openModal('modal-quick-add');
    });
  }

  const btnExport = document.getElementById('btn-export-data-header');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      openModal('modal-export-data');
    });
  }

  const profileBadge = document.getElementById('btn-user-profile-dropdown');
  if (profileBadge) {
    profileBadge.addEventListener('click', () => {
      openProfileModal();
    });
  }

  const bellBtn = document.getElementById('btn-notification-bell');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      const panel = document.getElementById('notification-dropdown-panel');
      if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
  }

  const clearNotifBtn = document.getElementById('btn-clear-notifications');
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener('click', () => {
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.style.display = 'none';
      const list = document.getElementById('notification-items-list');
      if (list) list.innerHTML = '<div style="padding:16px; text-align:center; color:#64748b; font-size:12px;">Semua notifikasi telah dibaca.</div>';
      showToast('Semua notifikasi telah ditandai dibaca.');
    });
  }

  // Header "Daftar Akun" button
  const btnDaftarHeader = document.getElementById('btn-header-daftar-akun');
  if (btnDaftarHeader) {
    btnDaftarHeader.addEventListener('click', () => {
      openModal('modal-auth-register');
    });
  }

  // Header "Ganti Akun" button
  const btnGantiHeader = document.getElementById('btn-header-ganti-akun');
  if (btnGantiHeader) {
    btnGantiHeader.addEventListener('click', () => {
      openModal('modal-auth-login');
    });
  }

  // Header "Keluar / Logout" button
  const btnLogoutHeader = document.getElementById('btn-header-logout');
  if (btnLogoutHeader) {
    btnLogoutHeader.addEventListener('click', () => {
      const current = AppState.currentUser || getCurrentUser();
      if (confirm(`Apakah Anda yakin ingin keluar dari akun ${current.name}?`)) {
        // Toggle to other user or guest
        const accounts = getRegisteredAccounts();
        const otherUser = accounts.find(a => a.id !== current.id) || INITIAL_REGISTERED_USERS[0];
        setCurrentUser(otherUser);
        AppState.currentUser = otherUser;
        updateUserInterfaceProfile();
        autoFillUserToForms();
        playSuccessChime();
        showToast(`Sesi berakhir. Sekarang masuk sebagai ${otherUser.name} (${otherUser.role})`);
        switchView('dashboard');
      }
    });
  }
}

/**
 * Setup In-App Auth Modals & Integrated Portal
 */
function setupAuthModals() {
  // 1. In-app Modal Register Form
  const regForm = document.getElementById('modal-register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('m-reg-name').value.trim();
      const nik = document.getElementById('m-reg-nik').value.trim();
      const telepon = document.getElementById('m-reg-telepon').value.trim();
      const email = document.getElementById('m-reg-email').value.trim();
      const wilayah = document.getElementById('m-reg-wilayah').value;
      const password = document.getElementById('m-reg-password').value;
      const role = document.getElementById('m-reg-role').value;

      if (role === 'Warga' && nik.length < 16) {
        alert('NIK harus terdiri dari 16 digit angka.');
        return;
      }

      const res = registerAccount({ name, nik, telepon, email, wilayah, role, password });
      if (res.success) {
        AppState.currentUser = res.user;
        updateUserInterfaceProfile();
        autoFillUserToForms();
        closeAllModals();
        playSuccessChime();
        showToast(`Selamat datang, ${name}! Akun Anda berhasil didaftarkan.`);
        if (role === 'Warga') {
          switchView('form');
        } else {
          switchView('dashboard');
        }
      } else {
        alert(res.message);
      }
    });
  }

  // 2. In-app Modal Login Form
  const loginForm = document.getElementById('modal-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('m-login-id').value.trim();
      const password = document.getElementById('m-login-pwd').value;

      const res = authenticateUser(identifier, password);
      if (res.success) {
        AppState.currentUser = res.user;
        updateUserInterfaceProfile();
        autoFillUserToForms();
        closeAllModals();
        playSuccessChime();
        showToast(`Login berhasil! Masuk sebagai ${res.user.name}`);
        if (res.user.role === 'Admin') {
          switchView('dashboard');
        } else {
          switchView('form');
        }
      } else {
        alert(res.message);
      }
    });
  }

  // 3. Integrated Portal Login Form
  const portalLoginForm = document.getElementById('portal-login-form');
  if (portalLoginForm) {
    portalLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('portal-login-id').value.trim();
      const pwd = document.getElementById('portal-login-pwd').value;
      const btn = document.getElementById('btn-submit-portal-login');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Memverifikasi kredensial...';
      }

      setTimeout(() => {
        const res = authenticateUser(id, pwd);
        if (res.success) {
          AppState.currentUser = res.user;
          updateUserInterfaceProfile();
          autoFillUserToForms();
          playSuccessChime();
          showToast(`Berhasil masuk! Selamat datang, ${res.user.name}`);
          if (btn) {
            btn.innerHTML = '✓ Berhasil Masuk!';
          }
          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = 'Masuk ke Sistem SIRSA →';
            }
            if (res.user.role === 'Admin') {
              switchView('dashboard');
            } else {
              switchView('form');
            }
          }, 350);
        } else {
          alert(res.message);
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Masuk ke Sistem SIRSA →';
          }
        }
      }, 400);
    });
  }

  // 4. Integrated Portal Register Form
  const portalRegForm = document.getElementById('portal-register-form');
  if (portalRegForm) {
    portalRegForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('p-reg-name').value.trim();
      const nik = document.getElementById('p-reg-nik').value.trim();
      const telepon = document.getElementById('p-reg-telepon').value.trim();
      const email = document.getElementById('p-reg-email').value.trim();
      const wilayah = document.getElementById('p-reg-wilayah').value;
      const pwd = document.getElementById('p-reg-pwd').value;
      const pwdConfirm = document.getElementById('p-reg-pwd-confirm').value;
      const role = document.querySelector('input[name="portal-reg-role"]:checked')?.value || 'Warga';
      const btn = document.getElementById('btn-submit-portal-reg');

      if (pwd !== pwdConfirm) {
        alert('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
        return;
      }

      if (role === 'Warga' && nik.length < 16) {
        alert('Nomor NIK harus terdiri dari 16 digit angka sesuai KTP.');
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Mendaftarkan Akun Baru...';
      }

      setTimeout(() => {
        const res = registerAccount({
          name,
          nik,
          telepon,
          email,
          wilayah,
          role,
          password: pwd
        });

        if (res.success) {
          AppState.currentUser = res.user;
          updateUserInterfaceProfile();
          autoFillUserToForms();
          playSuccessChime();
          showToast(`Registrasi sukses! Selamat datang, ${name}`);
          if (btn) {
            btn.innerHTML = '✓ Pendaftaran Sukses!';
          }
          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '🚀 Daftarkan Akun Saya Sekarang';
            }
            if (role === 'Warga') {
              switchView('form');
            } else {
              switchView('dashboard');
            }
          }, 400);
        } else {
          alert(res.message);
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🚀 Daftarkan Akun Saya Sekarang';
          }
        }
      }, 500);
    });
  }

  // Fast switch account buttons in Profile modal
  document.querySelectorAll('.btn-fast-switch-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email;
      const password = btn.dataset.pwd || 'admin';
      const res = authenticateUser(email, password);
      if (res.success) {
        AppState.currentUser = res.user;
        updateUserInterfaceProfile();
        autoFillUserToForms();
        closeAllModals();
        playSuccessChime();
        showToast(`Beralih akun ke: ${res.user.name} (${res.user.role})`);
        renderDashboard();
      }
    });
  });
}

/**
 * Audio Synthesizer Chime
 */
function playSuccessChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // Ignore audio error
  }
}

/**
 * Render Integrated Auth Portal View
 */
function renderAuthPortalView() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Switch tabs in integrated portal
 */
function switchIntegratedAuthTab(tab) {
  const panelLogin = document.getElementById('integrated-panel-login');
  const panelReg = document.getElementById('integrated-panel-register');
  const tabLogin = document.getElementById('auth-tab-btn-login');
  const tabReg = document.getElementById('auth-tab-btn-register');

  if (tab === 'login') {
    if (panelLogin) panelLogin.style.display = 'block';
    if (panelReg) panelReg.style.display = 'none';
    if (tabLogin) tabLogin.classList.add('active');
    if (tabReg) tabReg.classList.remove('active');
  } else {
    if (panelLogin) panelLogin.style.display = 'none';
    if (panelReg) panelReg.style.display = 'block';
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabReg) tabReg.classList.add('active');
  }
}

/**
 * Switch role in portal login
 */
function switchPortalLoginRole(role) {
  const btnAdmin = document.getElementById('portal-role-admin');
  const btnWarga = document.getElementById('portal-role-warga');
  const idInput = document.getElementById('portal-login-id');
  const pwdInput = document.getElementById('portal-login-pwd');
  const idLabel = document.getElementById('portal-login-id-label');

  if (role === 'Admin') {
    if (btnAdmin) btnAdmin.classList.add('active');
    if (btnWarga) btnWarga.classList.remove('active');
    if (idLabel) idLabel.innerHTML = 'Email / NIP Pegawai Dinas <span style="color:#ef4444;">*</span>';
    if (idInput) {
      idInput.value = 'admin.kominfo@jakarta.go.id';
      idInput.placeholder = 'nama@instansi.go.id';
    }
    if (pwdInput) pwdInput.value = 'admin';
  } else {
    if (btnWarga) btnWarga.classList.add('active');
    if (btnAdmin) btnAdmin.classList.remove('active');
    if (idLabel) idLabel.innerHTML = 'NIK KTP / Email Warga Pelapor <span style="color:#ef4444;">*</span>';
    if (idInput) {
      idInput.value = '3171012304920001';
      idInput.placeholder = '16 digit NIK atau email warga';
    }
    if (pwdInput) pwdInput.value = 'warga';
  }
}

/**
 * 1-Click Fast Fill for portal
 */
function quickFillPortalLogin(identifier, password, role) {
  switchPortalLoginRole(role);
  const idInput = document.getElementById('portal-login-id');
  const pwdInput = document.getElementById('portal-login-pwd');
  if (idInput) idInput.value = identifier;
  if (pwdInput) pwdInput.value = password;
  showToast(`Akun ${role} (${identifier}) telah diisikan ke formulir.`);
}

/**
 * Toggle password visibility helper
 */
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🔒 Sembunyikan';
  } else {
    input.type = 'password';
    btn.textContent = '👁 Lihat Sandi';
  }
}

/**
 * NIK validation & counter
 */
function handleNikCounter(input) {
  const counter = document.getElementById('p-reg-nik-counter');
  const cleanVal = input.value.replace(/[^0-9]/g, '');
  input.value = cleanVal;
  const len = cleanVal.length;

  if (counter) {
    counter.textContent = `${len}/16`;
    if (len === 16) {
      counter.classList.add('valid');
      counter.textContent = '16/16 ✓ Valid';
    } else {
      counter.classList.remove('valid');
    }
  }
}

/**
 * Live password strength meter
 */
function handlePasswordStrength(val) {
  const fill = document.getElementById('portal-pwd-fill');
  const text = document.getElementById('portal-pwd-text');
  if (!fill || !text) return;

  if (!val) {
    fill.style.width = '0%';
    text.textContent = 'Kekuatan: belum diisi';
    text.style.color = '#64748b';
    return;
  }

  let score = 0;
  if (val.length >= 6) score += 35;
  if (val.length >= 8) score += 25;
  if (/[A-Z]/.test(val)) score += 20;
  if (/[0-9]/.test(val)) score += 20;

  fill.style.width = score + '%';
  if (score < 40) {
    fill.style.backgroundColor = '#ef4444';
    text.textContent = 'Kekuatan: Lemah (minimal 6 karakter)';
    text.style.color = '#ef4444';
  } else if (score < 75) {
    fill.style.backgroundColor = '#f59e0b';
    text.textContent = 'Kekuatan: Cukup Baik';
    text.style.color = '#d97706';
  } else {
    fill.style.backgroundColor = '#10b981';
    text.textContent = 'Kekuatan: Sangat Kuat & Aman';
    text.style.color = '#059669';
  }
}

/**
 * Toggle portal registration fields for Warga vs Admin
 */
function togglePortalRegFields(role) {
  const labelWarga = document.getElementById('p-reg-role-label-warga');
  const labelAdmin = document.getElementById('p-reg-role-label-admin');
  const nikLabel = document.getElementById('p-reg-nik-label');
  const nikInput = document.getElementById('p-reg-nik');

  if (role === 'Admin') {
    if (labelAdmin) labelAdmin.classList.add('active');
    if (labelWarga) labelWarga.classList.remove('active');
    if (nikLabel) nikLabel.textContent = 'NIP Pegawai';
    if (nikInput) {
      nikInput.placeholder = '18 digit NIP';
      nikInput.maxLength = 18;
    }
  } else {
    if (labelWarga) labelWarga.classList.add('active');
    if (labelAdmin) labelAdmin.classList.remove('active');
    if (nikLabel) nikLabel.textContent = 'NIK (16 Digit)';
    if (nikInput) {
      nikInput.placeholder = '3171xxxxxxxxxxxx';
      nikInput.maxLength = 16;
    }
  }
}

/**
 * Mobile Drawer
 */
function setupMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('drawer-open');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', closeMobileDrawer);
  }
}

function closeMobileDrawer() {
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (sidebar) sidebar.classList.remove('drawer-open');
  if (overlay) overlay.classList.remove('active');
}

/* ==========================================================================
   VIEW 1: DASHBOARD LOGIC
   ========================================================================== */
function renderDashboard() {
  AppState.reports = getStoredReports();
  renderStatCards();
  renderDashboardTable();
  populateCategorySelects();
}

function renderStatCards() {
  const reports = AppState.reports;
  const total = reports.length;
  const highPriority = reports.filter(r => r.prioritas_ai === 'Tinggi').length;
  const completed = reports.filter(r => r.status === 'Selesai').length;
  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  const totalEl = document.getElementById('stat-total-val');
  if (totalEl) totalEl.textContent = (1248 + total - 8).toLocaleString('id-ID');

  const aiEl = document.getElementById('stat-ai-val');
  if (aiEl) aiEl.textContent = (1142 + total - 8).toLocaleString('id-ID');

  const highEl = document.getElementById('stat-high-val');
  if (highEl) highEl.textContent = (28 + highPriority - 4).toLocaleString('id-ID');

  const doneEl = document.getElementById('stat-done-val');
  if (doneEl) doneEl.textContent = (956 + completed - 2).toLocaleString('id-ID');

  const doneRateEl = document.getElementById('stat-done-rate');
  if (doneRateEl) doneRateEl.textContent = `${completionRate}% selesai`;
}

function renderDashboardTable() {
  const tbody = document.getElementById('dashboard-table-body');
  if (!tbody) return;

  const searchVal = (document.getElementById('dash-search-table')?.value || '').toLowerCase().trim();
  let reports = AppState.reports;

  if (searchVal) {
    reports = reports.filter(r =>
      r.id.toLowerCase().includes(searchVal) ||
      r.judul.toLowerCase().includes(searchVal) ||
      r.kategori_ai.toLowerCase().includes(searchVal) ||
      r.status.toLowerCase().includes(searchVal)
    );
  }

  const pageSize = AppState.dashPageSize;
  const start = (AppState.dashTablePage - 1) * pageSize;
  const paginated = reports.slice(start, start + pageSize);

  tbody.innerHTML = '';
  if (paginated.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748b;">Tidak ada laporan ditemukan.</td></tr>';
  } else {
    paginated.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="table-report-id" onclick="openReportDetailModal('${item.id}')">${start + index + 1}. ${item.id}</span></td>
        <td>
          <span class="table-report-title" title="${escapeHtml(item.judul)}">${escapeHtml(item.judul)}</span>
        </td>
        <td>${getCategoryBadge(item.kategori_ai)}</td>
        <td>${getPriorityBadge(item.prioritas_ai)}</td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openReportDetailModal('${item.id}')">
            Detail
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const paginationInfo = document.getElementById('dash-pagination-info');
  if (paginationInfo) {
    paginationInfo.textContent = `Menampilkan ${reports.length === 0 ? 0 : start + 1}-${Math.min(start + pageSize, reports.length)} dari ${1248 + AppState.reports.length - 8} laporan`;
  }
}

function setupDashboardTableControls() {
  const searchInput = document.getElementById('dash-search-table');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      AppState.dashTablePage = 1;
      renderDashboardTable();
    });
  }

  document.querySelectorAll('.dash-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const totalPages = Math.ceil(AppState.reports.length / AppState.dashPageSize);

      if (action === 'prev') {
        if (AppState.dashTablePage > 1) AppState.dashTablePage--;
      } else if (action === 'next') {
        if (AppState.dashTablePage < totalPages) AppState.dashTablePage++;
      } else {
        const p = parseInt(action, 10);
        if (!isNaN(p)) AppState.dashTablePage = p;
      }

      document.querySelectorAll('.dash-page-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`.dash-page-btn[data-action="${AppState.dashTablePage}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      renderDashboardTable();
    });
  });
}

/* ==========================================================================
   AI LIVE FORM LISTENERS
   ========================================================================== */
function setupAIFormListeners() {
  setupDashboardTableControls();

  const dashDesc = document.getElementById('dash-form-deskripsi');
  const dashCatSelect = document.getElementById('dash-form-kategori');
  const dashPrioSelect = document.getElementById('dash-form-prioritas');
  const dashInsightText = document.getElementById('dash-ai-insight-text');

  if (dashDesc) {
    dashDesc.addEventListener('input', () => {
      const text = dashDesc.value;
      const result = SIRSA_AI.classify(text);

      if (dashCatSelect && !dashCatSelect.dataset.userModified) {
        dashCatSelect.value = result.category;
      }
      if (dashPrioSelect && !dashPrioSelect.dataset.userModified) {
        dashPrioSelect.value = result.priority;
      }
      if (dashInsightText) {
        dashInsightText.innerHTML = `<strong>AI Insight:</strong> ${result.insightText}`;
      }
    });
  }

  if (dashCatSelect) {
    dashCatSelect.addEventListener('change', () => {
      dashCatSelect.dataset.userModified = 'true';
    });
  }
  if (dashPrioSelect) {
    dashPrioSelect.addEventListener('change', () => {
      dashPrioSelect.dataset.userModified = 'true';
    });
  }

  // Dashboard Widget Submit
  const dashForm = document.getElementById('dashboard-complaint-form');
  if (dashForm) {
    dashForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit('dashboard');
    });

    const resetBtn = document.getElementById('dash-form-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        dashForm.reset();
        AppState.uploadedPhotoBase64 = null;
        const preview = document.getElementById('dash-upload-preview');
        if (preview) preview.style.display = 'none';
        if (dashCatSelect) delete dashCatSelect.dataset.userModified;
        if (dashPrioSelect) delete dashPrioSelect.dataset.userModified;
        autoFillUserToForms();
      });
    }
  }

  // Dropzones
  setupImageDropzone('dash-dropzone', 'dash-photo-input', 'dash-upload-preview', 'dash-preview-img', 'dash-remove-photo');
  setupImageDropzone('full-dropzone', 'full-photo-input', 'full-upload-preview', 'full-preview-img', 'full-remove-photo');
  setupImageDropzone('quick-dropzone', 'quick-photo-input', 'quick-upload-preview', 'quick-preview-img', 'quick-remove-photo');

  // Full Form Listeners
  const fullTitle = document.getElementById('full-form-judul');
  const fullDesc = document.getElementById('full-form-deskripsi');
  if (fullTitle || fullDesc) {
    const updateFullAI = () => {
      const combined = `${fullTitle?.value || ''} ${fullDesc?.value || ''}`;
      const result = SIRSA_AI.classify(combined);

      const catSelect = document.getElementById('full-form-kategori');
      const prioSelect = document.getElementById('full-form-prioritas');
      const radarCat = document.getElementById('radar-predicted-cat');
      const radarPrio = document.getElementById('radar-predicted-prio');
      const radarScore = document.getElementById('radar-confidence-score');
      const radarTags = document.getElementById('radar-detected-tags');

      if (catSelect && !catSelect.dataset.userModified) catSelect.value = result.category;
      if (prioSelect && !prioSelect.dataset.userModified) prioSelect.value = result.priority;

      if (radarCat) radarCat.textContent = result.category;
      if (radarPrio) radarPrio.textContent = result.priority;
      if (radarScore) radarScore.textContent = `${result.confidence}%`;

      if (radarTags) {
        radarTags.innerHTML = result.detectedKeywords.length > 0
          ? result.detectedKeywords.map(k => `<span class="ai-tag-chip">#${escapeHtml(k)}</span>`).join('')
          : '<span class="ai-tag-chip" style="opacity:0.6">Belum ada kata kunci</span>';
      }
    };

    if (fullTitle) fullTitle.addEventListener('input', updateFullAI);
    if (fullDesc) fullDesc.addEventListener('input', updateFullAI);
  }

  const fullForm = document.getElementById('full-complaint-form');
  if (fullForm) {
    fullForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit('full');
    });
  }

  const quickForm = document.getElementById('quick-add-complaint-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit('quick');
    });
  }

  document.querySelectorAll('.btn-use-gps').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInputId = btn.dataset.targetInput || 'full-form-lokasi';
      const input = document.getElementById(targetInputId);
      btn.innerHTML = '⏳ Mendeteksi...';
      setTimeout(() => {
        if (input) {
          input.value = 'Jl. Medan Merdeka Barat No. 8, Gambir, Jakarta Pusat (-6.1754, 106.8272)';
        }
        btn.innerHTML = '📍 Lokasi Terdeteksi';
        showToast('Koordinat GPS berhasil disematkan!');
      }, 600);
    });
  });
}

/**
 * Handle Complaint Form Submissions
 */
function handleFormSubmit(type) {
  let nama, nik, telepon, email, judul, deskripsi, lokasi, kategori, prioritas;

  if (type === 'dashboard') {
    nama = document.getElementById('dash-form-nama')?.value.trim();
    nik = document.getElementById('dash-form-nik')?.value.trim();
    deskripsi = document.getElementById('dash-form-deskripsi')?.value.trim();
    lokasi = document.getElementById('dash-form-lokasi')?.value.trim();
    kategori = document.getElementById('dash-form-kategori')?.value;
    prioritas = document.getElementById('dash-form-prioritas')?.value;
    judul = deskripsi.length > 50 ? deskripsi.substring(0, 47) + '...' : deskripsi;
    telepon = '0812' + Math.floor(10000000 + Math.random() * 90000000);
    email = '-';
  } else if (type === 'quick') {
    nama = document.getElementById('quick-form-nama')?.value.trim();
    nik = document.getElementById('quick-form-nik')?.value.trim();
    telepon = document.getElementById('quick-form-telepon')?.value.trim() || '-';
    email = document.getElementById('quick-form-email')?.value.trim() || '-';
    judul = document.getElementById('quick-form-judul')?.value.trim();
    deskripsi = document.getElementById('quick-form-deskripsi')?.value.trim();
    lokasi = document.getElementById('quick-form-lokasi')?.value.trim();
    kategori = document.getElementById('quick-form-kategori')?.value;
    prioritas = document.getElementById('quick-form-prioritas')?.value;
  } else {
    nama = document.getElementById('full-form-nama')?.value.trim();
    nik = document.getElementById('full-form-nik')?.value.trim();
    telepon = document.getElementById('full-form-telepon')?.value.trim() || '-';
    email = document.getElementById('full-form-email')?.value.trim() || '-';
    judul = document.getElementById('full-form-judul')?.value.trim();
    deskripsi = document.getElementById('full-form-deskripsi')?.value.trim();
    lokasi = document.getElementById('full-form-lokasi')?.value.trim();
    kategori = document.getElementById('full-form-kategori')?.value;
    prioritas = document.getElementById('full-form-prioritas')?.value;
  }

  if (!nama || !nik || !deskripsi || !lokasi) {
    alert('Mohon lengkapi semua kolom yang wajib diisi (Nama, NIK, Deskripsi, dan Lokasi).');
    return;
  }

  if (nik.length < 16) {
    alert('NIK harus terdiri dari 16 digit angka.');
    return;
  }

  const aiAnalysis = SIRSA_AI.classify(`${judul} ${deskripsi}`);

  const newReport = {
    judul: judul || 'Aduan Warga ' + kategori,
    pelapor: nama,
    nik: nik,
    telepon: telepon,
    email: email,
    kategori_ai: kategori || aiAnalysis.category,
    prioritas_ai: prioritas || aiAnalysis.priority,
    lokasi: lokasi,
    deskripsi: deskripsi,
    foto: AppState.uploadedPhotoBase64 || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
    aiScore: aiAnalysis.confidence,
    aiKeywords: aiAnalysis.detectedKeywords,
    catatanAdmin: 'Laporan baru diterima sistem dan telah diklasifikasikan secara otomatis oleh AI.'
  };

  const created = saveReport(newReport);
  AppState.reports = getStoredReports();
  AppState.uploadedPhotoBase64 = null;

  if (type === 'dashboard') {
    document.getElementById('dashboard-complaint-form')?.reset();
    document.getElementById('dash-upload-preview').style.display = 'none';
    renderDashboard();
    autoFillUserToForms();
  } else if (type === 'quick') {
    document.getElementById('quick-add-complaint-form')?.reset();
    document.getElementById('quick-upload-preview').style.display = 'none';
    closeModal('modal-quick-add');
    renderDashboard();
  } else {
    document.getElementById('full-complaint-form')?.reset();
    document.getElementById('full-upload-preview').style.display = 'none';
    autoFillUserToForms();
  }

  openSuccessModal(created);
}

/**
 * Dropzone Setup Helper
 */
function setupImageDropzone(dropzoneId, inputId, previewContainerId, previewImgId, removeBtnId) {
  const dropzone = document.getElementById(dropzoneId);
  const input = document.getElementById(inputId);
  const container = document.getElementById(previewContainerId);
  const img = document.getElementById(previewImgId);
  const removeBtn = document.getElementById(removeBtnId);

  if (!dropzone || !input) return;

  dropzone.addEventListener('click', () => input.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#2563eb';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '#cbd5e1';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#cbd5e1';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], container, img);
    }
  });

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      handleImageFile(input.files[0], container, img);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      AppState.uploadedPhotoBase64 = null;
      if (container) container.style.display = 'none';
      if (img) img.src = '';
    });
  }
}

function handleImageFile(file, container, img) {
  if (!file.type.startsWith('image/')) {
    alert('Hanya berkas gambar (JPG/PNG) yang diperbolehkan.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    AppState.uploadedPhotoBase64 = e.target.result;
    if (img) img.src = e.target.result;
    if (container) container.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

/**
 * Badges Helpers
 */
function getCategoryBadge(cat) {
  const c = (cat || 'Infrastruktur').toLowerCase();
  let bgClass = 'badge-cat-infrastruktur';
  let icon = '✦';

  if (c.includes('sampah')) {
    bgClass = 'badge-cat-sampah';
    icon = '🗑';
  } else if (c.includes('layanan') || c.includes('publik')) {
    bgClass = 'badge-cat-layanan';
    icon = '👥';
  } else if (c.includes('drainase') || c.includes('banjir')) {
    bgClass = 'badge-cat-drainase';
    icon = '💧';
  } else if (c.includes('keamanan') || c.includes('tertib')) {
    bgClass = 'badge-cat-keamanan';
    icon = '🛡';
  }

  return `<span class="badge ${bgClass}">${icon} ${escapeHtml(cat)}</span>`;
}

function getPriorityBadge(priority) {
  let bgClass = 'badge-prio-sedang';
  let icon = '⚡';

  if (priority === 'Tinggi') {
    bgClass = 'badge-prio-tinggi';
    icon = '!';
  } else if (priority === 'Rendah') {
    bgClass = 'badge-prio-rendah';
    icon = '•';
  }

  return `<span class="badge ${bgClass}">${icon} ${escapeHtml(priority)}</span>`;
}

function getStatusBadge(status) {
  let bgClass = 'badge-status-menunggu';

  if (status === 'Diproses') {
    bgClass = 'badge-status-diproses';
  } else if (status === 'Selesai') {
    bgClass = 'badge-status-selesai';
  }

  return `<span class="badge ${bgClass}">${escapeHtml(status)} <span class="status-dot"></span></span>`;
}

function populateCategorySelects() {
  const categories = getStoredCategories();
  const selectIds = ['dash-form-kategori', 'full-form-kategori', 'quick-form-kategori', 'daftar-filter-cat', 'export-filter-cat'];

  selectIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    const currentVal = el.value;
    const isFilter = id.includes('filter');
    
    el.innerHTML = isFilter ? '<option value="all">Semua Kategori</option>' : '';

    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = `${cat.name} (${cat.opd ? cat.opd.split(' ')[0] : 'Umum'})`;
      el.appendChild(opt);
    });

    if (currentVal) el.value = currentVal;
  });
}

/* ==========================================================================
   VIEW 2: DAFTAR PENGADUAN LOGIC
   ========================================================================== */
function renderDaftarPage() {
  AppState.reports = getStoredReports();
  applyFiltersAndRenderDaftar();
  setupDaftarFilterListeners();
}

function applyFiltersAndRenderDaftar() {
  let list = [...AppState.reports];

  const s = AppState.filters.search.toLowerCase().trim();
  if (s) {
    list = list.filter(item =>
      item.id.toLowerCase().includes(s) ||
      item.judul.toLowerCase().includes(s) ||
      item.pelapor.toLowerCase().includes(s) ||
      item.lokasi.toLowerCase().includes(s)
    );
  }

  if (AppState.filters.category !== 'all') {
    list = list.filter(item => item.kategori_ai === AppState.filters.category);
  }
  if (AppState.filters.priority !== 'all') {
    list = list.filter(item => item.prioritas_ai === AppState.filters.priority);
  }
  if (AppState.filters.status !== 'all') {
    list = list.filter(item => item.status === AppState.filters.status);
  }

  const totalCounter = document.getElementById('daftar-total-count');
  if (totalCounter) {
    totalCounter.textContent = `Menampilkan ${list.length} dari total ${AppState.reports.length} laporan masyarakat`;
  }

  const tbody = document.getElementById('daftar-table-body');
  const cardGrid = document.getElementById('daftar-cards-grid');

  if (tbody) {
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px; color:#64748b;">Tidak ada data laporan yang cocok dengan filter pencarian.</td></tr>';
    } else {
      list.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="table-report-id" onclick="openReportDetailModal('${item.id}')">${item.id}</span></td>
          <td>
            <div style="font-weight:700; color:#0f172a; margin-bottom:2px;">${escapeHtml(item.judul)}</div>
            <div style="font-size:11.5px; color:#64748b;">📍 ${escapeHtml(item.lokasi)}</div>
          </td>
          <td>
            <div style="font-weight:600;">${escapeHtml(item.pelapor)}</div>
            <div style="font-size:11px; color:#94a3b8;">NIK: ${escapeHtml(item.nik)}</div>
          </td>
          <td>${getCategoryBadge(item.kategori_ai)}</td>
          <td>${getPriorityBadge(item.prioritas_ai)}</td>
          <td>${getStatusBadge(item.status)}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="openReportDetailModal('${item.id}')">Detail</button>
              <button class="btn btn-outline btn-sm" onclick="deleteReportConfirm('${item.id}')" style="color:#ef4444;">Hapus</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  if (cardGrid) {
    cardGrid.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-box';
      card.style.padding = '18px';
      card.style.marginBottom = '14px';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="table-report-id" onclick="openReportDetailModal('${item.id}')">${item.id}</span>
          ${getStatusBadge(item.status)}
        </div>
        <div style="font-weight:700; font-size:14.5px; margin-bottom:6px;">${escapeHtml(item.judul)}</div>
        <div style="font-size:12px; color:#64748b; margin-bottom:12px;">📍 ${escapeHtml(item.lokasi)}</div>
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:12px;">
          ${getCategoryBadge(item.kategori_ai)}
          ${getPriorityBadge(item.prioritas_ai)}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:12px;">
          <span style="font-size:11.5px; color:#94a3b8;">${escapeHtml(item.tanggal)}</span>
          <button class="btn btn-primary btn-sm" onclick="openReportDetailModal('${item.id}')">Buka & Proses</button>
        </div>
      `;
      cardGrid.appendChild(card);
    });
  }
}

function setupDaftarFilterListeners() {
  const searchInput = document.getElementById('daftar-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.filters.search = e.target.value;
      applyFiltersAndRenderDaftar();
    });
  }

  ['daftar-filter-cat', 'daftar-filter-prio', 'daftar-filter-status'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        AppState.filters.category = document.getElementById('daftar-filter-cat')?.value || 'all';
        AppState.filters.priority = document.getElementById('daftar-filter-prio')?.value || 'all';
        AppState.filters.status = document.getElementById('daftar-filter-status')?.value || 'all';
        applyFiltersAndRenderDaftar();
      });
    }
  });

  const exportBtn = document.getElementById('btn-export-daftar');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => openModal('modal-export-data'));
  }

  const printBtn = document.getElementById('btn-print-daftar');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
}

/* ==========================================================================
   VIEW 3: FORMULIR WARGA LOGIC
   ========================================================================== */
function renderFullFormPage() {
  populateCategorySelects();
  autoFillUserToForms();
  const fullTitle = document.getElementById('full-form-judul');
  if (fullTitle && fullTitle.value) {
    fullTitle.dispatchEvent(new Event('input'));
  }
}

/* ==========================================================================
   VIEW 4: KATEGORI AI MANAGEMENT
   ========================================================================== */
function setupCategoryManagement() {
  const form = document.getElementById('form-add-category');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cat-input-name').value.trim();
      const icon = document.getElementById('cat-input-icon').value;
      const color = document.getElementById('cat-input-color').value;
      const opd = document.getElementById('cat-input-opd').value.trim();
      const weight = parseInt(document.getElementById('cat-input-weight').value, 10);
      const keywords = document.getElementById('cat-input-keywords').value.trim();

      if (!name || !keywords) {
        alert('Mohon isi nama kategori dan kata kunci AI.');
        return;
      }

      saveCategory({ name, icon, color, opd, weight, keywords });
      AppState.categories = getStoredCategories();
      form.reset();
      populateCategorySelects();
      renderCategoriesView();
      showToast(`Kategori "${name}" berhasil ditambahkan ke model AI!`);
    });
  }

  const weightSlider = document.getElementById('cat-input-weight');
  const weightVal = document.getElementById('cat-weight-val');
  if (weightSlider && weightVal) {
    weightSlider.addEventListener('input', () => {
      weightVal.textContent = weightSlider.value;
    });
  }
}

function renderCategoriesView() {
  const categories = getStoredCategories();
  const container = document.getElementById('categories-cards-container');
  if (!container) return;

  container.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-card-header">
        <span class="category-title-pill" style="background-color: ${cat.color || '#2563eb'};">
          ${escapeHtml(cat.icon || '✦')} ${escapeHtml(cat.name)}
        </span>
        <button class="btn btn-outline btn-sm" onclick="handleDeleteCategory('${cat.id}', '${cat.name}')" style="color:#ef4444; border-color:#fca5a5;">
          Hapus
        </button>
      </div>

      <div style="font-size:12px; color:#64748b; margin-bottom:8px;">
        <strong>OPD Penanggung Jawab:</strong> ${escapeHtml(cat.opd || '-')}
      </div>
      <div style="font-size:12px; color:#64748b; margin-bottom:8px;">
        <strong>Bobot Prioritas AI:</strong> ${cat.weight || 5} / 10
      </div>

      <div style="font-size:11.5px; font-weight:700; color:#334155; margin-top:10px;">Kata Kunci Model NLP:</div>
      <div class="category-keywords-box">
        ${escapeHtml(cat.keywords)}
      </div>

      <div style="font-size:11px; color:#10b981; font-weight:600; display:flex; align-items:center; gap:6px;">
        <span>✓ Model Sinkron</span> • <span>Digunakan pada Form Pelaporan</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleDeleteCategory(id, name) {
  if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}" dari model AI?`)) {
    deleteCategory(id);
    AppState.categories = getStoredCategories();
    populateCategorySelects();
    renderCategoriesView();
    showToast(`Kategori "${name}" telah dihapus.`);
  }
}

/* ==========================================================================
   VIEW 5: ANALITIK AI
   ========================================================================== */
function setupAnalyticsSimulation() {
  const btnTest = document.getElementById('btn-test-nlp-simulation');
  const inputTest = document.getElementById('nlp-test-input');

  if (btnTest && inputTest) {
    btnTest.addEventListener('click', () => {
      const text = inputTest.value.trim();
      if (!text) {
        alert('Ketik kalimat keluhan untuk melakukan uji coba simulasi.');
        return;
      }
      runNLPSimulation(text);
    });

    inputTest.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        runNLPSimulation(inputTest.value.trim());
      }
    });
  }

  const dateFilter = document.getElementById('analytics-time-range');
  if (dateFilter) {
    dateFilter.addEventListener('change', () => {
      showToast(`Data analitik diperbarui untuk rentang: ${dateFilter.value}`);
      renderAnalyticsView();
    });
  }
}

function runNLPSimulation(text) {
  const res = SIRSA_AI.classify(text);
  const resultCard = document.getElementById('nlp-simulation-result');
  if (!resultCard) return;

  resultCard.style.display = 'block';
  document.getElementById('sim-cat-result').innerHTML = getCategoryBadge(res.category);
  document.getElementById('sim-prio-result').innerHTML = getPriorityBadge(res.priority);
  document.getElementById('sim-confidence-result').textContent = `${res.confidence}%`;
  document.getElementById('sim-insight-text').textContent = res.insightText;

  const probsContainer = document.getElementById('sim-probabilities-bars');
  if (probsContainer) {
    probsContainer.innerHTML = '';
    const entries = Object.entries(res.categoryProbabilities || {});
    entries.forEach(([cat, pct]) => {
      const row = document.createElement('div');
      row.className = 'bar-progress-item';
      row.innerHTML = `
        <div class="bar-progress-header">
          <span>${escapeHtml(cat)}</span>
          <span>${pct}%</span>
        </div>
        <div class="bar-progress-track">
          <div class="bar-progress-fill" style="width: ${pct}%; background-color: #2563eb;"></div>
        </div>
      `;
      probsContainer.appendChild(row);
    });
  }
}

function renderAnalyticsView() {
  const reports = getStoredReports();
  const total = reports.length;
  const categories = getStoredCategories();

  const counts = {};
  categories.forEach(c => counts[c.name] = 0);
  reports.forEach(r => {
    counts[r.kategori_ai] = (counts[r.kategori_ai] || 0) + 1;
  });

  const container = document.getElementById('analytics-category-bars');
  if (container) {
    container.innerHTML = '';
    Object.entries(counts).forEach(([cat, count]) => {
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      const div = document.createElement('div');
      div.className = 'bar-progress-item';
      div.innerHTML = `
        <div class="bar-progress-header">
          <span>${escapeHtml(cat)}</span>
          <span>${count} laporan (${pct}%)</span>
        </div>
        <div class="bar-progress-track">
          <div class="bar-progress-fill" style="width: ${pct}%; background-color: #0284c7;"></div>
        </div>
      `;
      container.appendChild(div);
    });
  }
}

/* ==========================================================================
   VIEW 6: MANAJEMEN PENGGUNA
   ========================================================================== */
function setupUserManagement() {
  const form = document.getElementById('form-add-user');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('usr-input-name').value.trim();
      const nip = document.getElementById('usr-input-nip').value.trim();
      const email = document.getElementById('usr-input-email').value.trim();
      const department = document.getElementById('usr-input-dept').value;
      const role = document.getElementById('usr-input-role').value;
      const status = document.getElementById('usr-input-status').value;

      if (!name || !email) {
        alert('Mohon isi nama dan email petugas.');
        return;
      }

      saveUser({ name, nip, email, department, role, status });
      AppState.users = getStoredUsers();
      form.reset();
      renderUsersView();
      showToast(`Petugas "${name}" berhasil ditambahkan.`);
    });
  }

  const searchInput = document.getElementById('users-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderUsersView());
  }
}

function renderUsersView() {
  const users = getStoredUsers();
  const searchVal = (document.getElementById('users-search-input')?.value || '').toLowerCase().trim();
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  let filtered = users;
  if (searchVal) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(searchVal) ||
      u.email.toLowerCase().includes(searchVal) ||
      (u.nip && u.nip.includes(searchVal)) ||
      u.department.toLowerCase().includes(searchVal)
    );
  }

  tbody.innerHTML = '';
  filtered.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight:700; color:#0f172a;">${escapeHtml(u.name)}</div>
        <div style="font-size:11px; color:#64748b;">NIP: ${escapeHtml(u.nip || '-')}</div>
      </td>
      <td>${escapeHtml(u.email)}</td>
      <td><span style="font-weight:600; color:#1e40af;">${escapeHtml(u.department)}</span></td>
      <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(u.role)}</span></td>
      <td>
        <span class="badge" style="background:${u.status === 'Aktif' ? '#dcfce7' : '#fee2e2'}; color:${u.status === 'Aktif' ? '#15803d' : '#b91c1c'};">
          ${escapeHtml(u.status)}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="handleDeleteUser('${u.id}', '${u.name}')" style="color:#ef4444; border-color:#fca5a5;">
          Hapus
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleDeleteUser(id, name) {
  if (confirm(`Yakin ingin menghapus akses petugas "${name}"?`)) {
    deleteUser(id);
    AppState.users = getStoredUsers();
    renderUsersView();
    showToast(`Pengguna "${name}" berhasil dihapus.`);
  }
}

/* ==========================================================================
   VIEW 7: BANTUAN & HELPDESK
   ========================================================================== */
function setupHelpdeskManagement() {
  const form = document.getElementById('form-helpdesk-ticket');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('help-input-name').value.trim();
      const email = document.getElementById('help-input-email').value.trim();
      const category = document.getElementById('help-input-category').value;
      const subject = document.getElementById('help-input-subject').value.trim();
      const message = document.getElementById('help-input-message').value.trim();

      if (!name || !subject || !message) {
        alert('Mohon lengkapi formulir tiket bantuan.');
        return;
      }

      const created = saveHelpdeskTicket({ name, email, category, subject, message });
      AppState.helpdesk = getStoredHelpdesk();
      form.reset();
      renderHelpdeskView();
      showToast(`Tiket bantuan ${created.id} berhasil terkirim ke Tim Teknis.`);
    });
  }

  document.querySelectorAll('.faq-accordion-item').forEach(item => {
    const head = item.querySelector('.faq-head');
    if (head) {
      head.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });
}

function renderHelpdeskView() {
  const tickets = getStoredHelpdesk();
  const listCont = document.getElementById('helpdesk-tickets-list');
  if (!listCont) return;

  listCont.innerHTML = '';
  tickets.forEach(t => {
    const item = document.createElement('div');
    item.style.padding = '14px';
    item.style.background = '#f8fafc';
    item.style.border = '1px solid #e2e8f0';
    item.style.borderRadius = '12px';
    item.style.marginBottom = '10px';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-weight:700; color:#2563eb; font-size:12px;">${escapeHtml(t.id)}</span>
        <span class="badge" style="background:#e0f2fe; color:#0369a1;">${escapeHtml(t.status)}</span>
      </div>
      <div style="font-weight:700; font-size:13.5px; margin-bottom:4px;">${escapeHtml(t.subject)}</div>
      <div style="font-size:11.5px; color:#64748b; margin-bottom:4px;">Pemohon: ${escapeHtml(t.name)} • ${escapeHtml(t.category)}</div>
      <div style="font-size:11px; color:#94a3b8;">Diajukan pada: ${escapeHtml(t.date)}</div>
    `;
    listCont.appendChild(item);
  });
}

/* ==========================================================================
   GLOBAL MODALS
   ========================================================================== */
function setupModals() {
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => closeAllModals());
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  const saveStatusBtn = document.getElementById('btn-save-detail-status');
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', saveReportStatusFromModal);
  }

  const viewDaftarFromSuccess = document.getElementById('btn-success-goto-daftar');
  if (viewDaftarFromSuccess) {
    viewDaftarFromSuccess.addEventListener('click', () => {
      closeAllModals();
      switchView('daftar');
    });
  }

  const btnDoExport = document.getElementById('btn-execute-export');
  if (btnDoExport) {
    btnDoExport.addEventListener('click', () => {
      executeAdvancedExport();
    });
  }

  const profileForm = document.getElementById('user-profile-edit-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prof-input-name').value.trim();
      const department = document.getElementById('prof-input-dept').value.trim();
      const email = document.getElementById('prof-input-email').value.trim();

      const user = { ...AppState.currentUser, name, department, email };
      setCurrentUser(user);
      AppState.currentUser = user;
      updateUserInterfaceProfile();
      closeModal('modal-user-profile');
      showToast('Profil pengguna berhasil diperbarui!');
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('open');
  });
}

function openSuccessModal(report) {
  const modal = document.getElementById('modal-ticket-success');
  if (!modal) return;

  document.getElementById('success-ticket-id').textContent = report.id;
  document.getElementById('success-report-title').textContent = report.judul;
  document.getElementById('success-report-category').innerHTML = getCategoryBadge(report.kategori_ai);
  document.getElementById('success-report-priority').innerHTML = getPriorityBadge(report.prioritas_ai);
  document.getElementById('success-report-date').textContent = report.tanggal;

  modal.classList.add('open');
}

function openProfileModal() {
  const user = getCurrentUser();
  const nameInput = document.getElementById('prof-input-name');
  const deptInput = document.getElementById('prof-input-dept');
  const emailInput = document.getElementById('prof-input-email');

  if (nameInput) nameInput.value = user.name;
  if (deptInput) deptInput.value = user.department;
  if (emailInput) emailInput.value = user.email || '';

  openModal('modal-user-profile');
}

function openReportDetailModal(reportId) {
  const reports = getStoredReports();
  const report = reports.find(r => r.id === reportId);
  if (!report) return;

  AppState.activeDetailReportId = reportId;
  const modal = document.getElementById('modal-report-detail');
  if (!modal) return;

  document.getElementById('detail-ticket-id').textContent = report.id;
  document.getElementById('detail-judul').textContent = report.judul;
  document.getElementById('detail-pelapor').textContent = report.pelapor;
  document.getElementById('detail-nik').textContent = report.nik;
  document.getElementById('detail-telepon').textContent = report.telepon || '-';
  document.getElementById('detail-tanggal').textContent = report.tanggal;
  document.getElementById('detail-lokasi').textContent = report.lokasi;
  document.getElementById('detail-deskripsi').textContent = report.deskripsi;
  document.getElementById('detail-kategori').innerHTML = getCategoryBadge(report.kategori_ai);
  document.getElementById('detail-prioritas').innerHTML = getPriorityBadge(report.prioritas_ai);
  document.getElementById('detail-status-badge').innerHTML = getStatusBadge(report.status);

  const imgEl = document.getElementById('detail-photo-img');
  if (imgEl) {
    imgEl.src = report.foto || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80';
  }

  const scoreEl = document.getElementById('detail-ai-score');
  if (scoreEl) scoreEl.textContent = `${report.aiScore || 92}%`;

  const noteInput = document.getElementById('detail-admin-note');
  if (noteInput) {
    noteInput.value = report.catatanAdmin || '';
  }

  const statusSelect = document.getElementById('detail-status-select');
  if (statusSelect) {
    statusSelect.value = report.status;
  }

  modal.classList.add('open');
}

function saveReportStatusFromModal() {
  if (!AppState.activeDetailReportId) return;

  const newStatus = document.getElementById('detail-status-select')?.value;
  const adminNote = document.getElementById('detail-admin-note')?.value;

  if (newStatus) {
    updateReportStatus(AppState.activeDetailReportId, newStatus, adminNote);
    AppState.reports = getStoredReports();
    closeAllModals();
    showToast(`Status laporan ${AppState.activeDetailReportId} berhasil diubah ke ${newStatus}`);

    if (AppState.currentView === 'dashboard') {
      renderDashboard();
    } else if (AppState.currentView === 'daftar') {
      applyFiltersAndRenderDaftar();
    }
  }
}

function deleteReportConfirm(reportId) {
  if (confirm(`Apakah Anda yakin ingin menghapus laporan ${reportId}?`)) {
    deleteReport(reportId);
    AppState.reports = getStoredReports();
    showToast(`Laporan ${reportId} berhasil dihapus.`);
    applyFiltersAndRenderDaftar();
    renderStatCards();
  }
}

function executeAdvancedExport() {
  let reports = getStoredReports();
  const format = document.getElementById('export-format')?.value || 'csv';
  const status = document.getElementById('export-filter-status')?.value || 'all';
  const category = document.getElementById('export-filter-cat')?.value || 'all';

  if (status !== 'all') reports = reports.filter(r => r.status === status);
  if (category !== 'all') reports = reports.filter(r => r.kategori_ai === category);

  if (reports.length === 0) {
    alert('Tidak ada data yang cocok dengan kriteria filter ekspor.');
    return;
  }

  if (format === 'pdf') {
    closeAllModals();
    window.print();
    return;
  }

  const headers = ['ID Laporan', 'Tanggal', 'Judul Aduan', 'Pelapor', 'NIK', 'Telepon', 'Kategori AI', 'Prioritas AI', 'Status', 'Lokasi', 'Catatan Admin'];
  const rows = reports.map(r => [
    `"${r.id}"`,
    `"${r.tanggal}"`,
    `"${r.judul.replace(/"/g, '""')}"`,
    `"${r.pelapor.replace(/"/g, '""')}"`,
    `"${r.nik}"`,
    `"${r.telepon || '-'}"`,
    `"${r.kategori_ai}"`,
    `"${r.prioritas_ai}"`,
    `"${r.status}"`,
    `"${r.lokasi.replace(/"/g, '""')}"`,
    `"${(r.catatanAdmin || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SIRSA_Laporan_Export_${status}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  closeAllModals();
  showToast(`File ekspor (${reports.length} data) berhasil diunduh!`);
}

function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.openReportDetailModal = openReportDetailModal;
window.deleteReportConfirm = deleteReportConfirm;
window.handleDeleteCategory = handleDeleteCategory;
window.handleDeleteUser = handleDeleteUser;
window.switchView = switchView;
window.openModal = openModal;
window.closeModal = closeModal;
