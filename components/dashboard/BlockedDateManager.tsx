"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createBlockedDate, deleteBlockedDate } from "@/actions/blockedDate.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlockedDate } from "@/types/blockedDate";
import type { Villa } from "@/types/villa";

const ALL_VILLAS_VALUE = "all";

interface BlockedDateManagerProps {
  villas: Villa[];
  blockedDates: BlockedDate[];
}

// Admin Dashboard > Calendar Management > Block/Unblock Dates — see PRD.md.
export function BlockedDateManager({ villas, blockedDates }: BlockedDateManagerProps) {
  const router = useRouter();
  const [villaId, setVillaId] = useState(ALL_VILLAS_VALUE);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function villaName(id: string | null): string {
    if (!id) return "All Villas";
    return villas.find((villa) => villa.id === id)?.name ?? "Unknown villa";
  }

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const result = await createBlockedDate({
        villaId: villaId === ALL_VILLAS_VALUE ? "" : villaId,
        blockedDate: date,
        reason,
      });
      if (result.success) {
        setDate("");
        setReason("");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await deleteBlockedDate(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
        <h2 className="text-h3 font-semibold text-foreground">Block a Date</h2>
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
          <div>
            <Label>Villa</Label>
            <Select value={villaId} onValueChange={setVillaId}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VILLAS_VALUE}>All Villas</SelectItem>
                {villas.map((villa) => (
                  <SelectItem key={villa.id} value={villa.id}>
                    {villa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              className="mt-2"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            <Label>Reason (optional)</Label>
            <Input
              className="mt-2"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Owner closure, maintenance, etc."
            />
          </div>
        </div>
        {error && <p className="text-body text-destructive">{error}</p>}
        <Button onClick={handleAdd} disabled={isPending || !date} className="self-start">
          {isPending ? "Saving..." : "Block Date"}
        </Button>
      </div>

      <div>
        <h2 className="text-h3 font-semibold text-foreground">Blocked Dates</h2>
        {blockedDates.length === 0 ? (
          <p className="mt-4 text-body text-muted-foreground">No dates are currently blocked.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-body">
              <thead className="bg-secondary text-caption text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Villa</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {blockedDates.map((blocked) => (
                  <tr key={blocked.id} className="border-t border-border">
                    <td className="px-4 py-2">{blocked.blockedDate}</td>
                    <td className="px-4 py-2">{villaName(blocked.villaId)}</td>
                    <td className="px-4 py-2">{blocked.reason ?? "—"}</td>
                    <td className="px-4 py-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleRemove(blocked.id)}
                      >
                        Unblock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
