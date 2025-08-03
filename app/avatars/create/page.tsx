"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { avatarApi, systemApi, type System } from "@/lib/api";
import { ArrowLeft, UserCircle, Loader2 } from "lucide-react";

export default function CreateAvatarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSystemId = searchParams.get("systemId");

  const [systems, setSystems] = useState<System[]>([]);
  const [formData, setFormData] = useState({
    systemId: preselectedSystemId || "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [systemsLoading, setSystemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      setSystemsLoading(true);
      const response = await systemApi.getAll();
      setSystems(response.data);
    } catch (err) {
      setError("Failed to fetch systems");
      console.error(err);
    } finally {
      setSystemsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.systemId || !formData.name.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await avatarApi.create({
        systemId: formData.systemId,
        name: formData.name.trim(),
      });

      // Redirect to the created avatar's page
      router.push(`/avatars/${response.data.id}`);
    } catch (err) {
      setError("Failed to create avatar. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const selectedSystem = systems.find((s) => s.id === formData.systemId);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-2 border-black font-black text-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-black flex items-center gap-3">
              <UserCircle className="w-10 h-10" />
              CREATE AVATAR
            </h1>
            <p className="text-lg font-bold text-black">
              Add a new role or identity to a system
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">
              AVATAR DETAILS
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              An avatar represents a specific role, identity, or aspect of a
              system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 border-4 border-red-500 bg-red-100">
                  <p className="text-red-800 font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="systemId"
                  className="text-lg font-black text-black"
                >
                  SELECT SYSTEM *
                </Label>
                {systemsLoading ? (
                  <div className="p-3 border-2 border-black text-black bg-gray-100 font-semibold">
                    Loading systems...
                  </div>
                ) : (
                  <Select
                    value={formData.systemId}
                    onValueChange={(value: any) =>
                      handleInputChange("systemId", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="border-2 border-black font-semibold text-black text-lg p-3 shadow-[4px_4px_0px_0px_#000]">
                      <SelectValue placeholder="Choose a system for this avatar" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {systems.map((system) => (
                        <SelectItem key={system.id} value={system.id}>
                          <div className="font-semibold text-black">
                            {system.name} ({system.type})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedSystem && (
                  <div className="p-3 border-2 border-blue-500 bg-blue-100">
                    <p className="font-bold text-blue-800">
                      Selected: {selectedSystem.name} ({selectedSystem.type})
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-black text-black">
                  AVATAR NAME *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., teacher, father, driver, assistant"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-2 border-black font-semibold text-lg text-black p-3 shadow-[4px_4px_0px_0px_#000]"
                  disabled={loading}
                />
                <p className="text-sm font-semibold text-gray-600">
                  Name the role or identity this avatar represents.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || systemsLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-black" />
                      CREATING...
                    </>
                  ) : (
                    "CREATE AVATAR"
                  )}
                </Button>
                {/* <Link href="/avatars/create">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3 px-6 bg-transparent"
                  >
                    CANCEL
                  </Button>
                </Link> */}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-cyan-400 mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-black text-black">
              AVATAR EXAMPLES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-black text-black">HUMAN AVATARS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• teacher</li>
                  <li>• father</li>
                  <li>• husband</li>
                  <li>• student</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-black text-black">CAR AVATARS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• family car</li>
                  <li>• taxi</li>
                  <li>• delivery vehicle</li>
                  <li>• emergency transport</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {systems.length === 0 && !systemsLoading && (
          <Card className="border-4 border-red-500 bg-red-100 mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-800 font-bold mb-4">
                No systems found! You need to create a system first.
              </p>
              <Link href="/systems/create">
                <Button className="bg-red-500 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  CREATE SYSTEM FIRST
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
