import { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, message, Tag, Button, Popconfirm, Modal, Form, Input, DatePicker } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, ScissorOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
const { Title } = Typography;
interface Appointment {
    _id: string;
    clientName: string;
    service: string;
    date: string;
    time: string;
    email: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

export const DashboardPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [form] = Form.useForm()
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/appointments');
            setAppointments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener citas:', error);
            message.error('Hubo un problema al cargar las citas');
            setLoading(false);
        }
    };

    // Nueva función para eliminar una cita
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:4000/api/appointments/${id}`);
            message.success('Cita eliminada correctamente');
            // Filtramos la lista para quitar la cita eliminada al instante
            setAppointments(currentAppointments => currentAppointments.filter(app => app._id !== id));
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            message.error('Hubo un problema al eliminar la cita');
        }
    };


    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment); // 1. Guardamos la cita entera en la memoria
        setIsEditModalOpen(true); // 2. Abrimos la ventana modal

        // 3. Rellenamos los campos del formulario con los valores que ya tiene la cita
        form.setFieldsValue({
            clientName: appointment.clientName,
            service: appointment.service,
            email: appointment.email || '',
            dateTime: dayjs(`${appointment.date.substring(0, 10)}T${appointment.time}`)
        });
    };

    // Esta función se ejecuta cuando el usuario presiona "Guardar Cambios" en el modal
    const handleUpdate = async (values: any) => {
        if (!selectedAppointment) return;
        try {
            // Enviamos los nuevos datos ingresados al servidor
            await axios.put(`http://localhost:4000/api/appointments/${selectedAppointment._id}`, {
                clientName: values.clientName,
                service: values.service,
                date: values.dateTime.format('YYYY-MM-DD'), // Formateamos la fecha elegida
                time: values.dateTime.format('HH:mm'),      // Formateamos la hora elegida
                email: values.email.toLowerCase()
            });

            message.success('¡Cita actualizada con éxito!');
            setIsEditModalOpen(false); // Cerramos el modal
            fetchAppointments(); // Recargamos la lista desde el servidor para refrescar la tabla
        } catch (error) {
            console.error('Error al actualizar la cita:', error);
            message.error('Hubo un problema al actualizar la cita');
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, []);

    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'clientName',
            key: 'clientName',
            render: (text: string) => <><UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />{text}</>,
        },
        {
            title: 'Servicio',
            dataIndex: 'service',
            key: 'service',
            render: (text: string) => <Tag color="blue" icon={<ScissorOutlined />}>{text}</Tag>,
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => <><CalendarOutlined style={{ marginRight: 8 }} />{dayjs(text).format('DD/MM/YYYY')}</>,
        },
        {
            title: 'Hora',
            dataIndex: 'time',
            key: 'time',
            render: (text: string) => <><ClockCircleOutlined style={{ marginRight: 8 }} />{text}</>,
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_: any, record: Appointment) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Botón de editar que llama a handleEdit pasándole la cita (record) */}
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#52c41a' }} />}
                        onClick={() => handleEdit(record)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="¿Estás seguro de eliminar esta cita?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger type="text" icon={<DeleteOutlined />}>
                            Eliminar
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },

    ];

    return (
        <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>Panel de Citas (Dashboard)</Title>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={appointments}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                        style={{ border: '1px solid #303030', borderRadius: 8 }}
                    />
                )}
            </Card>
            {/* Modal flotante para editar la cita */}
            <Modal
                title="Editar Cita"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)} // Si se cancela o cierra, pasamos a false
                footer={null} // Ocultamos el pie de página por defecto de Ant Design para usar nuestros propios botones
                destroyOnClose // Destruye el formulario al cerrarse para que se limpie por completo
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item
                        label="Nombre Completo"
                        name="clientName"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del cliente' }]}
                    >
                        <Input placeholder="Ej. Juan Pérez" />
                    </Form.Item>

                    <Form.Item
                        label="Servicio requerido"
                        name="service"
                        rules={[{ required: true, message: 'Por favor ingresa el servicio' }]}
                    >
                        <Input placeholder="Ej. Corte de cabello" />
                    </Form.Item>

                    <Form.Item
                        label="Fecha y Hora"
                        name="dateTime"
                        rules={[{ required: true, message: 'Selecciona fecha y hora' }]}
                    >
                        <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
                    </Form.Item>

                    <Form.Item
                        label="Correo electrónico"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo electrónico válido' }]}
                    >
                        <Input placeholder="Ej. correo@ejemplo.com" />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                        <Button onClick={() => setIsEditModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Guardar Cambios
                        </Button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
};
