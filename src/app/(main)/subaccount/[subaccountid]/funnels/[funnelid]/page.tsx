import BlurPage from "@/components/global/blur-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFunnel } from "@/lib/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import FunnelSteps from "./_components/funnell-steps";

import FunnelForm from "@/components/forms/funnel-form";

type Props = {
  params: { funnelid: string; subaccountid: string };
};

const FunnelPage = async ({ params }: Props) => {
  const funnelPages = await getFunnel(params.funnelid);
  if (!funnelPages)
    return redirect(`/subaccount/${params.subaccountid}/funnels`);

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${params.subaccountid}/funnels`}
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
      >
        Back
      </Link>
      <h1 className="text-3xl mb-8">{funnelPages.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            subaccountId={params.subaccountid}
            pages={funnelPages.FunnelPages}
            funnelId={params.funnelid}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelForm
            subAccountId={params.subaccountid}
            defaultData={funnelPages}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelPage;
