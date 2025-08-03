"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { systemApi, avatarApi, type System, type Avatar } from "@/lib/api";
import { ArrowLeft, Users, UserCircle, Plus, Target } from "lucide-react";

export default function SystemDetailPage() {
  const params = useParams();
  const systemId = params.id as string;

  const [system, setSystem] = useState<System | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (systemId) {
      fetchSystemDetails();
    }
  }, [systemId]);

  const fetchSystemDetails = async () => {
    try {
      setLoading(true);
      const [systemResponse, avatarsResponse] = await Promise.all([
        systemApi.getById(systemId),
        avatarApi.getBySystemId(systemId),
      ]);

      setSystem(systemResponse.data);
      setAvatars(avatarsResponse.data);
    } catch (err) {
      setError("Failed to fetch system details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black">LOADING SYSTEM...</div>
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-4 border-red-500 bg-red-100">
            <CardContent className="p-8 text-center">
              <p className="text-red-800 font-bold text-xl">
                {error || "System not found"}
              </p>
              <Link href="/systems" className="mt-4 inline-block">
                <Button className="bg-red-500 text-white font-black border-2 border-black">
                  BACK TO SYSTEMS
                </Button>
              </Link>
            </CardContent>
          </Card>
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
            <Link href="/systems">
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
                {system.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-blue-500 text-white font-bold border-2 border-black text-lg px-3 py-1">
                  {system.type.toUpperCase()}
                </Badge>
                <span className="text-lg font-bold text-black">
                  {avatars.length} AVATARS
                </span>
              </div>
            </div>
          </div>
          <Link href={`/avatars/create?systemId=${systemId}`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              ADD AVATAR
            </Button>
          </Link>
        </div>

        {/* System Info */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">
              SYSTEM INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="font-black text-black mb-2">CREATED</div>
                <div className="font-semibold text-gray-700">
                  {new Date(system.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="font-black text-black mb-2">LAST UPDATED</div>
                <div className="font-semibold text-gray-700">
                  {new Date(system.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="font-black text-black mb-2">SYSTEM ID</div>
                <div className="font-mono text-sm text-gray-600 break-all">
                  {system.id}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatars */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-black flex items-center gap-3">
                  <UserCircle className="w-8 h-8" />
                  AVATARS ({avatars.length})
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Different roles and identities of this system
                </CardDescription>
              </div>
              <Link href={`/avatars/create?systemId=${systemId}`}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  <Plus className="w-4 h-4 mr-2" />
                  ADD AVATAR
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {avatars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avatars.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className="border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-cyan-100"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-black text-black flex items-center gap-2">
                        <UserCircle className="w-5 h-5" />
                        {avatar.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm font-semibold text-gray-700">
                        Created:{" "}
                        {new Date(avatar.createdAt).toLocaleDateString()}
                      </div>

                      {avatar.goals && avatar.goals.length > 0 && (
                        <div>
                          <div className="font-bold text-black mb-2 flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            GOALS ({avatar.goals.length})
                          </div>
                          <div className="space-y-1">
                            {avatar.goals.slice(0, 2).map((goal) => (
                              <Badge
                                key={goal.id}
                                variant="outline"
                                className="border-2 border-black font-bold text-black text-xs"
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
                            size="sm"
                            className="w-full border-2 border-black font-black text-black shadow-[2px_2px_0px_0px_#000] bg-transparent"
                          >
                            VIEW
                          </Button>
                        </Link>
                        <Link href={`/goals/create?avatarId=${avatar.id}`}>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-black text-black mb-2">
                  NO AVATARS YET
                </h3>
                <p className="text-gray-600 font-semibold mb-6">
                  Create avatars to define different roles and identities for
                  this system.
                </p>
                <Link href={`/avatars/create?systemId=${systemId}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    <Plus className="w-4 h-4 mr-2" />
                    CREATE FIRST AVATAR
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
