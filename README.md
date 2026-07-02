# 📚 Hướng Dẫn Sử Dụng — Quản Lý Sinh Viên (SMS)

---

## 🚀 Mở ứng dụng như thế nào?

**Bước 1:** Mở Terminal (hoặc Command Prompt), gõ lệnh sau rồi nhấn Enter:

```bash
python -m http.server 8000
```

**Bước 2:** Mở trình duyệt (Chrome, Edge...), nhập vào thanh địa chỉ:

```
http://localhost:8000/html/index.html
```

> Nếu bạn dùng **VS Code**, có thể chuột phải vào file `html/index.html` → chọn **"Open with Live Server"** thay thế.

---

## 🔑 Đăng nhập lần đầu

Khi vào ứng dụng, bạn sẽ thấy màn hình đăng nhập.

Dùng tài khoản có sẵn:

- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `123`

Nhấn nút **Đăng nhập** → Hệ thống sẽ vào Dashboard.

---

## 🏠 Sau khi đăng nhập thấy gì?

Bạn sẽ thấy **Bảng Điều Khiển (Dashboard)** với 3 con số thống kê:

- 👨‍🎓 **Học viên** — Có bao nhiêu sinh viên đang được quản lý
- 🏫 **Lớp học** — Có bao nhiêu lớp học
- 👤 **Tài khoản** — Có bao nhiêu tài khoản trên hệ thống

Thanh menu bên trái dùng để điều hướng giữa các màn hình.

---

## 👨‍🎓 Xem & tìm kiếm sinh viên

1. Click **"Sinh viên"** ở menu bên trái
2. Danh sách sinh viên hiện ra
3. Muốn tìm kiếm → gõ tên vào ô **"Tên học viên"**
4. Muốn lọc theo tuổi → nhập số vào ô **"Tuổi từ"** và **"Đến tuổi"**
5. Muốn xem lại tất cả → nhấn nút **"Đặt lại"**

---

## ➕ Thêm sinh viên mới

> ⚠️ Chỉ tài khoản **Admin** mới thực hiện được bước này.

1. Click **"➕ Thêm sinh viên"** ở menu bên trái
2. Điền thông tin vào form:
   - **Mã sinh viên** — Ví dụ: `SV001` (không được trùng với sinh viên đã có)
   - **Họ và tên** — Tên đầy đủ
   - **Tuổi** — Nhập số, ví dụ: `20`
   - **Lớp học** — Chọn từ danh sách thả xuống
   - **Link ảnh** — Có thể bỏ trống, hệ thống tự tạo ảnh
3. Nhấn **"Thêm mới"**

---

## ✏️ Sửa hoặc 🗑️ Xóa sinh viên

> ⚠️ Chỉ tài khoản **Admin** mới thấy các nút này.

- Trong bảng danh sách sinh viên, mỗi dòng có 2 nút:
  - Nhấn **✏️ Sửa** → chỉnh sửa thông tin rồi nhấn **"💾 Cập nhật"**
  - Nhấn **🗑️ Xóa** → xác nhận để xóa sinh viên đó

---

## 🏫 Quản lý Lớp học

Tương tự quản lý sinh viên:

1. Click **"Quản lý lớp"** ở menu bên trái
2. Xem danh sách lớp học (có hiển thị số học viên mỗi lớp)
3. Nhấn **"➕ Thêm lớp"** để tạo lớp mới (cần: Mã lớp, Tên lớp, Giáo viên)
4. Nhấn **✏️ Sửa** hoặc **🗑️ Xóa** để chỉnh sửa

> ⚠️ Không thể xóa lớp học nếu lớp đó còn sinh viên. Hãy chuyển sinh viên sang lớp khác trước.

---

## 📝 Đăng ký tài khoản mới

1. Click **"📝 Đăng ký"** ở menu bên trái
2. Nhập Tên đăng nhập, Mật khẩu, Xác nhận mật khẩu
3. Nhấn **"Đăng ký tài khoản"**

> Tài khoản tự đăng ký chỉ có quyền **xem** — không thêm/sửa/xóa được.

---

## 🚪 Đăng xuất

Nhấn nút **"🚪 Đăng xuất"** ở cuối menu bên trái → Xác nhận → Trở về màn hình đăng nhập.

---

## ❓ Gặp sự cố?

| Vấn đề | Cách xử lý |
|---|---|
| Mở file trực tiếp không chạy được | Cần chạy qua server (xem phần đầu) |
| Quên mật khẩu | Xóa LocalStorage: F12 → Application → Local Storage → Xóa tất cả |
| Không thấy nút Thêm/Sửa/Xóa | Tài khoản của bạn là User, không phải Admin |
