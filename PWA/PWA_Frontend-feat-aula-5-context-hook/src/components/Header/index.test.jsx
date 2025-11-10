import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersProvider from '../../contexts/UsersProvider/UsersProvider';
import Header from '.';

describe('Header', () => {
  let countUsers;

  beforeEach(() => {
    countUsers = 0;
  });

  const renderComponent = (component) => {
    return (
      <UsersProvider>
        {component}
      </UsersProvider>
    );
  };

  it('renders correctly the component', () => {
    render(renderComponent(<Header />));
    
    // Test that the component renders without crashing
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Test that it shows "Users: 0" when countUsers is 0
    expect(screen.getByText('Users: 0')).toBeInTheDocument();
  });

  describe('when count of user is more than 0', () => {
    beforeEach(() => {
      countUsers = 1;
    });

    it('renders the component correctly', () => {
      render(renderComponent(<Header />));

      expect(screen.getByText(`Users: ${countUsers}`)).toBeInTheDocument();
    });
  });
});