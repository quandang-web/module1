// Khởi tạo các đối tượng quản lý nghiệp vụ
let quanLy = new StudentManager("C04");
let quanLyLop = new ClassManager();
let quanLyTaiKhoan = new AccountManager();

// Trạng thái phân trang cho danh sách sinh viên
let currentStudentList = [];
let currentStudentPage = 1;
const STUDENTS_PER_PAGE = 5;

// ==========================================
// 🛡️ PHẦN KIỂM SOÁT ĐĂNG NHẬP & PHÂN QUYỀN
// ==========================================

/**
 * Cập nhật giao diện thanh Sidebar và điều hướng dựa trên trạng thái Đăng nhập và Vai trò
 * @param {boolean} chuyenTrangMacDinh - Nếu true, sẽ tự động hiển thị màn hình mặc định tương ứng
 */
function capNhatGiaoDienTheoTrangThaiDangNhap(chuyenTrangMacDinh = false) {
  let currentUser = quanLyTaiKhoan.layNguoiDangNhap();

  // Lấy các phần tử DOM trên Sidebar
  let profileDiv = document.getElementById("sidebar-user-profile");
  let userDisplayName = document.getElementById("user-display-name");
  let userDisplayRole = document.getElementById("user-display-role");

  let btnDashboard = document.getElementById("btn-dashboard");
  let btnStudents = document.getElementById("btn-students");
  let btnAddStudent = document.getElementById("btn-add-student");
  let btnClasses = document.getElementById("btn-classes");
  let btnAddClass = document.getElementById("btn-add-class");

  let btnLogin = document.getElementById("btn-login");
  let btnRegister = document.getElementById("btn-register");
  let btnLogout = document.getElementById("btn-logout");
  let searchWrapper = document.getElementById("sidebar-search-wrapper");
  let divider = document.getElementById("sidebar-divider");

  if (currentUser) {
    // --- ĐÃ ĐĂNG NHẬP ---
    // 1. Hiển thị thông tin người dùng
    profileDiv.style.display = "block";
    userDisplayName.textContent = `Hi, ${currentUser.username}`;
    userDisplayRole.textContent = currentUser.role;
    userDisplayRole.className = `role badge ${currentUser.role === "Admin" ? "badge-admin" : "badge-user"}`;

    // Hiển thị badge nhỏ ở Header góc trên bên phải
    document.getElementById("header-user-badge").innerHTML = `
            <span class="badge ${currentUser.role === "Admin" ? "badge-admin" : "badge-user"}">
                🔑 ${currentUser.role}: ${currentUser.username}
            </span>
        `;

    // 2. Hiện các nút chức năng chính
    btnDashboard.style.display = "block";
    btnStudents.style.display = "block";
    btnClasses.style.display = "block";
    searchWrapper.style.display = "block";
    divider.style.display = "block";

    // Phân quyền: Chỉ hiển thị nút "Thêm" cho Admin
    if (currentUser.role === "Admin") {
      btnAddStudent.style.display = "block";
      btnAddClass.style.display = "block";
    } else {
      btnAddStudent.style.display = "none";
      btnAddClass.style.display = "none";
    }

    // 3. Ẩn nút Đăng nhập/Đăng ký, hiện nút Đăng xuất
    btnLogin.style.display = "none";
    btnRegister.style.display = "none";
    btnLogout.style.display = "block";

    // Điều hướng đến Dashboard nếu cần thiết
    if (chuyenTrangMacDinh) {
      hienThiDashboard();
    }
  } else {
    // --- CHƯA ĐĂNG NHẬP ---
    // 1. Ẩn thông tin người dùng và badge ở Header
    profileDiv.style.display = "none";
    document.getElementById("header-user-badge").innerHTML = "";

    // 2. Ẩn các nút chức năng chính
    btnDashboard.style.display = "none";
    btnStudents.style.display = "none";
    btnAddStudent.style.display = "none";
    btnClasses.style.display = "none";
    btnAddClass.style.display = "none";
    searchWrapper.style.display = "none";
    divider.style.display = "none";

    // 3. Hiện nút Đăng nhập/Đăng ký, ẩn nút Đăng xuất
    btnLogin.style.display = "block";
    btnRegister.style.display = "block";
    btnLogout.style.display = "none";

    // Bắt buộc chuyển về màn hình đăng nhập
    if (chuyenTrangMacDinh) {
      hienThiDangNhap();
    }
  }
}

/**
 * Đặt trạng thái Active (nổi bật) cho nút Menu đang được hiển thị
 * @param {string} buttonId - ID của nút cần active
 */
