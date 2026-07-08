// Placeholder content for the Home page until Phase 2 (Database) is seeded
// and wired up via the repository layer. Shapes mirror the domain types in
// /types so swapping to live data later is a drop-in replacement.
import type { Villa } from "@/types/villa";
import type { Review } from "@/types/review";
import type { Promotion } from "@/types/promotion";

const now = new Date().toISOString();

export const demoVillas: Villa[] = [
  {
    id: "demo-villa-1",
    name: "Villa 1",
    slug: "villa-1",
    description:
      "วิลล่าริมชายหาดส่วนตัวพร้อมสระว่ายน้ำ ติดทะเลโดยตรง เหมาะสำหรับกลุ่มใหญ่และครอบครัว",
    capacity: 15,
    weekdayPrice: 6900,
    weekendPrice: 7900,
    coverImage: "/demo/villa-1.svg",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "demo-villa-2",
    name: "Villa 2",
    slug: "villa-2",
    description:
      "วิลล่าขนาดใหญ่พร้อมสระว่ายน้ำส่วนตัว ห้องคาราโอเกะ และดาดฟ้าบาร์บีคิวติดชายหาด",
    capacity: 15,
    weekdayPrice: 6900,
    weekendPrice: 7900,
    coverImage: "/demo/villa-2.svg",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const demoReviews: Review[] = [
  {
    id: "demo-review-1",
    villaId: "demo-villa-1",
    customerName: "Anchalee P.",
    rating: 5,
    comment:
      "วิลล่าริมชายหาดสวยงามมาก สระน้ำและดาดฟ้าบาร์บีคิวทำให้ทริปครอบครัวครั้งนี้น่าจดจำมากเลยค่ะ",
    imageUrl: "/demo/review-1.svg",
    approved: true,
    createdAt: now,
  },
  {
    id: "demo-review-2",
    villaId: "demo-villa-2",
    customerName: "James W.",
    rating: 5,
    comment:
      "กว้างขวาง สะอาด และติดชายหาดเลย ห้องคาราโอเกะโดนใจกลุ่มเพื่อนมากครับ",
    imageUrl: "/demo/review-2.svg",
    approved: true,
    createdAt: now,
  },
  {
    id: "demo-review-3",
    villaId: "demo-villa-1",
    customerName: "Suda K.",
    rating: 4,
    comment:
      "ทำเลดีมาก เจ้าหน้าที่ใจดี ครั้งหน้าจะกลับมาจองอีกแน่นอนค่ะ",
    imageUrl: "/demo/review-3.svg",
    approved: true,
    createdAt: now,
  },
  {
    id: "demo-review-4",
    villaId: "demo-villa-2",
    customerName: "Natalie R.",
    rating: 5,
    comment:
      "ดาดฟ้าบาร์บีคิวและห้องคาราโอเกะเพอร์เฟกต์มาก กำลังวางแผนมาอีกรอบแล้ว",
    imageUrl: "/demo/review-1.svg",
    approved: true,
    createdAt: now,
  },
];

export const demoPromotions: Promotion[] = [
  {
    id: "demo-promo-1",
    title: "Early Bird — จองล่วงหน้า 30 วัน",
    description:
      "จองล่วงหน้าอย่างน้อย 30 วัน รับส่วนลดพิเศษทันที",
    discountType: "percentage",
    discountValue: 15,
    startDate: null,
    endDate: null,
    active: true,
    createdAt: now,
  },
  {
    id: "demo-promo-2",
    title: "ส่วนลดพักยาว",
    description:
      "พัก 3 คืนขึ้นไป รับส่วนลดพิเศษทันที",
    discountType: "fixed_amount",
    discountValue: 1000,
    startDate: null,
    endDate: null,
    active: true,
    createdAt: now,
  },
];
