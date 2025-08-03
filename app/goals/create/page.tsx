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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  goalApi,
  systemApi,
  avatarApi,
  type System,
  type Avatar,
} from "@/lib/api";
import { ArrowLeft, Target, Loader2, UserCircle, Users } from "lucide-react";

export default function CreateGoalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAvatarId = searchParams.get("avatarId");

  const [systems, setSystems] = useState<System[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [formData, setFormData] = useState({
    avatarId: preselectedAvatarId || "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [systemsLoading, setSystemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedAvatarId) {
      const fetchAvatar = async () => {
        try {
          setSystemsLoading(true);
          const response = await avatarApi.getById(preselectedAvatarId);

          setAvatars([response.data]);
          setFormData((prev) => ({ ...prev, avatarId: preselectedAvatarId }));
        } catch (err) {
          console.error(err);
          setError("Failed to load preselected avatar");
        } finally {
          setSystemsLoading(false);
        }
      };

      fetchAvatar();
    } else {
      fetchSystems();
    }
  }, [preselectedAvatarId]);

  useEffect(() => {
    if (formData.avatarId && preselectedAvatarId) {
      return;
    }
    if (systems.length > 0) {
      const allAvatars = systems.reduce((acc: Avatar[], system) => {
        if (system.avatars) {
          return [
            ...acc,
            ...system.avatars.map((avatar) => ({ ...avatar, system })),
          ];
        }
        return acc;
      }, []);
      setAvatars(allAvatars);
    }
  }, [systems, formData.avatarId, preselectedAvatarId]);

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

    if (!formData.avatarId || !formData.description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await goalApi.create({
        avatarId: formData.avatarId,
        description: formData.description.trim(),
      });

      router.push(`/goals/${response.data.id}`);
    } catch (err) {
      setError("Failed to create goal. Please try again.");
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

  const selectedAvatar = avatars.find((a) => a.id === formData.avatarId);

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
              <Target className="w-10 h-10" />
              CREATE GOAL
            </h1>
            <p className="text-lg font-bold text-black">
              Define an objective for an avatar
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">
              GOAL DETAILS
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              A goal represents something an avatar wants to achieve or
              accomplish.
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
                  htmlFor="avatarId"
                  className="text-lg font-black text-black"
                >
                  SELECT AVATAR *
                </Label>
                {systemsLoading ? (
                  <div className="p-3 border-2 border-black bg-gray-100 font-semibold text-black">
                    Loading avatars...
                  </div>
                ) : (
                  <Select
                    value={formData.avatarId}
                    onValueChange={(value) =>
                      handleInputChange("avatarId", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="border-2 border-black text-black font-semibold text-lg p-3 shadow-[4px_4px_0px_0px_#000]">
                      <SelectValue placeholder="Choose an avatar for this goal" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {avatars.map((avatar) => (
                        <SelectItem key={avatar.id} value={avatar.id}>
                          <div className="font-semibold flex items-center justify-around gap-2">
                            <div className="flex items-center gap-2 text-red-500">
                              <UserCircle className="w-4 h-4" />
                              {avatar.name}
                            </div>
                            {avatar.system && (
                              <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <Users className="w-3 h-3" />
                                {avatar.system.name} ({avatar.system.type})
                              </div>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedAvatar && (
                  <div className="p-3 border-2 border-blue-500 bg-blue-100">
                    <p className="font-bold text-blue-800">
                      Selected: {selectedAvatar.name}
                      {selectedAvatar.system &&
                        ` (${selectedAvatar.system.name})`}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-lg font-black text-black"
                >
                  GOAL DESCRIPTION *
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g., go to school, deliver packages, learn new skills"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="border-2 border-black font-semibold text-lg p-3 shadow-[4px_4px_0px_0px_#000] min-h-[100px] text-black"
                  disabled={loading}
                />
                <p className="text-sm font-semibold text-gray-600">
                  Describe what this avatar wants to achieve or accomplish.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || systemsLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      CREATING...
                    </>
                  ) : (
                    "CREATE GOAL"
                  )}
                </Button>
                {/* <Link href="/goals">
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
              GOAL EXAMPLES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-black text-black">HUMAN GOALS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• go to school</li>
                  <li>• learn programming</li>
                  <li>• buy groceries</li>
                  <li>• exercise daily</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-black text-black">SYSTEM GOALS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• transport passengers</li>
                  <li>• deliver packages</li>
                  <li>• provide assistance</li>
                  <li>• maintain security</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {avatars.length === 0 && !systemsLoading && (
          <Card className="border-4 border-red-500 bg-red-100 mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-800 font-bold mb-4">
                No avatars found! You need to create avatars first.
              </p>
              <Link href="/avatars/create">
                <Button className="bg-blue-500 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  CREATE AVATAR FIRST
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
