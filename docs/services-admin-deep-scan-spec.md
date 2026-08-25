# Scan & đề xuất cấu trúc Admin — Dịch vụ

> Phạm vi: rà soát flow Admin Dịch vụ, cách thể hiện list, vị trí các nút chỉnh sửa, nguyên tắc không thêm/xóa/ẩn/hiện component, và quy tắc chọn Input / Textarea / RichText.
>
> Lưu ý: tài liệu này chỉ là spec/đề xuất. Không sửa code.

---

## 1. Nguyên tắc khóa cứng

### 1.1. Không thay đổi cấu trúc component của site

Toàn bộ phần Dịch vụ phải coi layout hiện tại là **fixed layout**.

Admin chỉ được phép thay đổi:

- text;
- nội dung dài;
- nội dung rich text;
- ảnh;
- alt ảnh;
- các giá trị nội dung đã tồn tại.

Admin **không được phép**:

- thêm một section mới;
- xóa một section;
- thêm một card mới;
- xóa một card;
- thêm/xóa một bước quy trình;
- thêm/xóa FAQ;
- thêm/xóa project;
- thêm/xóa solution;
- bật/tắt component;
- ẩn/hiện component;
- thay đổi số lượng component theo dữ liệu.

Tức là logic phải là:

```text
Component structure = Developer quản lý
Content bên trong    = Admin quản lý
```

Không phải:

```text
Admin quản lý cả cấu trúc trang
```

---

## 2. Cách Services Admin hiện tại đang hoạt động

### 2.1. Collection của Services không dùng table CRUD thông thường

Trong:

`features/admin/routing/AdminCrudRoute.tsx`

Services collection đang được route sang:

```text
UnifiedResourceEditorPage
```

chứ không đi qua:

```text
ResourceListPage
```

Điều này khá đúng với yêu cầu hiện tại.

### Có nghĩa là list Dịch vụ hiện tại nên thể hiện theo dạng:

```text
┌─────────────────────────────────────────────┐
│ Item 01                                     │
│                                             │
│ [field]              [field]                │
│ [field]              [image]                │
├─────────────────────────────────────────────┤
│ Item 02                                     │
│                                             │
│ [field]              [field]                │
│ [field]              [image]                │
├─────────────────────────────────────────────┤
│ Item 03                                     │
│ ...                                         │
└─────────────────────────────────────────────┘
```

Tức là **expanded editable list**.

Không nên chuyển Services sang kiểu:

```text
Title | Image | Status | Edit | Delete
```

rồi click `Edit` mới vào form.

Lý do: user admin đang sửa content của một layout đã cố định, nhìn tất cả item cùng lúc sẽ dễ đối chiếu với site hơn.

---

## 3. Cách thể hiện list nên chốt

Có 3 trường hợp.

### A. List có nhiều field

Ví dụ:

- Service Tabs;
- Process;
- FAQ;
- Featured Projects;
- Solution Cards.

Hiển thị:

```text
01 — Dịch vụ / bước / project...

Tiêu đề
[________________________]

Mô tả
[________________________]
[________________________]

Hình ảnh
[ image editor ]
```

Sau đó:

```text
──────────────────────────
02 — ...
```

### Không cần:

- nút `Thêm`;
- nút `Duplicate`;
- reorder bằng drag nếu layout hiện tại không có;
- pagination;
- search;
- table view.

Vì số lượng component đã cố định theo site.

### B. List chỉ gồm ảnh

Ví dụ `overview/hero-cards`.

Hiện code `UnifiedResourceEditorPage` đã có cách render riêng:

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Ảnh 01       │ │ Ảnh 02       │ │ Ảnh 03       │ │ Ảnh 04       │
│              │ │              │ │              │ │              │
│   IMAGE      │ │    IMAGE     │ │    IMAGE     │ │    IMAGE     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Đây là cách hợp lý, **giữ nguyên**.

### C. Singleton

Ví dụ:

- Hero;
- heading section;
- FAQ intro;
- Process intro.

Không cần khái niệm list.

Render thẳng:

```text
Nội dung Hero
────────────────────────

Tiêu đề
[.......................]

Mô tả
[.......................]
[.......................]

Ảnh
[ image ]
```

---

## 4. Vị trí các nút Hoàn tác / Lưu

Đây là điểm mình khuyên **chốt tuyệt đối** cho toàn bộ Dịch vụ.

Hiện Services đang dùng:

`EditorTopActions.tsx`

nằm trong:

`AdminPageHeader`

ở **góc trên bên phải**.

Cấu trúc:

```text
DỊCH VỤ > THI CÔNG XÂY DỰNG

Chỉnh sửa giải pháp                   ● 3 thay đổi chưa lưu
                                      [Hoàn tác]
                                      [Hoàn tác tất cả]
                                      [Lưu thay đổi]
─────────────────────────────────────────────────────────

NỘI DUNG...
```

