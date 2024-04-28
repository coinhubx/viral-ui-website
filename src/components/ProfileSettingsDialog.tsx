"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteFromS3, uploadToS3 } from "@/lib/s3";
import { ChangeEvent, useState, useTransition } from "react";
import { useToast } from "./ui/use-toast";
import { updateProfileAction } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";

type Props = {
  user: User;
};

function ProfileSettingsDialog({ user }: Props) {
  const { toast } = useToast();

  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    user.avatarUrl || "",
  );

  const [isPending, startTransition] = useTransition();

  const handleUpdateProfile = async (formData: FormData) => {
    startTransition(async () => {
      const selectedAvatarUrlFile = formData.get("selectedAvatarUrl") as File;

      if (selectedAvatarUrlFile.size > 0) {
        const { s3ImageUrl, errorMessage } = await uploadToS3(
          selectedAvatarUrlFile,
          "avatars",
        );
        if (errorMessage) {
          toast({
            title: "Error!",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }

        formData.set("avatarUrl", s3ImageUrl!);

        if (user.avatarUrl) {
          await deleteFromS3(user.avatarUrl);
        }
      } else {
        formData.set("avatarUrl", user.avatarUrl || "");
      }

      formData.delete("selectedAvatarUrl");
      formData.delete("savedAvatarUrl");

      const { errorMessage } = await updateProfileAction(formData);

      if (!errorMessage) {
        toast({
          title: "Success!",
          description: "Profile successfully updated",
          variant: "success",
        });
      } else {
        toast({
          title: "Error!",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length === 1) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Profile Settings</DialogTitle>
      </DialogHeader>

      <form
        className={`flex w-full flex-col gap-4 transition-opacity duration-300 ease-in-out ${isPending && "-z-50 opacity-0"}`}
        action={handleUpdateProfile}
      >
        <div className="relative h-full self-center">
          {/* Image preview */}
          <Avatar
            className="size-56 cursor-pointer"
            onClick={() =>
              document.getElementById("selectedAvatarUrl")?.click()
            }
          >
            <AvatarImage src={selectedAvatarUrl} />
            <AvatarFallback className="text-4xl">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Hidden file input */}
          <input
            id="selectedAvatarUrl"
            name="selectedAvatarUrl"
            type="file"
            accept="image/*"
            hidden
            disabled={isPending}
            onChange={handleFileChange}
            max={1}
          />
          <input
            type="hidden"
            name="savedAvatarUrl"
            value={user.avatarUrl || ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <Label
              htmlFor="packageManager"
              className="mb-1 ml-2 block text-sm font-medium"
            >
              Package Manager
            </Label>
            <Input
              id="packageManager"
              name="packageManager"
              defaultValue={user.packageManager || ""}
              disabled={isPending}
            />
          </div>

          <div>
            <Label
              htmlFor="xUrl"
              className="mb-1 ml-2 block text-sm font-medium"
            >
              X Url
            </Label>
            <Input
              id="xUrl"
              name="xUrl"
              defaultValue={user.xUrl || ""}
              disabled={isPending}
            />
          </div>

          <div>
            <Label
              htmlFor="githubUrl"
              className="mb-1 ml-2 block text-sm font-medium"
            >
              GitHub Url
            </Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              defaultValue={user.githubUrl || ""}
              disabled={isPending}
            />
          </div>

          <div>
            <Label
              htmlFor="youtubeUrl"
              className="mb-1 ml-2 block text-sm font-medium"
            >
              YouTube Url
            </Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              defaultValue={user.youtubeUrl || ""}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default ProfileSettingsDialog;
