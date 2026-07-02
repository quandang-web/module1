/**
 * Lớp ClassManager quản lý danh sách lớp học và thực hiện các nghiệp vụ CRUD liên quan
 * Đây là lớp Logic (Business Logic) dành cho đối tượng Lớp học (ClassRoom)
 */
class ClassManager {
    listClass; // Mảng chứa các đối tượng lớp học (ClassRoom)

    constructor() {
        this.listClass = this.layRaTuLocalStorage();

        // Khởi tạo lớp học mẫu nếu localStorage trống
        if (this.listClass.length === 0) {
            this.listClass = [
                new ClassRoom("1", "C0424G1", "Kiều Anh"),
                new ClassRoom("2", "C0524H1", "Quang Huy"),
                new ClassRoom("3", "JV2403", "Minh Trí")
            ];
            this.luuLocalStorage();
        }
    }

    /**
     * Thêm lớp học mới
     * @param {ClassRoom} newClass - Đối tượng lớp học mới
     * @returns {boolean} true nếu thành công, false nếu trùng ID
     */
    themLop(newClass) {
        if (!this.kiemTraTrungId(newClass.id)) {
            this.listClass.push(newClass);
            this.luuLocalStorage();
            return true;
        }
        return false;
    }

    // Lấy toàn bộ danh sách lớp học
    layDanhSachLop() {
        return this.listClass;
    }

    // Xóa lớp học theo ID
    xoaLop(id) {
        let viTri = this.timViTri(id);
        if (viTri !== -1) {
            this.listClass.splice(viTri, 1);
            this.luuLocalStorage();
            return true;
        }
        return false;
    }

    // Cập nhật thông tin lớp học theo ID
    capNhatLop(id, newClass) {
        let viTri = this.timViTri(id);
        if (viTri !== -1) {
            this.listClass[viTri] = newClass;
            this.luuLocalStorage();
            return true;
        }
        return false;
    }

    // Lấy thông tin lớp học theo ID
    layThongTinLop(id) {
        let viTri = this.timViTri(id);
        if (viTri !== -1) {
            return this.listClass[viTri];
        }
        return null;
    }

    /**
     * Kiểm tra trùng lặp ID lớp học
     * @param {string|number} id - ID cần kiểm tra
     * @returns {boolean} true nếu trùng, false nếu chưa tồn tại
     */
    kiemTraTrungId(id) {
        return this.timViTri(id) !== -1;
    }

    // Tìm kiếm vị trí (chỉ mục) của lớp học trong mảng dựa vào ID
    timViTri(id) {
        for (let i = 0; i < this.listClass.length; i++) {
            if (this.listClass[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    // Lưu danh sách lớp học vào LocalStorage
    luuLocalStorage() {
        localStorage.setItem("listClass", JSON.stringify(this.listClass));
    }

    // Lấy danh sách lớp học từ LocalStorage
    layRaTuLocalStorage() {
        let data = localStorage.getItem("listClass");
        if (data) {
            return JSON.parse(data);
        }
        return [];
    }
}