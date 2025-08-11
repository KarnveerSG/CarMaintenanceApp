import React from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 24px;
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.danger};
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.danger}dd;
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  padding-right: 40px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SubTitle = styled.h3`
  color: ${props => props.theme.primary};
  margin-bottom: 12px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    padding: 8px 0;
    border-bottom: 1px solid ${props => props.theme.border};
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const HelpDetailPopup = ({ content, onClose }) => {
  // Prevent clicks inside the popup from closing it
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={handleContentClick}>
        <CloseButton onClick={onClose} aria-label="Close help details">×</CloseButton>
        <Title>{content.title}</Title>
        
        <Section>
          <SubTitle>Overview</SubTitle>
          <p>{content.description}</p>
        </Section>

        <Section>
          <SubTitle>How to Use</SubTitle>
          <List>
            {content.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </List>
        </Section>

        {content.tips && (
          <Section>
            <SubTitle>Tips & Tricks</SubTitle>
            <List>
              {content.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </List>
          </Section>
        )}
      </PopupContent>
    </PopupOverlay>
  );
};

export default HelpDetailPopup;
