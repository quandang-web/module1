/**
 * Lớp StudentManager quản lý danh sách sinh viên và thực hiện các nghiệp vụ CRUD
 * Đây là lớp Logic (Business Logic) tách biệt với giao diện người dùng
 */
class StudentManager {
    name;         // Tên nhóm/lớp quản lý (ví dụ: 'C04')
    listStudent;  // Mảng chứa các đối tượng sinh viên (Student)

    constructor(nameInput) {
        this.name = nameInput;
        this.listStudent = this.layRaTuLocalStorage();

        // Khởi tạo dữ liệu mẫu nếu localStorage trống
        if (this.listStudent.length === 0) {
            this.listStudent = [
                new Student("SV001", "Nguyễn Văn An", 20, "https://api.dicebear.com/7.x/adventurer/svg?seed=An", "1"),
                new Student("SV002", "Trần Thị Bình", 22, "https://api.dicebear.com/7.x/adventurer/svg?seed=Binh", "2"),
                new Student("SV003", "Lê Hoàng Cường", 19, "https://api.dicebear.com/7.x/adventurer/svg?seed=Cuong", "1"),
                new Student("SV004", "Phạm Minh Duy", 21, "https://api.dicebear.com/7.x/adventurer/svg?seed=Duy", "2"),
                new Student("SV005", "Hoàng Thị Emy", 20, "https://api.dicebear.com/7.x/adventurer/svg?seed=Emy", "3"),
                new Student("SV006", "Võ Minh Phong", 23, "https://api.dicebear.com/7.x/adventurer/svg?seed=Phong", "1"),
                new Student("SV007", "Đặng Thu Giang", 21, "https://api.dicebear.com/7.x/adventurer/svg?seed=Giang", "2"),
                new Student("SV008", "Bùi Quốc Huy", 22, "https://api.dicebear.com/7.x/adventurer/svg?seed=Huy", "3"),
                new Student("SV009", "Cao Thị Ích", 20, "https://api.dicebear.com/7.x/adventurer/svg?seed=Ich", "1"),
                new Student("SV010", "Tạ Minh Khánh", 21, "https://api.dicebear.com/7.x/adventurer/svg?seed=Khanh", "2"),
                new Student("SV011", "Ngô Thị Linh", 19, "https://api.dicebear.com/7.x/adventurer/svg?seed=Linh", "3"),
                new Student("SV012", "Lý Văn Minh", 22, "https://api.dicebear.com/7.x/adventurer/svg?seed=Minh", "1"),
                new Student("SV013", "Mã Thị Ngân", 20, "https://api.dicebear.com/7.x/adventurer/svg?seed=Ngan", "2"),
                new Student("SV014", "Nông Văn Ơn", 23, "https://api.dicebear.com/7.x/adventurer/svg?seed=On", "3"),
                new Student("SV015", "Phan Thị Phương", 21, "https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong", "1"),
                new Student("SV016", "Quách Minh Quân", 20, "https://api.dicebear.com/7.x/adventurer/svg?seed=Quan", "2"),
                new Student("SV017", "Rơ Thị Rê", 22, "https://api.dicebear.com/7.x/adventurer/svg?seed=Re", "3"),
                new Student("SV018", "Sử Minh Sơn", 19, "https://api.dicebear.com/7.x/adventurer/svg?seed=Son", "1"),
                new Student("SV019", "Tô Thị Tâm", 21, "https://api.dicebear.com/7.x/adventurer/svg?seed=Tam", "2"),
                new Student("SV020", "Vũ Văn Úc", 23, "https://api.dicebear.com/7.x/adventurer/svg?seed=Uc", "3")
            ];
            this.luuLocalStorage();
        }
    }

    /**
     * Tìm kiếm sinh viên theo khoảng tuổi
     * @param {number} tu - Tuổi tối thiểu
     * @param {number} den - Tuổi tối đa
     * @returns {Student[]} Danh sách sinh viên thỏa mãn điều kiện
     */
    timTheoKhoangTuoi(tu, den) {
        let ketQua = [];
        let tuoiMin = parseInt(tu);
        let tuoiMax = parseInt(den);

        // Validate đầu vào
        if (isNaN(tuoiMin)) tuoiMin = 0;
        if (isNaN(tuoiMax)) tuoiMax = Infinity;

        for (let i = 0; i < this.listStudent.length; i++) {
            let student = this.listStudent[i];
            if (student.age >= tuoiMin && student.age <= tuoiMax) {
                ketQua.push(student);
            }
        }
        return ketQua;
    }

    /**
     * Tìm kiếm sinh viên theo tên gần đúng (Không phân biệt chữ hoa/thường)
     * @param {string} keyword - Từ khóa tìm kiếm
     * @returns {Student[]} Danh sách sinh viên tìm thấy
     */
    layDanhSachSinhVienTheoTenGanDung(keyword) {
        let danhSachTimThay = [];
        let lowerKeyword = keyword.toLowerCase().trim();

        for (let i = 0; i < this.listStudent.length; i++) {
            let student = this.listStudent[i];
            if (student.name.toLowerCase().includes(lowerKeyword)) {
                danhSachTimThay.push(student);
            }
        }
        return danhSachTimThay;
    }

    /**
     * Kiểm tra xem ID sinh viên đã tồn tại trong danh sách chưa
     * @param {string|number} id - ID cần kiểm tra
     * @returns {boolean} true nếu trùng, false nếu chưa tồn tại
     */
    kiemTraTrungId(id) {
        return this.layViTriSinhVienTheoId(id) !== -1;
    }

    // Lưu dữ liệu vào LocalStorage
    luuLocalStorage() {
        localStorage.setItem("listStudent", JSON.stringify(this.listStudent));
    }

    // Lấy dữ liệu từ LocalStorage
    layRaTuLocalStorage() {
        let listStudentSaved = localStorage.getItem("listStudent");
        if (listStudentSaved) {
            return JSON.parse(listStudentSaved);
        } else {
            return [];
        }
    }

    // Cập nhật thông tin sinh viên theo ID
    capNhatSinhVien(id, newStudent) {
        let viTriSinhVien = this.layViTriSinhVienTheoId(id);
        if (viTriSinhVien !== -1) {
            this.listStudent[viTriSinhVien] = newStudent;
            this.luuLocalStorage();
            return true;
        }
        return false;
    }

    // Lấy thông tin sinh viên theo ID
    layThongTinSinhVien(id) {
        let viTriSinhVien = this.layViTriSinhVienTheoId(id);
        return this.listStudent[viTriSinhVien];
    }

    // Lấy toàn bộ danh sách sinh viên
    layDanhSachSinhVien() {
        return this.listStudent;
    }

    // Thêm mới sinh viên
    themSinhVien(newStudent) {
        if (!this.kiemTraTrungId(newStudent.id)) {
            this.listStudent.push(newStudent);
            this.luuLocalStorage();
            return true;
        }
        return false;
    }

    // Xóa sinh viên theo ID
    xoaSinhVien(id) {
        let viTriSinhVien = this.layViTriSinhVienTheoId(id);
        if (viTriSinhVien !== -1) {
            this.listStudent.splice(viTriSinhVien, 1);
            this.luuLocalStorage();
            return true;
        }
        return false;
    }

    // Tìm kiếm vị trí (chỉ mục) của sinh viên trong mảng dựa vào ID
    layViTriSinhVienTheoId(id) {
        for (let i = 0; i < this.listStudent.length; i++) {
            let student = this.listStudent[i];
            // So sánh lỏng lẻo == để hỗ trợ cả kiểu chuỗi và số
            if (student.id == id) {
                return i;
            }
        }
        return -1;
    }
}
