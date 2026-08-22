/* Thư viện page-flip (StPageFlip) không kèm file type, khai báo phần API mà
   ProfileBook đang dùng. Tên tuỳ chọn lấy đúng theo bảng mặc định trong
   node_modules/page-flip/dist/js/page-flip.module.js. */
declare module "page-flip" {
  export type FlipOrientation = "portrait" | "landscape";
  export type FlipCorner = "top" | "bottom";
  export type PageDensity = "soft" | "hard";

  export interface PageFlipSettings {
    startPage: number;
    size: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    swipeDistance: number;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface PageFlipEvent<T> {
    data: T;
    object: PageFlip;
  }

  export interface FlipPage {
    setDensity(density: PageDensity): void;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<PageFlipSettings>);
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    loadFromImages(images: string[]): void;
    on(event: "flip", callback: (event: PageFlipEvent<number>) => void): PageFlip;
    on(event: "changeOrientation", callback: (event: PageFlipEvent<FlipOrientation>) => void): PageFlip;
    on(event: "changeState", callback: (event: PageFlipEvent<string>) => void): PageFlip;
    on(event: "init", callback: (event: PageFlipEvent<{ page: number; mode: FlipOrientation }>) => void): PageFlip;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    turnToPage(page: number): void;
    getPage(index: number): FlipPage | null;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): FlipOrientation;
    destroy(): void;
  }
}
