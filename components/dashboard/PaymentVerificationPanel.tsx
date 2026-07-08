"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { rejectPayment, verifyPayment } from "@/actions/payment.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatTHB } from "@/lib/utils/currency";
import type { Booking } from "@/types/booking";
import type { Payment } from "@/types/payment";
import type { Villa } from "@/types/villa";

interface PaymentVerificationPanelProps {
  payment: Payment;
  booking: Booking | null;
  villa: Villa | null;
  slipUrl: string | null;
}

// See UI_UX_SPEC.md > Payment Verification (Slip Preview, Approve, Reject, Notes).
export function PaymentVerificationPanel({
  payment,
  booking,
  villa,
  slipUrl,
}: PaymentVerificationPanelProps) {
  const router = useRouter();
  const [remarks, setRemarks] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function handleVerify() {
    startTransition(async () => {
      const response = await verifyPayment({ paymentId: payment.id, remarks });
      if (response.success) {
        router.refresh();
      } else {
        setResult(response.error);
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      const response = await rejectPayment({ paymentId: payment.id, remarks });
      if (response.success) {
        router.refresh();
      } else {
        setResult(response.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <p className="text-body font-semibold text-foreground">
              {booking?.customerName ?? "Unknown guest"} — {villa?.name ?? "Unknown villa"}
            </p>
            <p className="text-caption text-muted-foreground">
              {booking ? `${booking.checkIn} – ${booking.checkOut}` : ""}
            </p>
          </div>
          <p className="text-h3 font-semibold text-foreground">{formatTHB(payment.amount)}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {slipUrl ? (
          <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border">
            <Image src={slipUrl} alt="Payment slip" fill className="object-contain" />
          </div>
        ) : (
          <p className="text-caption text-muted-foreground">No slip image available.</p>
        )}
        <Textarea
          placeholder="Notes (optional)"
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
        />
        {result && <p className="text-body text-muted-foreground">{result}</p>}
      </CardContent>
      <CardFooter className="gap-3">
        <Button onClick={handleVerify} disabled={isPending}>
          Approve
        </Button>
        <Button variant="destructive" onClick={handleReject} disabled={isPending}>
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
