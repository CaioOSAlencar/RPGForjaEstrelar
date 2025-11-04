import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Campaigns from './pages/Campaigns';
import JoinCampaign from './pages/JoinCampaign';
import JoinByLink from './pages/JoinByLink';
import CampaignDetails from './pages/CampaignDetails';
import AcceptInvite from './pages/AcceptInvite';
import Scenes from './pages/Scenes';
import SceneEditor from './pages/SceneEditor';
import SceneViewer from './pages/SceneViewer';
import GameTable from './pages/GameTable';
import EditCampaign from './pages/EditCampaign';
import { authService } from './services/auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !authService.isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns" 
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/join" 
            element={
              <ProtectedRoute>
                <JoinCampaign />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/join/:roomCode" 
            element={
              <ProtectedRoute>
                <JoinByLink />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/:id" 
            element={
              <ProtectedRoute>
                <CampaignDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/:id/edit" 
            element={
              <ProtectedRoute>
                <EditCampaign />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invite/:token" 
            element={
              <ProtectedRoute>
                <AcceptInvite />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/:campaignId/scenes" 
            element={
              <ProtectedRoute>
                <Scenes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scenes/:sceneId/edit" 
            element={
              <ProtectedRoute>
                <SceneEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scenes/:sceneId/view" 
            element={
              <ProtectedRoute>
                <SceneViewer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/:id/play" 
            element={
              <ProtectedRoute>
                <GameTable />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;