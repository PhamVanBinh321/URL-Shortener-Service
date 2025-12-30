# URL Shortener Service

## 📝 Mô tả bài toán

Dự án là một hệ thống rút gọn liên kết (URL Shortener) hoàn chỉnh, cung cấp giải pháp chuyển đổi các đường dẫn dài thành các liên kết ngắn gọn, dễ chia sẻ và quản lý. Không chỉ dừng lại ở việc rút gọn đơn thuần, hệ thống còn tập trung vào trải nghiệm người dùng toàn diện với các tính năng:
- **Quản lý liên kết:** Tạo, sửa, xóa, và tùy chỉnh mã ngắn (custom alias).
- **Mã QR:** Tự động tạo mã QR cho mỗi liên kết rút gọn.
- **Phân tích dữ liệu (Analytics):** Theo dõi chi tiết lượt click, bao gồm thời gian, địa chỉ IP, vị trí địa lý, thiết bị và trình duyệt.
- **Bảo mật & Hiệu năng:** Tích hợp Rate Limiting, xác thực người dùng (JWT), và caching để đảm bảo tốc độ và an toàn.

Hệ thống được thiết kế theo kiến trúc **Clean Architecture** tại Backend và giao diện hiện đại **React/Vite** tại Frontend.

---

## 🚀 Cách chạy project

### Yêu cầu tiên quyết (Prerequisites)
- **Go** (1.21+)
- **Node.js** (18+) & **npm**
- **MySQL** (8.0+)
- **Redis** (mặc định port 6379)

### 1. Backend Setup

1.  **Clone repository:**
    ```bash
    git clone https://github.com/PhamVanBinh321/URL-Shortener-Service.git
    cd URL-Shortener-Service/backend
    ```

2.  **Cấu hình Database & Environment:**
    - Mở file `configs/config.yaml`.
    - Cập nhật thông tin kết nối MySQL (`user`, `password`, `name`) và Redis nếu cần.
    - Đảm bảo MySQL đã chạy và database `url_shortener` (hoặc tên bạn cấu hình) đã được tạo (hệ thống sẽ tự động migrate bảng, nhưng DB schema cần tồn tại).

3.  **Cài đặt dependencies và chạy:**
    ```bash
    go mod tidy
    go run cmd/server/main.go
    ```
    - Server sẽ chạy tại `http://localhost:8081` (mặc định).

### 2. Frontend Setup

1.  **Di chuyển vào thư mục frontend:**
    ```bash
    cd ../frontend/Modern URL Shortener Interface
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    # Hoặc nếu dùng pnpm:
    # pnpm install
    ```

3.  **Chạy server development:**
    ```bash
    npm run dev
    ```
    - Web app sẽ chạy tại `http://localhost:5173`.

---

## 🛠 Thiết kế & Quyết định kỹ thuật

### 1. Tại sao chọn Database này?
- **MySQL (Primary DB):**
    - Dữ liệu (User, URL) có tính cấu trúc cao và quan hệ chặt chẽ (User sở hữu URL, URL có nhiều Analytics log).
    - Tính năng ACID là cần thiết để đảm bảo tính toàn vẹn dữ liệu (ví dụ: không để 2 user tạo cùng 1 custom alias tại cùng 1 thời điểm).
- **Redis (Cache & Queue):**
    - **Caching:** Giảm tải cho database khi truy vấn thông tin URL gốc từ mã ngắn (Read-heavy workload).
    - **Queue:** Dùng làm message queue đơn giản để xử lý tác vụ ghi log analytics bất đồng bộ (Write-heavy), giúp API phản hồi nhanh hơn mà không cần chờ ghi log vào MySQL xong.

### 2. Tại sao thiết kế API kiểu này?
- **Clean Architecture:** Chia project thành các tầng `Handler` -> `Service` -> `Repository`. Giúp code dễ test, dễ bảo trì và thay đổi công nghệ (ví dụ đổi DB) mà không ảnh hưởng logic nghiệp vụ.
- **RESTful API:** Chuẩn mực, dễ hiểu, dễ tích hợp với Frontend.
- **Authentication:** Sử dụng JWT (Access Token + Refresh Token) để bảo mật, stateless và dễ dàng mở rộng (scale horizontally).

