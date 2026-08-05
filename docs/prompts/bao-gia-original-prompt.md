# Prompt ban đầu cho page Báo giá

> Nội dung dưới đây được đóng gói lại từ yêu cầu ban đầu của người dùng trong cuộc trò chuyện.

Mấy page con nằm trong `dich-vu` nó chưa ổn nhưng mà ít ra nó cũng tạm được và đã ra hình hài rồi, cần chỉnh sửa lại chi tiết thôi. Giờ mình sẽ làm phần `bao-gia`.

Tôi cũng sẽ cung cấp cho bạn 4 thứ như sau:

1. Thứ nhất là 1 tấm ảnh mockup của toàn bộ page `bao-gia`.
2. Thứ 2 là những hình ảnh, logo, những cái icon chi tiết nhỏ, line, hình nhỏ cần dùng cho page đó, nói chung là tất cả thuộc về mặt hình ảnh trong page `bao-gia`.
3. Thứ 3 là docs mô tả yêu cầu của hiệu ứng do khách hàng cung cấp.
4. Sau đó bạn sẽ tạo những file cần thiết trong folder `quotation` để thể hiện được page `bao-gia` sao cho giống hệt 100% yêu cầu của khách hàng!!!

## Banner

### Nội dung bên phải

- Tiêu đề xuất hiện với hiệu ứng fade kết hợp trượt từ dưới lên.
- Đoạn mô tả xuất hiện sau tiêu đề, trượt từ phải qua trái.
- Nút "Liên hệ ngay" xuất hiện sau cùng với hiệu ứng fade in.

### Hình ảnh bên trái

- Khung hình trượt nhẹ từ trái sang phải kết hợp hiệu ứng fade in.
- Hình ảnh bên trong zoom nhẹ khi xuất hiện, sau đó trở về kích thước bình thường.
- Khi rê chuột vào, chỉ ảnh bên trong khung phóng to nhẹ, khung giữ nguyên.

### Nút "Liên hệ ngay"

- Khi rê chuột vào, nút nâng nhẹ lên, đổ bóng mềm và chuyển màu cam sáng hơn.
- Khi click vào chuyển qua trang Liên hệ.

### Các khối trang trí (ô xám và cam ở background)

- Xuất hiện lần lượt với hiệu ứng fade in.

## Thanh tiến trình (01 -> 05)

- Khi cuộn đến, các bước xuất hiện lần lượt từ trái sang phải với hiệu ứng fade in.
- Bước đang được chọn hiển thị màu cam và gạch chân màu cam bên dưới.

### Tiêu đề

- Tiêu đề trượt từ dưới lên và hiện dần.
- Nội dung mô tả: trượt từ dưới lên, xuất hiện sau tiêu đề.
- Line màu cam: trượt từ trái sang phải.

### Nút "Tiếp tục", "Quay lại"

- Khi rê chuột vào, nền nút đổi màu đen và chữ đổi màu trắng (ban đầu giống nút Quay lại), tương tự khi rê chuột vào nút Quay lại cũng vậy.

## Phần lựa chọn đáp án

- Các ô lựa chọn xuất hiện lần lượt với hiệu ứng fade kết hợp trượt từ dưới lên.
- Khi rê chuột vào một ô, viền chuyển sang màu cam, nền chuyển màu xám nhạt (như ô Nhà ở trong hình).
- Khi chọn một đáp án:
  - Hiệu ứng giống lúc rê chuột.
  - Dấu tick xuất hiện với hiệu ứng fade.

## Ô nhập diện tích

- Ô nhập xuất hiện với hiệu ứng fade kết hợp trượt từ dưới lên.
- Khi nhấp vào ô nhập:
  - Viền chuyển sang màu cam, nền chuyển màu xám nhạt.
- Trong quá trình nhập:
  - Đơn vị m² luôn cố định ở bên phải ô nhập.
- Khi người dùng nhập sai (ví dụ: để trống, nhập ký tự chữ):
  - Để trống -> Vui lòng nhập diện tích.
  - Nhập sai định dạng -> Vui lòng chỉ nhập số.
  - Viền ô nhập chuyển sang màu đỏ.
  - Thông báo lỗi xuất hiện ngay bên dưới ô nhập với hiệu ứng fade in.
- Khi người dùng nhập lại đúng, thông báo lỗi fade out và viền trở về màu cam.

## Ô nhập ngân sách

- Ô nhập xuất hiện với hiệu ứng fade kết hợp trượt nhẹ từ dưới lên.
- Khi nhấp vào ô nhập:
  - Viền chuyển sang màu cam, nền chuyển màu xám nhạt.
- Trong quá trình nhập:
  - Giá trị hiển thị ngay khi người dùng nhập.
  - Đơn vị đ luôn cố định ở phía bên phải ô nhập.
  - Tự động định dạng số theo hàng nghìn (ví dụ: `500000000 -> 500.000.000`) ngay khi nhập.
- Khi nhập không hợp lệ:
  - Để trống -> Vui lòng nhập ngân sách.
  - Nhập sai định dạng -> Vui lòng chỉ nhập số.
  - Viền chuyển sang màu đỏ.
  - Thông báo lỗi xuất hiện bên dưới bằng hiệu ứng fade in.
- Khi người dùng nhập đúng, thông báo lỗi fade out, viền trở về màu cam.

## Phần lựa chọn đáp án (tương tự 01 Loại hình)

- Các ô lựa chọn xuất hiện lần lượt với hiệu ứng fade kết hợp trượt từ dưới lên.
- Khi rê chuột vào một ô, viền chuyển sang màu cam, nền chuyển màu xám nhạt (như ô Nhà ở trong hình).
- Khi chọn một đáp án:
  - Hiệu ứng giống lúc rê chuột.
  - Dấu tick xuất hiện với hiệu ứng fade.

## Phần giá ước tính

- Khung kết quả: zoom nhẹ kết hợp fade in.
- Dãy giá: dãy giá được che bởi một lớp trắng, lớp trắng trượt từ trái sang phải để lộ dần giá.
- Rê chuột vào khung: viền chuyển sang màu cam, nền chuyển màu xám nhạt (giống hình).
- Dòng mô tả: xuất hiện sau phần giá, với hiệu ứng fade in từ dưới lên.

## Tài nguyên khách hàng cung cấp

### Mockup toàn trang

```text
F:\project\bmt\bao-gia\mockup-page
```

### Hình ảnh liên quan đến trang

```text
F:\project\bmt\bao-gia\picture-related-page
```

## Lưu ý đặc biệt về banner và hình ảnh

Bạn đọc kỹ cái mô tả ở phần banner của khách hàng nha. Bởi vì phần đó nó có nhiều tầng hình ảnh á, có hình xuất hiện trước, có hình xuất hiện sau, có cái từ trái qua, có cái từ phải qua, nên phải phân tích kỹ và chọn lọc xem trong file hình ảnh, những ảnh nào cần dùng để sử dụng cho chính xác.

Phải dùng tất cả hình ảnh khách hàng cung cấp nha, không tự ý tạo mới hình ảnh/logo tương tự mà phải dùng hình do khách hàng cung cấp.
