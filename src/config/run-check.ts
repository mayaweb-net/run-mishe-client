export type RunCheckInput = {
  game: string;
  gpu: string;
  cpu: string;
  ram: string;
};

export const defaultRunCheckInput: RunCheckInput = {
  game: "Red Dead Redemption 2",
  gpu: "Nvidia Geforce RTX 4060",
  cpu: "Intel Core i7-13500",
  ram: "32",
};

export const ramOptions = ["8", "16", "32", "64", "128"] as const;

export type RequirementTier = {
  title: string;
  gpu: string;
  cpu: string;
  ram: string;
  passed: boolean;
};

export type RunCheckResult = {
  game: string;
  runs: boolean;
  statusLabel: string;
  userSpec: {
    gpu: string;
    cpu: string;
    ram: string;
  };
  minimum: RequirementTier;
  recommended: RequirementTier;
  performanceSummary: string;
  performanceDetail: string;
  shareUrl: string;
};

export function getRunCheckResult(input: RunCheckInput): RunCheckResult {
  const game = input.game.trim() || defaultRunCheckInput.game;
  const gpu = input.gpu.trim() || defaultRunCheckInput.gpu;
  const cpu = input.cpu.trim() || defaultRunCheckInput.cpu;
  const ram = input.ram || defaultRunCheckInput.ram;

  return {
    game,
    runs: true,
    statusLabel: "ران میشه",
    userSpec: { gpu, cpu, ram },
    minimum: {
      title: "حداقل سیستم مورد نیاز",
      gpu: "Nvidia Geforce GTX 1060",
      cpu: "Intel Core i5-6600K",
      ram: "8 GB",
      passed: true,
    },
    recommended: {
      title: "سیستم پیشنهادی",
      gpu: "Nvidia Geforce RTX 2060",
      cpu: "Intel Core i7-8700K",
      ram: "16 GB",
      passed: true,
    },
    performanceSummary: "روی کیفیت High و Ultra راحت اجرا میشه",
    performanceDetail: "می‌تونی روی رزولوشن 2K و کیفیت High حدود ۶۰ فریم بگیری",
    shareUrl: `https://runmishe.com/c/${encodeURIComponent(game.toLowerCase().replace(/\s+/g, "-"))}`,
  };
}

export const howItWorksParagraphs = [
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.",
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.",
] as const;
