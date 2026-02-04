"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Table, Form, Button, Badge, Modal, InputGroup, Spinner, Alert } from "react-bootstrap";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";

// Data Types
interface Task {
    id: number;
    title: string;
    status: string;
    budget: number; // Mapping this to budget for UI consistency, though backend model has it
    description?: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1/tasks";

const schema = yup.object().shape({
    title: yup.string().required("Project name is required"),
    status: yup.string().required("Status is required"),
    budget: yup.number().transform((value) => (isNaN(value) ? undefined : value)).required("Budget is required"),
    description: yup.string().optional(),
});

export default function EntitiesPage() {
    const { token, loading: authLoading } = useAuth();
    const [data, setData] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Task | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    });

    const fetchTasks = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const tasks = await res.json();
                setData(tasks);
            } else {
                setError("Failed to fetch tasks");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!authLoading && token) {
            fetchTasks();
        }
    }, [authLoading, token, fetchTasks]);

    // Filter Logic
    const filteredData = data.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreate = () => {
        setEditingItem(null);
        reset({ title: "", status: "Active", budget: 0, description: "" });
        setShowModal(true);
    };

    const handleEdit = (item: Task) => {
        setEditingItem(item);
        setValue("title", item.title);
        setValue("status", item.status);
        setValue("budget", item.budget);
        setValue("description", item.description || "");
        setShowModal(true);
    };

    const onSubmit = async (formData: any) => {
        if (!token) return;
        try {
            let res;
            const payload = {
                title: formData.title,
                status: formData.status,
                budget: formData.budget,
                description: formData.description
            };

            if (editingItem) {
                res = await fetch(`${API_URL}/${editingItem.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        status: formData.status,
                        budget: Number(formData.budget),
                        description: formData.description
                    })
                });
            }

            if (res.ok) {
                fetchTasks();
                setShowModal(false);
            } else {
                alert("Failed to save project");
            }
        } catch (err) {
            alert("Error saving project");
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setData(data.filter(d => d.id !== id));
                setDeleteId(null);
            }
        } catch (err) {
            alert("Failed to delete");
        }
    }

    if (loading && !data.length) return <div className="p-5 text-center"><Spinner animation="border" /></div>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark">Projects</h2>
                    <p className="text-muted mb-0">Manage your ongoing projects</p>
                </div>
                <Button variant="primary" onClick={handleCreate} className="d-flex align-items-center gap-2 fw-bold shadow-sm">
                    <FaPlus /> New Project
                </Button>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="g-3">
                        <Col md={8}>
                            <InputGroup>
                                <InputGroup.Text className="border-0 shadow-none"><FaSearch className="text-muted" /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search projects by name..."
                                    className="border-0 shadow-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Form.Select
                                className="border-0 shadow-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 p-3">Project Name</th>
                            <th className="border-0 p-3">Budget</th>
                            <th className="border-0 p-3">Status</th>
                            <th className="border-0 p-3 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((item) => (
                            <tr key={item.id}>
                                <td className="p-3 fw-semibold">{item.title}</td>
                                <td className="p-3">${item.budget}</td>
                                <td className="p-3">
                                    <span className={`badge rounded-pill px-3 py-2 badge-soft ${item.status === 'Active' ? 'success' :
                                            item.status === 'Pending' ? 'warning' : 'secondary'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3 text-end">
                                    <button className="btn btn-icon me-2" onClick={() => handleEdit(item)}>
                                        <FaEdit size={14} />
                                    </button>
                                    <button className="btn btn-icon btn-icon-danger" onClick={() => setDeleteId(item.id)}>
                                        <FaTrash size={14} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center p-5 text-muted">
                                    No projects found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{editingItem ? "Edit Project" : "New Project"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control {...register("title")} isInvalid={!!errors.title} />
                            <Form.Control.Feedback type="invalid">{errors.title?.message?.toString()}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Budget ($)</Form.Label>
                            <Form.Control type="number" {...register("budget")} isInvalid={!!errors.budget} />
                            <Form.Control.Feedback type="invalid">{errors.budget?.message?.toString()}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" {...register("description")} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Status</Form.Label>
                            <Form.Select {...register("status")} isInvalid={!!errors.status}>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.status?.message?.toString()}</Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" animation="border" /> : (editingItem ? "Save Changes" : "Create Project")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3 display-4"><FaTrash /></div>
                    <h5 className="fw-bold mb-3">Delete Project?</h5>
                    <p className="text-muted mb-4">Are you sure you want to delete this project? This action cannot be undone.</p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button variant="light" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
