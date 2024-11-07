import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
    children: React.ReactNode;
    params: any; // Adjust the type of `params` based on what it contains
  };
  
  const Layout = async ({ children, params }: Props) => {
    const agencyId = await verifyAndAcceptInvitation()
    console.log("agency:" +agencyId)
    const user = await currentUser()
    console.log("user:" +user?.id)
    if (!user) {
        return redirect('/')
      }
    
      if (!agencyId) {
        return redirect('/agency')
      }
      console.log(user.privateMetadata.role);
      if(  user.privateMetadata.role !== 'AGENCY_OWNER' &&
        user.privateMetadata.role !== 'AGENCY_ADMIN')
        return <Unauthorized/>
        let allNoti: any = []
        const notifications = await getNotificationAndUser(agencyId)
        if (notifications) allNoti = notifications
    return (
      
      <div className="h-screen overflow-hidden">
      <Sidebar
        id={params.agencyId}
        type="agency"
      />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={allNoti}
          role={allNoti.User?.role}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
        </div>
      </div>
    );
  };
  
  export default Layout;
  