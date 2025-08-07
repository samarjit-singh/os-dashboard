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
import { needApi, goalApi, type Goal } from "@/lib/api";
import {
  ArrowLeft,
  Zap,
  Loader2,
  Target,
  UserCircle,
  Users,
} from "lucide-react";

export default function CreateNeedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGoalId = searchParams.get("goalId");

  const [goals, setGoals] = useState<any>([]);
  const [formData, setFormData] = useState({
    goalId: preselectedGoalId || "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      const response = await goalApi.getAllGoals();
      setGoals(response.data || response);
    } catch (err) {
      setError("Failed to fetch goals");
      console.error(err);
    } finally {
      setGoalsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.goalId || !formData.description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await needApi.create({
        goalId: formData.goalId,
        description: formData.description.trim(),
      });

      router.push(`/needs/${response.data.id}`);
    } catch (err) {
      setError("Failed to create need. Please try again.");
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
    if (error) setError(null);
  };

  const selectedGoal = goals.find((g: any) => g.id === formData.goalId);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/needs">
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
              <Zap className="w-10 h-10" />
              CREATE NEED
            </h1>
            <p className="text-lg font-bold text-black">
              Define a requirement for achieving a goal
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">
              NEED DETAILS
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              A need represents something required to fulfill a goal.
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
                  htmlFor="goalId"
                  className="text-lg font-black text-black"
                >
                  SELECT GOAL *
                </Label>
                {goalsLoading ? (
                  <div className="p-3 border-2 border-black text-black bg-gray-100 font-semibold">
                    Loading goals...
                  </div>
                ) : (
                  <Select
                    value={formData.goalId}
                    onValueChange={(value) =>
                      handleInputChange("goalId", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="border-2 border-black text-black font-semibold text-lg p-3 shadow-[4px_4px_0px_0px_#000]">
                      <SelectValue placeholder="Choose a goal for this need" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {goals.map((goal: any) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          <div className="font-semibold flex gap-2">
                            <div className="flex items-center gap-2 text-red-400">
                              <Target className="w-4 h-4 " />
                              {goal.description}
                            </div>
                            {goal.avatar && (
                              <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <UserCircle className="w-3 h-3" />
                                {goal.avatar.name}
                                <Users className="w-3 h-3" />
                                {/* System ID: {goal.avatar.systemId} */}
                              </div>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedGoal && (
                  <div className="p-3 border-2 border-blue-500 bg-blue-100">
                    <p className="font-bold text-blue-800">
                      Selected Goal: {selectedGoal.description}
                      {selectedGoal.avatar && ` (${selectedGoal.avatar.name})`}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-lg font-black text-black"
                >
                  NEED DESCRIPTION *
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g., transportation, money, equipment, assistance"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="border-2 border-black text-black font-semibold text-lg p-3 shadow-[4px_4px_0px_0px_#000] min-h-[100px]"
                  disabled={loading}
                />
                <p className="text-sm font-semibold text-gray-600">
                  Describe what is needed to achieve the selected goal.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || goalsLoading}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      CREATING...
                    </>
                  ) : (
                    "CREATE NEED"
                  )}
                </Button>
                <Link href="/needs">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3 px-6 bg-transparent"
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
              NEED EXAMPLES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-black text-black">PHYSICAL NEEDS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• transportation</li>
                  <li>• equipment</li>
                  <li>• materials</li>
                  <li>• space</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-black text-black">ABSTRACT NEEDS:</div>
                <ul className="space-y-1 font-semibold text-black">
                  <li>• knowledge</li>
                  <li>• assistance</li>
                  <li>• permission</li>
                  <li>• time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {goals.length === 0 && !goalsLoading && (
          <Card className="border-4 border-red-500 bg-red-100 mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-800 font-bold mb-4">
                No goals found! You need to create goals first.
              </p>
              <Link href="/goals/create">
                <Button className="bg-green-500 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  CREATE GOAL FIRST
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
