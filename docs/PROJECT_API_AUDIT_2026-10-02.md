# Kiểm tra đồng bộ module Dự án

> Đây là báo cáo lượt chỉ đọc trước khi thêm “Nhà ở mẫu 09”. Xem [báo cáo toàn hệ thống cập nhật](FULL_API_AUDIT_2026-10-02.md) cho số lượng 37 Admin/36 public, kiểm thử lưu/CRUD thật và kết quả khôi phục dữ liệu.

Ngày kiểm tra: 02/10/2026, khoảng 15:02–15:05 (Asia/Saigon).
Nhánh source: `duy_fb`, commit `e288f5a`.
FE: https://bmt-fe-six.vercel.app
BE: https://bmt-deploy-latest.onrender.com

## Phạm vi và phương pháp

Đăng nhập bằng tài khoản được người dùng cung cấp. Đọc danh sách Admin, toàn bộ 36 chi tiết Admin, danh sách public, toàn bộ 36 slug tương ứng, nội dung trang, danh mục và API trung gian trên FE deploy. Kiểm tra HTTP/HTML của cả 36 đường dẫn chi tiết trên deploy. Đối chiếu code FE và Swagger BE. Không gửi POST tạo dự án, PATCH cập nhật, DELETE hoặc upload; chỉ POST xác thực. Không lưu mật khẩu hoặc token vào báo cáo.

Kiểm tra HTML và API không thay thế kiểm thử trực quan tương tác trên trình duyệt. Luồng tạo/sửa/xóa và refresh sau lưu chưa được kiểm thử bằng thay đổi dữ liệu thật.

## Kết quả dữ liệu thực tế

| Hạng mục | Kết quả |
|---|---|
| Admin GET /admin/projects?PageIndex=1&PageSize=500 | HTTP 200; totalCount=36; nhận đủ 36 items |
| FE GET /api/admin/catalog?resourceKey=projects/list | HTTP 200; 36 records |
| Public GET /projects | HTTP 200; 35 items |
| Chi tiết Admin | 36/36 HTTP 200 |
| Chi tiết public | 35 HTTP 200; Demotest HTTP 404 |
| Chi tiết Admin/public của 35 dự án đang public | JSON khớp hoàn toàn |
| Mapper public trong source hiện tại | Đọc được đủ 35 dự án và 35 chi tiết |
| Trang deploy /projects/{slug} | 35 HTTP 200, có tiêu đề dự án tương ứng; Demotest HTTP 404 |
| Nội dung hero/contact Admin và public | Khớp sau khi bóc content của response Admin |
| GET public theo categoryId | Nhà ở: 8; Văn phòng: 9; Thẩm mỹ viện, showroom: 9; Nhà hàng, khách sạn: 9. Không trả nhầm danh mục |
| Dự án public không nổi bật | 3 dự án; isFeatured=false không đồng nghĩa bị ẩn public |

## Demotest: dữ liệu Admin có nhưng public không có

ID: `84a8f369-fff0-4186-a8c3-29e48b4f0468`; slug: `demotest`.

Admin có card.title=Demotest, card.categoryName=Nhà hàng, khách sạn, categoryId hợp lệ và imageUrl Cloudinary. card.isFeatured=false.

Tất cả các section của detail đều null: overview, survey, solution, renders, process, comparisons, contactForm.

GET /projects/demotest trả HTTP 404, messageCode=NOT_FOUND, detail="Project detail not found". Danh sách public cũng không có ID này. Đây là chênh lệch xảy ra ngay ở API, trước bước render FE; không phải FE đã nhận Demotest rồi làm mất nó.

Bổ sung đối chiếu contract: tài liệu `C:/Users/Admin/AppData/Local/Temp/Zalo Temp/acb1a7690197e8330e6f75b450882649~/docs/admin_projects_page_api.md`, dòng 17, ghi public list chỉ trả project chưa xóa, category còn hoạt động và DetailContent khác `{}`. Dữ liệu Demotest chưa có các section chi tiết, phù hợp với điều kiện loại dự án chưa có DetailContent. Đây là xác nhận từ tài liệu contract và response thực tế, chưa đọc source truy vấn BE.

FE deploy /api/admin/catalog cho projects/details của Demotest trả HTTP 200 nhưng biến các section null thành các chuỗi rỗng. Editor vì thế coi dự án đã có record chi tiết và không giải thích rằng public API đang trả 404.

## Các vấn đề FE xác định được

### 1. P1 — Đổi danh mục vẫn gửi categoryId cũ

Nguồn: features/admin/services/catalog-api.server.ts:1904–1906; features/admin/lib/mock-data/resource-registry.ts:760.

Editor chỉ thay field category (tên), trong khi record tải từ API vẫn giữ categoryId cũ. Khi lưu, code ưu tiên categoryId có sẵn nên không tra lại ID theo tên mới.

Đã tái hiện bằng chính hàm mutateAdminApiResource với fetch được thay bằng mô phỏng trong bộ nhớ: đổi category từ Nhà ở sang Văn phòng nhưng payload PATCH /card vẫn gửi categoryId=old-id. Không gửi PATCH lên server thật.

Hướng sửa: dropdown dùng ID danh mục thật và cập nhật ID cùng tên; hoặc tra lại ID khi lựa chọn tên thay đổi. Không gửi cặp tên/ID mâu thuẫn.

### 2. P1 — Admin chưa thể hiện rõ dự án chưa có nội dung public