function datMenuHoatDong(buttonId) {
  let buttons = document.querySelectorAll(".sidebar button");
  buttons.forEach((btn) => btn.classList.remove("active"));

  let activeBtn = document.getElementById(buttonId);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

/**
 * Hiển thị Banner thông báo lỗi hoặc thành công trong form
 * @param {string} messages - Nội dung thông báo
 * @param {string} type - Loại thông báo: 'danger' hoặc 'success'
 * @returns {string} Chuỗi HTML của alert banner
 */
function taoAlertBanner(message, type = "danger") {
  if (!message) return "";
  return `<div class="alert-banner alert-${type}">${message}</div>`;
}

// ==========================================
// 🏠 1. MÀN HÌNH DASHBOARD (BẢNG ĐIỀU KHIỂN)
// ==========================================

function hienThiDashboard() {
  datMenuHoatDong("btn-dashboard");
  document.getElementById("header-subtitle").textContent =
    "Tổng quan số liệu thống kê hệ thống";

  let tongSV = quanLy.layDanhSachSinhVien().length;
  let tongLop = quanLyLop.layDanhSachLop().length;
  let tongTK = quanLyTaiKhoan.layDanhSachTaiKhoan().length;

  document.getElementById("main").innerHTML = `
        <div class="section-title">Bảng Điều Khiển Hệ Thống</div>
        
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-icon" style="background: #e0e7ff; color: #4f46e5;">👨‍🎓</div>
                <div class="stat-info">
                    <h3>${tongSV}</h3>
                    <p>Học viên</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #d1fae5; color: #10b981;">🏫</div>
                <div class="stat-info">
                    <h3>${tongLop}</h3>
                    <p>Lớp học</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #fef3c7; color: #f59e0b;">👤</div>
                <div class="stat-info">
                    <h3>${tongTK}</h3>
                    <p>Tài khoản</p>
                </div>
            </div>
        </div>

        <br><br>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <h3 style="margin-bottom: 10px;">Chào mừng trở lại!</h3>
            <p style="color: var(--text-muted); font-size: 14px; line-height: 1.6;">
                Hệ thống SMS cho phép quản lý thông tin học viên, lớp học và phân quyền tài khoản chặt chẽ.
                Sử dụng thanh điều hướng bên trái để quản lý danh sách sinh viên hoặc quản lý thông tin lớp học.
            </p>
        </div>
    `;
}

// ==========================================
// 👨‍🎓 2. MÀN HÌNH QUẢN LÝ SINH VIÊN (CRUD)
// ==========================================

/**
 * Hiển thị danh sách sinh viên cùng bộ lọc tìm kiếm nâng cao
 * @param {Student[]} listStudent - Danh sách sinh viên cần hiển thị (nếu có)
 */
function hienThiHome(listStudent) {
  datMenuHoatDong("btn-students");
  document.getElementById("header-subtitle").textContent =
    "Xem danh sách và tìm kiếm thông tin học viên";

  if (listStudent === undefined) {
    listStudent = quanLy.layDanhSachSinhVien();
  }

  currentStudentList = listStudent;
  currentStudentPage = 1;

  let currentUser = quanLyTaiKhoan.layNguoiDangNhap();
  let isEditingAllowed = currentUser && currentUser.role === "Admin";

  // Giao diện Bộ lọc tìm kiếm
  let filterHtml = `
        <div class="filter-bar">
            <div class="form-group" style="flex: 2;">
                <label for="filter-name">Tên học viên</label>
                <input type="text" id="filter-name" class="form-control" placeholder="Tìm theo tên..." oninput="locDanhSachSinhVien()">
            </div>
            <div class="form-group">
                <label for="filter-age-min">Tuổi từ</label>
                <input type="number" id="filter-age-min" class="form-control" placeholder="Từ" oninput="locDanhSachSinhVien()">
            </div>
            <div class="form-group">
                <label for="filter-age-max">Đến tuổi</label>
                <input type="number" id="filter-age-max" class="form-control" placeholder="Đến" oninput="locDanhSachSinhVien()">
            </div>
            <div class="form-group">
                <button class="btn-outline" onclick="datLaiBoLocSV()" style="height: 40px; width: 100%;">Đặt lại</button>
            </div>
        </div>
    `;

  // Cấu trúc Bảng hiển thị
  let tableHtml = `
        <div class="section-title">
            Danh Sách Học Viên
            ${isEditingAllowed ? `<button class="btn-primary" onclick="hienThiFormTao()">➕ Thêm học viên</button>` : ""}
        </div>
        
        ${filterHtml}
        
        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>ID</th>
                        <th>Họ và Tên</th>
                        <th>Tuổi</th>
                        <th>Lớp học</th>
                        ${isEditingAllowed ? `<th style="text-align: center;">Hành động</th>` : ""}
                    </tr>
                </thead>
                <tbody id="student-list-rows">
                    <!-- Sẽ được điền bằng hàm hienThiDanhSachVienRows -->
                </tbody>
            </table>
        </div>
        <div id="student-pagination" class="pagination"></div>
    `;

  document.getElementById("main").innerHTML = tableHtml;
  hienThiDanhSachVienRows();
}

/**
 * Hiển thị các dòng (rows) dữ liệu sinh viên trong bảng
 */
function hienThiDanhSachVienRows(isEditingAllowed) {
  let listStudent = currentStudentList || [];
  let currentUser = quanLyTaiKhoan.layNguoiDangNhap();
  isEditingAllowed =
    isEditingAllowed !== undefined
      ? isEditingAllowed
      : currentUser && currentUser.role === "Admin";

  let htmlStr = "";
  let totalItems = listStudent.length;
  let totalPages = Math.max(Math.ceil(totalItems / STUDENTS_PER_PAGE), 1);
  if (currentStudentPage > totalPages) {
    currentStudentPage = totalPages;
  }

  let startIndex = (currentStudentPage - 1) * STUDENTS_PER_PAGE;
  let endIndex = startIndex + STUDENTS_PER_PAGE;
  let pagedStudents = listStudent.slice(startIndex, endIndex);

  if (pagedStudents.length === 0) {
    htmlStr = `<tr><td colspan="${isEditingAllowed ? 6 : 5}" class="no-data-msg">Không tìm thấy học viên nào thỏa mãn điều kiện</td></tr>`;
    document.getElementById("student-list-rows").innerHTML = htmlStr;
    document.getElementById("student-pagination").innerHTML = "";
    return;
  }

  for (let i = 0; i < pagedStudents.length; i++) {
    let student = pagedStudents[i];

    // Tìm tên lớp dựa vào classId liên kết
    let lop = quanLyLop.layThongTinLop(student.classId);
    let tenLop = lop
      ? lop.name
      : `<span style="color: var(--text-muted); font-style: italic;">Chưa phân lớp</span>`;

    htmlStr += `
            <tr>
                <td>
                    <img src="${student.img || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}" 
                         alt="Avatar" onerror="this.src='https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'">
                </td>
                <td><strong>#${student.id}</strong></td>
                <td style="font-weight: 500;">${student.name}</td>
                <td>${student.age} tuổi</td>
                <td><span class="badge badge-user">${tenLop}</span></td>
                ${
                  isEditingAllowed
                    ? `
                <td>
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-warning" style="padding: 6px 12px; font-size: 13px;" onclick="hienThiFormSua('${student.id}')">✏️ Sửa</button>
                        <button class="btn-danger" style="padding: 6px 12px; font-size: 13px;" onclick="xoaSinhVien('${student.id}')">🗑️ Xóa</button>
                    </div>
                </td>`
                    : ""
                }
            </tr>
        `;
  }
  document.getElementById("student-list-rows").innerHTML = htmlStr;
  renderStudentPagination(totalPages);
}

function renderStudentPagination(totalPages) {
  let paginationHtml = "";
  if (totalPages <= 1) {
    document.getElementById("student-pagination").innerHTML = paginationHtml;
    return;
  }

  paginationHtml += `<button class="pagination-btn" onclick="changeStudentPage(${Math.max(currentStudentPage - 1, 1)})" ${currentStudentPage === 1 ? "disabled" : ""}>‹</button>`;

  for (let page = 1; page <= totalPages; page++) {
    paginationHtml += `<button class="pagination-btn ${page === currentStudentPage ? "active" : ""}" onclick="changeStudentPage(${page})">${page}</button>`;
  }

  paginationHtml += `<button class="pagination-btn" onclick="changeStudentPage(${Math.min(currentStudentPage + 1, totalPages)})" ${currentStudentPage === totalPages ? "disabled" : ""}>›</button>`;

  document.getElementById("student-pagination").innerHTML = paginationHtml;
}

function changeStudentPage(pageNumber) {
  let totalItems = (currentStudentList || []).length;
  let totalPages = Math.max(Math.ceil(totalItems / STUDENTS_PER_PAGE), 1);
  if (pageNumber < 1 || pageNumber > totalPages) {
    return;
  }
  currentStudentPage = pageNumber;
  hienThiDanhSachVienRows();
}

/**
 * Lọc danh sách sinh viên kết hợp đa tiêu chí: theo Tên và khoảng Tuổi
 */
function locDanhSachSinhVien() {
  let nameKeyword = document.getElementById("filter-name").value;
  let ageMin = document.getElementById("filter-age-min").value;
  let ageMax = document.getElementById("filter-age-max").value;

  let allStudents = quanLy.layDanhSachSinhVien();

  // Lọc theo tên gần đúng trước
  let filtered = quanLy.layDanhSachSinhVienTheoTenGanDung(nameKeyword);

  // Lọc tiếp theo khoảng tuổi
  let ageMinVal = ageMin ? parseInt(ageMin) : 0;
  let ageMaxVal = ageMax ? parseInt(ageMax) : Infinity;

  filtered = filtered.filter((student) => {
    let age = parseInt(student.age);
    return age >= ageMinVal && age <= ageMaxVal;
  });

  currentStudentList = filtered;
  currentStudentPage = 1;
  hienThiDanhSachVienRows();
}

/**
 * Đặt lại các ô input lọc danh sách sinh viên về ban đầu
 */
function datLaiBoLocSV() {
  document.getElementById("filter-name").value = "";
  document.getElementById("filter-age-min").value = "";
  document.getElementById("filter-age-max").value = "";
  hienThiHome();
}

/**
 * Hàm tìm kiếm nhanh ở sidebar
 */
function timKiemSinhVienNhanh() {
  let keyword = document.getElementById("keyword").value;
  let danhSachSV = quanLy.layDanhSachSinhVienTheoTenGanDung(keyword);
  currentStudentList = danhSachSV;
  currentStudentPage = 1;
  hienThiHome(danhSachSV);
}

/**
 * Hiển thị Form Thêm học viên mới
 */
function hienThiFormTao(errorMsg = "") {
  datMenuHoatDong("btn-add-student");
  document.getElementById("header-subtitle").textContent =
    "Tạo mới thông tin sinh viên";

  // Lấy danh sách lớp học để điền vào dropdown select
  let listLop = quanLyLop.layDanhSachLop();
  let classOptions = listLop
    .map(
      (lop) =>
        `<option value="${lop.id}">${lop.name} (${lop.teacher})</option>`,
    )
    .join("");

  document.getElementById("main").innerHTML = `
        <div class="section-title">Tạo Mới Học Viên</div>
        
        ${taoAlertBanner(errorMsg, "danger")}

        <div style="max-width: 500px;">
            <div class="form-group">
                <label for="id">Mã sinh viên (ID) <span style="color: var(--danger);">*</span></label>
                <input type="text" id="id" class="form-control" placeholder="Nhập mã sinh viên (Ví dụ: SV100)">
            </div>
            
            <div class="form-group">
                <label for="name">Họ và tên <span style="color: var(--danger);">*</span></label>
                <input type="text" id="name" class="form-control" placeholder="Nhập họ và tên học viên">
            </div>
            
            <div class="form-group">
                <label for="age">Tuổi <span style="color: var(--danger);">*</span></label>
                <input type="number" id="age" class="form-control" placeholder="Nhập tuổi (phải lớn hơn 0)">
            </div>
            
            <div class="form-group">
                <label for="classId">Lớp học</label>
                <select id="classId" class="form-control">
                    <option value="">-- Chọn lớp học --</option>
                    ${classOptions}
                </select>
            </div>
            
            <div class="form-group">
                <label for="img">Link ảnh đại diện (URL)</label>
                <input type="text" id="img" class="form-control" placeholder="Đường dẫn link ảnh (Có thể để trống để dùng ảnh mặc định)">
            </div>
            
            <div class="form-actions">
                <button class="btn-primary" onclick="themSinhVien()">Thêm mới</button>
                <button class="btn-outline" onclick="hienThiHome()">Hủy bỏ</button>
            </div>
        </div>
    `;
}

/**
 * Thực hiện lưu học viên mới sau khi validate thông tin đầu vào
 */
function themSinhVien() {
  let id = document.getElementById("id").value.trim();
  let name = document.getElementById("name").value.trim();
  let ageInput = document.getElementById("age").value.trim();
  let classId = document.getElementById("classId").value;
  let img = document.getElementById("img").value.trim();

  // 1. Kiểm tra để trống các trường bắt buộc
  if (!id || !name || !ageInput) {
    hienThiFormTao("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
    return;
  }

  // 2. Kiểm tra định dạng và giá trị Tuổi
  let age = parseInt(ageInput);
  if (isNaN(age) || age <= 0 || age > 100) {
    hienThiFormTao("Tuổi sinh viên phải là số nguyên dương hợp lệ (1 - 100)");
    return;
  }

  // 3. Kiểm tra trùng lặp ID
  if (quanLy.kiemTraTrungId(id)) {
    hienThiFormTao(
      `Mã sinh viên "${id}" đã tồn tại trên hệ thống. Vui lòng chọn mã khác.`,
    );
    return;
  }

  // Nếu ảnh trống, tạo một ảnh ngẫu nhiên đẹp dựa trên ID học viên
  if (!img) {
    img = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
  }

  // Lưu vào database giả lập
  let newStudent = new Student(id, name, age, img, classId);
  quanLy.themSinhVien(newStudent);

  alert("Thêm sinh viên thành công!");
  hienThiHome();
}

/**
 * Hiển thị form cập nhật thông tin học viên
 */
function hienThiFormSua(id, errorMsg = "") {
  let thongTinSinhVien = quanLy.layThongTinSinhVien(id);
  if (!thongTinSinhVien) {
    alert("Không tìm thấy thông tin sinh viên!");
    hienThiHome();
    return;
  }

  let listLop = quanLyLop.layDanhSachLop();
  let classOptions = listLop
    .map((lop) => {
      let selected = lop.id == thongTinSinhVien.classId ? "selected" : "";
      return `<option value="${lop.id}" ${selected}>${lop.name} (${lop.teacher})</option>`;
    })
    .join("");

  document.getElementById("main").innerHTML = `
        <div class="section-title">Cập Nhật Thông Tin Học Viên</div>
        
        ${taoAlertBanner(errorMsg, "danger")}

        <div style="max-width: 500px;">
            <div class="form-group">
                <label for="id">Mã sinh viên (Không thể sửa)</label>
                <input type="text" id="id" class="form-control" value="${thongTinSinhVien.id}" readonly style="background: #f1f5f9; cursor: not-allowed;">
            </div>
            
            <div class="form-group">
                <label for="name">Họ và tên <span style="color: var(--danger);">*</span></label>
                <input type="text" id="name" class="form-control" value="${thongTinSinhVien.name}">
            </div>
            
            <div class="form-group">
                <label for="age">Tuổi <span style="color: var(--danger);">*</span></label>
                <input type="number" id="age" class="form-control" value="${thongTinSinhVien.age}">
            </div>
            
            <div class="form-group">
                <label for="classId">Lớp học</label>
                <select id="classId" class="form-control">
                    <option value="">-- Chọn lớp học --</option>
                    ${classOptions}
                </select>
            </div>
            
            <div class="form-group">
                <label for="img">Link ảnh đại diện (URL)</label>
                <input type="text" id="img" class="form-control" value="${thongTinSinhVien.img}">
            </div>
            
            <div class="form-actions">
                <button class="btn-success" onclick="capNhatSinhVien('${id}')">💾 Cập nhật</button>
                <button class="btn-outline" onclick="hienThiHome()">Hủy bỏ</button>
            </div>
        </div>
    `;
}

/**
 * Xử lý cập nhật thông tin sinh viên
 */
function capNhatSinhVien(id) {
  let name = document.getElementById("name").value.trim();
  let ageInput = document.getElementById("age").value.trim();
  let classId = document.getElementById("classId").value;
  let img = document.getElementById("img").value.trim();

  // 1. Kiểm tra để trống
  if (!name || !ageInput) {
    hienThiFormSua(id, "Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
    return;
  }

  // 2. Kiểm tra định dạng và giá trị Tuổi
  let age = parseInt(ageInput);
  if (isNaN(age) || age <= 0 || age > 100) {
    hienThiFormSua(
      id,
      "Tuổi sinh viên phải là số nguyên dương hợp lệ (1 - 100)",
    );
    return;
  }

  if (!img) {
    img = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
  }

  let updatedStudent = new Student(id, name, age, img, classId);
  quanLy.capNhatSinhVien(id, updatedStudent);

  alert("Cập nhật sinh viên thành công!");
  hienThiHome();
}

/**
 * Thực hiện xóa học viên
 */
function xoaSinhVien(id) {
  let xacNhan = confirm(
    `Bạn chắc chắn muốn xóa sinh viên có ID là "${id}" không? Hành động này không thể hoàn tác.`,
  );
  if (xacNhan) {
    quanLy.xoaSinhVien(id);
    hienThiHome();
  }
}

// ==========================================
// 🏫 3. MÀN HÌNH QUẢN LÝ LỚP HỌC (CRUD)
// ==========================================

function hienThiDanhSachLop() {
  datMenuHoatDong("btn-classes");
  document.getElementById("header-subtitle").textContent =
    "Quản lý thông tin các lớp học hiện có";

  let list = quanLyLop.layDanhSachLop();
  let currentUser = quanLyTaiKhoan.layNguoiDangNhap();
  let isEditingAllowed = currentUser && currentUser.role === "Admin";

  let html = `
        <div class="section-title">
            Danh Sách Lớp Học
            ${isEditingAllowed ? `<button class="btn-primary" onclick="hienThiFormThemLop()">➕ Thêm lớp mới</button>` : ""}
        </div>
        
        <div style="overflow-x: auto; margin-top: 20px;">
            <table>
                <thead>
                    <tr>
                        <th>Mã Lớp (ID)</th>
                        <th>Tên Lớp Học</th>
                        <th>Giáo Viên Phụ Trách</th>
                        <th>Sỉ số</th>
                        ${isEditingAllowed ? `<th style="text-align: center;">Hành động</th>` : ""}
                    </tr>
                </thead>
                <tbody>
    `;

  if (list.length === 0) {
    html += `<tr><td colspan="${isEditingAllowed ? 5 : 4}" class="no-data-msg">Không có lớp học nào hiện tại</td></tr>`;
  } else {
    // Lấy tất cả sinh viên để đếm sỉ số động
    let allStudents = quanLy.layDanhSachSinhVien();

    for (let i = 0; i < list.length; i++) {
      let lop = list[i];
      // Đếm số lượng sinh viên thuộc lớp này
      let siSo = allStudents.filter(
        (student) => student.classId == lop.id,
      ).length;

      html += `
                <tr>
                    <td><strong>#${lop.id}</strong></td>
                    <td style="font-weight: 500;">${lop.name}</td>
                    <td>👨‍🏫 ${lop.teacher}</td>
                    <td><span class="badge badge-user">${siSo} học viên</span></td>
                    ${
                      isEditingAllowed
                        ? `
                    <td>
                        <div style="display: flex; gap: 8px; justify-content: center;">
                            <button class="btn-warning" style="padding: 6px 12px; font-size: 13px;" onclick="hienThiSuaLop('${lop.id}')">✏️ Sửa</button>
                            <button class="btn-danger" style="padding: 6px 12px; font-size: 13px;" onclick="xoaLop('${lop.id}')">🗑️ Xóa</button>
                        </div>
                    </td>`
                        : ""
                    }
                </tr>
            `;
    }
  }

  html += `
                </tbody>
            </table>
        </div>
    `;

  document.getElementById("main").innerHTML = html;
}

/**
 * Hiển thị form tạo lớp học mới
 */
function hienThiFormThemLop(errorMsg = "") {
  datMenuHoatDong("btn-add-class");
  document.getElementById("header-subtitle").textContent =
    "Tạo mới thông tin lớp học";

  document.getElementById("main").innerHTML = `
        <div class="section-title">Thêm Lớp Học Mới</div>
        
        ${taoAlertBanner(errorMsg, "danger")}

        <div style="max-width: 500px;">
            <div class="form-group">
                <label for="class-id">Mã lớp học (ID) <span style="color: var(--danger);">*</span></label>
                <input type="text" id="class-id" class="form-control" placeholder="Nhập mã lớp học (Ví dụ: LH001)">
            </div>
            
            <div class="form-group">
                <label for="class-name">Tên lớp học <span style="color: var(--danger);">*</span></label>
                <input type="text" id="class-name" class="form-control" placeholder="Nhập tên lớp (Ví dụ: C0424G1)">
            </div>
            
            <div class="form-group">
                <label for="class-teacher">Giáo viên phụ trách <span style="color: var(--danger);">*</span></label>
                <input type="text" id="class-teacher" class="form-control" placeholder="Tên giáo viên phụ trách">
            </div>
            
            <div class="form-actions">
                <button class="btn-primary" onclick="themLop()">Thêm mới</button>
                <button class="btn-outline" onclick="hienThiDanhSachLop()">Hủy bỏ</button>
            </div>
        </div>
    `;
}

/**
 * Lưu lớp học mới sau khi validate
 */
function themLop() {
  let id = document.getElementById("class-id").value.trim();
  let name = document.getElementById("class-name").value.trim();
  let teacher = document.getElementById("class-teacher").value.trim();

  // 1. Kiểm tra để trống
  if (!id || !name || !teacher) {
    hienThiFormThemLop("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
    return;
  }

  // 2. Kiểm tra trùng ID lớp học
  if (quanLyLop.kiemTraTrungId(id)) {
    hienThiFormThemLop(`Mã lớp học "${id}" đã tồn tại. Vui lòng chọn mã khác.`);
    return;
  }

  let classRoom = new ClassRoom(id, name, teacher);
  quanLyLop.themLop(classRoom);

  alert("Thêm lớp học thành công!");
  hienThiDanhSachLop();
}

/**
 * Hiển thị form sửa thông tin lớp học
 */
function hienThiSuaLop(id, errorMsg = "") {
  let lop = quanLyLop.layThongTinLop(id);
  if (!lop) {
    alert("Không tìm thấy thông tin lớp học!");
    hienThiDanhSachLop();
    return;
  }

  document.getElementById("main").innerHTML = `
        <div class="section-title">Sửa Thông Tin Lớp Học</div>
        
        ${taoAlertBanner(errorMsg, "danger")}

        <div style="max-width: 500px;">
            <div class="form-group">
                <label for="class-id">Mã lớp học (Không thể sửa)</label>
                <input type="text" id="class-id" class="form-control" value="${lop.id}" readonly style="background: #f1f5f9; cursor: not-allowed;">
            </div>
            
            <div class="form-group">
                <label for="class-name">Tên lớp học <span style="color: var(--danger);">*</span></label>
                <input type="text" id="class-name" class="form-control" value="${lop.name}">
            </div>
            
            <div class="form-group">
                <label for="class-teacher">Giáo viên phụ trách <span style="color: var(--danger);">*</span></label>
                <input type="text" id="class-teacher" class="form-control" value="${lop.teacher}">
            </div>
            
            <div class="form-actions">
                <button class="btn-success" onclick="capNhatLop('${id}')">💾 Cập nhật</button>
                <button class="btn-outline" onclick="hienThiDanhSachLop()">Hủy bỏ</button>
            </div>
        </div>
    `;
}

/**
 * Lưu thông tin cập nhật của lớp học
 */
function capNhatLop(id) {
  let name = document.getElementById("class-name").value.trim();
  let teacher = document.getElementById("class-teacher").value.trim();

  if (!name || !teacher) {
    hienThiSuaLop(id, "Tên lớp và giáo viên không được phép để trống");
    return;
  }

  let classRoom = new ClassRoom(id, name, teacher);
  quanLyLop.capNhatLop(id, classRoom);

  alert("Cập nhật thông tin lớp thành công!");
  hienThiDanhSachLop();
}

/**
 * Xóa lớp học
 */
function xoaLop(id) {
  // Kiểm tra xem lớp học có chứa sinh viên nào không
  let isHavingStudents = quanLy
    .layDanhSachSinhVien()
    .some((student) => student.classId == id);
  if (isHavingStudents) {
    alert(
      "Lưu ý: Không thể xóa lớp học này vì đang chứa học viên. Vui lòng chuyển học viên sang lớp khác trước khi xóa lớp.",
    );
    return;
  }

  let check = confirm(`Bạn có chắc muốn xóa lớp học có ID "${id}" không?`);
  if (check) {
    quanLyLop.xoaLop(id);
    hienThiDanhSachLop();
  }
}

// ==========================================
// 🔑 4. MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ (AUTH)
// ==========================================

/**
 * Hiển thị biểu mẫu Đăng nhập
 */
function hienThiDangNhap(alertMsg = "", alertType = "danger") {
  document.getElementById("header-subtitle").textContent =
    "Vui lòng đăng nhập tài khoản để vào hệ thống quản trị";

  document.getElementById("main").innerHTML = `
        <div class="auth-container">
            <div class="auth-header">
                <h2>Khóa học SMS</h2>
                <p>Đăng nhập tài khoản của bạn</p>
            </div>
            
            ${taoAlertBanner(alertMsg, alertType)}

            <div class="form-group">
                <label for="username">Tên đăng nhập</label>
                <input type="text" id="username" class="form-control" placeholder="Ví dụ: admin hoặc user">
            </div>

            <div class="form-group">
                <label for="password">Mật khẩu</label>
                <input type="password" id="password" class="form-control" placeholder="Nhập mật khẩu">
            </div>

            <button class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;" onclick="dangNhap()">
                Đăng nhập
            </button>
            
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-muted);">
                Chưa có tài khoản? <a href="#" onclick="hienThiDangKy(); return false;" style="color: var(--primary); text-decoration: none; font-weight: 500;">Đăng ký ngay</a>
            </p>

            <div style="margin-top: 24px; padding: 12px; border-radius: 8px; background: #f1f5f9; font-size: 12px; color: var(--text-muted);">
                <strong>Tài khoản Demo có sẵn:</strong><br>
                • Admin (Toàn quyền): admin / 123
            </div>
        </div>
    `;

  datMenuHoatDong("btn-login");
}

/**
 * Hiển thị biểu mẫu Đăng ký
 */
function hienThiDangKy(alertMsg = "", alertType = "danger") {
  document.getElementById("header-subtitle").textContent =
    "Đăng ký tài khoản người dùng mới";

  document.getElementById("main").innerHTML = `
        <div class="auth-container">
            <div class="auth-header">
                <h2>Đăng Ký Tài Khoản</h2>
                <p>Đăng ký thành viên hệ thống SMS (Vai trò: User)</p>
            </div>

            ${taoAlertBanner(alertMsg, alertType)}

            <div class="form-group">
                <label for="username">Tên đăng nhập <span style="color: var(--danger);">*</span></label>
                <input type="text" id="username" class="form-control" placeholder="Tên đăng nhập viết liền, không dấu">
            </div>

            <div class="form-group">
                <label for="password">Mật khẩu <span style="color: var(--danger);">*</span></label>
                <input type="password" id="password" class="form-control" placeholder="Tối thiểu 3 ký tự">
            </div>

            <div class="form-group">
                <label for="confirm-password">Xác nhận mật khẩu <span style="color: var(--danger);">*</span></label>
                <input type="password" id="confirm-password" class="form-control" placeholder="Nhập lại mật khẩu">
            </div>

            <button class="btn-success" style="width: 100%; justify-content: center; margin-top: 10px;" onclick="dangKy()">
                Đăng ký tài khoản
            </button>
            
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-muted);">
                Đã có tài khoản? <a href="#" onclick="hienThiDangNhap(); return false;" style="color: var(--primary); text-decoration: none; font-weight: 500;">Đăng nhập</a>
            </p>
        </div>
    `;

  datMenuHoatDong("btn-register");
}

/**
 * Thực hiện xử lý đăng ký tài khoản mới
 */
function dangKy() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirm-password").value;

  // 1. Kiểm tra để trống các trường
  if (!username || !password || !confirmPassword) {
    hienThiDangKy("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
    return;
  }

  // 2. Validate độ dài mật khẩu
  if (password.length < 3) {
    hienThiDangKy("Mật khẩu phải chứa ít nhất từ 3 ký tự trở lên");
    return;
  }

  // 3. Kiểm tra mật khẩu khớp nhau
  if (password !== confirmPassword) {
    hienThiDangKy("Mật khẩu xác nhận không khớp. Vui lòng nhập lại.");
    return;
  }

  // Mặc định tài khoản đăng ký qua web sẽ có vai trò là User (chỉ đọc)
  let account = new Account(username, password, "User");
  let check = quanLyTaiKhoan.dangKy(account);

  if (check) {
    alert("Đăng ký tài khoản thành công!");
    hienThiDangNhap("Đăng ký thành công! Vui lòng đăng nhập.", "success");
  } else {
    hienThiDangKy(
      `Tên đăng nhập "${username}" đã tồn tại. Vui lòng chọn tên khác.`,
    );
  }
}

/**
 * Thực hiện xử lý đăng nhập hệ thống
 */
function dangNhap() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  if (!username || !password) {
    hienThiDangNhap("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu");
    return;
  }

  let check = quanLyTaiKhoan.dangNhap(username, password);

  if (check) {
    alert("Đăng nhập thành công!");
    // Cập nhật lại thanh sidebar và chuyển hướng đến Dashboard
    capNhatGiaoDienTheoTrangThaiDangNhap(true);
  } else {
    hienThiDangNhap("Sai tên tài khoản hoặc mật khẩu. Vui lòng thử lại!");
  }
}

/**
 * Thực hiện đăng xuất hệ thống
 */
function dangXuat() {
  let confirmLogout = confirm(
    "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?",
  );
  if (confirmLogout) {
    quanLyTaiKhoan.dangXuat();
    alert("Đăng xuất thành công!");
    // Cập nhật lại thanh sidebar và chuyển hướng về màn hình đăng nhập
    capNhatGiaoDienTheoTrangThaiDangNhap(true);
  }
}

// ==========================================
// 🚀 KHỞI ĐỘNG HỆ THỐNG
// ==========================================
// Chạy hàm cập nhật giao diện ngay khi trang web được tải lần đầu tiên
capNhatGiaoDienTheoTrangThaiDangNhap(true);
