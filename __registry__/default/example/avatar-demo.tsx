import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/ColeBlender.png"
        alt="@ColeBlender"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
