"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { goalApi, type Goal } from "@/lib/api";
import { ArrowLeft, Plus, Target, UserCircle, Users, Zap } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalApi.getAllGoals();

      setGoals(response.data);
    } catch (err) {
      setError("Failed to fetch goals");
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
        <div className="text-4xl font-black text-black">LOADING GOALS...</div>
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
                <Target className="w-10 h-10" />
                ALL GOALS
              </h1>
              <p className="text-lg font-bold text-black">
                {goals.length} goals in the system
              </p>
            </div>
          </div>
          <Link href="/goals/create">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              CREATE GOAL
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

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal: any) => (
            <Card
              key={goal.id}
              className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-black text-black mb-2">
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
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {goal.avatar && (
                  <div className="flex items-center gap-2 p-2 border-2 border-gray-300 bg-gray-50">
                    <UserCircle className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-black">
                      {goal.avatar.name}
                    </span>
                    {goal.avatar.system && (
                      <div className="flex items-center gap-1 ml-auto">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-600">
                          {goal.avatar.system.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm font-semibold text-gray-700">
                  Created: {new Date(goal.createdAt).toLocaleDateString()}
                </div>

                {goal.needs && goal.needs.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-bold text-black flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      NEEDS ({goal.needs.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {goal.needs.slice(0, 2).map((need: any) => (
                        <Badge
                          key={need.id}
                          variant="outline"
                          className="border-2 border-black font-bold text-black text-xs"
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
                      className="w-full border-2 border-black font-black text-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
                    >
                      VIEW DETAILS
                    </Button>
                  </Link>
                  <Link href={`/needs/create?goalId=${goal.id}`}>
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && !loading && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white text-center p-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-black text-black mb-2">
              NO GOALS YET
            </h3>
            <p className="text-gray-600 font-semibold mb-6">
              Create your first goal to start defining objectives for your
              avatars!
            </p>
            <Link href="/goals/create">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <Plus className="w-4 h-4 mr-2" />
                CREATE FIRST GOAL
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
