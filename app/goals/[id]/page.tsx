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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { goalApi, needApi, type Goal, type Need } from "@/lib/api";
import {
  ArrowLeft,
  Target,
  UserCircle,
  Users,
  Zap,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function GoalDetailPage() {
  const params = useParams();
  const goalId = params.id as string;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalId) {
      fetchGoalDetails();
    }
  }, [goalId]);

  const fetchGoalDetails = async () => {
    try {
      setLoading(true);
      const [goalResponse, needsResponse] = await Promise.all([
        goalApi.getById(goalId),
        needApi.getByGoalId(goalId),
      ]);

      setGoal(goalResponse.data);
      setNeeds(needsResponse.data);
    } catch (err) {
      setError("Failed to fetch goal details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Goal["status"]) => {
    if (!goal) return;

    try {
      setStatusLoading(true);
      const response = await goalApi.updateStatus(goal.id, newStatus);
      setGoal(response.data);
    } catch (err) {
      setError("Failed to update goal status");
      console.error(err);
    } finally {
      setStatusLoading(false);
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
        <div className="text-4xl font-black text-black">LOADING GOAL...</div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-4 border-red-500 bg-red-100">
            <CardContent className="p-8 text-center">
              <p className="text-red-800 font-bold text-xl">
                {error || "Goal not found"}
              </p>
              <Link href="/goals" className="mt-4 inline-block">
                <Button className="bg-red-500 text-white font-black border-2 border-black">
                  BACK TO GOALS
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
            <Link href="/goals">
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
                {goal.description}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge
                  className={`${getStatusColor(
                    goal.status
                  )} text-white font-bold border-2 border-black text-lg px-3 py-1`}
                >
                  {goal.status.toUpperCase().replace("-", " ")}
                </Badge>
                <span className="text-lg font-bold text-black">
                  {needs.length} NEEDS
                </span>
              </div>
            </div>
          </div>
          <Link href={`/needs/create?goalId=${goalId}`}>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              ADD NEED
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goal Info */}
          <div className="space-y-6">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-black">
                  GOAL INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-black text-black mb-2">DESCRIPTION</div>
                  <div className="p-3 border-2 border-gray-300 text-black bg-gray-50 font-semibold">
                    {goal.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-black text-black mb-2">CREATED</div>
                    <div className="font-semibold text-gray-700">
                      {new Date(goal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-black mb-2">
                      LAST UPDATED
                    </div>
                    <div className="font-semibold text-gray-700">
                      {new Date(goal.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-black text-black mb-2">GOAL ID</div>
                  <div className="font-mono text-sm text-gray-600 break-all">
                    {goal.id}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avatar Info */}
            {goal.avatar && (
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                    <UserCircle className="w-6 h-6" />
                    AVATAR OWNER
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-black text-black mb-1">
                        AVATAR NAME
                      </div>
                      <div className="font-semibold text-black">
                        {goal.avatar.name}
                      </div>
                    </div>
                    {goal.avatar.system && (
                      <div>
                        <div className="font-black text-black mb-1">SYSTEM</div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold text-black">
                            {goal.avatar.system.name}
                          </span>
                          <Badge className="bg-white border-2 border-black font-bold">
                            {goal.avatar.system.type}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <Link href={`/avatars/${goal.avatar.id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-black text-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
                      >
                        VIEW AVATAR
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Update */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  UPDATE STATUS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="font-black text-black">CURRENT STATUS</div>
                  <Badge
                    className={`${getStatusColor(
                      goal.status
                    )} text-white font-bold border-2 border-black text-lg px-3 py-1`}
                  >
                    {goal.status.toUpperCase().replace("-", " ")}
                  </Badge>

                  <div className="font-black text-black">CHANGE TO</div>
                  <Select
                    onValueChange={handleStatusUpdate}
                    disabled={statusLoading}
                  >
                    <SelectTrigger className="border-2 border-black text-black font-semibold shadow-[4px_4px_0px_0px_#000]">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="pending">PENDING</SelectItem>
                      <SelectItem value="in-progress">IN PROGRESS</SelectItem>
                      <SelectItem value="fulfilled">FULFILLED</SelectItem>
                      <SelectItem value="canceled">CANCELED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Needs */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-black flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    NEEDS ({needs.length})
                  </CardTitle>
                  <CardDescription className="text-black font-semibold">
                    Requirements to fulfill this goal
                  </CardDescription>
                </div>
                <Link href={`/needs/create?goalId=${goalId}`}>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    <Plus className="w-4 h-4 mr-2" />
                    ADD NEED
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {needs.length > 0 ? (
                <div className="space-y-4">
                  {needs.map((need) => (
                    <Card
                      key={need.id}
                      className="border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-purple-100"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-black text-black flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          {need.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm font-semibold text-gray-700">
                          Created:{" "}
                          {new Date(need.createdAt).toLocaleDateString()}
                        </div>

                        {need.mappings && need.mappings.length > 0 && (
                          <div>
                            <div className="font-bold text-black mb-2">
                              MAPPINGS ({need.mappings.length})
                            </div>
                            <div className="space-y-1">
                              {need.mappings.slice(0, 2).map((mapping) => (
                                <Badge
                                  key={mapping.id}
                                  variant="outline"
                                  className="border-2 border-black font-bold text-xs text-black"
                                >
                                  {mapping.status}
                                </Badge>
                              ))}
                              {need.mappings.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="border-2 border-black font-bold text-xs text-black"
                                >
                                  +{need.mappings.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Link href={`/needs/${need.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] bg-transparent text-black"
                            >
                              VIEW
                            </Button>
                          </Link>
                          <Link href={`/mappings/create?needId=${need.id}`}>
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
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
                  <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-black text-black mb-2">
                    NO NEEDS YET
                  </h3>
                  <p className="text-gray-600 font-semibold mb-6">
                    Define what this goal needs to be fulfilled.
                  </p>
                  <Link href={`/needs/create?goalId=${goalId}`}>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4 mr-2" />
                      CREATE FIRST NEED
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
