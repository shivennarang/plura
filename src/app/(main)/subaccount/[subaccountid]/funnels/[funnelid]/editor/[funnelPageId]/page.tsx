import { db } from "@/lib/db"
import EditorProvider from "@/providers/editor/editor-provider"
import { redirect } from "next/navigation"
import FunnelEditorNavigation from "./_components/funnel-editor-navigation"
import FunnelEditor from "./_components/funnel-editor"
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar"




type Props = {
  params: {
    subaccountid: string
    funnelid: string
    funnelPageId: string
  }
}

const Page = async ({ params }: Props) => {
  console.log("funnel parms",params);
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  })
  if (!funnelPageDetails) {
    return redirect(
      `/subaccount/${params.subaccountid}/funnels/${params.funnelid}`
    )
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={params.subaccountid}
        funnelId={params.funnelid}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelid}
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountid}
        />
        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageId={params.funnelPageId} />
        </div>

        <FunnelEditorSidebar subaccountId={params.subaccountid} />
      </EditorProvider>
    </div>
  )
}

export default Page
