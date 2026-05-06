import { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, message, Tag, Button, Popconfirm } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, ScissorOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;

interface Appointment {
  _id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
}

export const DashboardPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

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
        </div>
    );
};
