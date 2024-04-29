"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PackageManager } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

type Props = {
  packageManager: PackageManager;
  setPackageManager: Dispatch<SetStateAction<PackageManager>>;
  disabled: boolean;
};

function SelectPackageManager({
  packageManager,
  setPackageManager,
  disabled,
}: Props) {
  const handleValueChange = (value: PackageManager) => {
    setPackageManager(value);
  };

  return (
    <Select
      value={packageManager}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="pnpm">pnpm</SelectItem>
          <SelectItem value="npm">npm</SelectItem>
          <SelectItem value="yarn">yarn</SelectItem>
          <SelectItem value="bun">bun</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectPackageManager;
