"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { logApi, type Log } from "@/lib/api";
import { ArrowLeft, Activity, Search, RefreshCw, Filter } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedType]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await logApi.getAll();
      setLogs(response.data);
    } catch (err) {
      setError("Failed to fetch logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((log) => log.type === selectedType);
    }

    setFilteredLogs(filtered);
  };

  const getLogTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      SYSTEM_CREATED: "bg-red-500",
      AVATAR_CREATED: "bg-blue-500",
      GOAL_CREATED: "bg-green-500",
      NEED_CREATED: "bg-purple-500",
      MAPPING_CREATED: "bg-orange-500",
      MAPPING_UPDATED: "bg-yellow-500",
      GOAL_UPDATED: "bg-cyan-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const uniqueTypes = Array.from(new Set(logs.map((log) => log.type)));

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-300 p-4 flex items-center justify-center">
        <div className="text-4xl font-black text-black">
          LOADING ACTIVITY LOGS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black text-black flex items-center gap-3">
                <Activity className="w-10 h-10" />
                ACTIVITY LOGS
              </h1>
              <p className="text-lg font-bold text-black">
                {filteredLogs.length} of {logs.length} activities
              </p>
            </div>
          </div>
          <Button
            onClick={fetchLogs}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            REFRESH
          </Button>
        </div>

        {error && (
          <Card className="border-4 border-red-500 bg-red-100 mb-6">
            <CardContent className="p-4">
              <p className="text-red-800 font-bold">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-black text-black flex items-center gap-2">
              <Filter className="w-5 h-5" />
              FILTERS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-black text-black">
                  SEARCH LOGS
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search descriptions, types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-black font-semibold shadow-[4px_4px_0px_0px_#000]"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-black text-black">
                  FILTER BY TYPE
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border-2 border-black font-semibold shadow-[4px_4px_0px_0px_#000] bg-white"
                >
                  <option value="all">ALL TYPES</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-black">
              SYSTEM ACTIVITY ({filteredLogs.length})
            </CardTitle>
            <CardDescription className="text-black font-semibold">
              Complete history of all operations in your One Whole World
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length > 0 ? (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 border-2 border-black bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      <Badge
                        className={`${getLogTypeColor(
                          log.type
                        )} text-white font-bold border border-black`}
                      >
                        {log.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-black mb-1">
                        {log.description}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-gray-600">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        {log.entityId && (
                          <span className="font-mono text-xs text-gray-500">
                            ID: {log.entityId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                      {log.metadata && (
                        <div className="mt-2 p-2 bg-gray-200 border border-gray-400 text-xs font-mono">
                          {JSON.stringify(log.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-black text-black mb-2">
                  {logs.length === 0 ? "NO ACTIVITY YET" : "NO MATCHING LOGS"}
                </h3>
                <p className="text-gray-600 font-semibold">
                  {logs.length === 0
                    ? "Start creating systems, avatars, and goals to see activity here."
                    : "Try adjusting your search or filter criteria."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
