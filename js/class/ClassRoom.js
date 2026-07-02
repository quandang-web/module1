/**
 * Lớp ClassRoom đại diện cho thực thể Lớp học
 * Đây là lớp Model (Mô hình dữ liệu) định nghĩa các thuộc tính của một Lớp học
 */
class ClassRoom {
    id;       // Mã lớp học
    name;     // Tên lớp học
    teacher;  // Giáo viên phụ trách

    constructor(id, name, teacher) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
    }
}
