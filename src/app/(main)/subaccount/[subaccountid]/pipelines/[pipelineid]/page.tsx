
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import {
  getLanesWithTicketAndTags,
  getPipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
} from '@/lib/queries'
import { LaneDetail } from '@/lib/types'
import { redirect } from 'next/navigation'
import React from 'react'


import PipelineView from '../_components/pipeline-view'
import PipelineInfoBar from '../_components/pipeline-infobar'
import PipelineSettings from '../_components/pipeline-settings'

type Props = {
  params: { subaccountid: string; pipelineid: string }
}

const PipelinePage = async ({ params }: Props) => {
console.log("pipeline page");
  const pipelineDetails = await getPipelineDetails(params.pipelineid)
  if (!pipelineDetails)
    return redirect(`/subaccount/${params.subaccountid}/pipelines`)

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountid },
  })

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineid
  )) as LaneDetail[]
console.log("pipelines ji pipeline",pipelines)
  return (
    <Tabs
      defaultValue="view"
      className="w-full"
    >
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar
          pipelineId={params.pipelineid}
          subAccountId={params.subaccountid}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={params.pipelineid}
          subaccountId={params.subaccountid}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={params.pipelineid}
          pipelines={pipelines}
          subaccountId={params.subaccountid}
        />
      </TabsContent>
    </Tabs>
  )
}

export default PipelinePage
