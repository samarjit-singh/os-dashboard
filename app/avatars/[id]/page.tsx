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
import { avatarApi, goalApi, type Avatar, type Goal } from "@/lib/api";
import { ArrowLeft, UserCircle, Users, Target, Plus, Zap } from "lucide-react";

export default function AvatarDetailPage() {
  const params = useParams();
  const avatarId = params.id as string;

  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (avatarId) {
      fetchAvatarDetails();
    }
  }, [avatarId]);

  const fetchAvatarDetails = async () => {
    try {
      setLoading(true);
      const [avatarResponse, goalsResponse] = await Promise.all([
        avatarApi.getById(avatarId),
        goalApi.getByAvatarId(avatarId),
      ]);

      setAvatar(avatarResponse.data);
      setGoals(goalsResponse.data);
    } catch (err) {
      setError("Failed to fetch avatar details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Goal["status"]) => {
    const colors = {
      pending: "bg-yellow-500",
      "in-progress": "bg-blue-500",
      fulfilled: "bg-green-500",
      canceled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black">LOADING AVATAR...</div>
      </div>
    );
  }

  if (error || !avatar) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-4 border-red-500 bg-red-100">
            <CardContent className="p-8 text-center">
              <p className="text-red-800 font-bold text-xl">
                {error || "Avatar not found"}
              </p>
              <Link href="/avatars" className="mt-4 inline-block">
                <Button className="bg-red-500 text-white font-black border-2 border-black">
                  BACK TO AVATARS
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
            <Link href="/avatars">
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
                {avatar.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                {avatar.system && (
                  <>
                    <Users className="w-5 h-5" />
                    <span className="text-lg font-bold text-black">
                      {avatar.system.name}
                    </span>
                    <Badge className="bg-blue-500 text-white font-bold border-2 border-black">
                      {avatar.system.type}
                    </Badge>
                  </>
                )}
                <span className="text-lg font-bold text-black">
                  {goals.length} GOALS
                </span>
              </div>
            </div>
          </div>
          <Link href={`/goals/create?avatarId=${avatarId}`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              ADD GOAL
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Info */}
          <div className="space-y-6">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-black">
                  AVATAR INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-black text-black mb-2">AVATAR NAME</div>
                  <div className="p-3 border-2 border-gray-300 bg-gray-50 font-semibold text-black">
                    {avatar.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-black text-black mb-2">CREATED</div>
                    <div className="font-semibold text-gray-700">
                      {new Date(avatar.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-black mb-2">
                      LAST UPDATED
                    </div>
                    <div className="font-semibold text-gray-700">
                      {new Date(avatar.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-black text-black mb-2">AVATAR ID</div>
                  <div className="font-mono text-sm text-gray-600 break-all">
                    {avatar.id}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            {avatar.system && (
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    PARENT SYSTEM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-black text-black mb-1">
                        SYSTEM NAME
                      </div>
                      <div className="font-semibold text-black">
                        {avatar.system.name}
                      </div>
                    </div>
                    <div>
                      <div className="font-black text-black mb-1">TYPE</div>
                      <Badge className="bg-white border-2 border-black font-bold text-black">
                        {avatar.system.type}
                      </Badge>
                    </div>
                    <Link href={`/systems/${avatar.system.id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-black font-black text-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
                      >
                        VIEW SYSTEM
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Goals */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-black flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    GOALS ({goals.length})
                  </CardTitle>
                  <CardDescription className="text-black font-semibold">
                    Objectives this avatar wants to achieve
                  </CardDescription>
                </div>
                <Link href={`/goals/create?avatarId=${avatarId}`}>
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    <Plus className="w-4 h-4 mr-2" />
                    ADD GOAL
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <Card
                      key={goal.id}
                      className="border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-green-100"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-black text-black flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            {goal.description}
                          </CardTitle>
                          <Badge
                            className={`${getStatusColor(
                              goal.status
                            )} text-white font-bold border-2 border-black`}
                          >
                            {goal.status.toUpperCase().replace("-", " ")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm font-semibold text-gray-700">
                          Created:{" "}
                          {new Date(goal.createdAt).toLocaleDateString()}
                        </div>

                        {goal.needs && goal.needs.length > 0 && (
                          <div>
                            <div className="font-bold text-black mb-2 flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              NEEDS ({goal.needs.length})
                            </div>
                            <div className="space-y-1">
                              {goal.needs.slice(0, 2).map((need) => (
                                <Badge
                                  key={need.id}
                                  variant="outline"
                                  className="border-2 border-black font-bold text-xs text-black"
                                >
                                  {need.description}
                                </Badge>
                              ))}
                              {goal.needs.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="border-2 border-black font-bold text-xs"
                                >
                                  +{goal.needs.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Link href={`/goals/${goal.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] bg-transparent text-black"
                            >
                              VIEW
                            </Button>
                          </Link>
                          <Link href={`/needs/create?goalId=${goal.id}`}>
                            <Button
                              size="sm"
                              className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
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
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-black text-black mb-2">
                    NO GOALS YET
                  </h3>
                  <p className="text-gray-600 font-semibold mb-6">
                    Define what this avatar wants to achieve.
                  </p>
                  <Link href={`/goals/create?avatarId=${avatarId}`}>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4 mr-2" />
                      CREATE FIRST GOAL
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
