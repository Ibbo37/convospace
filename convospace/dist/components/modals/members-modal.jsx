"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvtar } from "@/components/user-avtar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger, } from "@/components/ui/dropdown-menu";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";
const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500"/>,
    ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500"/>,
};
const MembersModal = () => {
    const router = useRouter();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");
    const isModalOpen = isOpen && type === "members";
    const { server } = data;
    const onKick = async (memberId) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: { serverId: server?.id },
            });
            const response = await axios.delete(url);
            router.refresh();
            onOpen("members", { server: response.data });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    };
    const onRoleChange = async (memberId, role) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: { serverId: server?.id, memberId },
            });
            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen("members", { server: response.data });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingId("");
        }
    };
    return (<Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (<div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvtar src={member.profile.imageUrl}/>
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server?.profileId !== member.profile.id &&
                loadingId !== member.id && (<div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-5 h-5 text-zinc-500"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2"/>
                            <span>Role</span>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => onRoleChange(member?.id, "GUEST")}>
                                <Shield className="w-4 h-4 mr-2"/>
                                Guest
                                {member.role === "GUEST" && (<Check className="w-4 h-4 ml-auto"/>)}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRoleChange(member?.id, "MODERATOR")}>
                                <ShieldCheck className="w-4 h-4 mr-2"/>
                                Moderator
                                {member.role === "MODERATOR" && (<Check className="w-4 h-4 ml-auto"/>)}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => onKick(member?.id)}>
                          <Gavel className="w-4 h-4 mr-2"/>
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>)}
              {loadingId === member.id && (<Loader2 className="animate-spin text-zonc-500 ml-auto w-4 h-4"/>)}
            </div>))}
        </ScrollArea>
      </DialogContent>
    </Dialog>);
};
export default MembersModal;
