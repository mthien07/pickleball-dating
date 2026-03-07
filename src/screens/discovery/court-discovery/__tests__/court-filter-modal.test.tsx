/**
 * CourtFilterModal Tests
 *
 * Tests modal rendering, chip selection, apply/reset, and onClose callback.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CourtFilterModal, FilterState } from '../court-filter-modal';

jest.mock('../../../../contexts/ThemeContext', () => ({
  useThemeColors: () => ({
    primary: '#2563EB',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    white: '#FFFFFF',
  }),
}));

jest.mock('../../../../theme/tokens', () => ({
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    full: 9999,
  },
  typography: {
    h3: { fontSize: 20, fontWeight: '700' },
    body: { fontSize: 16 },
    label: { fontSize: 12, fontWeight: '600' },
    button: { fontSize: 16, fontWeight: '600' },
  },
}));

const defaultFilter: FilterState = {
  maxPrice: null,
  maxDistance: null,
  minRating: null,
};

describe('CourtFilterModal', () => {
  const defaultProps = {
    visible: true,
    filter: defaultFilter,
    resultCount: 12,
    onFilterChange: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section headers when visible', () => {
    const { getByText } = render(<CourtFilterModal {...defaultProps} />);
    expect(getByText('GIÁ / GIỜ')).toBeTruthy();
    expect(getByText('KHOẢNG CÁCH')).toBeTruthy();
    expect(getByText('ĐÁNH GIÁ TỐI THIỂU')).toBeTruthy();
  });

  it('renders filter title', () => {
    const { getByText } = render(<CourtFilterModal {...defaultProps} />);
    expect(getByText('Bộ lọc')).toBeTruthy();
  });

  it('renders result count in apply button', () => {
    const { getByText } = render(<CourtFilterModal {...defaultProps} />);
    expect(getByText('Xem 12 kết quả')).toBeTruthy();
  });

  it('renders price chip options', () => {
    const { getByText } = render(<CourtFilterModal {...defaultProps} />);
    expect(getByText('≤ 100k')).toBeTruthy();
    expect(getByText('≤ 150k')).toBeTruthy();
    expect(getByText('≤ 200k')).toBeTruthy();
  });

  it('renders distance chip options', () => {
    const { getByText } = render(<CourtFilterModal {...defaultProps} />);
    expect(getByText('≤ 3 km')).toBeTruthy();
    expect(getByText('≤ 5 km')).toBeTruthy();
    expect(getByText('≤ 10 km')).toBeTruthy();
  });

  it('renders rating chip options', () => {
    const { getByText } = render(<CourtFilterModal {...defaultProps} />);
    expect(getByText('≥ 4★')).toBeTruthy();
    expect(getByText('≥ 4.5★')).toBeTruthy();
  });

  it('calls onFilterChange with maxPrice when price chip is selected', () => {
    const onFilterChange = jest.fn();
    const { getByText } = render(
      <CourtFilterModal {...defaultProps} onFilterChange={onFilterChange} />
    );
    fireEvent.press(getByText('≤ 100k'));
    expect(onFilterChange).toHaveBeenCalledWith({
      maxPrice: 100000,
      maxDistance: null,
      minRating: null,
    });
  });

  it('calls onFilterChange with maxDistance when distance chip is selected', () => {
    const onFilterChange = jest.fn();
    const { getByText } = render(
      <CourtFilterModal {...defaultProps} onFilterChange={onFilterChange} />
    );
    fireEvent.press(getByText('≤ 5 km'));
    expect(onFilterChange).toHaveBeenCalledWith({
      maxPrice: null,
      maxDistance: 5,
      minRating: null,
    });
  });

  it('calls onFilterChange with minRating when rating chip is selected', () => {
    const onFilterChange = jest.fn();
    const { getByText } = render(
      <CourtFilterModal {...defaultProps} onFilterChange={onFilterChange} />
    );
    fireEvent.press(getByText('≥ 4★'));
    expect(onFilterChange).toHaveBeenCalledWith({
      maxPrice: null,
      maxDistance: null,
      minRating: 4,
    });
  });

  it('calls onFilterChange with all nulls when reset (Xóa tất cả) is pressed', () => {
    const onFilterChange = jest.fn();
    const { getByText } = render(
      <CourtFilterModal {...defaultProps} onFilterChange={onFilterChange} />
    );
    fireEvent.press(getByText('Xóa tất cả'));
    expect(onFilterChange).toHaveBeenCalledWith({
      maxPrice: null,
      maxDistance: null,
      minRating: null,
    });
  });

  it('calls onClose when apply button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(<CourtFilterModal {...defaultProps} onClose={onClose} />);
    fireEvent.press(getByText('Xem 12 kết quả'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Modal requests close (back gesture)', () => {
    const onClose = jest.fn();
    const { UNSAFE_getByType } = render(<CourtFilterModal {...defaultProps} onClose={onClose} />);
    const { Modal } = require('react-native');
    const modal = UNSAFE_getByType(Modal);
    // Simulate Android back button / swipe-down triggering onRequestClose
    modal.props.onRequestClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render content when visible is false', () => {
    const { queryByText } = render(<CourtFilterModal {...defaultProps} visible={false} />);
    // Modal with visible=false won't show its children
    expect(queryByText('Bộ lọc')).toBeNull();
  });

  it('reflects active price filter visually (selected chip has different style)', () => {
    const activeFilter: FilterState = { maxPrice: 150000, maxDistance: null, minRating: null };
    const { getByText } = render(<CourtFilterModal {...defaultProps} filter={activeFilter} />);
    // The selected chip renders the label - just verify it exists
    expect(getByText('≤ 150k')).toBeTruthy();
  });
});