### Giữ đúng 3 action:

| Action | Ý nghĩa |
|---|---|
| `Hoàn tác` | Undo thay đổi cuối cùng |
| `Hoàn tác tất cả` | Quay về trạng thái lần lưu gần nhất |
| `Lưu thay đổi` | Lưu toàn bộ draft của màn hình |

Khi chưa có thay đổi:

```text
[Hoàn tác disabled]
[Hoàn tác tất cả disabled]
[Lưu thay đổi disabled]
```

Khi có thay đổi:

```text
● 4 thay đổi chưa lưu

[Hoàn tác] [Hoàn tác tất cả] [Lưu thay đổi]
```

---

## 5. Không dùng sticky bottom bar cho Services

Repo có:

`EditorActionBar.tsx`

với:

```text
position: sticky;
bottom: ...
```

nhưng `ResourceEditorPage` hiện đã cố tình **không sử dụng nó cho Services**.

Đây là đúng.

### Dịch vụ nên thống nhất:

**Action nằm trên header.**

Không nên có thêm một bộ:

```text
[Hoàn tác] [Hoàn tác tất cả] [Lưu]
```

ở cuối màn hình.

Nếu để cả trên và dưới sẽ tạo 2 nơi thực hiện cùng một hành động, UX bị rối.

---

## 6. Rule chọn Input / Textarea / RichText

Đây là rule đề xuất dùng xuyên suốt.

| Nội dung | Editor |
|---|---|
| Text ngắn, một dòng | **Input** |
| Tiêu đề một dòng | **Input** |
| Label | **Input** |
| Tagline ngắn | **Input** |
| CTA label | **Input** |
| Câu hỏi FAQ | **Input** |
| Text dài / paragraph plain text | **Textarea** |
| Text cần xuống dòng chủ động | **Textarea** |
| Heading 2–3 dòng nhưng cùng style | **Textarea** |
| Nội dung bài viết | **RichText** |
| Paragraph có nhiều phần bold/italic/link khác nhau | **RichText** |
| Text có nhiều style ngay trong cùng một đoạn | **RichText** |
| Checklist | Danh sách các **Input** |
| URL | URL Input |
| Hình | ImageField |

---

## 7. Một điểm rất quan trọng về RichText

Không phải cứ chỗ nào trên site có chữ **bold** thì dùng RichText.

Ví dụ:

```tsx
<h2 className="font-extrabold">
  QUY TRÌNH THI CÔNG
</h2>
```

Toàn bộ component đã quy định bold.

Admin chỉ cần:

```text
Input
```

vì style là trách nhiệm của component.

### Chỉ dùng RichText khi style nằm **bên trong nội dung**

Ví dụ public đang có:

```tsx
BMT Decor triển khai dự án theo
<strong>quy trình 6 bước</strong>
rõ ràng...
```

Thì đây mới đúng là:

```text
RichText
```

Vì trong một paragraph:

- đoạn bình thường;
- đoạn bold;
- rồi lại bình thường.

---

## 8. Trường hợp heading có 2 style khác nhau

Ví dụ site đang có:

```tsx
<span className="font-normal">
  THI CÔNG XÂY DỰNG
</span>

<span className="font-extrabold">
  THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
</span>
```

**Không nên dùng RichText.**

Nên coi đây là hai slot nội dung cố định:

```text
Dòng 1
[ THI CÔNG XÂY DỰNG ]

Dòng 2
[ THEO TỪNG LOẠI HÌNH CÔNG TRÌNH ]
```

Cả hai đều là `Input`.

Component tự chịu trách nhiệm:

```text
line 1 = normal
line 2 = extrabold
```

Admin **không cần được quyền chọn bold**.

Đây là cách giữ design an toàn nhất.

---

## 9. Tổng quan Dịch vụ `/dich-vu`

### 9.1. Hero

### Nội dung

| Field | Editor | Lý do |
|---|---|---|
| `eyebrow` — GIẢI PHÁP | Input | một dòng |
| Main title | Textarea | heading nhiều dòng |
| Supporting title | Textarea | dài |
| Description | Textarea | paragraph plain |
| Intro logo | Image | ảnh |
| Line logo | Image | ảnh |
| Background | Image | ảnh |

Hero description có icon nhà nằm inline trước paragraph.

**Icon vẫn là component/image cố định.**

Không đưa icon vào RichText.

### 9.2. Hero Cards

Hiện tại có **4 card ảnh**.

Nên coi là:

```text
Hero Card 01
[image]

Hero Card 02
[image]

Hero Card 03
[image]

Hero Card 04
[image]
```

