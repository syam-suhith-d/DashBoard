import Link from "next/link";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaLayerGroup, FaShieldAlt, FaChartPie } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <Container>
          <span className="navbar-brand fw-bold fs-4 text-primary">DashApp</span>
          <div className="ms-auto">
            <Link href="/login" className="btn btn-outline-primary me-2 fw-bold px-4 rounded-pill">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary fw-bold px-4 rounded-pill">
              Sign Up
            </Link>
          </div>
        </Container>
      </nav>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col md={8} lg={6}>
              <h1 className="display-4 fw-bold mb-3 text-dark">Build Faster with <span className="text-primary">DashApp</span></h1>
              <p className="lead text-muted mb-4">
                A premium, responsive dashboard template built with Next.js and Bootstrap.
                Secure, scalable, and ready for your next project.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/signup" className="btn btn-lg btn-primary fw-bold px-5 rounded-pill shadow-lg">
                  Get Started
                </Link>
                <Link href="/login" className="btn btn-lg btn-white fw-bold px-5 rounded-pill bg-white shadow-sm text-dark border">
                  Live Demo
                </Link>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 p-4 text-center glass-card">
                <div className="mb-3 text-primary"><FaLayerGroup size={40} /></div>
                <h5 className="fw-bold">Modern Design</h5>
                <p className="text-muted small">Glassmorphism effects, clean typography, and responsive layouts.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 p-4 text-center glass-card">
                <div className="mb-3 text-success"><FaShieldAlt size={40} /></div>
                <h5 className="fw-bold">Secure Auth</h5>
                <p className="text-muted small">Built-in authentication flow with protected routes and context.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 p-4 text-center glass-card">
                <div className="mb-3 text-warning"><FaChartPie size={40} /></div>
                <h5 className="fw-bold">Data Ready</h5>
                <p className="text-muted small">Pre-built CRUD tables, charts placeholders, and profile management.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <footer className="bg-white py-4 border-top mt-auto">
        <Container className="text-center text-muted small">
          &copy; {new Date().getFullYear()} DashApp. All rights reserved.
        </Container>
      </footer>
    </div>
  );
}
