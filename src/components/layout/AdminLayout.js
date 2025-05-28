import React from "react";
import DashboardTopbar from "./DashboardTopbar";
import DashboardSidebar from "./DashboardSidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-y-hidden">
            {/* Sidebar */}
            <DashboardSidebar />

            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <DashboardTopbar />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
