"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";

export type RenovationProcessStep = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
};

type RenovationProcessStepsProps = {
  steps: readonly RenovationProcessStep[];
};

export function RenovationProcessSteps({ steps }: RenovationProcessStepsProps) {
  return (
    // Đã thu hẹp max-width xuống còn khoảng 1024px để lọt lòng vừa đường viền đỏ
    <section className="mx-auto w-[min(64rem,calc(100%-2rem))] py-12">
      {/* Header: Chữ bên trái, Logo BMT bên phải */}
      {/* Header: Chữ bên trái, Logo BMT bên phải */}
      {/* Header: Chữ bên trái, Logo BMT bên phải */}
      {/* Header: Chữ và Logo đi liền nhau, canh giữa */}
      {/* Header: Đẩy sát 2 lề và kích thước vừa đủ để lấp đầy không gian */}
      <Reveal
        from="bottom"
        className="mb-10 flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:justify-center lg:gap-x-2"
      >
        {/* Tiêu đề: đã giảm cỡ chữ (42/46px -> 32/36px) để vừa với độ rộng
            dải 5 quy trình bên dưới, không còn to lấn át lưới thẻ. Màn nhỏ tự
            xuống dòng thay vì whitespace-nowrap (trước đây gây tràn ngang). */}
        <h2 className="font-heading text-xl font-black uppercase tracking-tight text-charcoal text-center sm:text-2xl lg:text-[2rem] lg:text-left lg:whitespace-nowrap xl:text-[2.25rem]">
          Quy trình cải tạo & sửa chữa tại
        </h2>

        {/* Logo: To ra khoảng 310px để nối tiếp ngay sau chữ và chạm mép phải */}
        <Image
          src="/images/cai-tao-sua-chua/logo.png" // BẠN ĐỔI URL ẢNH LOGO VÀO ĐÂY
          alt="BMT Decor Logo"
          width={310}
          height={85}
          className="h-auto w-32 max-w-full -translate-y-1 shrink-0 object-contain sm:w-48 lg:w-56 xl:w-60"
        />
      </Reveal>

      {/* Grid 5 cột */}
      <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-1">
        {steps.map((step, index) => (
          <Reveal
            key={step.number}
            className="group/step @container relative w-full transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
            delay={index * 150}
            from="bottom"
          >
            {/* Background Frame: Tự động scale theo chiều ngang mới.
                `width`/`height` PHẢI khớp tỉ lệ thật của file (1016x1214,
                ~0.84) — trước đây để 260x600 (~0.43) làm trình duyệt tính
                sai tỉ lệ khung theo `h-auto`, khiến `object-contain` co ảnh
                nhỏ lại và chừa ~24% khoảng trống rỗng trên/dưới trong khung.
                Số thứ tự (`top-[16.5%]`) và icon cam (`bottom-[-4%]`) đều
                định vị theo % của khung đó nên bị lọt vào đúng vùng trống
                này — số như bị lệch trái, icon như bị tụt xuống quá thấp. */}
            <Image
              src="/images/cai-tao-sua-chua/frame.png" // BẠN ĐỔI URL ẢNH KHUNG SỐ 49 VÀO ĐÂY
              alt="Khung background"
              width={1016}
              height={1214}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 20vw"
            />

            {index === steps.length - 1 && (
              <>
                <span
                  className="pointer-events-none absolute bottom-0 right-0 top-[68%] w-[17%] bg-white"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute bottom-0 right-[14.6%] top-[68%] w-[0.8%] bg-[#231f20]"
                  aria-hidden="true"
                />
              </>
            )}

            {/* Lớp overlay sáng màu cam khi hover */}
            <div className="pointer-events-none absolute left-0 top-0 h-[28%] w-full rounded-t-[1.5rem] bg-white/0 transition-colors duration-300 group-hover/step:bg-white/20" />

            {/* Số thứ tự và khối chữ đều tính theo BỀ RỘNG CARD (cqw) nên khi
                card to ra ở tablet/mobile chữ phóng theo đúng tỉ lệ, không còn
                bé tí trong khung. Từ lg trở lên chốt lại đúng px của bản cũ. */}
            {/* `leading-none` bỏ khoảng đệm line-height phía trên/dưới chữ số
                — không có nó thì -translate-y-1/2 canh giữa theo cả phần
                leading rỗng chứ không phải theo bản thân glyph, làm số nhìn
                lệch xuống dưới tâm khung. */}
            <div className="absolute left-[46%] top-[16.5%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[17.9cqw] font-black leading-none text-white lg:text-[2.25rem] xl:text-[2.75rem]">
              {step.number}
            </div>
            {/* Vùng chứa Text: Vẫn giữ nguyên tỉ lệ bóp lề để lọt lòng khung đen */}
            <div className="absolute inset-0 bottom-[12%] left-[12%] right-[18%] top-[29%] flex flex-col pt-2">
              {/* Tiêu đề: đậm hơn (extrabold) và to hơn một chút so với bản cũ.
                  `shrink-0` để flexbox không bóp chiều cao khi nội dung tràn. */}
              <h3 className="font-heading flex shrink-0 flex-col text-left text-[6.3cqw] font-extrabold leading-snug text-charcoal lg:text-[0.8125rem] xl:text-sm">
                <span>{step.title}</span>
                <span>{step.subtitle}</span>
              </h3>

              {/* Đường line cam: `shrink-0` giữ line luôn hiển thị đủ độ dày,
                  không bị flexbox bóp mất khi mô tả dài tràn khung (bug khiến
                  1 số thẻ mất hẳn đường line). */}
              <div className="my-1.5 h-0.5 w-[55%] shrink-0 bg-[#f26f21]" />

              {/* Mô tả: căn đều 2 lề, chừa lề trong đều 2 bên (px) và
                  siết bớt tracking để chữ khít lại, không bị giãn quá khi justify */}
              <p className="text-justify tracking-tighter px-[3%] text-[5.46cqw] leading-tight text-charcoal/80 lg:text-[0.6875rem] xl:text-xs xl:leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Icon (Logo dưới): Tràn 50% ra ngoài khung. Đã thu nhỏ thêm một
                nấc (24->20/lg 10->9/xl 12->10) so với bản cũ. */}
            <Reveal
              className="absolute bottom-[-4%] left-[46%] z-10 -translate-x-1/2 translate-y-1/2"
              delay={index * 150 + 350}
              from="fade"
            >
              <Image
                className="size-[17cqw] max-w-10 object-contain transition-transform duration-300 group-hover/step:scale-110 lg:size-9 xl:size-10"
                src={step.icon}
                alt={step.title}
                width={48}
                height={48}
              />
            </Reveal>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
