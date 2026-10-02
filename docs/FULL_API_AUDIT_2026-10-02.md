# Kiểm tra toàn bộ kết nối API và Admin

Ngày kiểm tra: 02/10/2026, Asia/Saigon. Lượt kiểm tra mở rộng khoảng 15:43–16:14.

Source: nhánh `duy_fb`, HEAD `e288f5a`. FE kiểm tra chính: `http://localhost:3001`. BE: `https://bmt-deploy-latest.onrender.com/api/v1`.

## Kết luận

**Chưa hoàn thiện toàn bộ.** Trong 85 resource được đăng ký cho Admin, 82 có đường đọc dữ liệu thật và tải thành công; 3 vẫn dùng cơ chế mock. Dashboard còn dùng số liệu mẫu. Ngoài ra đã tái hiện lỗi đổi danh mục dự án, lỗi phiên đăng nhập cần refresh và lỗi thiếu bài viết khi BE có hơn 20 bài.

82/85 là số resource có kết nối đọc API, không phải tỷ lệ chức năng đã hoàn thiện hoặc đã kiểm thử mọi trường hợp. Các luồng ghi đã được kiểm tra theo phạm vi bên dưới.

## Phạm vi đã kiểm tra

- Đăng nhập bằng tài khoản Admin người dùng cung cấp; xác nhận người dùng hiện tại và chặn truy cập chưa đăng nhập. Không lưu mật khẩu, token hoặc cookie vào báo cáo/script.
- Kiểm tra registry 85 resource: 36 qua catalog API và 46 qua remote binding; 3 mock.
- Đọc nội dung API của 13 trang/nhóm public; đối chiếu dữ liệu Admin/public và các hàm chuyển đổi FE.
- Đọc 37 chi tiết dự án Admin; đối chiếu 36 dự án được public. Đọc và chuyển đổi đủ 20 chi tiết bài viết, 9 chi tiết tuyển dụng.
- Kiểm tra HTTP 49 đường dẫn public hiện có, gồm 13 trang chính và 36 chi tiết dự án; 79 đường dẫn Admin lấy từ các trang quản lý. Tất cả trả 200 sau kiểm tra lại ở tốc độ thấp.
- Kiểm tra trực tiếp trình duyệt: đăng nhập, Dashboard, các trang quản lý nội dung, editor dự án, báo giá và trang dự án public. Không khẳng định đã thao tác trực quan trên mọi editor trong 79 đường dẫn.
- Lưu giữ nguyên nội dung tại 14 nhóm theo sự cho phép: Trang chủ, Giới thiệu, Dự án, Tin tức, Tuyển dụng, Liên hệ, thương hiệu, 5 trang Dịch vụ, Báo giá, Hồ sơ năng lực. Mỗi nhóm lưu một resource đại diện; không PATCH toàn bộ 82 resource.
- Tạo → sửa → đọc lại → xóa bản ghi mới mang nhãn `API AUDIT` ở Dự án, Tin tức, Tuyển dụng, Khách hàng liên hệ, trang ảnh Hồ sơ năng lực. Một bản ghi Tin tức bổ sung dùng riêng cho ca vượt giới hạn 20 bài.
- Thử thay đổi mô tả giải pháp “Nhà ở mẫu 09” bằng UI Admin, kiểm tra nội dung mới ở trang public rồi hoàn nguyên ngay. Thử đổi danh mục bằng hàm lưu FE với API thật rồi khôi phục card gốc.
- Kiểm tra 16 tổ hợp tính báo giá, đầu vào không hợp lệ, lỗi một API phụ bằng mô phỏng lỗi có kiểm soát trong hàm FE, và phiên chỉ còn refresh token.

## Mức độ kết nối theo nhóm

| Nhóm resource Admin | Có API thật / tổng | Ghi chú |
|---|---:|---|
| Trang chủ | 8/8 | Đọc thành công |
| Giới thiệu | 9/9 | Đọc thành công |
| Dự án | 4/7 | 3 resource còn mock, xem F1 |
| 5 trang Dịch vụ | 40/40 | Đọc thành công |
| Tin tức | 4/4 | Có lỗi giới hạn danh sách, xem F4 |
| Tuyển dụng | 4/4 | Đọc thành công |
| Báo giá | 3/3 | 16 tổ hợp tính đúng với bảng giá |
| Liên hệ | 3/3 | Đọc thành công; form submission đã thử CRUD riêng |
| Cấu hình, thương hiệu, Hồ sơ năng lực | 7/7 | Đọc thành công |
| **Tổng** | **82/85** | Không bao gồm việc coi Dashboard mock là đã nối API |

