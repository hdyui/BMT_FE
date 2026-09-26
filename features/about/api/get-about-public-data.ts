import {
  aboutCapabilities,
  aboutCoreValues,
  aboutJourneyMilestones,
  aboutJourneySection,
} from "@/features/about/data/about-content";
import type { AboutPublicData } from "@/features/about/types/about-public";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(
  record: UnknownRecord | null,
  key: string,
  fallback = "",
): string {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readOptionalString(
  record: UnknownRecord | null,
  key: string,
): string | undefined {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function getAboutFallbackData(): AboutPublicData {
  return {
    hero: {
      eyebrow: "Về chúng tôi",
      heading: "Kiến tạo giá trị từ mỗi không gian",
      description:
        "BMT Decor là đơn vị thiết kế kiến trúc, thiết kế nội thất, thi công xây dựng và cải tạo trọn gói, mang đến giải pháp toàn diện cho nhà ở, văn phòng và công trình thương mại. Với hơn 15 năm kinh nghiệm cùng quy trình triển khai chuyên nghiệp, chúng tôi cam kết kiến tạo những không gian hài hòa giữa công năng, thẩm mỹ và chất lượng, tối ưu giá trị đầu tư và bền vững theo thời gian.",
      desktopImage: "/images/about/source/hero-interior.png",
      desktopAlt: "Không gian nội thất phòng ăn hiện đại do BMT Decor thiết kế",
    },
    journey: {
      title: aboutJourneySection.title,
      items: aboutJourneyMilestones.map((item) => ({ ...item })),
    },
    visionMission: {
      visionHeading: "Tầm nhìn",
      visionDescription:
        "Trở thành đơn vị thiết kế và thi công được khách hàng tin tưởng lựa chọn nhờ năng lực chuyên môn, quy trình chuyên nghiệp và chất lượng công trình, không ngừng nâng cao giá trị cho từng không gian sống và làm việc.",
      missionHeading: "Sứ mệnh",
      missionDescription:
        "Mang đến những giải pháp thiết kế và thi công trọn gói chuyên nghiệp, giúp khách hàng sở hữu không gian tối ưu về công năng, hài hòa về thẩm mỹ và bền vững về chất lượng, đồng hành trong suốt quá trình kiến tạo công trình.",
    },
    coreValues: {
      title: "Giá trị cốt lõi",
      items: aboutCoreValues.map((item) => ({
        ...item,
        imageAlt: item.title,
      })),
    },
    capabilities: {
      title: "Năng lực nổi bật",
      items: aboutCapabilities.map((item) => ({ ...item })),
    },
    contactForm: {
      title: "LIÊN HỆ TƯ VẤN",
      description: "",
      successMessage:
        "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.",
    },
  };
}

export function buildAboutPublicData({
  aboutApiValue,
  fallbackData,
}: {
  aboutApiValue?: unknown;
  fallbackData?: AboutPublicData;
}): AboutPublicData {
  const fallback = fallbackData ?? getAboutFallbackData();
  const root = asRecord(aboutApiValue);
  const content = asRecord(root?.content) ?? root;

  const hero = asRecord(content?.hero);
  const journey = asRecord(content?.journey);
  const visionMission = asRecord(content?.visionMission);
  const coreValues = asRecord(content?.coreValues);
  const capabilities = asRecord(content?.capabilities);
  const contactForm = asRecord(content?.contactForm);

  const journeyItems = asArray(journey?.items);
  const mappedJourney =
    journeyItems.length > 0
      ? journeyItems.map((item, index) => {
          const record = asRecord(item);
          const visual = fallback.journey.items[index] ?? fallback.journey.items[0];
          return {
            year: readString(record, "year", visual?.year ?? ""),
            title: readString(record, "title", visual?.title ?? ""),
            description: readString(
              record,
              "description",
              visual?.description ?? "",
            ),
            image: visual?.image ?? "",
          };
        })
      : fallback.journey.items;

  const coreItems = asArray(coreValues?.items);
  const mappedCore =
    coreItems.length > 0
      ? coreItems.map((item, index) => {
          const record = asRecord(item);
          const visual = fallback.coreValues.items[index] ?? fallback.coreValues.items[0];
          return {
            title: readString(record, "title", visual?.title ?? ""),
            description: readString(
              record,
              "description",
              visual?.description ?? "",
            ),
            image: readString(record, "image", visual?.image ?? ""),
            imageAlt:
              readOptionalString(record, "imageAlt") ??
              visual?.imageAlt ??
              visual?.title,
          };
        })
      : fallback.coreValues.items;

  const capabilityItems = asArray(capabilities?.items);
  const mappedCapabilities =
    capabilityItems.length > 0
      ? fallback.capabilities.items.map((visual, index) => {
          const record = asRecord(capabilityItems[index]);
          if (!record) return visual;
          return {
            ...visual,
            title: readString(record, "title", visual.title),
            mobileTitle:
              readOptionalString(record, "mobileTitle") ??
              visual.mobileTitle ??
              visual.title,
            description: readString(
              record,
              "description",
              visual.description,
            ),
          };
        })
      : fallback.capabilities.items;

  return {
    hero: hero
      ? {
          eyebrow: readString(hero, "eyebrow", fallback.hero.eyebrow),
          heading: readString(hero, "heading", fallback.hero.heading),
          description: readString(
            hero,
            "description",
            fallback.hero.description,
          ),
          desktopImage: readString(
            hero,
            "desktopImage",
            fallback.hero.desktopImage,
          ),
          desktopAlt:
            readOptionalString(hero, "desktopAlt") ?? fallback.hero.desktopAlt,
        }
      : fallback.hero,
    journey: {
      title: readString(journey, "title", fallback.journey.title),
      items: mappedJourney,
    },
    visionMission: visionMission
      ? {
          visionHeading: readString(
            visionMission,
            "visionHeading",
            fallback.visionMission.visionHeading,
          ),
          visionDescription: readString(
            visionMission,
            "visionDescription",
            fallback.visionMission.visionDescription,
          ),
          missionHeading: readString(
            visionMission,
            "missionHeading",
            fallback.visionMission.missionHeading,
          ),
          missionDescription: readString(
            visionMission,
            "missionDescription",
            fallback.visionMission.missionDescription,
          ),
        }
      : fallback.visionMission,
    coreValues: {
      title: readString(coreValues, "title", fallback.coreValues.title),
      items: mappedCore,
    },
    capabilities: {
      title: readString(
        capabilities,
        "title",
        fallback.capabilities.title,
      ),
      items: mappedCapabilities,
    },
    contactForm: contactForm
      ? {
          title: readString(
            contactForm,
            "title",
            fallback.contactForm.title,
          ),
          description:
            readOptionalString(contactForm, "description") ??
            fallback.contactForm.description,
          successMessage: readString(
            contactForm,
            "successMessage",
            fallback.contactForm.successMessage,
          ),
        }
      : fallback.contactForm,
  };
}
