"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CheckIn {
  timeIn: Date;
  timeOut: Date | null;
}

interface Member {
  id: string;
  name: string;
  email: string;
  status: string;
  membershipType: {
    name: string;
  };
  startDate: Date;
  endDate: Date;
  qrCode: string;
  checkIns?: CheckIn[];
}

interface ViewMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMemberDialog({
  member,
  open,
  onOpenChange,
}: ViewMemberDialogProps) {
  if (!member) return null;

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = member.qrCode;
    link.download = `${member.name}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            View detailed information about {member.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p className="text-sm text-muted-foreground">{member.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-sm text-muted-foreground">{member.status}</p>
            </div>
            <div>
              <h3 className="font-medium">Membership Type</h3>
              <p className="text-sm text-muted-foreground">
                {member.membershipType.name}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Membership Period</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(member.startDate), "PPP")} -{" "}
                {format(new Date(member.endDate), "PPP")}
              </p>
            </div>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Member QR Code</CardTitle>
              <CardDescription>Scan this code to check in</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <img src={member.qrCode} alt="Member QR Code" className="w-48 h-48" />
              <Button onClick={downloadQRCode} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 