### Fixed count

```text
4/4
```

Không:

```text
+ Thêm Hero Card
Xóa Hero Card
Ẩn Hero Card
```

---

## 10. Service Tabs

Hiện có **4 service tabs**.

Mỗi item:

| Field | Editor |
|---|---|
| Tên dịch vụ | Input |
| Tagline | Input |
| Description | Textarea |
| Image | Image |

UI:

```text
01 — Xây dựng trọn gói
   Tên       [................]
   Tagline   [................]
   Mô tả     [................]
             [................]
   Ảnh       [...]

02 — Thiết kế kiến trúc...
...
```

Fixed:

```text
4 items
```

---

## 11. Process Intro của trang Tổng quan

Public hiện có:

```text
BMT Decor triển khai dự án theo quy trình 6 bước rõ ràng...
```

Trong đó:

- `BMT Decor` bold;
- `quy trình 6 bước` bold;
- phần còn lại normal.

### Vì vậy:

| Field | Editor |
|---|---|
| Tiêu đề `QUY TRÌNH LÀM VIỆC` | Input |
| Paragraph | **RichText** |
| Line Image | Image |

Đây là một trong những chỗ hiện tại registry đang dùng `textarea`, nhưng theo rule mới thì **RichText hợp lý hơn**.

---

## 12. Process List Tổng quan

Hiện có **6 bước**.

Mỗi bước:

| Field | Editor |
|---|---|
| Title | Input |
| Description | Textarea |
| Image | Image |
| Image Open | Image |

Không cần editor cho:

```text
01
02
03
...
```

Số thứ tự nên do component tự generate từ index.

---

## 13. FAQ Intro

| Field | Editor |
|---|---|
| Title | Input |
| Description | Textarea |
| Photo | Image |
| Decorative line | Image |

Không RichText vì paragraph hiện tại không có style nội bộ khác nhau.

---

## 14. FAQ List

Hiện có **10 FAQ**.

Mỗi FAQ:

```text
FAQ 01
Câu hỏi
[________________________________]

Câu trả lời
[________________________________]
[________________________________]
[________________________________]
```

### Type

| Field | Editor |
|---|---|
| Question | Input |
| Answer | Textarea |

Không dùng RichText cho answer hiện tại vì public chỉ render plain content.

Nếu sau này nội dung FAQ cần:

- bullet;
- bold một số từ;
- link;
- heading nhỏ;

thì lúc đó mới RichText.

---

## 15. Vấn đề hiện tại: FAQ có `enabled`

Registry hiện có:

```text
question
answer
enabled
```

Trong đó `enabled` cho phép:

```text
Hiển thị / Ẩn
```

Điều này **xung đột trực tiếp với rule**:

> không được ẩn hoặc hiển thị component.

### Spec nên khóa:

```text
FAQ = fixed 10 slots
```

Admin sửa nội dung, không được tắt FAQ.

---

## 16. 4 trang Dịch vụ con

Có:

1. Xây dựng trọn gói
2. Thiết kế Kiến trúc & Nội thất
3. Thi công Xây dựng
4. Cải tạo & Sửa chữa

Cấu trúc tổng thể tương đối giống nhau:

```text
Hero
↓
Featured Project Intro
↓
Featured Project List
↓
CTA
↓
Solution Intro
↓
Solution Cards
↓
Process Intro
↓
Process List
↓
Contact
↓
Footer
```

**Không thay đổi thứ tự hoặc số component.**

---

## 17. Hero của 4 trang con

Mỗi Hero nên có:

| Field | Editor |
|---|---|
| Main title | Textarea |
| Subtitle | Textarea |
| Các ảnh hiện tại | Image |

Ví dụ:

```text
DỊCH VỤ THIẾT KẾ THI CÔNG
& XÂY DỰNG TRỌN GÓI
```

là:

```text
Textarea
```

vì có line break nhưng cả hai dòng cùng một style do Hero component quyết định.

Không cần RichText.

---

## 18. Không để admin quản lý các decorative components

Các thứ như:

- orange vertical line;
- dots;
- BuildingRule;
- wireframe;
- shadow;
- mask;
- navigation icon;
- desktop/mobile artwork wrapper;
- Reveal animation;
- các `<br>` layout mang tính responsive;
- frame;
- background shape;

**không phải content component**.

Không cho admin:

```text
Ẩn
Hiện
Thêm
Xóa
```

Nếu ảnh của chúng đang được coi là replaceable asset thì chỉ cho:

```text
Replace Image
```

và vẫn giữ nguyên component đó.

---

## 19. Featured Project Intro — 4 trang

Đây là chỗ cần RichText khá rõ.

### Xây dựng trọn gói

