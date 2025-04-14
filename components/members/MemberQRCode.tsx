"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface MemberQRCodeProps {
  memberId: string;
  memberName: string;
}

export function MemberQRCode({ memberId, memberName }: MemberQRCodeProps) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(memberId, {
          width: 300,
          margin: 2,
        });
        setQrCode(url);
      } catch (err) {
        console.error(err);
      }
    };

    generateQR();
  }, [memberId]);

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${memberName}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Member QR Code</CardTitle>
        <CardDescription>Scan this code to check in</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrCode && (
          <>
            <img src={qrCode} alt="Member QR Code" className="w-48 h-48" />
            <Button onClick={downloadQRCode} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
} 