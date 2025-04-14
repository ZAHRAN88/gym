"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Camera, X, User } from "lucide-react";

export default function CheckInPage() {
  const [memberId, setMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
        // Find iVCam device
        const ivcamDevice = videoDevices.find(device => 
          device.label.toLowerCase().includes('ivcam')
        );
        
        if (ivcamDevice) {
          setSelectedDevice(ivcamDevice.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error getting devices:", error);
        toast.error("Error accessing camera devices");
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: 250,
          videoConstraints: {
            deviceId: selectedDevice,
          },
        },
        false
      );

      scanner.render(onScanSuccess, (errorMessage: string) => {
        // Ignore frequent scanning errors
        console.debug("QR scan error:", errorMessage);
      });

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner, selectedDevice]);

  const onScanSuccess = (decodedText: string) => {
    handleCheckIn(decodedText);
  };

  const handleCheckIn = async (memberId: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // Membership inactive or expired
          toast.error(data.error, {
            description: "Please contact the front desk for assistance."
          });
        } else {
          toast.error(data.error || "Failed to check in");
        }
        return;
      }

      toast.success(data.message);
      setMemberId("");
      setShowScanner(false);
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error("Failed to check in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Member Check-In</h1>
            <p className="text-muted-foreground">Welcome to the gym! Please check in using your QR code or member ID.</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Check In</CardTitle>
              <CardDescription>
                Choose your preferred check-in method below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {showScanner ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      QR Code Scanner
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowScanner(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Select
                    value={selectedDevice}
                    onValueChange={(value) => {
                      setSelectedDevice(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div id="qr-reader" className="w-full rounded-lg overflow-hidden border"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="w-full h-12"
                    size="lg"
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Scan QR Code
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCheckIn(memberId);
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Enter Member ID"
                          value={memberId}
                          onChange={(e) => setMemberId(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Checking in...
                        </div>
                      ) : (
                        "Check In"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 