Public có:

- text thường;
- `thiết kế thi công` bold;
- `xây dựng trọn gói` bold;
- text thường.

→ **RichText**

### Thiết kế Kiến trúc & Nội thất

Public có:

- text thường;
- `thiết kế kiến trúc` bold;
- `thiết kế nội thất` bold;
- text thường.

→ **RichText**

### Thi công xây dựng

Public có các phần:

- text thường;
- `xây dựng phần thô` bold;
- `thi công hoàn thiện` bold;
- các đoạn bình thường.

→ **RichText**

### Cải tạo & Sửa chữa

Public có nhiều đoạn nhấn:

- `cải tạo nhà ở`;
- `cải tạo văn phòng`;
- `cải tạo showroom`;
- `cải tạo nhà hàng`;
- `sửa chữa nhà`.

→ **RichText**

---

## 20. Featured Project Intro structure

Nên là:

```text
Tiêu đề section
[ Textarea ]

Nội dung giới thiệu
┌──────────────────────────────────────────────┐
│ B  I  Link ...                              │
├──────────────────────────────────────────────┤
│ Nội dung...                                 │
│                                             │
└──────────────────────────────────────────────┘

Decorative line
[ Image ]
```

Tiêu đề dùng Textarea nếu có intentional multiline.

Paragraph dùng RichText.

---

## 21. Featured Project List

Mỗi trang hiện có **3 featured projects**.

```text
Project 01
Project 02
Project 03
```

Mỗi project:

| Field | Editor |
|---|---|
| Project title | Input |
| Tag | Input |
| Image | Image |

### Không có:

```text
+ Thêm dự án
Xóa dự án
Ẩn dự án
```

Layout carousel vẫn nhận đúng **3 slot hiện tại**.

---

## 22. Solution Intro

Đây là chỗ cần phân biệt **style cố định** và **RichText**.

Ví dụ:

```text
THIẾT KẾ NỘI THẤT
THEO TỪNG LOẠI HÌNH CÔNG TRÌNH
```

Trong code:

```text
line 1 = normal
line 2 = extrabold
```

Nên admin:

```text
Dòng tiêu đề 1
[ THIẾT KẾ NỘI THẤT ]

Dòng tiêu đề 2
[ THEO TỪNG LOẠI HÌNH CÔNG TRÌNH ]
```

Cả hai:

**Input**

không phải RichText.

### Description Solution Intro

Ví dụ:

```text
Giải pháp thiết kế tối ưu cho từng không gian
```

→ **Input**

vì chỉ là một line copy ngắn.

---

## 23. Solution Cards

Mỗi trang có **4 solution cards**.

Đây là phần registry hiện tại cần đặc biệt chú ý.

Public `SolutionCards` thực tế có:

```text
titlePrefix
titleCategory
tagline
description
checklist
image
CTA
```

Nhưng registry hiện đang gom:

```text
titlePrefix + titleCategory
```

thành một `title`.

Điều này không lý tưởng.

### Nên giữ thành 2 Input riêng

```text
Card 01

Tiêu đề dòng 1
[ CẢI TẠO ]

Tiêu đề dòng 2
[ NHÀ Ở ]

Tagline
[ ......................... ]

Mô tả
[ ......................... ]
[ ......................... ]

Danh sách cung cấp
01 [ ....................... ]
02 [ ....................... ]
03 [ ....................... ]

Nhãn CTA
[ XEM DỰ ÁN ]

Hình
[ image ]
```

### Type

| Field | Type |
|---|---|
| `titlePrefix` | Input |
| `titleCategory` | Input |
| `tagline` | Input |
| `description` | Textarea |
| checklist item | Input |
| `ctaLabel` | Input |
| image | Image |

Không RichText cho title vì style 2 dòng được **SolutionCards component cố định sẵn**.

---

## 24. Checklist là một điểm xung đột hiện tại

Hiện `EditorField.tsx` có `ArrayField`.

Nó đang có:

```text
[+ Thêm dòng]
```

và mỗi dòng có:

```text
[Trash]
```

Tức là admin có thể:

```text
thêm checklist item
xóa checklist item
```

Nếu áp dụng rule một cách nghiêm ngặt:

> Không thêm/xóa component.

thì đối với Services, checklist cũng phải được xem như **fixed slots** nếu mỗi bullet là một element trong layout.

### Nên là:

```text
01 [.....................]
02 [.....................]
03 [.....................]
```

chỉ sửa value.

Không:

```text
+ Thêm dòng
Xóa dòng
```

---

## 25. Process của Xây dựng trọn gói

Hiện có **6 bước**.

Đáng chú ý là data thực tế có title kiểu:

```text
Tiếp nhận
yêu cầu
```

hoặc:

