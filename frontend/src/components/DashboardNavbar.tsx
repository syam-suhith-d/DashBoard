"use client";

import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <Button variant="link" className="text-muted p-0 border-0" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} className="text-warning" />}
        </Button>
    );
};

export default function DashboardNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const { user } = useAuth();

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm border-bottom sticky-top py-2" style={{ zIndex: 900, minHeight: '80px' }}>
            <Container fluid>
                <Button variant="link" className="text-dark p-0 me-3 border-0" onClick={onToggleSidebar}>
                    <FaBars size={24} />
                </Button>
                <Navbar.Brand href="/dashboard" className="d-md-none fw-bold">DashApp</Navbar.Brand>

                <div className="ms-auto d-flex align-items-center gap-3">
                    <ThemeToggle />
                    <span className="ms-2 fw-semibold text-muted">
                        Welcome, <span className="text-primary">{user?.name || "User"}</span>
                    </span>
                    {user?.avatar && (
                        <img
                            src={user.avatar}
                            alt="User"
                            className="rounded-circle border"
                            width={45}
                            height={45}
                        />
                    )}
                </div>
            </Container>
        </Navbar>
    );
}
