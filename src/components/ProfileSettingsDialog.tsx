"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteFromS3, uploadToS3 } from "@/lib/s3";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useState,
  useTransition,
} from "react";
import { useToast } from "./ui/use-toast";
import { updateProfileAction } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PackageManager, User } from "@/lib/types";
import SelectPackageManager from "./SelectPackageManager";

type Props = {
  user: User;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  isPendingDialog: boolean;
  startTransitionDialog: TransitionStartFunction;
};

function ProfileSettingsDialog({
  user,
  setDialogOpen,
  isPendingDialog,
  startTransitionDialog,
}: Props) {
  const { toast } = useToast();

  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    user.avatarUrl || "",
  );
  const [packageManager, setPackageManager] = useState<PackageManager>(
    user.packageManager,
  );

  const handleUpdateProfile = async (formData: FormData) => {
    startTransitionDialog(async () => {
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
        setDialogOpen(false);
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
    <DialogContent
      className="sm:max-w-[425px]"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className="text-center text-2xl">
          Profile Settings
        </DialogTitle>
      </DialogHeader>

      <form className="flex w-full flex-col gap-4" action={handleUpdateProfile}>
        <div className="flex w-full justify-center py-2">
          {/* Image preview */}
          <Avatar
            aria-disabled={isPendingDialog}
            className="h-40 w-40 cursor-pointer aria-disabled:cursor-not-allowed"
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
            disabled={isPendingDialog}
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
              className="mb-1 ml-2 block text-sm font-medium text-muted-foreground"
            >
              Package Manager
            </Label>
            <SelectPackageManager
              packageManager={packageManager}
              setPackageManager={setPackageManager}
              disabled={isPendingDialog}
            />
            <input type="hidden" name="packageManager" value={packageManager} />
          </div>

          <div>
            <Label
              htmlFor="xUrl"
              className="mb-1 ml-2 block text-sm font-medium text-muted-foreground"
            >
              X Url
            </Label>
            <Input
              id="xUrl"
              name="xUrl"
              defaultValue={user.xUrl || ""}
              disabled={isPendingDialog}
            />
          </div>

          <div>
            <Label
              htmlFor="githubUrl"
              className="mb-1 ml-2 block text-sm font-medium text-muted-foreground"
            >
              GitHub Url
            </Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              defaultValue={user.githubUrl || ""}
              disabled={isPendingDialog}
            />
          </div>

          <div>
            <Label
              htmlFor="youtubeUrl"
              className="mb-1 ml-2 block text-sm font-medium text-muted-foreground"
            >
              YouTube Url
            </Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              defaultValue={user.youtubeUrl || ""}
              disabled={isPendingDialog}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isPendingDialog}>
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default ProfileSettingsDialog;
