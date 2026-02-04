"use client";

import React from "react";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";
import { FaUsers, FaChartLine, FaDollarSign, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="border-0 shadow-sm h-100 fs-6 overflow-hidden">
        <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
                <h6 className="text-muted fw-normal mb-1">{title}</h6>
                <h3 className="fw-bold mb-0 text-dark">{value}</h3>
            </div>
            <div className={`p-3 rounded-circle bg-${color} bg-opacity-10 text-${color}`}>
                <Icon size={24} />
            </div>
        </Card.Body>
        <div className={`bg-${color} h-1 w-100`} style={{ height: "4px" }}></div>
    </Card>
);

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <>
            <div className="mb-4">
                <h2 className="fw-bold text-dark">Dashboard Overview</h2>
                <p className="text-muted">Welcome back, <strong>{user?.name || "User"}</strong>! Here's what's happening today.</p>
            </div>

            <Row className="g-4 mb-5">
                <Col md={6} xl={3}>
                    <StatCard title="Total Users" value="12,345" icon={FaUsers} color="primary" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard title="Revenue" value="$45,678" icon={FaDollarSign} color="success" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard title="Sales" value="1,230" icon={FaShoppingCart} color="warning" />
                </Col>
                <Col md={6} xl={3}>
                    <StatCard title="Growth" value="+22.5%" icon={FaChartLine} color="info" />
                </Col>
            </Row>

            <Row>
                <Col lg={8} className="mb-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Recent Transactions</h5>
                        </Card.Header>
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr className="text-muted small text-uppercase">
                                    <th className="border-0 p-3">ID</th>
                                    <th className="border-0 p-3">User</th>
                                    <th className="border-0 p-3">Date</th>
                                    <th className="border-0 p-3">Amount</th>
                                    <th className="border-0 p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item}>
                                        <td className="p-3">#INV-00{item}</td>
                                        <td className="p-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-gray-200" style={{ width: 32, height: 32, backgroundImage: `url(https://ui-avatars.com/api/?name=User+${item})`, backgroundSize: 'cover' }}></div>
                                                <span className="fw-semibold">User {item}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">Oct 24, 2023</td>
                                        <td className="p-3 fw-bold">$120.00</td>
                                        <td className="p-3">
                                            <Badge bg={item % 2 === 0 ? "success" : "warning"} className="px-3 py-2 rounded-pill fw-normal">
                                                {item % 2 === 0 ? "Completed" : "Pending"}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm bg-primary text-white h-100" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
                        <Card.Body className="d-flex flex-column justify-content-center text-center p-4">
                            <h4 className="fw-bold mb-3">Upgrade to Pro</h4>
                            <p className="mb-4 opacity-75">Get access to advanced analytics and premium support.</p>
                            <button className="btn btn-light text-primary fw-bold py-2 rounded-pill shadow-lg">View Plans</button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
