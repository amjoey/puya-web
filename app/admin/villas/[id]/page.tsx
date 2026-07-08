import { notFound } from "next/navigation";

import { AdminShell } from "@/components/dashboard/AdminShell";
import { VillaImageManager } from "@/components/dashboard/VillaImageManager";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { isUuid } from "@/lib/utils/uuid";
import { listVillaImagesByVilla } from "@/repositories/villaImage.repository";
import { getVillaById } from "@/repositories/villa.repository";

interface AdminVillaGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminVillaGalleryPage({ params }: AdminVillaGalleryPageProps) {
  const { id } = await params;

  if (!isUuid(id)) {
    notFound();
  }

  const { data: villa, error: villaLoadError } = await safeFetch(() => getVillaById(id), null);

  if (villaLoadError) {
    return (
      <AdminShell>
        <main className={cn(CONTAINER_PADDING, "py-8")}>
          <p className="text-body text-destructive">
            Unable to load this villa. Make sure you are signed in as an admin.
          </p>
        </main>
      </AdminShell>
    );
  }

  if (!villa) {
    notFound();
  }

  const { data: images, error: imagesLoadError } = await safeFetch(
    () => listVillaImagesByVilla(villa.id),
    [],
  );

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">{villa.name} — Gallery</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Photos appear on the public page in the order shown below.
        </p>

        <div className="mt-6 max-w-3xl">
          {imagesLoadError ? (
            <p className="text-body text-destructive">Unable to load this villa&apos;s photos.</p>
          ) : (
            <VillaImageManager villaId={villa.id} villaName={villa.name} images={images} />
          )}
        </div>
      </main>
    </AdminShell>
  );
}
