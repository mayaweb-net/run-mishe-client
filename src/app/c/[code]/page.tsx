import { CheckSnapshotPage } from "@/components/review/check-snapshot-page";

type PageProps = {
  params: Promise<{ code: string }>;
};

export default async function SharedCheckPage({ params }: PageProps) {
  const { code } = await params;
  return <CheckSnapshotPage code={code} />;
}
