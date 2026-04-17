"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  id: number;
  name: string;
}

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value: number | null;
  onChange: (id: number) => void;
  icon?: React.ReactNode;
}

export function SelectField({
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  icon,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {label}
      </Label>
      <Select
        value={value?.toString() ?? ""}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="bg-slate-800/60 border-slate-600/50 text-white h-11 rounded-xl focus:border-violet-500 focus:ring-violet-500/20 data-[placeholder]:text-slate-500">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700/50 rounded-xl">
          {options.map((opt) => (
            <SelectItem
              key={opt.id}
              value={opt.id.toString()}
              className="text-slate-200 focus:bg-slate-800 focus:text-white rounded-lg"
            >
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
