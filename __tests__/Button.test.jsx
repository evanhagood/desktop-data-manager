import { render, fireEvent, screen } from '@testing-library/react';
import Button from '../src/components/Button';
import ColumnSelector from '../src/components/ColumnSelector';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

//button tests
test('renders button text correctly', () => {
  render(<Button text="Click Me" />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});

test('calls onClick handler when clicked', () => {
  const handleClick = vi.fn();
  render(<Button text="Click Me" onClick={handleClick} />);
  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// ColumnSelector Tests
describe('ColumnSelector Component', () => {
  const labels = ['Column 1', 'Column 2'];
  const columns = { 'Column 1': { show: true }, 'Column 2': { show: false } };
  const setShow = vi.fn();
  const toggleColumn = vi.fn();

  test('renders correctly when show is true', () => {
    render(
      <ColumnSelector
        show={true}
        labels={labels}
        columns={columns}
        setShow={setShow}
        toggleColumn={toggleColumn}
      />
    );
    expect(screen.getByText('Column Selector')).toBeInTheDocument();
    labels.forEach(label => {
      expect(screen.getByText((content) => content.startsWith(label))).toBeInTheDocument();
    });
  });

  test('calls setShow(false) when clicking outside the component', () => {
    const { container } = render(
      <ColumnSelector
        show={true}
        labels={labels}
        columns={columns}
        setShow={setShow}
        toggleColumn={toggleColumn}
      />
    );

    fireEvent.mouseDown(container);
    expect(setShow).toHaveBeenCalledWith(false);
  });

  test('calls toggleColumn when checkbox is clicked', () => {
    render(
      <ColumnSelector
        show={true}
        labels={labels}
        columns={columns}
        setShow={setShow}
        toggleColumn={toggleColumn}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(toggleColumn).toHaveBeenCalledWith('Column 1');
  });
});
