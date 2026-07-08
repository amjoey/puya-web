"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import {
  deleteVillaImage,
  reorderVillaImages,
  uploadVillaImage,
  type UploadVillaImageResult,
} from "@/actions/villaImage.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VillaImage } from "@/types/villaImage";

interface VillaImageManagerProps {
  villaId: string;
  villaName: string;
  images: VillaImage[];
}

// Admin Dashboard > Manage Villas > Gallery — add/remove/reorder the photos
// shown on the public villa detail page (components/villa/VillaGallery.tsx).
export function VillaImageManager({ villaId, villaName, images }: VillaImageManagerProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [gallery, setGallery] = useState(images);
  const [isPending, startTransition] = useTransition();
  const [uploadState, uploadAction, isUploading] = useActionState<
    UploadVillaImageResult | null,
    FormData
  >(uploadVillaImage, null);

  // Fires once per completed upload action — `uploadState` is referentially
  // stable across unrelated re-renders (delete/reorder), so this only runs
  // right after a new upload actually resolves.
  useEffect(() => {
    if (!uploadState?.success) return;
    const uploaded = uploadState.image;
    setGallery((current) =>
      current.some((image) => image.id === uploaded.id) ? current : [...current, uploaded],
    );
    formRef.current?.reset();
  }, [uploadState]);

  function handleDelete(imageId: string) {
    startTransition(async () => {
      const result = await deleteVillaImage(imageId);
      if (result.success) {
        setGallery((current) => current.filter((image) => image.id !== imageId));
      }
      router.refresh();
    });
  }

  function handleMove(index: number, direction: "up" | "down") {
    const otherIndex = direction === "up" ? index - 1 : index + 1;
    if (otherIndex < 0 || otherIndex >= gallery.length) return;

    const current = gallery[index];
    const other = gallery[otherIndex];

    startTransition(async () => {
      const result = await reorderVillaImages(
        current.id,
        current.sortOrder,
        other.id,
        other.sortOrder,
      );
      if (result.success) {
        setGallery((prev) => {
          const next = [...prev];
          const swappedCurrent = { ...current, sortOrder: other.sortOrder };
          const swappedOther = { ...other, sortOrder: current.sortOrder };
          next[index] = swappedOther;
          next[otherIndex] = swappedCurrent;
          return next.sort((a, b) => a.sortOrder - b.sortOrder);
        });
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        ref={formRef}
        action={uploadAction}
        className="flex flex-col gap-3 rounded-lg border border-border p-4"
      >
        <input type="hidden" name="villaId" value={villaId} />
        <Label htmlFor="photo">Add Photo</Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          disabled={isUploading}
        />
        <p className="text-caption text-muted-foreground">JPG, PNG, or WEBP, up to 8MB.</p>
        {uploadState && !uploadState.success && (
          <p className="text-body text-destructive">{uploadState.error}</p>
        )}
        <Button type="submit" disabled={isUploading} className="self-start">
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {gallery.length === 0 ? (
        <p className="text-body text-muted-foreground">
          No photos yet for {villaName}. The public page will fall back to placeholder images
          until at least one photo is uploaded.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 tablet:grid-cols-3">
          {gallery.map((image, index) => (
            <div key={image.id} className="flex flex-col gap-2">
              <img
                src={image.url}
                alt={`${villaName} photo ${index + 1}`}
                className="aspect-4/3 w-full rounded-lg border border-border object-cover"
              />
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending || index === 0}
                  onClick={() => handleMove(index, "up")}
                  aria-label="Move photo earlier"
                >
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending || index === gallery.length - 1}
                  onClick={() => handleMove(index, "down")}
                  aria-label="Move photo later"
                >
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleDelete(image.id)}
                  aria-label="Delete photo"
                  className="ml-auto"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
