// app/records/releases/[slug]/page.tsx
// Single release detail page

import { ReleaseClient } from "./ReleaseClient";

export default function ReleasePage({ params }: { params: { slug: string } }) {
  return <ReleaseClient slug={params.slug} />;
}
