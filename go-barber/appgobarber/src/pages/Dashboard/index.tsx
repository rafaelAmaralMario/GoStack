import React from 'react';
import { useAuth } from '../../hooks/auth';

import { Container, DashboardText, Logout, LogoutText } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <DashboardText>Dashboard</DashboardText>
      <Logout onPress={signOut}>
        <LogoutText>Logout</LogoutText>
      </Logout>
    </Container>
  );
};
export default Dashboard;
