import { Form, Input, DatePicker, Button, Card, message, Modal, QRCode } from 'antd';
import axios from 'axios';
import { useState } from 'react';


export const AppointmentForm = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [appointmentData, setAppointmentData] = useState<any>(null);

    const onFinish = async (values: any) => {
        try {
            const response = await axios.post('http://localhost:4000/api/appointments', {
                clientName: values.clientName,
                service: values.service,
                date: values.dateTime.format('YYYY-MM-DD'),
                time: values.dateTime.format('HH:mm'),
                email: values.email.toLowerCase()
            });

            message.success('¡Tu cita fue agendada con éxito!');
            setAppointmentData(response.data);
            setIsModalVisible(true);
            console.log('Respuesta del servidor:', response.data);

        } catch (error) {
            message.error('Hubo un error al guardar tu cita. Verifica si el servidor está encendido.');
            console.error('Error:', error);
        }
    };

    // Preparamos la información que tendrá el QR por dentro
    const qrText = appointmentData
        ? `Cita Confirmada\nCliente: ${appointmentData.clientName}\nServicio: ${appointmentData.service}\nFecha: ${appointmentData.date.substring(0, 10)}\nHora: ${appointmentData.time}`
        : 'Generando información...';

    return (
        <Card title="Agendar Nueva Cita" bordered={false} style={{ maxWidth: 400, margin: '0 auto' }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Nombre Completo" name="clientName" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
                    <Input placeholder="Ej. Juan Pérez" />
                </Form.Item>
                <Form.Item label="Servicio requerido" name="service" rules={[{ required: true, message: 'Elige un servicio' }]}>
                    <Input placeholder="Ej. Corte de cabello" />
                </Form.Item>
                <Form.Item label="Fecha y Hora" name="dateTime" rules={[{ required: true, message: 'Selecciona fecha y hora' }]}>
                    <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
                </Form.Item>
                <Form.Item label="Correo electrónico" name="email" rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico' }]}>
                    <Input placeholder="Ej. [EMAIL_ADDRESS]" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Agendar Cita
                </Button>
            </Form>
            <Modal
                title="Código QR de tu Cita"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Cerrar
                    </Button>
                ]}
            >
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    {/* El QR ahora contiene todo el texto formateado */}
                    <QRCode value={qrText} size={256} />
                </div>
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Escanea este código para ver los detalles de tu cita.
                </p>
            </Modal>
        </Card>
    );
};