Đối chiếu 347 giá trị nội dung ở 5 trang Dịch vụ: không có giá trị bị thiếu trong dữ liệu public đã đọc. Kiểm tra 40 section của Dịch vụ với schema cho thấy 137 key được phép chỉnh đều thuộc schema. 9 key nhãn nút (`submitLabel`, `ctaLabel`) bị registry cố ý lọc khỏi editor bằng quy tắc phạm vi chỉnh sửa; đây là hạn chế quản trị hiện có, không phải bằng chứng API đọc thất bại.

## Dữ liệu và số lượng sau kiểm thử

| Loại dữ liệu | Admin | Public | Kết luận |
|---|---:|---:|---|
| Dự án | 37 | 36 | Chênh 1 là Demotest chưa có nội dung chi tiết |
| Nhà ở | — | 9 | Có “Nhà ở mẫu 09” |
| Văn phòng | — | 9 | Đủ theo API |
| Thẩm mỹ viện, showroom | — | 9 | Đủ theo API |
| Nhà hàng, khách sạn | 10 | 9 | Demotest chưa được public |
| Tin tức | 20 | 20 | Đã dọn bản ghi thử; lỗi xuất hiện khi có bài thứ 21 |
| Tuyển dụng | 9 | 9 | Chi tiết đọc/chuẩn hóa được |
| Trang ảnh Hồ sơ năng lực | 21 | 21 | Đồng bộ URL ảnh và thứ tự trong ca thử |
| Khách hàng liên hệ | 5 | Không phải danh sách public | Số lượng trở về trước kiểm thử |

Demotest (`84a8f369-fff0-4186-a8c3-29e48b4f0468`, slug `demotest`) có cả 7 section chi tiết null. BE loại khỏi danh sách public và trả 404 cho chi tiết. Tài liệu `admin_projects_page_api.md`, dòng 17, quy định public chỉ trả dự án có DetailContent khác `{}`. Đây là điều kiện public của BE, không phải FE đã nhận 10 card rồi tự làm mất một card. `isFeatured=false` cũng không phải điều kiện ẩn public.

FE đã có logic giới hạn 9 card/trang desktop và chấm chuyển khi số dự án public của danh mục vượt 9; mobile có luồng hiển thị riêng. Vì Nhà hàng, khách sạn hiện có đúng 9 public nên chưa có trang thứ hai để chuyển. Tab local mở từ trước cũng không tự lấy lại dữ liệu sau thay đổi bên ngoài; tải lại trang đã nhận đủ 9 Nhà ở.

## Các vấn đề cần sửa

### F1 — P2: Dashboard và 3 cấu hình dự án còn mock

**Xác nhận từ code và UI.** Dashboard gọi `project-content.service.ts`, service trả `mockProjectContent`. Dashboard hiển thị 8 dự án/5 đã public trong khi DB có 37/36; số liệu Trang chủ 32, tỷ lệ hoàn thiện và hoạt động gần đây cũng có phần cố định.

3 resource chưa có catalog/remote binding: `projects/list-section-content`, `projects/related`, `projects/related-section-content`. Trang public lấy dự án liên quan từ danh sách API rồi chọn phần tử; các cấu hình mock này chưa tạo một đường lưu DB → hiển thị public hoàn chỉnh.

Nguồn: `app/admin/dashboard/page.tsx:11`, `features/admin/services/project-content.service.ts:10`, `features/admin/dashboard/DashboardView.tsx:28`, registry và AdminCrudProvider. Cần dùng thống kê thật và nối hoặc bỏ các cấu hình không có tác dụng lên public.

### F2 — P1: Đổi tên danh mục dự án nhưng giữ categoryId cũ

**Đã tái hiện với API thật qua hàm lưu FE.** Chọn tên “Văn phòng” cho dự án mẫu nhưng payload vẫn ưu tiên ID “Nhà ở” đã có trong record. BE trả 200, đọc lại vẫn là Nhà ở. Đã khôi phục card gốc và xác nhận thành công.

Nguồn: `features/admin/services/catalog-api.server.ts:1904`. Cần dùng ID thật làm giá trị dropdown, hoặc tra lại ID khi tên được chọn thay đổi. Đây là lỗi có thể khiến Admin lưu thành công nhưng User vẫn lọc vào danh mục cũ.

### F3 — P1: Catalog lỗi 500 khi cần refresh phiên

**Đã tái hiện bằng phiên chỉ còn refresh cookie hợp lệ.** GET catalog dự án trả 500 vì request tới BE trả 401. Gọi refresh tường minh thành công 200; sau đó catalog cũng 200. Luồng catalog chưa tự phục hồi phiên như đường API client có refresh.

Nguồn: `features/admin/services/catalog-api.client.ts`, `features/admin/services/catalog-api.server.ts:125`, `app/api/admin/catalog/route.ts:39`. Cần refresh một lần khi access token hết hạn rồi thử lại; nếu phiên không còn hợp lệ, trả trạng thái xác thực phù hợp và chuyển đăng nhập.

