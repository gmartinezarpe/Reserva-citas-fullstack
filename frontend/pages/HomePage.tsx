// frontend/src/pages/HomePage.tsx
import { Row, Col, Card, Typography, Button } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { AppointmentForm } from '../components/Appointmentform';

const { Paragraph } = Typography;

export const HomePage = () => {
    return (
        <div className="app-content">
            <div className="hero-section">
                <h1 className="hero-title">Reserva tu cita <span className="highlight">al instante</span></h1>
                <p className="hero-subtitle">Descubre la forma más rápida y elegante de gestionar tus citas.</p>
                <Button type="primary" size="large" icon={<CalendarOutlined />}> Agendar Ahora </Button>
            </div>

            {/* Aquí inyectamos tu formulario ordenadamente */}
            <div style={{ padding: '40px 0' }}>
                <AppointmentForm />
            </div>

            <Row gutter={[32, 32]} style={{ marginTop: '40px' }}>
                {/* ... Aquí van las 3 cards que estaban antes ... */}
            </Row>
        </div>
    );
};