### 3. Thuật toán generate mã ngắn là gì?
- Sử dụng bộ ký tự **Base62** (`a-z`, `A-Z`, `0-9`).
- **Logic:**
    - Sử dụng `crypto/rand` để chọn ngẫu nhiên các ký tự từ bộ Base62.
    - Độ dài mặc định là 7 ký tự (có thể cấu hình).
    - Không gian mẫu: $62^7 \approx 3.5 \times 10^{12}$ (3.5 nghìn tỷ) tổ hợp, đủ lớn để giảm thiểu va chạm.

### 4. Xử lý conflict/duplicate như thế nào?
- **Chiến lược:** "Generate & Retry".
- Khi sinh ra một mã ngắn ngẫu nhiên, hệ thống sẽ kiểm tra trong Database xem mã này đã tồn tại chưa.
- Nếu tồn tại (collision), hệ thống sẽ thử sinh lại mã khác (tối đa 10 lần).
- **Lý do:** Với độ dài 7 ký tự, xác suất va chạm là cực thấp ở quy mô dữ liệu hiện tại. Cách này đơn giản hơn so với việc duy trì một distributed counter (như Zookeeper) hay ID generator phức tạp (Snowflake) mà vẫn hiệu quả.
- **Với Custom Alias:** Sử dụng `UNIQUE constraint` trong Database (hoặc check exist) để đảm bảo duy nhất. Nếu user chọn trùng, trả về lỗi ngay lập tức.

---

## ⚖️ Trade-offs

- **Random Generation vs ID-based Encoding:**
    - *Em chọn Random Generation thay vì ID-based (encode ID 1, 2, 3... sang base62) vì:*
        - **Bảo mật:** Random code khó đoán hơn. ID-based (ví dụ `abc` rồi đến `abd`) cho phép kẻ xấu dễ dàng đoán ra số lượng URL và crawl toàn bộ dữ liệu của hệ thống.
        - **Nhược điểm:** Phải xử lý va chạm (collision check).
        - **Chấp nhận:** Vì xác suất va chạm rất thấp và chi phí check (qua index DB hoặc Bloom Filter trong tương lai) là chấp nhận được.

- **Sync vs Async Analytics:**
    - *Em chọn Async (dùng Worker) thay vì ghi trực tiếp vào DB:*
        - **Lý do:** Ghi log analytics là tác vụ nặng về ghi. Nếu user phải chờ DB insert xong log mới redirect thì latency sẽ cao.
        - **Trade-off:** Dữ liệu analytics có thể hiển thị trễ vài giây (Eventual Consistency), nhưng trải nghiệm người dùng (tốc độ redirect) được ưu tiên hàng đầu.

---

## 🔥 Challenges

1.  **Vấn đề:** Tốc độ phản hồi API khi lượng request tăng cao, đặc biệt là endpoint redirect.
    - **Giải quyết:** Sử dụng Redis để cache mapping `ShortCode -> OriginalURL`.
    - **Kết quả:** Giảm thời gian phản hồi từ ~20ms (MySQL query) xuống <1ms (Redis get).

2.  **Vấn đề:** Ghi nhận Analytics chính xác (IP, Location, Device).
    - **Giải quyết:** Tích hợp `GeoIPService` để phân giải IP sang location và parser User-Agent. Xử lý bất đồng bộ qua Queue để không chặn luồng chính.

---

## 🔮 Limitations & Improvements

### Code hiện tại còn thiếu gì?
- **Unit Test:** Độ phủ test chưa cao, cần bổ sung thêm test case cho các edge cases.
- **Dockerize:** Chưa có file `Dockerfile` và `docker-compose` hoàn chỉnh để deploy "1-click".

### Nếu có thêm thời gian sẽ làm gì?
- **Bloom Filter:** Tích hợp Bloom Filter vào Redis để kiểm tra sự tồn tại của short code nhanh hơn nữa, giảm thiểu query vào DB khi check duplicate.
- **Advanced Analytics:** Thêm biểu đồ trực quan hơn, export báo cáo (CS/PDF).
- **Link Expiration:** Hiện thực Job chạy định kỳ để cleanup các hard-expired links (hiện tại chỉ check logic khi truy cập).

### Production-ready cần thêm gì?
- **Monitoring & Logging:** Tích hợp Prometheus/Grafana để theo dõi sức khỏe hệ thống, ELK stack cho logging tập trung.
- **CI/CD:** Thiết lập pipeline tự động test và deploy.
- **Horizontal Scaling:** Chạy nhiều instance backend đằng sau Load Balancer.
