"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
  Waypoints,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Briefcase,
  BarChart3,
  Building2,
  Users,
  MessageSquare,
  Settings2,
  PlusSquare,
  LifeBuoy,
  FileText,
  Clock,
} from "lucide-react";
import { UserContext } from "@/app/context/userContext";
import { user } from "@/types";

const data = {
  user: {
    name: "PayStack",
    email: "hr@paystack.com",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  teams: [
    {
      name: "PayStack Inc.",
      logo: Building2,
      plan: "Premium",
    },
    {
      name: "Flutterwave Ltd.",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "Andela",
      logo: Building2,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Performance",
          url: "/performance",
        },
      ],
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: Briefcase,
      items: [
        {
          title: "Post New Job",
          url: "/dashboard/jobs/new",
        },
        {
          title: "Active Jobs",
          url: "/dashboard/jobs/active",
        },
        {
          title: "Closed Jobs",
          url: "/dashboard/jobs/closed",
        },
      ],
    },
    {
      title: "Applicants",
      url: "/dashboard/applicants",
      icon: Users,
      items: [
        {
          title: "All Applicants",
          url: "/dashboard/applicants",
        },
        {
          title: "Shortlisted",
          url: "/dashboard/applicants/shortlisted",
        },
        {
          title: "Accepted",
          url: "/dashboard/applicants/accepted",
        },
      ],
    },
    {
      title: "Messages",
      url: "/company/messages",
      icon: MessageSquare,
      items: [
        {
          title: "Inbox",
          url: "/room",
        },
        {
          title: "Sent",
          url: "/messages/sent",
        },
      ],
    },
    {
      title: "Settings",
      url: "/company/settings",
      icon: Settings2,
      items: [
        {
          title: "Company Profile",
          url: "/company/settings/profile",
        },
        {
          title: "Team Members",
          url: "/company/settings/team",
        },
        {
          title: "Billing",
          url: "/company/settings/billing",
        },
        {
          title: "Notifications",
          url: "/company/settings/notifications",
        },
      ],
    },
  ],
  jobsListed: [
    {
      title: "Frontend Developer",
      url: "/company/jobs/1",
      icon: FileText,
      applicants: 120,
      status: "Active",
    },
    {
      title: "Backend Engineer",
      url: "/company/jobs/2",
      icon: FileText,
      applicants: 98,
      status: "Active",
    },
    {
      title: "UI/UX Designer",
      url: "/company/jobs/3",
      icon: FileText,
      applicants: 60,
      status: "Closed",
    },
    {
      title: "Project Manager",
      url: "/company/jobs/4",
      icon: Clock,
      applicants: 45,
      status: "Pending Review",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = React.useContext(UserContext) as any;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Waypoints className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">JobSmart</span>
            {/* <span className="truncate text-xs">{activeTeam.plan}</span>*/}
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.jobsListed} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