### F4 — P1: Admin Tin tức thiếu bản ghi từ bài thứ 21

**Đã tái hiện với dữ liệu thật.** Tạm tạo bài thứ 21: BE trả `totalCount=21`, đọc đủ 21 items với PageSize phù hợp, nhưng catalog FE chỉ trả 20. Bài thử đã xóa; tổng cuối cùng trở về 20.

Nguồn: `features/admin/services/catalog-api.server.ts:984`. Request `/admin/news` dùng phân trang mặc định của BE, không tải trang tiếp theo; chuyển đổi response bỏ metadata tổng. Cần phân trang thực hoặc lấy tiếp đủ dữ liệu. Tuyển dụng có cách lấy danh sách tương tự nên cần kiểm tra khi vượt kích thước trang mặc định. Dự án lấy trang đầu 500, trang ảnh hồ sơ lấy 100: chưa mất dữ liệu hiện tại nhưng chưa xử lý vượt giới hạn.

### F5 — P2: Nội dung chi tiết Tin tức có API nhưng chưa có trang đọc

**Đã kiểm tra thực tế và code.** Bài thử lưu được body, BE public detail trả 200 và body khớp Admin; FE `/news/{slug}` trả 404 khi bài đang tồn tại. Liên kết card hiện là `/news#{slug}`, trỏ tới thẻ ở cùng trang; FE chỉ có `app/news/page.tsx`, chưa có route chi tiết.

Nguồn: `features/news/api/get-news-public-data.ts:75`, `app/news/page.tsx`. Nếu yêu cầu người dùng đọc toàn bài thì chức năng này chưa hoàn thiện. Không kết luận body bị mất khi API danh sách không chứa body: API chi tiết vẫn trả đầy đủ.

### F6 — P2: Một API phụ lỗi làm mất dữ liệu đã lấy thành công

**Đã tái hiện trong hàm FE bằng lỗi mô phỏng, không gây lỗi server thật.** Cho API dự án trả danh sách thành công, API danh mục ném lỗi: kết quả FE trở thành 0 dự án thay vì giữ 37 dự án đang có tại thời điểm thử (gồm bản ghi thử).

Nguồn: `shared/lib/api/public-data.ts:37–45`. `Promise.all` và catch chung dựng dữ liệu rỗng cho toàn trang. Một số trang khác có cùng cấu trúc. Cần xử lý từng kết quả độc lập và giữ phần dữ liệu đọc thành công.

### F7 — P2: BE báo giá chấp nhận diện tích ngoài contract

**Đã tái hiện bằng API thật.** API vẫn trả 200 khi `areaM2=9` và `areaM2=50001`. Tài liệu `admin_quotation_page_api.md:249` quy định khoảng [10, 50000], dòng 314 quy định lỗi 422. FE có chặn giới hạn này; BE chưa bảo vệ cùng điều kiện.

Nguồn tài liệu: `C:/Users/Admin/AppData/Local/Temp/Zalo Temp/acb1a7690197e8330e6f75b450882649~/docs/admin_quotation_page_api.md`. Cần thống nhất validation phía BE. Mã loại công trình không hợp lệ đã bị BE từ chối 400.

### F8 — P2: Bản vẽ và giải pháp phụ thuộc có ảnh 3D

**Xác định từ code; chưa thử xóa ảnh của dự án thật.** `ProjectEditorialGallery` chứa bản vẽ và mô tả giải pháp, nhưng cả component chỉ render nếu `project.renders.length > 0`. Khi có giải pháp/bản vẽ mà không có render, nội dung này bị ẩn.

Nguồn: `features/projects/pages/ProjectDetailPage.tsx:42`, `features/projects/components/ProjectEditorialGallery.tsx`. Cần tách điều kiện hiển thị từng phần.

### F9 — P2: Tab danh mục phụ thuộc 4 tên cố định

**Xác định từ code; chưa xảy ra với 4 tên hiện tại.** Danh mục không khớp bộ tên/icon tĩnh bị lọc bỏ; lọc dự án bằng categoryName thay vì categoryId. Đổi tên hoặc thêm danh mục ở BE có thể làm mất tab truy cập.

Nguồn: `features/projects/pages/ProjectsPage.tsx:164–177`, `features/projects/data/projects-page.ts:29`. Cần giữ mọi danh mục API, dùng icon dự phòng và lọc bằng ID.

### F10 — P2: Admin chưa giải thích rõ trạng thái public của dự án chưa có chi tiết

**Xác nhận dữ liệu Demotest và cách chuyển đổi FE.** Detail null được chuẩn hóa thành record chuỗi rỗng, không thể hiện trực tiếp nguyên nhân BE loại khỏi public. Nên có trạng thái/hướng dẫn bổ sung nội dung và kiểm tra public sau lưu.