```text
Thiết kế &
Lập phương án thi công
```

Tức là có explicit `\n`.

### Vì vậy process title ở trang này nên là:

**Textarea**

chứ không nên là Input.

Current registry hiện dùng:

```text
text("title")
```

→ đây là một mismatch.

---

## 26. Process của Thiết kế

Hiện có:

```text
6 bước
```

Description của từng bước trong data còn có intentional line breaks khá nhiều.

Ví dụ nội dung dạng:

```text
Tiếp nhận thông tin từ chủ đầu tư, tìm
hiểu nhu cầu sử dụng, mục tiêu, ngân
sách...
```

### Nên:

| Field | Type |
|---|---|
| Step title | Input hoặc Textarea nếu có line break |
| Step description | **Textarea** |
| Icon | Image |

Không RichText vì toàn bộ description cùng style.

---

## 27. Process Thi công xây dựng

Hiện có:

```text
5 bước
```

Mỗi bước:

```text
Title     → Input/Textarea tùy ngắt dòng
Description → Textarea
Icon/Image → Image
```

Fixed 5 records.

---

## 28. Process Cải tạo & sửa chữa

Hiện có:

```text
5 bước
```

Giữ tương tự:

```text
01
02
03
04
05
```

Không add/delete.

Title nếu cấu trúc có:

```text
title
subtitle
```

thì tốt nhất dùng **2 Input riêng**.

Không gom thành RichText, vì style của title/subtitle được component quyết định.

---

## 29. Số lượng fixed records hiện tại

Đây là số scan trực tiếp từ data hiện tại.

| Trang / Section | Số lượng |
|---|---:|
| Tổng quan — Hero Cards | **4** |
| Tổng quan — Service Tabs | **4** |
| Tổng quan — Process | **6** |
| Tổng quan — FAQ | **10** |
| Xây dựng trọn gói — Projects | **3** |
| Xây dựng trọn gói — Solutions | **4** |
| Xây dựng trọn gói — Process | **6** |
| Thiết kế KT & Nội thất — Gallery | **3** |
| Thiết kế KT & Nội thất — Projects | **3** |
| Thiết kế KT & Nội thất — Solutions | **4** |
| Thiết kế KT & Nội thất — Process | **6** |
| Thi công xây dựng — Projects | **3** |
| Thi công xây dựng — Solutions | **4** |
| Thi công xây dựng — Process | **5** |
| Cải tạo & Sửa chữa — Projects | **3** |
| Cải tạo & Sửa chữa — Solutions | **4** |
| Cải tạo & Sửa chữa — Process | **5** |

Theo rule, tất cả các số lượng này là **layout contract**, không phải CRUD data tùy ý.

---

## 30. Mobile content

Hiện code có riêng:

```text
ConstructionMobileContent
RenovationMobileContent
MobileHeroArtwork
```

Các component này **phải giữ nguyên**.

Không cho admin:

```text
Hiện mobile section
Ẩn mobile section
Dùng desktop thay mobile
```

Nếu text mobile giống desktop về semantic thì tốt nhất dùng chung data.

Nếu thiết kế hiện tại thực sự có copy riêng cho mobile thì expose riêng:

```text
Mobile title       → Input / Textarea
Mobile description → Textarea
Mobile image       → Image
```

Nhưng không thay đổi component.

---

## 31. Những component public phải giữ nguyên

Qua scan, Services đang sử dụng nhiều component layout/content như:

```text
SiteHeader
SiteFooter
ContactForm
BuildingRule
Reveal

ServiceTabs
ProcessAccordion
FaqAccordion

HexagonShowcase
MobileHeroArtwork
ProjectCarousel
SolutionCards
ProcessStepsGrid

DesignHeroGallery
ProcessTimeline

ConstructionMobileHero
ConstructionMobileProcess
ConstructionProcessList
DiamondPhotoFrame

RenovationHeroGallery
RenovationMobileContent
RenovationProcessSteps

PillCtaButton
```

Rule:

> Admin chỉ cấp data vào những component trên.  
> Admin tuyệt đối không được quyết định component nào tồn tại.

---

## 32. Xung đột lớn nhất trong code hiện tại: nút Xóa record

`UnifiedResourceEditorPage` hiện có:

```text
[Xóa]
```

cho collection records.

Điều này cho phép xóa:

- project;
- solution;
- process step;
- FAQ;
- service item.

Nếu một record = một component trên site thì nó trái với yêu cầu:

> không được thêm/xóa component.

### Vì vậy logic Services về sau cần coi collection là:

```text
FIXED COLLECTION
```

không phải CRUD collection.

### Nếu constraint "không được ẩn/xóa component" áp dụng cả Admin UI

