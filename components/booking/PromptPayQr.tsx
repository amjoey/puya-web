import generatePayload from "promptpay-qr";
import QRCode from "react-qr-code";

import { formatTHB } from "@/lib/utils/currency";

interface PromptPayQrProps {
  amount: number;
}

export function PromptPayQr({ amount }: PromptPayQrProps) {
  const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID ?? "";
  const payload = generatePayload(promptPayId, { amount });

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper p-6">
      <div className="rounded-xl bg-white p-3 shadow-soft">
        <QRCode value={payload} size={192} />
      </div>
      <p className="text-2xl font-semibold text-ink">{formatTHB(amount)}</p>
      <p className="text-caption text-ink-soft">
        สแกนด้วยแอปธนาคารเพื่อชำระเงิน แล้วอัปโหลดสลิปด้านล่าง
      </p>
    </div>
  );
}