Nguồn: features/admin/services/catalog-api.server.ts:203; features/admin/projects/ProjectEditorPage.tsx:49; features/admin/components/editor/ResourceEditorPage.tsx:298.

Demotest có detail với mọi section null, nhưng normalizeProjectDetails tạo record chuỗi rỗng và editor vẫn nhận record đó. Cập nhật sau kiểm tra mở rộng: saveAll kiểm tra tất cả field bắt buộc bằng validateDrafts trước khi lưu; không kết luận rằng chỉ sửa card trong UI luôn lưu được detail còn thiếu. API card riêng không đồng nghĩa khởi tạo nội dung chi tiết; cần thể hiện rõ trạng thái public.

Luồng tạo hiện báo "Đã tạo bản nháp" và chuyển tới editor; đây là luồng có API, không phải mock. Thiếu hướng dẫn/trạng thái public rõ ràng và kiểm tra readiness theo contract BE.

Hướng sửa: giữ thông tin detail chưa khởi tạo, hiển thị cảnh báo cụ thể, hướng dẫn bổ sung chi tiết và kiểm tra public sau lưu. Không tự thêm Demotest vào dữ liệu tĩnh hoặc bật isFeatured để che vấn đề.

### 3. P2 — Danh mục trang khách phụ thuộc 4 tên viết cố định

Nguồn: features/projects/pages/ProjectsPage.tsx:164–177; features/projects/data/projects-page.ts:29.

Danh mục không trùng tên với bộ icon tĩnh bị loại khỏi danh sách tab. Dự án được lọc theo categoryName thay vì categoryId. Tên đổi hoặc danh mục mới có thể khiến dự án không có tab để truy cập.

Hiện 4 tên BE đang khớp nên lỗi này chưa xảy ra với dữ liệu kiểm tra. Hướng sửa: giữ mọi danh mục API, icon có fallback và lọc bằng ID.

### 4. P2 — Một API phụ lỗi làm rỗng cả trang dự án

Nguồn: shared/lib/api/public-data.ts:37–45.

Danh sách, danh mục và nội dung trang nằm trong cùng Promise.all. Một request lỗi dẫn tới buildProjectsPublicData({}), bỏ cả dữ liệu thành công của các request khác. Đây là lỗi xử lý lỗi trong code; không xảy ra trong lượt kiểm tra vì cả ba endpoint đều HTTP 200.

Hướng sửa: xử lý kết quả độc lập, giữ phần dữ liệu thành công và hiển thị trạng thái lỗi tương ứng.

### 5. P2 — Dashboard dự án vẫn đọc mock

Nguồn: app/admin/dashboard/page.tsx:11; features/admin/services/project-content.service.ts:10; features/admin/dashboard/DashboardView.tsx:28.

Dashboard lấy mockProjectContent. Hoạt động gần đây, tỷ lệ hoàn thiện và một số số liệu cũng viết cố định. Dashboard có thể lệch DB, dù /admin/projects đã lấy đủ 36 dự án thật.

Hướng sửa: dùng dữ liệu thống kê/danh sách BE cho dashboard, không suy luận rằng /admin/projects còn mock chỉ vì service cũ còn tồn tại.

### 6. P2 — Phần bản vẽ/giải pháp bị ẩn nếu chưa có ảnh 3D

Nguồn: features/projects/pages/ProjectDetailPage.tsx:42; features/projects/components/ProjectEditorialGallery.tsx:32.

ProjectEditorialGallery chứa cả bản vẽ và mô tả giải pháp, nhưng chỉ render khi project.renders.length > 0. Nếu Admin nhập bản vẽ/giải pháp mà chưa nhập render, dữ liệu đã lưu vẫn không hiển thị. Đây là lỗi điều kiện render xác định từ code, chưa được tái hiện bằng thay đổi dữ liệu thật.

Hướng sửa: tách điều kiện hiển thị giải pháp/bản vẽ khỏi thư viện ảnh 3D.

## Giới hạn và điểm cần thống nhất

- Admin chỉ lấy trang đầu với PageSize=500, chưa tải tiếp khi totalCount vượt giới hạn. Hiện chỉ có 36 nên không bị thiếu.
- Nhà phố 2 tầng Quận 9 có cardCategory=Nhà ở, detail.overview.category=Nhà Phố. Hai giá trị này tồn tại ngay ở BE và được FE đọc đúng. Cần thống nhất đây là nhóm lọc và loại công trình riêng hay phải đồng bộ; không tự kết luận là lỗi.
- Chưa xác minh persist sau thao tác tạo/sửa/xóa thật vì phạm vi lượt kiểm tra là chỉ đọc.
- Bộ test hiện có: 7/7 pass. Các test này chưa bao phủ đổi category dự án hoặc readiness của detail.
- Chưa chạy lint/build vì không sửa source ứng dụng.

## Ưu tiên xử lý

1. Làm rõ contract public với BE và hoàn thiện nội dung Demotest theo contract đó.
2. Sửa categoryId khi đổi danh mục, thêm kiểm tra chống payload tên/ID lệch nhau.
3. Bổ sung trạng thái chưa có chi tiết/public trong Admin.
4. Sửa các điều kiện render, xử lý lỗi từng API và dữ liệu dashboard.
5. Sau khi sửa, kiểm thử tạo → nhập chi tiết → public, đổi danh mục, đổi ảnh, sửa nội dung, refresh và xóa trên dữ liệu kiểm thử được phép.
