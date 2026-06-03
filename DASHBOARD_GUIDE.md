# Dashboard Design System - Implementation Guide

## Overview
A complete, reusable dashboard design system with a **lime green (#CCFF00) and purple accent theme**. Built with React, Tailwind CSS, and shadcn/ui components.

## 📁 Component Structure

### Core Components Location
- `src/lib/theme.js` - Global theme colors and utilities
- `src/components/dashboard/` - All dashboard components
  - `layout.jsx` - DashboardLayout & DashboardHeader
  - `sidebar.jsx` - DashboardSidebar navigation
  - `stat-card.jsx` - DashStatCard, TrendBadge, Pill components
  - `charts.jsx` - PieChartCard, BarChartCard, LineChartCard, SimpleBarChart
  - `index.js` - Exports all components

---

## 🎨 Theme Colors

All colors are defined in `src/lib/theme.js`:

```javascript
import { theme } from "@/lib/theme";

// Usage
style={{ background: theme.colors.lime }}
style={{ color: theme.colors.dark }}
```

### Color Palette
- **Lime**: `#CCFF00` (primary accent)
- **Purple**: `#C4B5FD` (secondary accent)
- **Dark**: `#111113` (text & backgrounds)
- **Gray variants**: For borders and subtle elements
- **White**: `#fff` (cards & contrast)

---

## 🚀 Quick Start - Using the Dashboard

### 1. Basic Dashboard Layout
```javascript
import {
  DashboardLayout,
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard";
import { theme } from "@/lib/theme";

export default function MyPage() {
  const navItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Reports", path: "/reports", icon: BarChart3, badge: "2" },
  ];

  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          navItems={navItems}
          userName="John Doe"
          userEmail="john@email.com"
        />
      }
      header={
        <DashboardHeader
          title="Dashboard Title"
          subtitle="Descriptive subtitle"
          timeRange={true}
        />
      }
    >
      {/* Your page content goes here */}
    </DashboardLayout>
  );
}
```

---

## 📊 Component Examples

### Stat Card
```javascript
import { DashStatCard } from "@/components/dashboard";
import { Users, TrendingUp } from "lucide-react";

<DashStatCard
  icon={Users}
  title="Total Users"
  value={1250}
  trend="+15% this week"
  variant="primary" // or "secondary"
/>
```

### Trend Badge
```javascript
import { TrendBadge } from "@/components/dashboard";

<TrendBadge text="+12% this week" variant="success" />
<TrendBadge text="-5% this week" variant="danger" />
```

### Charts
```javascript
import { BarChartCard, PieChartCard, LineChartCard } from "@/components/dashboard";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
];

<BarChartCard title="Sales" subtitle="Monthly" data={data} />
<PieChartCard 
  title="Distribution" 
  data={data}
  colors={[theme.colors.lime, theme.colors.purple]}
/>
```

### Simple Bar Chart
```javascript
import { SimpleBarChart } from "@/components/dashboard";

const weekData = [
  { label: "Mon", value: 6, active: true },
  { label: "Tue", value: 4, active: false },
];

<SimpleBarChart data={weekData} />
```

---

## 🎯 Implementation Checklist

- [ ] Created dashboard layout for the page
- [ ] Added sidebar navigation
- [ ] Added stat cards for key metrics
- [ ] Integrated charts for data visualization
- [ ] Used theme colors consistently
- [ ] Mobile responsive (grid layouts included)
- [ ] Added quick actions or CTAs

---

## 📱 Responsive Behavior

All components are built with Tailwind's responsive utilities:
- **Mobile**: Single column layouts
- **Tablet**: 2 columns (sm:grid-cols-2)
- **Desktop**: 3-4 columns (lg:grid-cols-4)

Example:
```javascript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* cards render 1, 2, or 4 across */}
</div>
```

---

## 🛠️ Customization

### Change Theme Colors
Edit `src/lib/theme.js`:
```javascript
export const theme = {
  colors: {
    lime: "#YOUR_COLOR",
    // ... modify any color
  },
};
```

### Custom Components
All components accept `style` props for one-off customizations:
```javascript
<DashStatCard
  // ... props
  style={{ background: "custom-color" }}
/>
```

---

## 📝 Next Steps

1. Apply to admin pages: `src/pages/admin/`
2. Apply to user pages: `src/pages/user/`
3. Apply to blog pages: `src/pages/BlogList.jsx`, etc.
4. Customize navigation items for each page
5. Wire up data from your API/database

---

## 🔗 Related Files

- Theme: [src/lib/theme.js](./src/lib/theme.js)
- Components: [src/components/dashboard/](./src/components/dashboard/)
- Example: [src/pages/user/StudyOverview.jsx](./src/pages/user/StudyOverview.jsx)
