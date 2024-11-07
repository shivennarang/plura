import BlurPage from "@/components/global/blur-page"
import FunnelsDataTable from "./data-table"
import { Plus } from "lucide-react"
import { getFunnels } from "@/lib/queries"
import FunnelForm from "@/components/forms/funnel-form"
import { columns } from "./columns"



const Funnels = async ({ params }: { params: { subaccountid: string } }) => {
  const funnels = await getFunnels(params.subaccountid)
  if (!funnels) return null

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountid}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}

export default Funnels
