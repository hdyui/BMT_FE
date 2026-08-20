import Image from "next/image";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { FaqAccordion } from "@/features/services/components/FaqAccordion";
import { ProcessAccordion } from "@/features/services/components/ProcessAccordion";
import { ServiceTabs } from "@/features/services/components/ServiceTabs";
import { heroCards } from "@/features/services/data/overview";
import { SERVICE_HERO_CLASS_NAME } from "@/features/services/config/layout";

const cardPositions = [
  "top-[16%] left-0 z-40",
  "top-[10.7%] left-[23.5%] z-30",
  "top-[5.35%] left-[47%] z-20",
  "top-0 left-[70.5%] z-10",
] as const;

export function ServicesOverviewPage() {
  return (
    <div className="min-h-screen bg-white pt-16 text-charcoal xl:pt-[var(--site-header-desktop-height)]">
      <SiteHeader />

      {/* --hero-lift: kéo TOÀN BỘ nội dung banner (cột chữ trái + cụm 4 thẻ
          ảnh phải) lên gần header thêm bấy nhiêu. Một núm duy nhất cho cả hai
          bên nên tương quan trái/phải không bao giờ lệch. Đơn vị vw để nó co
          theo chiều cao banner (lg: 38,9vw). Chỉ áp dụng từ md trở lên — bản
          mobile xếp dọc theo luồng thường, không đụng tới. */}
      <section className={`${SERVICE_HERO_CLASS_NAME} [--hero-lift:3.5vw]`}>
        <Image
          className="-z-30 object-cover"
          src="/images/services/hero-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgb(255_255_255/.95)_0%,rgb(255_255_255/.78)_38%,rgb(255_255_255/.08)_68%)] max-md:bg-[linear-gradient(180deg,rgb(255_255_255/.96)_0%,rgb(255_255_255/.88)_55%,rgb(255_255_255/.18)_100%)]" />

        {/* Màn nhỏ: bỏ kiểu "chữ + cụm ảnh chồng tuyệt đối trong khung cố định
            chiều cao" (dễ đè lên nhau khi ước lượng chiều cao sai) — chuyển cụm
            ảnh sang `relative` (vẫn là mốc % cho 4 thẻ con bên trong, nhưng bản
            thân nó lại nằm trong luồng thường), nối ngay sau khối chữ bằng
            margin-top thay vì `bottom-0` tuyệt đối, nên không bao giờ đè lên
            nội dung bất kể chữ dài ngắn thế nào. Wrapper ngoài cùng đã có pt-16
            (64px) để né SiteHeader cao 60px trên mobile, nên chỉ cần thêm chút
            khoảng thở, không lặp lại toàn bộ chiều cao header lần nữa. */}
        <div className="relative h-full w-full max-md:mx-auto max-md:h-auto max-md:w-[calc(100%-2.25rem)] max-md:pb-10">
          <div className="relative z-10 flex h-full w-[36%] max-w-160 flex-col justify-center md:translate-y-[calc(var(--hero-lift)*-1)] lg:ml-[7.3%] lg:translate-y-[calc(3.5vw-var(--hero-lift))] max-md:h-auto max-md:w-full max-md:translate-y-0 max-md:justify-start max-md:pt-6">
            <Reveal>
              {/* Dưới md trước đây là `border-b-2`: dày 2px và nằm ở đáy hộp
                  inline-block (~6,5px dưới baseline) nên nhìn đậm và rời chữ.
                  Đổi sang cùng kiểu gạch chân như bản PC — 1px, nhưng offset 4px
                  thay vì 8px để sát chữ hơn. Giá trị md/lg giữ nguyên. */}
              <p className="mb-4 inline-block text-base max-md:underline max-md:decoration-1 max-md:underline-offset-4 sm:text-lg md:underline md:decoration-1 md:underline-offset-8">
                GIẢI PHÁP
              </p>
              {/* Dưới md: cỡ chữ 5,6vw cho ngang các trang dịch vụ con (5,9vw),
                  kèm ngắt dòng theo mockup — "VÀ" xuống dòng 2. Ngắt cũ để "VÀ"
                  ở cuối dòng 1 làm dòng đó dài hơn 11% (hệ số bề rộng 17,4 so
                  với 15,7), ở 5,9vw sẽ tràn 113% khung nên buộc phải nhỏ đi.
                  Hai span "VÀ" ẩn/hiện theo breakpoint để md trở lên giữ nguyên
                  ngắt dòng cũ của bản desktop. */}
              <h1 className="font-heading max-w-120 text-[clamp(1.25rem,4.6vw,2.35rem)] leading-[1.18] font-extrabold text-brand max-md:text-[clamp(1.1rem,5.6vw,1.75rem)] lg:text-[clamp(1.5rem,1.9vw,2.35rem)]">
                <span className="block lg:whitespace-nowrap">
                  THIẾT KẾ THI CÔNG, XÂY DỰNG
                  <span className="max-md:hidden">{" "}VÀ</span>
                </span>

                <span className="block lg:whitespace-nowrap">
                  <span className="md:hidden">VÀ </span>CẢI TẠO TRỌN GÓI
                </span>
              </h1>
            </Reveal>

            {/* 45% -> 40% của cột chữ (cột = 100vw - 36px) cho ra vạch rộng
                36,3vw, bằng 4 trang dịch vụ con (~36,2vw) và bằng mockup
                (256/720 = 35,6vw). `object-contain` nên icon nhà ở đuôi vạch
                cũng thu theo đúng tỉ lệ. */}
            <BuildingRule
              className="mt-2 w-full max-w-72 max-md:w-[40%]"
              src="/images/services/rule-dark.png"
              delay={200}
            />

            <Reveal delay={320} from="left">
              {/* Dưới md: 2,6vw + nowrap để câu này nằm gọn MỘT dòng và lấp ~98%
                  cột chữ, đúng như mockup (659/720 = 91,5vw trên cột 92,4vw).
                  Chặn dưới hạ 0,5625rem -> 0,5rem vì 9px cố định sẽ tràn 108%
                  khung ở màn 320px. */}
              <h2 className="font-heading mt-5 mb-4 max-w-160 text-[clamp(0.5625rem,2.5vw,0.875rem)] max-md:whitespace-nowrap max-md:text-[min(0.875rem,calc((100vw-2.25rem)*0.029))] sm:text-base lg:whitespace-nowrap">
                ĐÁP ỨNG ĐA DẠNG NHU CẦU CHO NHÀ Ở VÀ CÔNG TRÌNH THƯƠNG{" "}
                MẠI
              </h2>
              <span className="flex max-w-160 items-start gap-1.5 text-sm leading-relaxed text-pretty max-md:text-[min(0.875rem,calc((100vw-2.25rem)*0.029))] sm:text-base">
                {/* Căn đều 2 lề cả ở mobile/tablet chứ không chỉ từ lg. Cần
                    `w-full` đi kèm, nếu không flex item co theo nội dung thì
                    justify không có lề phải để dàn chữ. */}
                <p className="w-full text-justify leading-normal lg:w-full lg:text-justify">
                  <Image
                    className="inline-block size-4 mr-0.5 my-1 align-sub object-contain max-md:my-0 max-md:size-[0.88em] max-md:align-[-0.08em]"
                    src="/images/services/icon-house.png"
                    alt=""
                    width={86}
                    height={91}
                  />
                  BMT Decor mang đến dịch vụ thiết kế thi công, xây dựng và cải
                  tạo trọn gói từ ý tưởng đến hoàn thiện, tạo nên những công
                  trình chất lượng và đáp ứng nhu cầu sử dụng.
                </p>
              </span>
            </Reveal>
          </div>

          {/* Từ lg: cụm thẻ vẫn neo tuyệt đối như cũ, chồng lên vùng ảnh nền
              theo đúng bố cục desktop gốc.

              Dưới lg: cụm thẻ chuyển sang `relative`, xuống dòng bình thường
              ngay sau khối chữ (margin-top thay vì `bottom-0` tuyệt đối) nên
              không bao giờ chồng lên đoạn mô tả cho dù chữ dài ngắn ra sao. */}
          <div className="absolute top-[16.4%] right-[7.2%] aspect-1387/1000 w-[45%] md:translate-y-[calc(var(--hero-lift)*-1)] max-md:relative max-md:top-auto max-md:right-auto max-md:mt-8 max-md:w-full max-md:translate-y-0">
            {heroCards.map((card, index) => (
              <Reveal
                className={`group/card absolute w-[31.5%] hover:z-50 active:z-50 ${cardPositions[index]}`}
                delay={(heroCards.length - 1 - index) * 130}
                from="right"
                key={card.image}
              >
                <Image
                  className="h-auto w-full transition-transform duration-500 ease-out group-hover/card:scale-105 group-active/card:scale-105"
                  src={card.image}
                  alt={card.alt}
                  width={800}
                  height={1501}
                  sizes="280px"
                  priority
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-[min(75rem,calc(100%-2.25rem))]">
          <ServiceTabs />
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20" id="quy-trinh">
        {/* Dưới md nới lề trang 18px -> 12px riêng cho khối này: đoạn mô tả đã
            chạm trần cỡ chữ của bố cục 2 dòng, chỉ còn cách nới khung mới to
            thêm được. Lề 12px vẫn cách mép màn hình an toàn. */}
        <div className="mx-auto mb-8 w-[min(49.375rem,calc(100%-2.25rem))] text-center max-md:w-[calc(100%-1.5rem)] lg:mb-10">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold max-md:text-[clamp(1.12rem,4.75vw,1.55rem)] max-md:leading-[1.08] max-md:font-extrabold sm:text-4xl md:text-[clamp(2.25rem,3.36vw,2.6875rem)]">
              QUY TRÌNH LÀM VIỆC
            </h2>
          </Reveal>
          <Reveal delay={160}>
            {/* Mockup ngắt 2 dòng sau "đảm bảo tiến độ," và in đậm "BMT Decor",
                "quy trình 6 bước". Ngắt dòng chỉ bật từ md trở lên để màn nhỏ
                vẫn tự xuống hàng theo bề rộng.

                Dưới md: bỏ in đậm, và cỡ chữ bám bề rộng khung thay vì
                text-sm cố định (14px cứng cho ra 3 dòng, màn 320px là 4 dòng).

                0,0295 là mức kịch trần của bố cục 2 dòng: câu này dài 65,13
                lần cỡ chữ, chia đôi thì dòng dài nhất tối thiểu 33,44 lần —
                và chỗ ngắt greedy hiện tại đã đúng là chỗ cân nhất, nên không
                thể moi thêm bằng cách ngắt lại. Dòng 1 lấp 98,6% khung. */}
            <p className="mx-auto mt-3 max-w-180 text-sm leading-relaxed max-md:text-[min(0.875rem,calc((100vw-1.5rem)*0.0295))] sm:text-base">
              <strong className="font-bold max-md:font-normal">BMT Decor</strong> triển khai dự án
              theo <strong className="font-bold max-md:font-normal">quy trình 6 bước</strong> rõ
              ràng, đảm bảo tiến độ,
              <br className="hidden md:inline" /> chất lượng và đồng hành cùng
              khách hàng trong từng giai đoạn.
            </p>
          </Reveal>
          {/* Cùng lý do với đường kẻ ở phần FAQ: ảnh 1388×128 rất dẹt, khoá
              chiều cao cố định khiến object-contain để trống mảng trên/dưới
              trong khung. Đổi sang h-auto + đúng aspect ảnh gốc. */}
          <BuildingRule
            className="mx-auto mt-4 w-full max-w-82.5 max-lg:mt-1.5 max-lg:h-auto max-lg:aspect-1388/128 max-lg:w-[50%]"
            src="/images/services/rule-orange.png"
            delay={320}
          />
        </div>
        <ProcessAccordion />
      </section>

      {/* Ảnh trái chạm đáy section, panel xám lệch xuống 30px và thò qua phần
          liên hệ bên dưới. Phía trên đỉnh panel (bên phải đường cong của ảnh)
          để trắng, đúng bản thiết kế. Panel thụt sang trái 14px chui dưới ảnh
          để mép cong chạm đúng góc trên-trái của panel, không hở nêm trắng:
          14 = R - √(R² - (R - lệch)²) với R = 72, lệch = 30. */}
      {/* Ảnh trái và panel xám được đặt thẳng hàng để mép dưới khớp mượt mà. 
          Khe hở ở góc cong phía trên sẽ được lấp bằng một khối div phụ ẩn phía sau. */}
      <section className="grid lg:grid-cols-2">
        <Reveal
          className="group/photo relative z-20 max-lg:aspect-[1400/1207] overflow-hidden rounded-t-3xl lg:mr-0 lg:min-h-120 lg:rounded-none lg:rounded-tr-[4.5rem]"
          from="left"
        >
          <Image
            className="object-cover transition-transform duration-700 ease-out group-hover/photo:scale-105 group-active/photo:scale-105"
            src="/images/services/faq-photo.webp"
            alt="Góc thư giãn trong công trình do BMT Decor thực hiện"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        {/* Đã xóa lg:-ml-[14px] ở div chứa panel */}
        <div className="relative z-10 bg-neutral-100 px-5 py-14 lg:mt-[30px] lg:-mb-[calc(max(30px,2.57vw)+10px)] lg:rounded-tr-[83px] lg:rounded-bl-[30px] lg:pt-8 lg:pr-[8%] lg:pb-[calc(3rem+max(0px,calc(2.57vw-30px))+10px)] lg:pl-[5.5%]">
          {/* MỚI: Khối màu xám nhỏ ẩn phía sau, dùng để lấp vào khoảng hở 14px ở góc trên cùng */}
          <div
            className="hidden lg:block absolute top-0 -left-3.5 w-3.5 h-25 bg-neutral-100"
            aria-hidden="true"
          />

          <Reveal>
            <h2 className="font-heading text-2xl font-bold max-lg:text-center max-md:text-[clamp(1.12rem,4.75vw,1.55rem)] max-md:leading-[1.08] max-md:font-extrabold sm:text-3xl lg:text-4xl">
              CÁC CÂU HỎI THƯỜNG GẶP
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 max-w-110 text-sm leading-relaxed text-pretty max-md:text-[min(0.875rem,calc((100vw-1.5rem)*0.0295))] max-lg:mx-auto max-lg:text-center">
              Giải đáp những thắc mắc phổ biến giúp khách hàng hiểu rõ
              <br className="hidden md:inline" /> hơn về quy trình và dịch vụ
              của BMT Decor
            </p>
          </Reveal>
          {/* Ảnh gốc rule-orange.png tỉ lệ 1388×128 (~10.8:1) rất dẹt: khoá
              h-16 cố định trước đó khiến object-contain co theo bề rộng rồi
              để trống mảng trên/dưới trong khung. Đổi sang h-auto + aspect
              đúng tỉ lệ ảnh để khung ôm sát nội dung, không còn khoảng trắng
              thừa. */}
          <BuildingRule
            className="mt-3 mb-10 w-full max-w-82.5 max-lg:mx-auto max-lg:mt-1.5 max-lg:mb-4 max-lg:h-auto max-lg:aspect-1388/128 max-lg:w-[48%] lg:mb-18"
            src="/images/services/rule-orange.png"
            delay={320}
          />
          <FaqAccordion />
        </div>
      </section>

      {/* Bọc nền xám neutral-100 sau lưng ContactForm: phần khuyết (notch) phía
          trên form vốn trong suốt trong ảnh nền, chỉ chồng margin âm của panel
          FAQ không đảm bảo khớp pixel ở mọi khổ màn hình, nên thêm nền chắc
          chắn ở đây để phần khuyết luôn lộ đúng màu xám thay vì trắng. */}
      <div className="bg-neutral-100">
        <ContactForm showTopNotch />
      </div>
      {/* Mobile: nền contact form đã là cam nên vạch cam đầu footer thành thừa. */}
      <SiteFooter hideTopBorderOnMobile />
    </div>
  );
}
