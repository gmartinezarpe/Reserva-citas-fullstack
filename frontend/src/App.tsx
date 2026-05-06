// frontend/src/App.tsx
import { App as AntApp, ConfigProvider, Layout, Button } from 'antd';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import theme from 'antd/es/theme';
import './index.css';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../components/DashboardPAge';

const { Header, Content, Footer } = Layout;

// El "Molde" que envuelve todas tus páginas
const AppLayout = () => {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">Citas<span>App</span></div>
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/dashboard">
             <Button>Ver Citas (Dashboard)</Button>
          </Link>
          <Button type="primary">Iniciar Sesión</Button>
        </div>
      </Header>

      {/* ¡AQUÍ ESTÁ LA MAGIA DE LAS RUTAS ORDENADAS! */}
      <Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/perfil" element={<ProfilePage />} />  <-- ¡Así de fácil agregarás más! */}
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center', padding: '32px' }}>
        CitasApp ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

// Configuración general
function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#3b82f6' } }}>
      <AntApp>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
