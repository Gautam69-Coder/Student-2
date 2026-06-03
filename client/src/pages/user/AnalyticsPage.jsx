import React from "react";
import {
    Home,
    BarChart3,
    Users,
    MessageSquare,
    Settings,
    FileText,
    TrendingUp,
    Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DashboardLayout,
    DashboardHeader,
    DashboardSidebar,
    DashStatCard,
    BarChartCard,
    LineChartCard,
    PieChartCard,
} from "@/components/dashboard";
import { theme } from "@/lib/theme";

export default function AnalyticsPage() {
    const navItems = [
        { label: "Home", path: "/dashboard", icon: Home },
        { label: "Analytics", path: "/analytics", icon: BarChart3 },
        { label: "Users", path: "/users", icon: Users },
        { label: "Messages", path: "/messages", icon: MessageSquare, badge: "12" },
        { label: "Settings", path: "/settings", icon: Settings },
    ];

    const stats = {
        pageViews: { value: "12.5k", trend: "+8% this week", icon: Activity },
        uniqueUsers: { value: "2.8k", trend: "+12% this week", icon: Users },
        engagement: { value: "68%", trend: "+5% this week", icon: TrendingUp },
        conversions: { value: "340", trend: "+3% this week", icon: FileText },
    };

    const monthlyData = [
        { name: "Jan", value: 2400 },
        { name: "Feb", value: 1398 },
        { name: "Mar", value: 3200 },
        { name: "Apr", value: 2780 },
        { name: "May", value: 1890 },
        { name: "Jun", value: 2390 },
    ];

    const deviceData = [
        { name: "Desktop", value: 4000 },
        { name: "Mobile", value: 3000 },
        { name: "Tablet", value: 2000 },
    ];

    const trafficData = [
        { date: "Mon", organic: 400, paid: 240 },
        { date: "Tue", organic: 300, paid: 221 },
        { date: "Wed", organic: 200, paid: 229 },
        { date: "Thu", organic: 278, paid: 200 },
        { date: "Fri", organic: 189, paid: 220 },
        { date: "Sat", organic: 239, paid: 250 },
        { date: "Sun", organic: 349, paid: 210 },
    ];

    return (
        <DashboardLayout
            
        >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashStatCard
                    icon={stats.pageViews.icon}
                    title="Page Views"
                    value={stats.pageViews.value}
                    trend={stats.pageViews.trend}
                />
                <DashStatCard
                    icon={stats.uniqueUsers.icon}
                    title="Unique Users"
                    value={stats.uniqueUsers.value}
                    trend={stats.uniqueUsers.trend}
                    variant="secondary"
                />
                <DashStatCard
                    icon={stats.engagement.icon}
                    title="Engagement Rate"
                    value={stats.engagement.value}
                    trend={stats.engagement.trend}
                />
                <DashStatCard
                    icon={stats.conversions.icon}
                    title="Conversions"
                    value={stats.conversions.value}
                    trend={stats.conversions.trend}
                    variant="secondary"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChartCard
                    title="Monthly Traffic"
                    subtitle="Page views per month"
                    data={monthlyData}
                />
                <PieChartCard
                    title="Device Distribution"
                    subtitle="Traffic by device type"
                    data={deviceData}
                    colors={[theme.colors.lime, theme.colors.purple, "#8B5CF6"]}
                />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 gap-4">
                <LineChartCard
                    title="Traffic Sources"
                    subtitle="Organic vs Paid traffic"
                    data={trafficData}
                    lines={[
                        { key: "organic", color: theme.colors.lime },
                        { key: "paid", color: theme.colors.purple },
                    ]}
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card
                    className="rounded-2xl"
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                    }}
                >
                    <CardHeader className="pb-3">
                        <CardTitle
                            className="text-[16px] font-bold"
                            style={{ color: theme.colors.dark }}
                        >
                            Top Pages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { page: "/dashboard", views: 1200 },
                                { page: "/learn", views: 980 },
                                { page: "/practice", views: 750 },
                                { page: "/community", views: 620 },
                            ].map((item) => (
                                <div key={item.page} className="flex justify-between items-center">
                                    <span style={{ color: theme.colors.dark }}>{item.page}</span>
                                    <span
                                        className="px-2 py-1 rounded-full text-sm font-bold"
                                        style={{
                                            background: theme.colors.limeDimmer,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        {item.views}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="rounded-2xl"
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                    }}
                >
                    <CardHeader className="pb-3">
                        <CardTitle
                            className="text-[16px] font-bold"
                            style={{ color: theme.colors.dark }}
                        >
                            Top Referrers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { source: "Google", count: 450 },
                                { source: "Direct", count: 320 },
                                { source: "Social Media", count: 280 },
                                { source: "Referrals", count: 190 },
                            ].map((item) => (
                                <div key={item.source} className="flex justify-between items-center">
                                    <span style={{ color: theme.colors.dark }}>{item.source}</span>
                                    <span
                                        className="px-2 py-1 rounded-full text-sm font-bold"
                                        style={{
                                            background: theme.colors.purpleLight,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
