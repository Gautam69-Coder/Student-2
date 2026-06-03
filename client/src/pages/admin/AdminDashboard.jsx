import React from "react";
import {
    Home,
    Users,
    FileText,
    BarChart3,
    Settings,
    Bell,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DashboardLayout,
    DashboardHeader,
    DashboardSidebar,
    DashStatCard,
    BarChartCard,
} from "@/components/dashboard";
import { theme } from "@/lib/theme";

export default function AdminDashboard() {
    const navItems = [
        { label: "Dashboard", path: "/admin", icon: Home },
        { label: "Users", path: "/admin/users", icon: Users, badge: "12" },
        { label: "Content", path: "/admin/content", icon: FileText },
        { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { label: "Settings", path: "/admin/settings", icon: Settings },
    ];

    const stats = {
        totalUsers: { value: "1,234", trend: "+45 this week", icon: Users },
        activeContent: { value: "89", trend: "+12% this week", icon: FileText },
        engagement: { value: "4.2k", trend: "+8% this week", icon: CheckCircle2 },
        alerts: { value: "7", trend: "-2 this week", icon: AlertCircle },
    };

    const userGrowth = [
        { month: "Jan", users: 200 },
        { month: "Feb", users: 320 },
        { month: "Mar", users: 480 },
        { month: "Apr", users: 650 },
        { month: "May", users: 890 },
        { month: "Jun", users: 1234 },
    ];

    const recentUsers = [
        { id: 1, name: "John Doe", email: "john@email.com", joined: "2 days ago", status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@email.com", joined: "1 week ago", status: "active" },
        { id: 3, name: "Mike Johnson", email: "mike@email.com", joined: "2 weeks ago", status: "inactive" },
        { id: 4, name: "Sarah Williams", email: "sarah@email.com", joined: "3 weeks ago", status: "active" },
    ];

    return (
        <DashboardLayout
            sidebar={
                <DashboardSidebar
                    navItems={navItems}
                    userName="Admin"
                    userEmail="admin@studyhub.com"
                />
            }
            header={
                <DashboardHeader
                    title="Admin Dashboard"
                    subtitle="Manage users, content, and monitor platform metrics"
                    timeRange={true}
                />
            }
        >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashStatCard
                    icon={stats.totalUsers.icon}
                    title="Total Users"
                    value={stats.totalUsers.value}
                    trend={stats.totalUsers.trend}
                />
                <DashStatCard
                    icon={stats.activeContent.icon}
                    title="Active Content"
                    value={stats.activeContent.value}
                    trend={stats.activeContent.trend}
                    variant="secondary"
                />
                <DashStatCard
                    icon={stats.engagement.icon}
                    title="Engagements"
                    value={stats.engagement.value}
                    trend={stats.engagement.trend}
                />
                <DashStatCard
                    icon={stats.alerts.icon}
                    title="Alerts"
                    value={stats.alerts.value}
                    trend={stats.alerts.trend}
                    variant="secondary"
                />
            </div>

            {/* User Growth Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <BarChartCard
                        title="User Growth"
                        subtitle="Monthly new users"
                        data={userGrowth}
                    />
                </div>

                {/* Quick Stats Card */}
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
                            Quick Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center pb-3">
                            <span style={{ color: theme.colors.darkGray }}>Avg. Session</span>
                            <span
                                className="font-bold text-lg"
                                style={{ color: theme.colors.lime }}
                            >
                                12m 34s
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-3">
                            <span style={{ color: theme.colors.darkGray }}>Bounce Rate</span>
                            <span
                                className="font-bold text-lg"
                                style={{ color: theme.colors.purple }}
                            >
                                28%
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-3">
                            <span style={{ color: theme.colors.darkGray }}>Conversion</span>
                            <span
                                className="font-bold text-lg"
                                style={{ color: theme.colors.lime }}
                            >
                                3.8%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span style={{ color: theme.colors.darkGray }}>Revenue</span>
                            <span
                                className="font-bold text-lg"
                                style={{ color: theme.colors.lime }}
                            >
                                $12.5k
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table */}
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
                        Recent Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    style={{
                                        borderBottom: `1px solid ${theme.colors.lightGray}`,
                                    }}
                                >
                                    <th
                                        className="text-left py-3 px-4 font-semibold"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        Name
                                    </th>
                                    <th
                                        className="text-left py-3 px-4 font-semibold"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        Email
                                    </th>
                                    <th
                                        className="text-left py-3 px-4 font-semibold"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        Joined
                                    </th>
                                    <th
                                        className="text-left py-3 px-4 font-semibold"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        style={{
                                            borderBottom: `1px solid ${theme.colors.softGray}`,
                                        }}
                                    >
                                        <td
                                            className="py-3 px-4 font-medium"
                                            style={{ color: theme.colors.dark }}
                                        >
                                            {user.name}
                                        </td>
                                        <td
                                            className="py-3 px-4"
                                            style={{ color: theme.colors.darkGray }}
                                        >
                                            {user.email}
                                        </td>
                                        <td
                                            className="py-3 px-4"
                                            style={{ color: theme.colors.darkGray }}
                                        >
                                            {user.joined}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className="px-3 py-1 rounded-full text-sm font-bold"
                                                style={{
                                                    background:
                                                        user.status === "active"
                                                            ? theme.colors.limeDimmer
                                                            : theme.colors.softGray,
                                                    color: theme.colors.dark,
                                                }}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
