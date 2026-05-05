import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CitizenRecords } from './pages/CitizenRecords';
import { AgentManagement } from './pages/AgentManagement';
import { AgentDashboard } from './pages/AgentDashboard';
import { Reports } from './pages/Reports';
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<Layout />}>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/citizens" element={<CitizenRecords />} />
              <Route path="/admin/agents" element={<AgentManagement />} />
              <Route path="/admin/reports" element={<Reports />} />

              {/* Agent Routes */}
              <Route path="/agent" element={<AgentDashboard />} />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>);

}