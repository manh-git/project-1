# Review Vocabulary

Một ứng dụng hỗ trợ học tập thông qua Flashcard và kiểm tra kiến thức bằng Quiz.

## Tính năng chính
* **Flashcards:** Học từ vựng, khái niệm qua thẻ ghi nhớ.
* **Quiz:** Hệ thống câu hỏi trắc nghiệm có tính thời gian.
* **Kết quả:** Hiển thị điểm số và đánh giá sau khi hoàn thành.
* **Giao diện:** Responsive (tương thích cả điện thoại và máy tính).

## Công nghệ sử dụng
* **Frontend:** React.js, Vite, CSS3, HTML.
* **Backend:** Node.js, Express.
* **Database:** MS SQL Server.

## Cấu trúc thư mục
client/: Mã nguồn giao diện người dùng(React).
server/: Mã nguồn API và xử lý dữ liệu.

##  Cài đặt

Để chạy dự án này ở máy cục bộ, hãy làm theo các bước sau:

### 1. Clone dự án
```base
git clone [https://github.com/manh-git/project-1.git](https://github.com/manh-git/project-1.git)
cd project-1
```
### 2. Cài đặt cho Client
cd client
npm install
npm run dev
### 3. Cài đạt cho server
cd server
npm start
### 4. Thiết lập Database
Để chạy được dự án bạn cần tạo database mới tên là 'ReviewVocab'. Chạy file server/database.sql để tạo bảng.
Rồi cấu hình kết nối thông số. Tải dữ liệu trong folder server/data lên database.

Phát triển bởi Vũ Thị Mai Anh.
