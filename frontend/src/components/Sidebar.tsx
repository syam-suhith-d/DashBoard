"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";
import { FaHome, FaUser, FaList, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
    showMobile: boolean;
    onHideMobile: () => void;
    collapsed: boolean;
}

export default function Sidebar({ showMobile, onHideMobile, collapsed }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const links = [
        { href: "/dashboard", label: "Overview", icon: FaHome },
        { href: "/dashboard/profile", label: "My Profile", icon: FaUser },
        { href: "/dashboard/entities", label: "Manage Entities", icon: FaList },
    ];

    if (!mounted) return null;

    // Use isMobile logic if needed, but here we rely on CSS classes d-md-block
    const sidebarWidth = collapsed ? "80px" : "240px";

    return (
        <>
            {/* Sidebar Container */}
            <div
                className={`d-flex flex-column flex-shrink-0 bg-dark text-white vh-100 position-fixed transition-all ${showMobile ? "d-block" : "d-none d-md-block"}`}
                style={{ width: sidebarWidth, zIndex: 1000, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
                {/* Header - Aligned with Navbar (80px height) */}
                <div className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : 'px-4'} border-bottom border-secondary`} style={{ minHeight: '80px', overflow: 'hidden' }}>
                    <Link href="/dashboard" className="text-white text-decoration-none text-nowrap">
                        {collapsed ? (
                            <span className="fs-4 fw-bold">D</span>
                        ) : (
                            <span className="fs-4 fw-bold">DashApp</span>
                        )}
                    </Link>
                </div>

                {/* Scrollable Content */}
                <div className={`d-flex flex-column ${collapsed ? 'p-2' : 'p-3'} flex-grow-1 overflow-hidden`}>
                    <Nav className="flex-column mb-auto gap-2">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Nav.Item key={link.href}>
                                    <Link
                                        href={link.href}
                                        passHref
                                        legacyBehavior={false}
                                        className={`nav-link sidebar-link d-flex align-items-center ${collapsed ? 'justify-content-center' : 'gap-3'} rounded-3 ${isActive ? "active" : ""}`}
                                        title={collapsed ? link.label : ""}
                                    >
                                        <link.icon size={20} />
                                        {!collapsed && <span className="text-nowrap">{link.label}</span>}
                                    </Link>
                                </Nav.Item>
                            );
                        })}
                    </Nav>
                    <hr className="border-secondary" />
                    <div>
                        <button
                            onClick={logout}
                            className={`btn btn-link sidebar-link w-100 text-start d-flex align-items-center ${collapsed ? 'justify-content-center' : 'gap-3'} text-danger`}
                            title={collapsed ? "Sign out" : ""}
                        >
                            <FaSignOutAlt size={20} />
                            {!collapsed && <span className="text-nowrap">Sign out</span>}
                        </button>
                    </div>
                </div>
            </div>
            {/* Overlay for mobile */}
            {showMobile && <div className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" onClick={onHideMobile} style={{ zIndex: 900 }}></div>}
        </>
    );
}
