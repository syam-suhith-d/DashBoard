"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Spinner, Container } from "react-bootstrap";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleToggleSidebar = () => {
        if (window.innerWidth >= 768) {
            setIsCollapsed(!isCollapsed);
        } else {
            setShowMobileSidebar(!showMobileSidebar);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // If user is not authenticated, return null (waiting for redirect)
    if (!user) return null;

    return (
        <div className="d-flex min-vh-100 bg-light overflow-hidden">
            {/* Sidebar (Fixed position) */}
            <Sidebar
                showMobile={showMobileSidebar}
                onHideMobile={() => setShowMobileSidebar(false)}
                collapsed={isCollapsed}
            />

            {/* Main Wrapper */}
            <div className="d-flex w-100">
                {/* Sidebar Spacer for Desktop */}
                <div className="d-none d-md-block flex-shrink-0 transition-all" style={{ width: isCollapsed ? "80px" : "240px", transition: "width 0.3s" }}></div>

                {/* Main Content Area */}
                <div className="flex-grow-1 d-flex flex-column min-vh-100 w-100" style={{ maxWidth: "100%" }}>
                    <DashboardNavbar onToggleSidebar={handleToggleSidebar} />

                    <main className="p-4 flex-grow-1 overflow-auto">
                        <Container fluid>
                            {children}
                        </Container>
                    </main>
                </div>
            </div>
        </div>
    );
}
