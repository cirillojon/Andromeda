import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageCircle, ArrowUp } from "lucide-react";

const CustomerSupportChat = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="w-48 fixed bottom-8 right-14"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Customer Support
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center">
            <DrawerTitle>Customer Support</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[80%]">
                <p>Hi there! How can I assist you today?</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Agent · 2:30 PM
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="bg-primary text-white p-3 rounded-lg max-w-[80%]">
                <p>
                  Im having trouble with the checkout process. Can you help me?
                </p>
                <div className="text-xs text-gray-300 mt-1">You · 2:31 PM</div>
              </div>
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[80%]">
                <p>
                  Sure, let me take a look at that for you. Can you tell me more
                  about the issue youre facing?
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Agent · 2:32 PM
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="min-h-[48px] rounded-2xl resize-none p-4 border border-gray-200shadow-sm pr-16 dark:border-gray-800"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-3 right-3 w-8 h-8"
              >
                <ArrowUp className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerSupportChat;