Thì thậm chí không nên remove/hide nút `Xóa` bằng conditional rendering.

Có thể giữ đúng component button hiện hữu nhưng:

```text
[Xóa] disabled
```

và tooltip:

```text
Số lượng mục được cố định theo layout website
```

Như vậy:

- không add component;
- không remove component;
- không hide component;
- nhưng cũng không cho người dùng phá cấu trúc site.

---

## 33. Tương tự với `enabled`

`overview/faq` hiện có:

```text
Hiển thị: ON/OFF
```

Theo rule mới:

```text
không sử dụng visibility control
```

Nếu không được remove control ở admin thì:

```text
switch disabled
```

hoặc giá trị luôn khóa ở:

```text
Hiển thị
```

---

## 34. Tương tự với `ArrayField`

Hiện:

```text
[+ Thêm dòng]
[trash]
```

Nếu giữ nguyên component UI:

```text
disable Add
disable Delete
```

Chỉ cho edit text của từng row.

---

## 35. RichText hiện tại chưa tồn tại trong infrastructure

Đây là một technical finding quan trọng.

`AdminFieldType` hiện chỉ có:

```text
text
textarea
number
url
image
boolean
select
list
```

Chưa có:

```text
richtext
```

`EditorField.tsx` cũng chưa có RichText renderer.

Do đó nếu làm đúng rule mới thì về mặt architecture cần thêm **field type capability**:

```text
richtext
```

nhưng **không cần thay đổi bất kỳ public Services component nào**.

Quan trọng là không tạo một "RichText section" mới trên site.

RichText chỉ là **cách admin edit data**.

---

## 36. Cách thiết kế RichText

Không nên cho admin một editor kiểu Word đầy đủ.

Chỉ cần những chức năng website thực sự dùng:

```text
B
I
Link
Bulleted list    ← chỉ nếu content hiện có cần
```

Không nên cho:

```text
font-size
font-family
text color tự do
background color
heading H1/H2 tùy ý
alignment tùy ý
HTML
```

Vì mấy thứ đó sẽ phá design system.

---

## 37. RichText không được điều khiển layout

Ví dụ đoạn:

```text
BMT Decor cung cấp dịch vụ thiết kế kiến trúc...
```

RichText được phép lưu:

```html
BMT Decor cung cấp dịch vụ
<strong>thiết kế kiến trúc</strong>,
<strong>thiết kế nội thất</strong>...
```

Nhưng không được lưu:

```html
<div style="position:absolute...">
```

hoặc:

```html
<span style="font-size:52px;color:red">
```

Layout/style chính vẫn nằm trong code.

---

## 38. Ma trận editor cuối cùng

### Input

Dùng cho:

```text
Eyebrow
Short title
Tab title
Tagline
Label
Tag
FAQ question
CTA label
titlePrefix
titleCategory
Process title một dòng
Alt
```

### Textarea

Dùng cho:

```text
Hero title nhiều dòng
Hero subtitle dài
Description plain text
Section heading nhiều dòng cùng style
Process description
FAQ answer plain text
Mobile description
Process title có \n
```

`AutoGrowTextarea` hiện tại đã auto-grow nên khá phù hợp.

### RichText

Dùng cho:

```text
Nội dung bài viết
Paragraph có bold/italic/link xen giữa
Đoạn intro có nhiều cụm nhấn khác style
```

Đối với Services hiện tại, RichText chắc chắn có giá trị ở các block:

1. Tổng quan → Process intro.
2. Xây dựng trọn gói → Featured intro.
3. Thiết kế KT & Nội thất → Featured intro.
4. Thi công xây dựng → Featured intro.
5. Cải tạo & sửa chữa → Featured intro.

---

## 39. Image

Giữ `ImageField` hiện tại.

Không biến image component thành optional.

Nếu component có ảnh:

```text
ImageField luôn tồn tại.
```

Admin chỉ:

```text
Replace image
Edit alt
```

Không:

```text
Remove image component
Hide image
```

---

## 40. Cấu trúc một màn hình Service lý tưởng

Ví dụ:

```text
DỊCH VỤ / XÂY DỰNG TRỌN GÓI / GIẢI PHÁP

Giải pháp Xây dựng trọn gói               ● 5 thay đổi chưa lưu
                                          [Hoàn tác]
                                          [Hoàn tác tất cả]
                                          [Lưu thay đổi]


───────────────────────────────────────────────────────────

GIỚI THIỆU SECTION

Tiêu đề dòng 1
[ GIẢI PHÁP THIẾT KẾ THI CÔNG ]

Tiêu đề dòng 2
[ THEO TỪNG LOẠI HÌNH CÔNG TRÌNH ]

Mô tả
[ Giải pháp toàn diện, tối ưu công năng ]

Line
[ IMAGE ]


───────────────────────────────────────────────────────────

SOLUTION 01

Tiêu đề 1
[ THIẾT KẾ ]

Tiêu đề 2
[ NHÀ PHỐ ]

Tagline
[ ........................................ ]

Mô tả
[ ........................................ ]
[ ........................................ ]

BMT Decor cung cấp
01 [ ..................................... ]
02 [ ..................................... ]
03 [ ..................................... ]

Ảnh
[ IMAGE ]


───────────────────────────────────────────────────────────

SOLUTION 02
...
```

