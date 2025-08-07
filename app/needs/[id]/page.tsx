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
import { needApi, mappingApi, type Need, type Mapping } from "@/lib/api";
import {
  ArrowLeft,
  Zap,
  Target,
  UserCircle,
  Users,
  GitBranch,
  Plus,
} from "lucide-react";

export default function NeedDetailPage() {
  const params = useParams();
  const needId = params.id as string;

  const [need, setNeed] = useState<Need | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (needId) {
      fetchNeedDetails();
    }
  }, [needId]);

  const fetchNeedDetails = async () => {
    try {
      setLoading(true);
      const [needResponse, mappingsResponse] = await Promise.all([
        needApi.getById(needId),
        // mappingApi.getByNeedId(needId),
        mappingApi.getSuggestions(needId),
      ]);

      setNeed(needResponse.data);
      setMappings(mappingsResponse.data);
    } catch (err) {
      setError("Failed to fetch need details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Mapping["status"]) => {
    const colors = {
      PENDING: "bg-yellow-500",
      IN_PROGRESS: "bg-blue-500",
      FULFILLED: "bg-green-500",
      REJECTED: "bg-red-500",
      CANCELED: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black">LOADING NEED...</div>
      </div>
    );
  }

  if (error || !need) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-4 border-red-500 bg-red-100">
            <CardContent className="p-8 text-center">
              <p className="text-red-800 font-bold text-xl">
                {error || "Need not found"}
              </p>
              <Link href="/needs" className="mt-4 inline-block">
                <Button className="bg-red-500 text-white font-black border-2 border-black">
                  BACK TO NEEDS
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
            <Link href="/needs">
              <Button
                variant="outline"
                className="border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black text-black flex items-center gap-3">
                <Zap className="w-10 h-10" />
                {need.description}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-lg font-bold text-black">
                  {mappings.length} MAPPINGS
                </span>
              </div>
            </div>
          </div>
          <Link href={`/mappings/create?needId=${needId}`}>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              ADD MAPPING
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Need Info */}
          <div className="space-y-6">
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-black">
                  NEED INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-black text-black mb-2">DESCRIPTION</div>
                  <div className="p-3 border-2 text-black border-gray-300 bg-gray-50 font-semibold">
                    {need.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-black text-black mb-2">CREATED</div>
                    <div className="font-semibold text-gray-700">
                      {new Date(need.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-black mb-2">
                      LAST UPDATED
                    </div>
                    <div className="font-semibold text-gray-700">
                      {new Date(need.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-black text-black mb-2">NEED ID</div>
                  <div className="font-mono text-sm text-gray-600 break-all">
                    {need.id}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Info */}
            {need.goal && (
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-green-100">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    RELATED GOAL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-black text-black mb-1">
                        GOAL DESCRIPTION
                      </div>
                      <div className="font-semibold text-black">
                        {need.goal.description}
                      </div>
                    </div>
                    <div>
                      <div className="font-black text-black mb-1">STATUS</div>
                      <Badge className="bg-white border-2 border-black font-bold text-black">
                        {need.goal.status.toUpperCase().replace("-", " ")}
                      </Badge>
                    </div>
                    {need.goal.avatar && (
                      <div>
                        <div className="font-black text-black mb-1">AVATAR</div>
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          <span className="font-semibold text-black">
                            {need.goal.avatar.name}
                          </span>
                          {need.goal.avatar.system && (
                            <>
                              <Users className="w-4 h-4" />
                              <span className="font-semibold text-black">
                                {need.goal.avatar.system.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    <Link href={`/goals/${need.goal.id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent text-black"
                      >
                        VIEW GOAL
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mappings */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-black flex items-center gap-3">
                    <GitBranch className="w-8 h-8" />
                    MAPPINGS ({mappings.length})
                  </CardTitle>
                  <CardDescription className="text-black font-semibold">
                    Systems that can fulfill this need
                  </CardDescription>
                </div>
                <Link href={`/mappings/create?needId=${needId}`}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    <Plus className="w-4 h-4 mr-2" />
                    ADD MAPPING
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {mappings.length > 0 ? (
                <div className="space-y-4">
                  {mappings.map((mapping) => (
                    <Card
                      key={mapping.id}
                      className="border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-orange-100"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-black text-black flex items-center gap-2">
                            <GitBranch className="w-5 h-5" />
                            MAPPING
                          </CardTitle>
                          <Badge
                            className={`${getStatusColor(
                              mapping.status
                            )} text-white font-bold border-2 border-black`}
                          >
                            {mapping.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mapping.fulfillerSystem && (
                          <div>
                            <div className="font-bold text-black mb-1">
                              FULFILLER SYSTEM
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span className="font-semibold text-black">
                                {mapping.fulfillerSystem.name}
                              </span>
                              <Badge className="bg-white border border-black font-bold text-xs">
                                {mapping.fulfillerSystem.type}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {mapping.fulfillerAvatar && (
                          <div>
                            <div className="font-bold text-black mb-1">
                              FULFILLER AVATAR
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCircle className="w-4 h-4" />
                              <span className="font-semibold text-black">
                                {mapping.fulfillerAvatar.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {mapping.notes && (
                          <div>
                            <div className="font-bold text-black mb-1">
                              NOTES
                            </div>
                            <div className="text-sm font-semibold text-gray-700 p-2 bg-gray-100 border border-gray-300">
                              {mapping.notes}
                            </div>
                          </div>
                        )}

                        <div className="text-sm font-semibold text-gray-700">
                          Created:{" "}
                          {new Date(mapping.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link
                            href={`/mappings/${mapping.id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] bg-transparent"
                            >
                              VIEW DETAILS
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-black text-black mb-2">
                    NO MAPPINGS YET
                  </h3>
                  <p className="text-gray-600 font-semibold mb-6">
                    Create mappings to connect this need with systems that can
                    fulfill it.
                  </p>
                  <Link href={`/mappings/create?needId=${needId}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4 mr-2" />
                      CREATE FIRST MAPPING
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
