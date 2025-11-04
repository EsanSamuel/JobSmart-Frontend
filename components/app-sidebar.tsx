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
          title: "Interviews",
          url: "/company/applicants/interviews",
        },
      ],
    },
    /* {
      title: "Messages",
      url: "/company/messages",
      icon: MessageSquare,
      items: [
        {
          title: "Inbox",
          url: "/company/messages",
        },
        {
          title: "Sent",
          url: "/company/messages/sent",
        },
      ],
    },*/
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
        <TeamSwitcher teams={data.teams} />
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
