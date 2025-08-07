"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { needApi, type Need } from "@/lib/api";
import {
  ArrowLeft,
  Plus,
  Zap,
  Target,
  UserCircle,
  Users,
  GitBranch,
} from "lucide-react";

export default function NeedsPage() {
  const [needs, setNeeds] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    try {
      setLoading(true);
      const response = await needApi.getAllNeeds();

      setNeeds(response.data);
    } catch (err) {
      setError("Failed to fetch needs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black">LOADING NEEDS...</div>
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
                className="border-2 border-black text-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black text-black flex items-center gap-3">
                <Zap className="w-10 h-10" />
                ALL NEEDS
              </h1>
              <p className="text-lg font-bold text-black">
                {needs.length} needs in the system
              </p>
            </div>
          </div>
          <Link href="/needs/create">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              CREATE NEED
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

        {/* Needs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {needs.map((need: any) => (
            <Card
              key={need.id}
              className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-black text-black mb-2">
                      {need.description}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {need.goal && (
                  <div className="p-2 border-2 border-gray-300 bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-black">GOAL</span>
                    </div>
                    <div className="font-semibold text-black">
                      {need.goal.description}
                    </div>
                    {need.goal.avatar && (
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <UserCircle className="w-3 h-3 text-gray-500" />
                        <span className="font-semibold text-gray-600">
                          {need.goal.avatar.name}
                        </span>
                        {need.goal.avatar.system && (
                          <>
                            <Users className="w-3 h-3 text-gray-500" />
                            <span className="font-semibold text-gray-600">
                              {need.goal.avatar.system.name}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm font-semibold text-gray-700">
                  Created: {new Date(need.createdAt).toLocaleDateString()}
                </div>

                {need.mappings && need.mappings.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-bold text-black flex items-center gap-1">
                      <GitBranch className="w-4 h-4" />
                      MAPPINGS ({need.mappings.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {need.mappings.slice(0, 2).map((mapping: any) => (
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
                          className="border-2 border-black font-bold text-xs"
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
                      className="w-full border-2 border-black text-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
                    >
                      VIEW DETAILS
                    </Button>
                  </Link>
                  <Link href={`/mappings/create?needId=${need.id}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {needs.length === 0 && !loading && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white text-center p-12">
            <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-black text-black mb-2">
              NO NEEDS YET
            </h3>
            <p className="text-gray-600 font-semibold mb-6">
              Create your first need to define requirements for achieving goals!
            </p>
            <Link href="/needs/create">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <Plus className="w-4 h-4 mr-2" />
                CREATE FIRST NEED
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
