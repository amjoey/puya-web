import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";

import { AvailabilityCalendar } from "@/components/calendar/AvailabilityCalendar";
import { RatingStars } from "@/components/review/RatingStars";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VillaFacilities } from "@/components/villa/VillaFacilities";
import { VillaGallery } from "@/components/villa/VillaGallery";
import { VillaPricing } from "@/components/villa/VillaPricing";
import { SEO } from "@/lib/constants/seo";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { DEMO_VILLA_GALLERIES } from "@/lib/demo/villaGalleries";
import { cn } from "@/lib/utils/cn";
import { parseMonthParam } from "@/lib/utils/date";
import { safeFetch } from "@/lib/utils/safeFetch";
import { listApprovedReviewsByVilla } from "@/repositories/review.repository";
import { getActiveVillas, getVillaBySlug } from "@/repositories/villa.repository";
import { listVillaImagesByVilla } from "@/repositories/villaImage.repository";

export const dynamic = "force-dynamic";

interface VillaDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ month?: string }>;
}

export async function generateStaticParams() {
  const { data: villas } = await safeFetch(() => getActiveVillas(), []);
  return villas.map((villa) => ({ slug: villa.slug }));
}

export async function generateMetadata({
  params,
}: VillaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: villa } = await safeFetch(() => getVillaBySlug(slug), null);
  if (!villa) return {};

  return {
    title: `${villa.name} | PUYA Beach Villa`,
    description: villa.description ?? undefined,
    alternates: { canonical: `/villas/${villa.slug}` },
    openGraph: {
      title: `${villa.name} | PUYA Beach Villa`,
      description: villa.description ?? undefined,
      images: [villa.coverImage ?? "/demo/hero.svg"],
      type: "website",
    },
  };
}

export default async function VillaDetailPage({
  params,
  searchParams,
}: VillaDetailPageProps) {
  const { slug } = await params;
  const { month: monthParam } = await searchParams;

  const { data: villa, error: villaLoadError } = await safeFetch(
    () => getVillaBySlug(slug),
    null,
  );

  if (villaLoadError) {
    return (
      <main className={cn(CONTAINER_PADDING, "py-12 text-center")}>
        <p className="text-body text-destructive">
          ไม่สามารถโหลดข้อมูลวิลล่าได้ กรุณาลองใหม่ภายหลัง
        </p>
      </main>
    );
  }

  if (!villa) {
    notFound();
  }

  const { year, month } = parseMonthParam(monthParam);

  const { data: villaImages } = await safeFetch(() => listVillaImagesByVilla(villa.id), []);
  const gallery =
    villaImages.length > 0
      ? villaImages.map((image) => image.url)
      : DEMO_VILLA_GALLERIES[villa.slug] ?? [villa.coverImage ?? "/demo/hero.svg"];
  const { data: villaReviews } = await safeFetch(
    () => listApprovedReviewsByVilla(villa.id),
    [],
  );
  const averageRating =
    villaReviews.length > 0
      ? villaReviews.reduce((sum, review) => sum + review.rating, 0) /
        villaReviews.length
      : null;

  const villaJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: villa.name,
    description: villa.description,
    image: villa.coverImage,
    priceRange: `฿${villa.weekdayPrice} - ฿${villa.weekendPrice}`,
    url: `${SEO.siteUrl}/villas/${villa.slug}`,
    ...(averageRating !== null && villaReviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: villaReviews.length,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SEO.siteUrl },
      { "@type": "ListItem", position: 2, name: "Villas", item: `${SEO.siteUrl}/villas` },
      {
        "@type": "ListItem",
        position: 3,
        name: villa.name,
        item: `${SEO.siteUrl}/villas/${villa.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(villaJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className={cn(CONTAINER_PADDING, "py-8 pb-28 tablet:py-12 tablet:pb-12")}>
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <VillaGallery images={gallery} villaName={villa.name} />

          <div className="flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between">
            <div>
              <h1 className="text-3xl font-medium text-ink tablet:text-4xl">
                {villa.name}
              </h1>
              <Badge variant="secondary" className="mt-2 gap-1.5">
                <Users className="size-3.5" aria-hidden="true" />
                รับได้ถึง {villa.capacity} คน
              </Badge>
            </div>
            <Button asChild size="lg" className="hidden tablet:inline-flex tablet:shrink-0">
              <Link href={`/booking/${villa.slug}`}>เช็คราคา / จองเลย</Link>
            </Button>
          </div>

          <section>
            <h2 className="text-2xl font-medium text-ink">รายละเอียด</h2>
            <p className="mt-3 text-body text-ink-soft">{villa.description}</p>
          </section>

          <section>
            <VillaFacilities />
          </section>

          <section>
            <VillaPricing villa={villa} />
          </section>

          <section>
            <AvailabilityCalendar
              villaId={villa.id}
              villaName={villa.name}
              year={year}
              month={month}
              basePath={`/villas/${villa.slug}`}
            />
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-ink">รีวิว</h2>
              {averageRating !== null && (
                <div className="flex items-center gap-2">
                  <RatingStars rating={averageRating} />
                  <span className="text-caption text-ink-soft">
                    {averageRating.toFixed(1)} / 5 ({villaReviews.length})
                  </span>
                </div>
              )}
            </div>
            {villaReviews.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4 tablet:flex-row tablet:flex-wrap">
                {villaReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-body text-ink-soft">
                ยังไม่มีรีวิวสำหรับวิลล่านี้
              </p>
            )}
          </section>
        </div>

        {/* Sticky mobile Booking CTA — see UI_UX_SPEC.md > Villa Detail Page > Booking CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 p-4 backdrop-blur-md tablet:hidden">
          <Button asChild size="lg" className="w-full">
            <Link href={`/booking/${villa.slug}`}>เช็คราคา / จองเลย</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
