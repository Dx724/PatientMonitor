import React from 'react';
import { render } from '@testing-library/react';
import PatientMonitor from './PatientMonitor';

test('renders learn react link', () => {
  const { getByText } = render(<PatientMonitor />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
