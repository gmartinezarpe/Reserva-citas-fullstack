import { Form, Input, DatePicker, Button, Card, message } from 'antd';
// 1. Importamos Axios
import axios from 'axios';

export const AppointmentForm = () => {
    // 2. Agregamos 'async' porque la petición a internet toma tiempo
    const onFinish = async (values: any) => {
        try {
            // 3. Le decimos a Axios que envíe los datos al Backend
            const response = await axios.post('http://localhost:4000/api/appointments', {
                clientName: values.clientName,
                service: values.service,
                // Formateamos la fecha a texto para enviarla segura
                date: values.dateTime.format('YYYY-MM-DD'),
                time: values.dateTime.format('HH:mm')
            });

            // 4. Si todo salió bien, le avisamos al usuario
            message.success('¡Tu cita fue agendada con éxito!');
            console.log('Respuesta del servidor:', response.data);

        } catch (error) {
            // Si el backend falla o está apagado
            message.error('Hubo un error al guardar tu cita. Verifica si el servidor está encendido.');
            console.error('Error:', error);
        }
    };

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
                <Button type="primary" htmlType="submit" block>
                    Agendar Cita
                </Button>
            </Form>
        </Card>
    );
};