Đây là cách phù hợp nhất với code hiện tại.

---

## 41. Không nên dùng accordion trong editor cho các item

Có thể nghĩ tới việc collapse:

```text
▶ Solution 01
▶ Solution 02
▶ Solution 03
```

nhưng với mục đích edit CMS kiểu này **không khuyến nghị**.

Vì user cần:

- scan nhanh content;
- đối chiếu item;
- biết field nào đang thay đổi;
- không phải mở từng accordion.

Current expanded list của `UnifiedResourceEditorPage` tốt hơn.

---

## 42. Dirty state nên thể hiện ở 3 cấp

Code hiện tại đã có phần lớn logic này.

### Toàn page

```text
● 5 thay đổi chưa lưu
```

### Record

```text
● Solution 02
```

### Field

```text
● Mô tả
[........................]
```

Đây là UX tốt, nên giữ.

---

## 43. Save semantics

Không nên save từng field ngay khi blur.

Flow tốt nhất cho Services hiện tại:

```text
Edit nhiều field
↓
dirty state
↓
Hoàn tác nếu cần
↓
Lưu thay đổi
↓
commit cả màn hình
```

Đúng với `UnifiedResourceEditorPage` hiện tại.

---

## 44. Không nên có Save riêng cho từng item

Không cần:

```text
Solution 01   [Save]
Solution 02   [Save]
Solution 03   [Save]
```

Nên có duy nhất:

```text
[Lưu thay đổi]
```

ở header.

Vì các item thuộc cùng một section/page.

---

## 45. Một số mismatch phát hiện trong code hiện tại

| Hiện trạng | Đánh giá theo rule mới |
|---|---|
| Services collection dùng Unified editor | ✅ Đúng |
| Collection được expand toàn bộ | ✅ Đúng |
| Save/Undo ở header | ✅ Đúng |
| Services không có sticky bottom action | ✅ Đúng |
| Collection không có Add button | ✅ Đúng |
| Collection có `Xóa` | ❌ Không phù hợp |
| FAQ có `enabled` | ❌ Không phù hợp |
| Array checklist có `Thêm dòng` | ❌ Không phù hợp |
| Array checklist có `Xóa dòng` | ❌ Không phù hợp |
| Không có RichText field | ❌ Thiếu |
| Mixed-style paragraph đang là textarea | ❌ Sai loại editor |
| Solution `titlePrefix/titleCategory` bị gom thành `title` | ⚠️ Làm mất semantic style slot |
| Process title Xây dựng trọn gói dùng `text` dù có `\n` | ⚠️ Nên textarea |
| Hero multiline đang textarea | ✅ Đúng |
| Plain description đang textarea | ✅ Đúng |

---

## 46. Kết luận architecture

Triết lý nên là:

```text
                     WEBSITE
                        │
                        │ fixed component tree
                        ▼
 ┌─────────────────────────────────────────┐
 │ Hero                                    │
 │ Project section                         │
 │ Solution section                        │
 │ Process section                         │
 │ Contact                                 │
 │ Footer                                  │
 └─────────────────────────────────────────┘
                        ▲
                        │
                  CONTENT ONLY
                        │
 ┌─────────────────────────────────────────┐
 │                 ADMIN                   │
 │                                         │
 │ Input       → short/simple text         │
 │ Textarea    → long/multiline text       │
 │ RichText    → mixed formatting/body     │
 │ ImageField  → replace image             │
 │ Fixed list  → edit existing slots       │
 │                                         │
 │ NO ADD / DELETE / HIDE / SHOW           │
 └─────────────────────────────────────────┘
```

### Cách chốt

**List:** dùng expanded fixed-slot list như `UnifiedResourceEditorPage` hiện tại.

**Actions:** luôn nằm **góc phải trên Page Header** theo thứ tự:

```text
Hoàn tác → Hoàn tác tất cả → Lưu thay đổi
```

**Không sticky action bar cho Services.**

**Text:** một dòng → Input; dài/multiline → Textarea; mixed-format/article body → RichText.

**Style cố định bởi component:** không RichText, tách thành các text slot/Input riêng khi cần.

**Cấu trúc public:** tuyệt đối immutable.

