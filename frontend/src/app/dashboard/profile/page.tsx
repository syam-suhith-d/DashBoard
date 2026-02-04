"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";

const API_URL = "http://127.0.0.1:8000/api/v1/users";

export default function ProfilePage() {
    const { user, token } = useAuth();
    const [success, setSuccess] = React.useState("");
    const [error, setError] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    // File upload ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue } = useForm();

    // Handle file selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/me/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                    // Content-Type is automatically set by browser for FormData
                },
                body: formData
            });

            if (res.ok) {
                // Force reload to update context (ideally context should expose a refresh method)
                window.location.reload();
            } else {
                setError("Failed to upload avatar");
            }
        } catch (err) {
            setError("Error uploading file");
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("email", user.email);
            // setValue("bio", user.bio); // If bio exists
        }
    }, [user, setValue]);

    const onSubmit = async (data: any) => {
        if (!token) return;
        setIsSaving(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch(`${API_URL}/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: data.name,
                    email: user?.email
                })
            });

            if (res.ok) {
                setSuccess("Profile updated successfully");
                // Ideally refresh user context here, but effectively user object is stale until reload or we add a refreshUser method
                // simplified for now
                window.location.reload();
            } else {
                setError("Failed to update profile");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="mb-4">
                <h2 className="fw-bold text-dark">My Profile</h2>
                <p className="text-muted">Manage your account settings</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col md={4} className="mb-4">
                    <Card className="border-0 shadow-sm text-center p-4">
                        <div className="mb-3 mx-auto position-relative d-inline-block" style={{ cursor: "pointer" }} onClick={handleAvatarClick}>
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=4F46E5&color=fff`}
                                alt="Profile"
                                className="rounded-circle shadow-sm"
                                width={120}
                                height={120}
                                style={{ objectFit: 'cover' }}
                            />
                            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-opacity">
                                <span className="text-white fw-bold small">{uploading ? "Uploading..." : "Change Photo"}</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="d-none"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <style jsx>{`
                            .hover-opacity-100:hover { opacity: 1 !important; transition: opacity 0.2s; }
                        `}</style>
                        <h4 className="fw-bold">{user?.name}</h4>
                        <p className="text-muted">{user?.email}</p>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-4">Account Details</h5>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="fullName">
                                        <Form.Label className="small text-muted fw-bold">Full Name</Form.Label>
                                        <Form.Control type="text" {...register("name")} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label className="small text-muted fw-bold">Email</Form.Label>
                                        <Form.Control type="email" {...register("email")} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* Bio handled if backend supports it */}
                            <div className="d-flex justify-content-end">
                                <Button variant="primary" type="submit" className="rounded-pill px-4 fw-bold" disabled={isSaving}>
                                    {isSaving ? <Spinner size="sm" animation="border" /> : "Save Changes"}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
