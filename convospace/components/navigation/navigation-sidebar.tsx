import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";
// // import ChatWindow from "../ChatWindow";
// import DropdownLike from "../DropdownLike";
import ChatWindow from "../ChatWindow";
import DropdownLike from "../DropdownLike";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-5 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-4">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-12 mx-auto" />
      
      <ScrollArea className="flex-1 w-full px-2">
        {servers.map((server) => (
          <div key={server.id} className="mb-5">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-4 mt-auto flex flex-col items-center gap-y-4">
        <DropdownLike/>
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "h-[48px] w-[48px]" },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
