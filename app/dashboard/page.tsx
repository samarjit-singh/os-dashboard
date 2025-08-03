"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { systemApi, logApi, type System, type Log } from "@/lib/api";
import {
  ArrowLeft,
  Users,
  UserCircle,
  Target,
  GitBranch,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [systemsResponse, logsResponse] = await Promise.all([
        systemApi.getAll(),
        logApi.getAll(),
      ]);

      setSystems(systemsResponse.data);
      setLogs(logsResponse.data.slice(0, 10)); // Get latest 10 logs
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalSystems = systems.length;
  const totalAvatars = systems.reduce(
    (sum, system) => sum + (system.avatars?.length || 0),
    0
  );
  const totalGoals = systems.reduce(
    (sum, system) =>
      sum +
      (system.avatars?.reduce(
        (avatarSum, avatar) => avatarSum + (avatar.goals?.length || 0),
        0
      ) || 0),
    0
  );

  const recentActivity = logs.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black">
          LOADING DASHBOARD...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-2 border-black text-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              HOME
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-black flex items-center gap-3">
              <TrendingUp className="w-10 h-10" />
              SYSTEM DASHBOARD
            </h1>
            <p className="text-lg font-bold text-black">
              Overview of your One Whole World
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-4 border-red-500 bg-red-100 mb-6">
            <CardContent className="p-4">
              <p className="text-red-800 font-bold">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-red-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-black" />
                <div className="text-right">
                  <div className="text-3xl font-black text-black">
                    {totalSystems}
                  </div>
                  <div className="text-sm font-bold text-black">SYSTEMS</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-blue-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <UserCircle className="w-8 h-8 text-black" />
                <div className="text-right">
                  <div className="text-3xl font-black text-black">
                    {totalAvatars}
                  </div>
                  <div className="text-sm font-bold text-black">AVATARS</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-green-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-black" />
                <div className="text-right">
                  <div className="text-3xl font-black text-black">
                    {totalGoals}
                  </div>
                  <div className="text-sm font-bold text-black">GOALS</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-purple-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="w-8 h-8 text-black" />
                <div className="text-right">
                  <div className="text-3xl font-black text-black">
                    {logs.length}
                  </div>
                  <div className="text-sm font-bold text-black">ACTIVITIES</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Systems */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-black flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  RECENT SYSTEMS
                </CardTitle>
                <Link href="/systems">
                  <Button
                    variant="outline"
                    className="border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_#000] bg-transparent"
                  >
                    VIEW ALL
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {systems.slice(0, 5).map((system) => (
                <div
                  key={system.id}
                  className="flex items-center justify-between p-3 border-2 border-black mb-3 bg-gray-50"
                >
                  <div>
                    <div className="font-black text-black">{system.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-500 text-white font-bold border border-black text-xs">
                        {system.type}
                      </Badge>
                      <span className="text-sm font-semibold text-gray-600">
                        {system.avatars?.length || 0} avatars
                      </span>
                    </div>
                  </div>
                  <Link href={`/systems/${system.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] bg-transparent text-black"
                    >
                      VIEW
                    </Button>
                  </Link>
                </div>
              ))}
              {systems.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-bold text-gray-600">
                    No systems created yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-black flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  RECENT ACTIVITY
                </CardTitle>
                <Link href="/logs">
                  <Button
                    variant="outline"
                    className="border-2 border-black font-black shadow-[2px_2px_0px_0px_#000] text-black bg-transparent"
                  >
                    VIEW ALL
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 border-2 border-black mb-3 bg-gray-50"
                >
                  <Activity className="w-4 h-4 mt-1 text-gray-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-black text-sm">
                      {log.description}
                    </div>
                    <div className="text-xs font-bold text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-bold text-gray-600">
                    No activity logged yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-cyan-400 mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black text-center">
              QUICK ACTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/systems/create">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  <Users className="w-4 h-4 mr-2" />
                  SYSTEM
                </Button>
              </Link>
              <Link href="/avatars/create">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  <UserCircle className="w-4 h-4 mr-2" />
                  AVATAR
                </Button>
              </Link>
              <Link href="/goals/create">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  <Target className="w-4 h-4 mr-2" />
                  GOAL
                </Button>
              </Link>
              <Link href="/mappings/auto-map">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  <GitBranch className="w-4 h-4 mr-2" />
                  AUTO-MAP
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
