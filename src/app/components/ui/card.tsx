import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={classNames("card", className)}>{children}</div>
);

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="card-header">{children}</div>
);

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="card-title">{children}</h2>
);

export const CardContent = ({ children, className }: CardProps) => (
  <div className={classNames("card-content", className)}>{children}</div>
);

export const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="card-description">{children}</p>
);

const SoftUICard = styled.div`
  background: #e0e0e0;
  border-radius: 12px;
  box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
  padding: 20px;
  margin: 20px 0;
`;

const SoftUICardHeader = styled.div`
  margin-bottom: 20px;
`;

const SoftUICardTitle = styled.h2`
  font-size: 24px;
  color: #333;
`;

const SoftUICardContent = styled.div`
  font-size: 16px;
  color: #666;
`;

export { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent };