"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
const formSchema = z.object({
    name: z
        .string()
        .min(1, "Server Name is required")
        .max(32, "Server Name is too long"),
    imageUrl: z.string().min(1, "Server Image is required"),
});
const CreateServerModal = () => {
    const { isOpen, onClose, type } = useModal();
    const routes = useRouter();
    const isModalOpen = isOpen && type === "createServer";
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values) => {
        try {
            await axios.post("/api/servers", values);
            routes.refresh();
            onClose();
        }
        catch (error) {
            console.log(error);
        }
    };
    const handleModalClose = () => {
        onClose();
        form.reset();
    };
    return (<Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your new server a personality with a name and an icon. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange}/>
                      </FormControl>
                    </FormItem>)}/>
              </div>
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a server name" className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" disabled={isLoading} {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>)}/>
            </div>
            <DialogFooter className="flex bg-gray-100 px-6 py-4">
              <Button variant="primary">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>);
};
export default CreateServerModal;