Lưu ý: editor hợp nhất hiện gọi `validateDrafts` cho các field bắt buộc trước `saveAll`. Vì vậy không kết luận rằng chỉ sửa card trong UI luôn lưu được dự án thiếu chi tiết. Ghi nhận cũ về bỏ qua detail không thay đổi cần đọc cùng điều kiện validation này.

## Kết quả ghi dữ liệu, khôi phục và kiểm tra kỹ thuật

14/14 lượt lưu đại diện trả 200. Đọc lại full content không đổi; chỉ `updatedAt` thay đổi. Ca thử UI thêm `[Kiểm thử đồng bộ API]` vào giải pháp dự án đã hiển thị trên User sau lưu; đã hoàn nguyên đúng chuỗi gốc: “Giải pháp thiết kế minh họa, phục vụ kiểm thử trang chi tiết dự án.”

Cả 5 nhóm CRUD đều tạo/sửa/đọc lại thành công. Dự án bản nháp chưa có chi tiết bị loại khỏi public; sau khi khởi tạo detail, API public và trang local trả 200, có nội dung mới. Tin tức, tuyển dụng, trang ảnh hồ sơ đọc lại đúng các giá trị thử. Khách hàng liên hệ tạo 201; cập nhật trạng thái/xác nhận đã đọc 200; lọc và phân trang PageSize=2 hoạt động.

**Đã xóa và xác nhận vắng mặt toàn bộ 6 bản ghi mới của lượt kiểm thử**: 5 bản ghi CRUD và 1 bài kiểm tra phân trang. “Nhà ở mẫu 09” là dữ liệu đã tạo theo yêu cầu trước đó, được giữ lại và đã hoàn nguyên nội dung/danh mục. Không xóa bản ghi có sẵn của người dùng.

| Kiểm tra | Kết quả |
|---|---|
| Bộ test hiện có | 7/7 pass |
| Lint | Pass |
| TypeScript | Pass |
| Build với kết nối BE | Pass |
| 16 tổ hợp báo giá, diện tích 100 | Giá đơn vị và tổng khớp bảng giá Admin |
| Chưa đăng nhập | Catalog 401; trang Admin chuyển tới login |
| Form liên hệ rỗng | BE từ chối 400 |

Lượt đọc hàng loạt đầu tiên gặp BE 429 và khiến 16 trang chi tiết local cùng 1 request detail trả lỗi. Log dev xác nhận upstream 429; kiểm tra lại 17 request ở tốc độ thấp đều 200. Đây là giới hạn tốc độ có thể tái hiện khi tải dồn, không phải 16 dự án thiếu nội dung. Các kết quả lỗi ban đầu được giữ trong JSON để minh bạch, kết quả kiểm tra lại nằm ở file roundtrip.

Không sửa source ứng dụng trong lượt audit. Hai file có thay đổi sẵn của người dùng được giữ nguyên: `ContactSubmissionsPanel.tsx`, `form-submissions-api.client.ts`. Báo cáo, script kiểm thử và kết quả nằm trong `docs/`; chưa commit hoặc triển khai.

## Bằng chứng và giới hạn

- [Kết quả đọc toàn hệ thống](FULL_API_AUDIT_RESULTS_2026-10-02.json)
- [Lưu, so sánh nội dung, refresh và đổi danh mục](ADMIN_ROUNDTRIP_RESULTS_2026-10-02.json)
- [CRUD, validation và lỗi API phụ](CRUD_AUDIT_RESULTS_2026-10-02.json)
- [79 đường dẫn Admin và lỗi bài thứ 21](ADMIN_ROUTES_RESULTS_2026-10-02.json)
- [Nhật ký dọn 5 bản ghi CRUD](API_AUDIT_CLEANUP_2026-10-02.json); bản ghi thứ 6 được xác nhận dọn trong kết quả kiểm tra đường dẫn Admin.
- [Log build](audit-build.log)

Các script không lưu thông tin xác thực; chạy lại các script có ghi dữ liệu cần đúng phạm vi được người dùng cho phép. Kết quả này không thay thế test mọi field, mọi trình duyệt, mọi màn hình hoặc tải đồng thời lớn. Upload ảnh nhị phân lên Cloudinary chưa được thử; ca ảnh sử dụng URL ảnh có sẵn. Không có source BE trong lượt kiểm tra, nên các nhận định BE dựa trên response và tài liệu contract được cung cấp. UI lỗi phân trang/danh mục cần được kiểm thử lại sau khi sửa dù lint/build đang pass.

Ưu tiên sửa F2, F3, F4 trước; sau đó hoàn thiện Dashboard/config mock, đọc toàn bài Tin tức, xử lý lỗi từng API và các điều kiện hiển thị dự án.
