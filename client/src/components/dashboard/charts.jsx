import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { theme } from "@/lib/theme";

export function PieChartCard({ title, subtitle, data, colors }) {
    return (
        <Card className="rounded-2xl" style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}>
            <CardHeader className="pb-3">
                <CardTitle className="text-[16px] font-bold" style={{ color: theme.colors.dark }}>
                    {title}
                </CardTitle>
                {subtitle && (
                    <div className="text-[13px] font-medium" style={{ color: theme.colors.darkGray, marginTop: 4 }}>
                        {subtitle}
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: theme.colors.dark,
                                border: `1px solid ${theme.colors.lime}`,
                                borderRadius: "8px",
                                color: theme.colors.white,
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function BarChartCard({ title, subtitle, data }) {
    return (
        <Card className="rounded-2xl" style={{ background: theme.colors.dark, borderColor: theme.colors.lime }}>
            <CardHeader className="pb-3">
                <CardTitle className="text-[16px] font-bold" style={{ color: theme.colors.white }}>
                    {title}
                </CardTitle>
                {subtitle && (
                    <div className="text-[13px] font-medium" style={{ color: theme.colors.darkGray, marginTop: 4 }}>
                        {subtitle}
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={`${theme.colors.white}20`} />
                        <XAxis stroke={theme.colors.darkGray} />
                        <YAxis stroke={theme.colors.darkGray} />
                        <Tooltip
                            contentStyle={{
                                background: theme.colors.dark,
                                border: `1px solid ${theme.colors.lime}`,
                                borderRadius: "8px",
                                color: theme.colors.white,
                            }}
                        />
                        <Bar dataKey="value" fill={theme.colors.lime} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function LineChartCard({ title, subtitle, data, lines }) {
    return (
        <Card className="rounded-2xl" style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}>
            <CardHeader className="pb-3">
                <CardTitle className="text-[16px] font-bold" style={{ color: theme.colors.dark }}>
                    {title}
                </CardTitle>
                {subtitle && (
                    <div className="text-[13px] font-medium" style={{ color: theme.colors.darkGray, marginTop: 4 }}>
                        {subtitle}
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.softGray} />
                        <XAxis stroke={theme.colors.darkGray} />
                        <YAxis stroke={theme.colors.darkGray} />
                        <Tooltip
                            contentStyle={{
                                background: theme.colors.white,
                                border: `1px solid ${theme.colors.lightGray}`,
                                borderRadius: "8px",
                                color: theme.colors.dark,
                            }}
                        />
                        {lines.map((line) => (
                            <Line
                                key={line.key}
                                type="monotone"
                                dataKey={line.key}
                                stroke={line.color || theme.colors.lime}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function SimpleBarChart({ data }) {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="w-full h-48 flex items-end gap-2">
            {data.map((d) => {
                const h = Math.round((d.value / max) * 100);
                const isActive = d.active;
                return (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                        <div
                            className="w-full rounded-full"
                            style={{
                                height: `${Math.max(8, h)}%`,
                                backgroundColor: isActive ? theme.colors.lime : theme.colors.softGrayDarker,
                            }}
                        />
                        <div className="text-[11px] font-semibold" style={{ color: theme.colors.darkGray }}>
                            {d.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
