import React from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
`;

const HelpButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.cardBg};
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
  }
`;

const TooltipContent = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: ${props => props.theme.cardBg};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  width: 280px;
  z-index: 1000;
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    right: 14px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${props => props.theme.cardBg};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const HelpTooltip = ({ activeTab, tabs }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const helpContent = tabs.find(t => t.key === activeTab)?.help || '';

  return (
    <TooltipContainer>
      <HelpButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Help information"
      >
        ?
      </HelpButton>
      {isOpen && (
        <TooltipContent>
          <h3>{tabs.find(t => t.key === activeTab)?.label}</h3>
          <p>{helpContent}</p>
          <CloseButton
            onClick={() => setIsOpen(false)}
            aria-label="Close help tooltip"
          >
            ×
          </CloseButton>
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};

export default HelpTooltip;
