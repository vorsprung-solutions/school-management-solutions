import UpdateBanner from "@/components/dashboard/banner/update-banner"

 
interface UpdateBannerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UpdateBannerPage({ params }: UpdateBannerPageProps) {
  const { id } = await params
  return <UpdateBanner bannerId={id} />
}