**Số lượng item:** fixed theo data/layout hiện tại; admin chỉ chỉnh content.

**Ba điểm cần xử lý kỹ nhất khi bắt đầu code:**

1. khóa toàn bộ khả năng `Xóa/Thêm/Ẩn`;
2. bổ sung capability `richtext` vào `EditorField`;
3. tách các field có semantic riêng như `titlePrefix/titleCategory` thay vì gộp text.

---

# 47. Quy tắc bất biến khi triển khai sau này

Đây là phần nên coi như acceptance criteria.

## 47.1. Không thay đổi public component tree

Sau khi làm Admin:

- số `ServiceTabs` không đổi;
- số `FAQ` không đổi;
- số `ProjectCarousel` item không đổi;
- số `SolutionCards` không đổi;
- số process step không đổi;
- `ContactForm` vẫn tồn tại;
- `Footer` vẫn tồn tại;
- `Hero` vẫn tồn tại;
- mobile-specific component vẫn tồn tại.

## 47.2. Admin không được làm layout phụ thuộc vào content existence

Không dùng kiểu:

```tsx
{content && <Component />}
```

nếu trước đây component luôn tồn tại.

Content rỗng phải được xử lý bằng validation hoặc giữ slot, không được biến thành cơ chế hide component.

## 47.3. Không sử dụng empty string để “ẩn” component

Ví dụ admin xóa text thành rỗng không được hiểu là:

```text
hide section
```

Nếu field bắt buộc thì validation chặn save.

Nếu field optional thì chỉ text rỗng, component wrapper vẫn giữ nguyên nếu layout contract yêu cầu.

## 47.4. Không expose class/style/layout field

Admin không được chỉnh:

- `className`;
- font size;
- font weight;
- color;
- margin;
- padding;
- grid columns;
- position;
- animation;
- breakpoint;
- width/height layout.

## 47.5. RichText chỉ quản lý inline semantics

Cho phép tối đa các semantic thực sự cần:

```text
bold
italic
link
list nếu content cần
```

Không cho RichText trở thành page builder.

---

# 48. Mapping field theo semantic, không theo độ dài hiện tại

Không nên chọn editor chỉ dựa vào value hiện tại dài hay ngắn.

Ví dụ:

```text
Title hiện đang ngắn 15 ký tự
```

nhưng public component cho phép intentional line-break → vẫn nên là Textarea.

Ngược lại:

```text
Tagline hiện dài 50 ký tự
```

nhưng semantic luôn là một dòng → Input.

Thứ tự quyết định:

```text
1. Semantic của field
2. Layout contract của public component
3. Có cần manual line break không
4. Có mixed formatting không
5. Cuối cùng mới xét độ dài hiện tại
```

---

# 49. Recommendation về label trong Admin

Label admin nên mô tả **vai trò nội dung**, không mô tả CSS/layout kỹ thuật.

Nên:

```text
Tiêu đề chính
Tiêu đề phụ
Mô tả
Nhãn nút
Ảnh nền
Ảnh minh họa
```

Không nên:

```text
Text bên trái top 24%
Ảnh ở col-span-2
Font đậm dòng hai
Ảnh absolute bên phải
```

Admin user không cần biết implementation layout.

---

# 50. Final decision table

| Trường hợp | Component Admin | Cho sửa | Không cho |
|---|---|---|---|
| Text ngắn 1 dòng | Input | Value | Style/layout |
| Text dài cùng style | Textarea | Value + newline | Rich styling |
| Mixed-format paragraph | RichText | Inline semantic formatting | Layout/CSS |
| Image | ImageField | Replace + alt | Remove/hide slot |
| Fixed collection | Expanded list | Content từng slot | Add/delete/hide/show |
| Checklist fixed | Input rows | Text từng row | Add/delete row |
| Section intro | Inline form | Existing fields | Add/remove section |
| Action bar | Header top-right | Undo/Undo all/Save | Duplicate save controls |

---

# 51. Kết luận cuối

Services Admin nên được xây như một **content editor cho layout cố định**, không phải CMS page builder và cũng không phải generic CRUD.

Mô hình chính xác nhất:

```text
PUBLIC UI = fixed
ADMIN UI  = content mapping
```

Mọi quyết định field editor phải phục vụ đúng dữ liệu mà public component đang tiêu thụ:

```text
Input     = simple one-line content
Textarea  = multiline/plain content
RichText  = mixed-style content
Image     = replace existing media
```

Và toàn bộ list trong Services phải được hiểu là:

```text
Fixed slots, editable values
```

không phải:

```text
Dynamic records, CRUD structure
```

Đó là cách an toàn nhất để Admin chỉnh nội dung mà không làm sai layout hoặc mất component trên website.
