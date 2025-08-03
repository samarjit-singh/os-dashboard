"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { systemApi, type System } from "@/lib/api";
import { ArrowLeft, Plus, UserCircle, Users, Target } from "lucide-react";

export default function AvatarsPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const response = await systemApi.getAll();
      setSystems(response.data);
    } catch (err) {
      setError("Failed to fetch avatars");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Flatten all avatars from all systems
  const allAvatars = systems.reduce((acc: any[], system) => {
    if (system.avatars) {
      return [
        ...acc,
        ...system.avatars.map((avatar) => ({ ...avatar, system })),
      ];
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black text-black">
          LOADING AVATARS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
                ALL AVATARS
              </h1>
              <p className="text-lg font-bold text-black">
                {allAvatars.length} avatars across {systems.length} systems
              </p>
            </div>
          </div>
          <Link href="/avatars/create">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              CREATE AVATAR
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="border-4 border-red-500 bg-red-100 mb-6">
            <CardContent className="p-4">
              <p className="text-red-800 font-bold">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Avatars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAvatars.map((avatar) => (
            <Card
              key={avatar.id}
              className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-black text-black mb-2">
                      {avatar.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-black">
                        {avatar.system.name}
                      </span>
                      <Badge className="bg-blue-500 text-white font-bold border border-black text-xs">
                        {avatar.system.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-semibold text-gray-700">
                  Created: {new Date(avatar.createdAt).toLocaleDateString()}
                </div>

                {avatar.goals && avatar.goals.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-bold text-black flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      GOALS ({avatar.goals.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {avatar.goals.slice(0, 2).map((goal: any) => (
                        <Badge
                          key={goal.id}
                          variant="outline"
                          className="border-2 border-black font-bold text-xs"
                        >
                          {goal.description}
                        </Badge>
                      ))}
                      {avatar.goals.length > 2 && (
                        <Badge
                          variant="outline"
                          className="border-2 border-black font-bold text-xs"
                        >
                          +{avatar.goals.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link href={`/avatars/${avatar.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-black font-black text-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
                    >
                      VIEW DETAILS
                    </Button>
                  </Link>
                  <Link href={`/goals/create?avatarId=${avatar.id}`}>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {allAvatars.length === 0 && !loading && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white text-center p-12">
            <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-black text-black mb-2">
              NO AVATARS YET
            </h3>
            <p className="text-gray-600 font-semibold mb-6">
              Create your first avatar to define roles and identities for your
              systems!
            </p>
            <Link href="/avatars/create">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <Plus className="w-4 h-4 mr-2" />
                CREATE FIRST AVATAR
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
