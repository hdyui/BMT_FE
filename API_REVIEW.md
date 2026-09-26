# Rà soát API — 26/09/2026

Phạm vi: các thay đổi đang có trong working tree liên quan public và admin của Trang chủ, Giới thiệu, Dự án, Tin tức, Tuyển dụng, Liên hệ và cấu hình website. Git không xác định chính xác thời điểm chỉnh từng dòng chưa commit, nên phạm vi kiểm tra dựa trên toàn bộ diff hiện tại.

## Cách gọi API sau khi tối ưu

- Giữ REST/HTTPS theo hợp đồng BE. Không thay giao thức hay tự ép HTTP/2: phiên bản HTTP do hạ tầng và client thương lượng.
- Nội dung public được tải ở server, các GET độc lập chạy song song. Next cache dữ liệu 60 giây; React chống gọi trùng trong cùng render. Trang nhận dữ liệu ngay trong HTML, không gọi lại API sau hydration.
- Header/footer/đối tác dùng dữ liệu server truyền qua provider, không còn cache trình duyệt vô thời hạn.
- Ghi admin và gửi form dùng route cùng origin. Dữ liệu admin không đưa vào cache public. GET trùng đang chạy được gộp; phiên backend được tái sử dụng, đăng nhập đồng thời được gộp, 401 chỉ thử làm mới phiên một lần.
- Ghi thành công làm hết hạn tag public tương ứng ngay. Lần render public tiếp theo lấy dữ liệu mới. Tab đã mở cần tải lại/chuyển trang; không có cơ chế push cập nhật trực tiếp.
- Lỗi HTTP, lỗi kết nối và envelope báo thất bại không được coi là lưu thành công. Request có timeout; không tự retry mutation khi timeout vì không biết BE đã ghi hay chưa.
- Form kiểm tra tên/số điện thoại ở client và proxy; proxy xử lý đúng response 204.

## Dọn dẹp và sửa lỗi

- Xóa browser test bootstrap, cache test và các script `seed-dev-*`; không xóa dữ liệu backend.
- Xóa loader admin tải toàn bộ resource không còn dùng và dữ liệu mock dự án tiêu biểu không còn được tham chiếu.
- Giữ ngoại lệ hiển thị `contacts/map.googleMapsUrl` trong bộ lọc field admin.
- Sửa ký tự lỗi ở copyright footer; bỏ section About ẩn chứa nội dung trùng.
- Giới hạn 2 worker build sau khi build mặc định 15 worker bị thiếu bộ nhớ trên máy kiểm thử.

## Kiểm chứng

- Build production với `npm run build -- --webpack`: thành công, 34 trang prerender.
- 35 resource admin đã đọc qua proxy với BE thật: tất cả HTTP 200. API admin không có phiên trả 401.
- 6 trang public chính: HTTP 200, có nội dung trong HTML, không còn bootstrap test. Kiểm tra lại nội dung render trên trình duyệt.
- 2 slug dự án có thật: có nội dung chi tiết; slug không tồn tại: HTTP 404.
- Luồng ghi thật bản đồ: đổi `%2C` thành `%2c` trong URL (cùng tọa độ), PATCH, GET lại admin và kiểm tra iframe public. Cache làm mới đúng. Đã khôi phục và kiểm tra URL gốc.
- Kiểm tra form bỏ trống trên trình duyệt: hiển thị lỗi bắt buộc. Không gửi liên hệ giả vào BE.
- `npm test`: 7 kiểm tra hồi quy, gồm field URL qua registry thật, cache public, gộp GET/login, refresh phiên, payload map và invalidation, envelope lỗi, form 204. Đây là kiểm tra tự động với network giả lập, không phải chế độ test API trong website.
- Đo nhanh HTML production local có cache: 23–136 ms ở lần smoke test; không phải cam kết latency khi deploy hoặc lúc BE cold start.

## Giới hạn phạm vi

Chưa ghi thử mọi thao tác tạo/xóa/upload trên BE thật; không thay nội dung kinh doanh để kiểm thử hàng loạt. Các module chưa nối API từ trước (như nội dung Dịch vụ/Báo giá/Hồ sơ năng lực) và cơ chế đăng nhập admin local hiện có không được chuyển sang backend trong đợt tối ưu này. Tốc độ cold start và xử lý phía BE vẫn phụ thuộc hạ tầng BE. Chưa deploy.
