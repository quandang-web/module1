/**
 * Lớp Student đại diện cho thực thể Sinh viên
 * Đây là lớp Model (Mô hình dữ liệu) định nghĩa các thuộc tính của một Sinh viên
 */
class Student {
    id;       // Mã sinh viên (unique)
    name;     // Tên sinh viên
    age;      // Tuổi
    img;      // Đường dẫn ảnh (URL hoặc Base64)
    classId;  // ID lớp học mà sinh viên thuộc về (Liên kết đến ClassRoom.id)

    constructor(id, name, age, img, classId) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.img = img;
        this.classId = classId;
    }
}