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
import { Label } from "@/components/ui/label";
import { mappingApi, type Need } from "@/lib/api";
import {
  ArrowLeft,
  Zap,
  Bot,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AutoMapPage() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [needsLoading, setNeedsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    try {
      setNeedsLoading(true);
      // This would need to be implemented in your API to get all needs
      // For now, we'll simulate it
      setNeeds([]);
    } catch (err) {
      setError("Failed to fetch needs");
      console.error(err);
    } finally {
      setNeedsLoading(false);
    }
  };

  const handleAutoMapPending = async () => {
    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const response = await mappingApi.autoMapPending({ threshold });
      setResults(response.data || []);
    } catch (err) {
      setError("Failed to auto-map pending needs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAutoMap = async () => {
    if (selectedNeeds.length === 0) {
      setError("Please select at least one need to map");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const response = await mappingApi.batchAutoMap({
        needIds: selectedNeeds,
        threshold,
      });
      setResults(response.data || []);
    } catch (err) {
      setError("Failed to batch auto-map needs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNeedSelection = (needId: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(needId)
        ? prev.filter((id) => id !== needId)
        : [...prev, needId]
    );
  };

  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
              <Bot className="w-10 h-10" />
              AUTO-MAP NEEDS
            </h1>
            <p className="text-lg font-bold text-black">
              Automatically find and create mappings between needs and fulfiller
              systems
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-4 border-red-500 bg-red-100 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-bold">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Auto-Map Controls */}
          <div className="space-y-6">
            {/* Threshold Setting */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black text-black">
                  MAPPING THRESHOLD
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Set the confidence threshold for automatic mappings (0.0 -
                  1.0)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label
                    htmlFor="threshold"
                    className="text-lg font-black text-black"
                  >
                    THRESHOLD: {threshold}
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={threshold}
                    onChange={(e) =>
                      setThreshold(Number.parseFloat(e.target.value))
                    }
                    className="border-2 border-black font-semibold text-lg p-3 shadow-[4px_4px_0px_0px_#000]"
                    disabled={loading}
                  />
                  <p className="text-sm font-semibold text-gray-600">
                    Higher values = more selective matching. Lower values = more
                    permissive matching.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Map All Pending */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-green-100">
              <CardHeader>
                <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  AUTO-MAP ALL PENDING
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Automatically map all needs that don't have active mappings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleAutoMapPending}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all text-lg py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      MAPPING IN PROGRESS...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      START AUTO-MAPPING
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Batch Auto-Map Selected */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-blue-100">
              <CardHeader>
                <CardTitle className="text-xl font-black text-black">
                  BATCH AUTO-MAP
                </CardTitle>
                <CardDescription className="text-black font-semibold">
                  Select specific needs to auto-map
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {needsLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="font-semibold">Loading needs...</p>
                  </div>
                ) : needs.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {needs.map((need) => (
                      <div
                        key={need.id}
                        className="flex items-center gap-3 p-2 border border-black"
                      >
                        <input
                          type="checkbox"
                          id={need.id}
                          checked={selectedNeeds.includes(need.id)}
                          onChange={() => toggleNeedSelection(need.id)}
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor={need.id}
                          className="font-semibold text-black flex-1"
                        >
                          {need.description}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center font-semibold text-gray-600 py-4">
                    No needs available for mapping
                  </p>
                )}

                <Button
                  onClick={handleBatchAutoMap}
                  disabled={loading || selectedNeeds.length === 0}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      MAPPING...
                    </>
                  ) : (
                    `MAP SELECTED (${selectedNeeds.length})`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                MAPPING RESULTS
              </CardTitle>
              <CardDescription className="text-black font-semibold">
                Results from the latest auto-mapping operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 border-2 border-black bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={`font-bold border border-black ${
                            result.success
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {result.success ? "SUCCESS" : "FAILED"}
                        </Badge>
                        {result.confidence && (
                          <Badge
                            variant="outline"
                            className="border-2 border-black font-bold"
                          >
                            {Math.round(result.confidence * 100)}% MATCH
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold text-black">
                        {result.message || result.description}
                      </div>
                      {result.mapping && (
                        <div className="text-sm font-semibold text-gray-600 mt-1">
                          Mapping ID: {result.mapping.id}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-black text-black mb-2">
                    NO RESULTS YET
                  </h3>
                  <p className="text-gray-600 font-semibold">
                    Run an auto-mapping operation to see results here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-cyan-400 mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-black text-black">
              HOW AUTO-MAPPING WORKS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-black mb-2">
                  🤖 INTELLIGENT MATCHING
                </h4>
                <p className="font-semibold text-black">
                  The system analyzes need descriptions and system capabilities
                  to find the best matches automatically.
                </p>
              </div>
              <div>
                <h4 className="font-black text-black mb-2">
                  ⚡ THRESHOLD CONTROL
                </h4>
                <p className="font-semibold text-black">
                  Set confidence thresholds to control how selective the
                  matching algorithm should be.
                </p>
              </div>
              <div>
                <h4 className="font-black text-black mb-2">
                  📊 BATCH PROCESSING
                </h4>
                <p className="font-semibold text-black">
                  Process multiple needs at once or automatically handle all
                  pending needs in the system.
                </p>
              </div>
              <div>
                <h4 className="font-black text-black mb-2">
                  🎯 SMART SUGGESTIONS
                </h4>
                <p className="font-semibold text-black">
                  Get intelligent suggestions for manual review before creating
                  automatic mappings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
