import {
  BarChart3,
  BrainCircuit,
  Clapperboard,
  Code2,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

export type SystemCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  resultTitle: string;
};

export const systemCategories: SystemCategory[] = [
  {
    id: "gaming",
    label: "بازی",
    icon: Gamepad2,
    resultTitle: "برای بازی چطوره؟",
  },
  {
    id: "editing",
    label: "ادیت",
    icon: Clapperboard,
    resultTitle: "برای ادیت چطوره؟",
  },
  {
    id: "ai",
    label: "هوش مصنوعی",
    icon: BrainCircuit,
    resultTitle: "برای هوش مصنوعی چطوره؟",
  },
  {
    id: "programming",
    label: "برنامه‌نویسی",
    icon: Code2,
    resultTitle: "برای برنامه‌نویسی چطوره؟",
  },
  {
    id: "trading",
    label: "ترید",
    icon: BarChart3,
    resultTitle: "برای ترید چطوره؟",
  },
];

export type ComponentRating = "good" | "very-good" | "average";

export type HardwareSpec = {
  gpu: string;
  cpu: string;
  ram: string;
};

export const defaultHardware: HardwareSpec = {
  gpu: "RTX 4060",
  cpu: "Core i7-14700K",
  ram: "32 GB",
};

export const ramOptions = ["8", "16", "32", "64", "128"] as const;

export type ComponentStatus = {
  label: string;
  value: string;
  rating: ComponentRating;
  ratingLabel: string;
};

export function getComponentStatuses(spec: HardwareSpec): ComponentStatus[] {
  return [
    {
      label: "GPU",
      value: spec.gpu,
      rating: "good",
      ratingLabel: "خوبه",
    },
    {
      label: "CPU",
      value: spec.cpu,
      rating: "very-good",
      ratingLabel: "خیلی خوبه",
    },
    {
      label: "RAM",
      value: spec.ram,
      rating: "very-good",
      ratingLabel: "خیلی خوبه",
    },
  ];
}

export const gamingSummary =
  "تقریباً می‌تونی همه بازی‌های مدرن رو با کیفیت خیلی خوب اجرا کنی.";

export const gamingExamples = [
  {
    name: "Red Dead Redemption 2",
    description:
      "می‌تونی Red Dead Redemption 2 رو با کیفیت Very High و رزولوشن 1080p با 60fps اجرا کنی.",
    color: "bg-red-900",
  },
  {
    name: "GTA V",
    description:
      "می‌تونی GTA V رو با کیفیت Very High و رزولوشن 2K با 104fps اجرا کنی.",
    color: "bg-emerald-800",
  },
] as const;

export const gamingLimitations = [
  "ممکنه تو بعضی از محیط‌های خیلی جزئی و شلوغ بازی‌ها، افت فریم جزئی داشته باشی.",
  "برای اجرای بازی‌های سنگین در رزولوشن 2K یا 4K، بهتره تنظیمات گرافیکی رو یک پله پایین‌تر بیاری.",
] as const;

export const categorySummaries: Record<string, string> = {
  gaming: gamingSummary,
  editing: "برای ادیت ویدیو 1080p و 4K سبک، این سیستم گزینه مناسبیه.",
  ai: "برای مدل‌های سبک و متوسط ML/AI مناسبه؛ برای مدل‌های خیلی سنگین محدودیت داری.",
  programming: "برای توسعه روزمره، کامپایل و مولتی‌تسکینگ عملکرد خیلی خوبی داری.",
  trading: "برای ترید و چند مانیتور، پایداری و پاسخ‌گویی سیستم کافیه.",
};
