"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { systemApi, type System } from "@/lib/api";
import { ArrowLeft, Plus, Users, UserCircle } from "lucide-react";

export default function SystemsPage() {
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
      setError("Failed to fetch systems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black text-black">
          LOADING SYSTEMS...
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
                <Users className="w-10 h-10" />
                ALL SYSTEMS
              </h1>
              <p className="text-lg font-bold text-black">
                {systems.length} systems in the world
              </p>
            </div>
          </div>
          <Link href="/systems/create">
            <Button className="bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <Plus className="w-4 h-4 mr-2" />
              CREATE SYSTEM
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

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <Card
              key={system.id}
              className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-black text-black mb-2">
                      {system.name}
                    </CardTitle>
                    <Badge className="bg-blue-500 text-white font-bold border-2 border-black">
                      {system.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-600">
                      {system.avatars?.length || 0} AVATARS
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-semibold text-gray-700">
                  Created: {new Date(system.createdAt).toLocaleDateString()}
                </div>

                {system.avatars && system.avatars.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-bold text-black">AVATARS:</div>
                    <div className="flex flex-wrap gap-2">
                      {system.avatars.slice(0, 3).map((avatar) => (
                        <Badge
                          key={avatar.id}
                          variant="outline"
                          className="border-2 border-black font-bold text-black"
                        >
                          <UserCircle className="w-3 h-3 mr-1" />
                          {avatar.name}
                        </Badge>
                      ))}
                      {system.avatars.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-2 border-black font-bold text-black"
                        >
                          +{system.avatars.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link href={`/systems/${system.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-black font-black text-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
                    >
                      VIEW DETAILS
                    </Button>
                  </Link>
                  <Link href={`/avatars/create?systemId=${system.id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {systems.length === 0 && !loading && (
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white text-center p-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-black text-black mb-2">
              NO SYSTEMS YET
            </h3>
            <p className="text-gray-600 font-semibold mb-6">
              Create your first system to get started building your world!
            </p>
            <Link href="/systems/create">
              <Button className="bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <Plus className="w-4 h-4 mr-2" />
                CREATE FIRST SYSTEM
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
