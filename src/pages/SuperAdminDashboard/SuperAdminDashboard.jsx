import Header from "../../components/SuperAdminDashboard/Header";
import { Outlet } from "react-router-dom";

export default function SuperAdminDashboard(){
    return(
        <>
        <Header/>
        <main>
            <Outlet/>
        </main>
        </>
    );
}