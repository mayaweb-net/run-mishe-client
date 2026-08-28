import { Logo } from "@/components/main/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <Logo showName size="lg" />
      <Button>شروع کنید</Button>
    </div>
  );
}
