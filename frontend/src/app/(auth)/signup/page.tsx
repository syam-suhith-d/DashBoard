"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaRocket, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const schema = yup.object().shape({
    name: yup.string().required("Full name is required").min(2, "Name too short"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

type SignupFormInputs = yup.InferType<typeof schema>;

export default function SignupPage() {
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: SignupFormInputs) => {
        try {
            setError("");
            await signup(data.name, data.email, data.password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to create account");
            }
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col md={7} lg={5} xl={4}>
                    <div className="glass-card p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: 64, height: 64 }}>
                                <FaRocket size={32} />
                            </div>
                            <h2 className="fw-bold mb-1">Get Started</h2>
                            <p className="text-muted">Create your free account now</p>
                        </div>

                        {error && <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4 text-small">{error}</Alert>}

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label className="small fw-semibold text-muted">Full Name</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0">
                                        <FaUser />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="John Doe"
                                        {...register("name")}
                                        isInvalid={!!errors.name}
                                        className="border-start-0 ps-0 shadow-none"
                                        style={{ borderLeft: 'none' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0">
                                        <FaEnvelope />
                                    </span>
                                    <Form.Control
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                        isInvalid={!!errors.email}
                                        className="border-start-0 ps-0 shadow-none"
                                        style={{ borderLeft: 'none' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0">
                                        <FaLock />
                                    </span>
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        isInvalid={!!errors.password}
                                        className="border-start-0 ps-0 shadow-none"
                                        style={{ borderLeft: 'none' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="confirmPassword">
                                <Form.Label className="small fw-semibold text-muted">Confirm Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text border-end-0">
                                        <FaLock />
                                    </span>
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        isInvalid={!!errors.confirmPassword}
                                        className="border-start-0 ps-0 shadow-none"
                                        style={{ borderLeft: 'none' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Create Account"}
                            </Button>

                            <div className="text-center">
                                <span className="text-muted small">Already have an account? </span>
                                <Link href="/login" className="text-decoration-none fw-bold">Sign In</Link>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
