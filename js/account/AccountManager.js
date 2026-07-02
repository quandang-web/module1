/**
 * Lớp AccountManager quản lý danh sách tài khoản người dùng, đăng ký, đăng nhập và phân quyền
 * Đây là lớp Logic (Business Logic) dành cho đối tượng Tài khoản (Account)
 */
class AccountManager {
    listAccount; // Mảng chứa các đối tượng tài khoản (Account)

    constructor() {
        this.listAccount = this.layRaTuLocalStorage();

        // Nếu chưa có tài khoản nào, tự động tạo tài khoản Admin mặc định để thử nghiệm
        if (this.listAccount.length == 0) {
            this.listAccount.push(
                new Account("admin", "123", "Admin")
            );
            this.luuLocalStorage();
        }
    }

    /**
     * Đăng ký tài khoản mới (mặc định vai trò là 'User')
     * @param {Account} account - Đối tượng tài khoản cần đăng ký
     * @returns {boolean} true nếu đăng ký thành công, false nếu trùng username
     */
    dangKy(account) {
        for (let i = 0; i < this.listAccount.length; i++) {
            if (this.listAccount[i].username == account.username) {
                return false; // Tên đăng nhập đã tồn tại
            }
        }
        this.listAccount.push(account);
        this.luuLocalStorage();
        return true;
    }

    /**
     * Đăng nhập hệ thống
     * @param {string} username - Tên đăng nhập
     * @param {string} password - Mật khẩu
     * @returns {boolean} true nếu thông tin đúng, false nếu sai
     */
    dangNhap(username, password) {
        for (let i = 0; i < this.listAccount.length; i++) {
            let acc = this.listAccount[i];
            if (acc.username == username && acc.password == password) {
                // Lưu session người dùng hiện tại vào LocalStorage
                localStorage.setItem("currentUser", JSON.stringify(acc));
                return true;
            }
        }
        return false;
    }

    // Đăng xuất và xóa session
    dangXuat() {
        localStorage.removeItem("currentUser");
    }

    // Lấy thông tin tài khoản đang đăng nhập hiện tại
    layNguoiDangNhap() {
        let data = localStorage.getItem("currentUser");
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }

    // Lấy toàn bộ danh sách tài khoản trong hệ thống
    layDanhSachTaiKhoan() {
        return this.listAccount;
    }

    // Lưu danh sách tài khoản vào LocalStorage
    luuLocalStorage() {
        localStorage.setItem("listAccount", JSON.stringify(this.listAccount));
    }

    // Lấy danh sách tài khoản từ LocalStorage
    layRaTuLocalStorage() {
        let data = localStorage.getItem("listAccount");
        if (data) {
            return JSON.parse(data);
        }
        return [];
    }
}