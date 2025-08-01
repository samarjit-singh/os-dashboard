import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCircle,
  Target,
  Zap,
  GitBranch,
  Activity,
  Plus,
  Eye,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-yellow-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-4 tracking-tight">
            ONE WHOLE WORLD
          </h1>
          <p className="text-xl font-bold text-black max-w-2xl mx-auto">
            A revolutionary operating system where systems, avatars, goals, and
            needs interconnect to create a living digital ecosystem.
          </p>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Systems */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-black" />
                <CardTitle className="text-2xl font-black text-black">
                  SYSTEMS
                </CardTitle>
              </div>
              <CardDescription className="text-black font-semibold">
                Core entities: humans, cars, robots, anything under the sun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/systems/create">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE SYSTEM
                </Button>
              </Link>
              <Link href="/systems">
                <Button
                  variant="outline"
                  className="w-full border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-transparent text-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW ALL
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Avatars */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <UserCircle className="w-8 h-8 text-black" />
                <CardTitle className="text-2xl font-black text-black">
                  AVATARS
                </CardTitle>
              </div>
              <CardDescription className="text-black font-semibold">
                Roles and identities that define each system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/avatars/create">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE AVATAR
                </Button>
              </Link>
              <Link href="/avatars">
                <Button
                  variant="outline"
                  className="w-full border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-transparent text-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW ALL
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-black" />
                <CardTitle className="text-2xl font-black text-black">
                  GOALS
                </CardTitle>
              </div>
              <CardDescription className="text-black font-semibold">
                Objectives that avatars strive to achieve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/goals/create">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE GOAL
                </Button>
              </Link>
              <Link href="/goals">
                <Button
                  variant="outline"
                  className="w-full border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-transparent text-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW ALL
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Needs */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-black" />
                <CardTitle className="text-2xl font-black text-black">
                  NEEDS
                </CardTitle>
              </div>
              <CardDescription className="text-black font-semibold">
                Requirements to fulfill avatar goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/needs/create">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE NEED
                </Button>
              </Link>
              <Link href="/needs">
                <Button
                  variant="outline"
                  className="w-full border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-transparent text-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW ALL
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mappings */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <GitBranch className="w-8 h-8 text-black" />
                <CardTitle className="text-2xl font-black text-black">
                  MAPPINGS
                </CardTitle>
              </div>
              <CardDescription className="text-black font-semibold">
                Connections between needs and fulfiller systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/mappings/create">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE MAPPING
                </Button>
              </Link>
              <Link href="/mappings">
                <Button
                  variant="outline"
                  className="w-full border-2 border-black font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-transparent text-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  VIEW ALL
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Logs */}
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-black" />
                <CardTitle className="text-2xl font-black text-black">
                  ACTIVITY
                </CardTitle>
              </div>
              <CardDescription className="text-black font-semibold">
                Complete history of all system operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/logs">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  <Activity className="w-4 h-4 mr-2" />
                  VIEW LOGS
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-cyan-400">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-black text-center">
              QUICK ACTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/mappings/auto-map">
                <Button className="w-full bg-black text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#fff] transition-all">
                  🤖 AUTO-MAP NEEDS
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full bg-white text-black font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                  📊 SYSTEM DASHBOARD
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
