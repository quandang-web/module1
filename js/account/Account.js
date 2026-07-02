/**
 * Lớp Account đại diện cho thực thể Tài khoản người dùng
 * Đây là lớp Model (Mô hình dữ liệu) lưu trữ thông tin đăng nhập và vai trò người dùng
 */
class Account {
    username; // Tên đăng nhập (unique)
    password; // Mật khẩu
    role;     // Vai trò: 'Admin' (đầy đủ quyền CRUD) hoặc 'User' (chỉ đọc)

    constructor(username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}