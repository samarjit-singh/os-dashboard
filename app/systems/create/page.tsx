"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { systemApi } from "@/lib/api";
import { ArrowLeft, Users, Loader2 } from "lucide-react";

export default function CreateSystemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.type.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await systemApi.create({
        name: formData.name.trim(),
        type: formData.type.trim(),
      });

      // Redirect to the created system's page
      router.push(`/systems/${response.data.id}`);
    } catch (err) {
      setError("Failed to create system. Please try again.");
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
              <Users className="w-10 h-10" />
              CREATE SYSTEM
            </h1>
            <p className="text-lg font-bold text-black">
              Add a new entity to your world
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">
              SYSTEM DETAILS
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              A system can be anything: human, car, robot, animal, or any entity
              in your world.
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
                <Label htmlFor="name" className="text-lg font-black text-black">
                  SYSTEM NAME *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., human (Samarjit), car (Hyundai Creta)"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-2 border-black font-semibold text-lg text-black p-3 shadow-[4px_4px_0px_0px_#000]"
                  disabled={loading}
                />
                <p className="text-sm font-semibold text-gray-600">
                  Give your system a descriptive name that identifies it
                  uniquely.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-lg font-black text-black">
                  SYSTEM TYPE *
                </Label>
                <Input
                  id="type"
                  type="text"
                  placeholder="e.g., human, car, robot, animal"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="border-2 border-black font-semibold text-lg text-black p-3 shadow-[4px_4px_0px_0px_#000]"
                  disabled={loading}
                />
                <p className="text-sm font-semibold text-gray-600">
                  Categorize your system by its fundamental type or nature.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      CREATING...
                    </>
                  ) : (
                    "CREATE SYSTEM"
                  )}
                </Button>
                <Link href="/systems">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg text-black py-3 px-6 bg-transparent"
                  >
                    CANCEL
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-cyan-400 mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-black text-black">
              EXAMPLES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-black text-black">LIVING SYSTEMS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• human (Samarjit)</li>
                  <li>• dog (Buddy)</li>
                  <li>• cat (Whiskers)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-black text-black">NON-LIVING SYSTEMS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• car (Hyundai Creta)</li>
                  <li>• robot (Assistant Bot)</li>
                  <li>• building (School)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
