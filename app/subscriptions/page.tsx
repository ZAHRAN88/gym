"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface MembershipType {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export default function SubscriptionsPage() {
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<MembershipType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "1",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/membership-types");
      if (!response.ok) {
        throw new Error("Failed to fetch membership types");
      }
      const data = await response.json();
      setMembershipTypes(data);
    } catch (error) {
      console.error("Error fetching membership types:", error);
      toast.error("Failed to load membership types");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/membership-types";
      const method = editingType ? "PUT" : "POST";
      const body = editingType
        ? { ...formData, id: editingType.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save membership type");
      }

      toast.success(
        editingType ? "Membership type updated successfully" : "Membership type created successfully"
      );
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving membership type:", error);
      toast.error("Failed to save membership type");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership type?")) {
      return;
    }

    try {
      const response = await fetch(`/api/membership-types?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete membership type");
      }

      toast.success("Membership type deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting membership type:", error);
      toast.error("Failed to delete membership type");
    }
  };

  const openEditDialog = (type: MembershipType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      price: type.price.toString(),
      duration: type.duration.toString(),
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingType(null);
    setFormData({
      name: "",
      price: "",
      duration: "1",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading membership types...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 p-7">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Membership Types</h1>
        <Button onClick={openCreateDialog}>Add New Type</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration (months)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>${type.price}</TableCell>
                  <TableCell>{type.duration}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(type)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(type.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Membership Type" : "Create New Membership Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update the membership type details below"
                : "Fill in the details to create a new membership type"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (months)</label>
              <Input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingType ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}