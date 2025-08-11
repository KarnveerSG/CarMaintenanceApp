import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

export const Sidebar = styled.nav`
  width: 250px;
  background: ${props => props.theme.sidebarBg};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 32px 0;
  box-shadow: 2px 0 12px ${props => props.theme.shadow};
`;

export const Logo = styled.img`
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 10px;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px ${props => props.theme.shadow});
`;

export const AppTitle = styled.h2`
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  letter-spacing: 0.5px;
`;

export const TabButton = styled.button`
  background: ${props => props.isActive ? props.theme.primary : 'none'};
  color: ${props => props.isActive ? props.theme.cardBg : props.theme.text};
  border: none;
  border-radius: 0 24px 24px 0;
  padding: 16px 24px;
  margin: 8px 0;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${props => props.isActive ? props.theme.primary : props.theme.hover};
  }
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

export const ContentBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
`;

export const Card = styled.div`
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px ${props => props.theme.shadow};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const Button = styled.button`
  background: ${props => props.variant === 'primary' ? props.theme.primary : props.theme.secondary};
  color: ${props => props.theme.text};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.theme.shadow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}33;
  }
`;

export const Select = styled.select`
  background: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  margin-bottom: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}33;
  }
`;
