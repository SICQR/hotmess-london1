import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/Badge';
import { Flame } from 'lucide-react';

describe('Badge Component', () => {
  it('renders with label', () => {
    render(<Badge label="Test" variant="hot" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    const { container } = render(<Badge label="No Icon" />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders with icon', () => {
    const { container } = render(<Badge label="With Icon" icon={Flame} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies hot variant styling', () => {
    const { container } = render(<Badge label="Hot" variant="hot" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('neon-border');
    expect(badge).toHaveClass('bg-hot/20');
    expect(badge).toHaveClass('text-hot');
  });

  it('applies default variant styling', () => {
    const { container } = render(<Badge label="Default" variant="default" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-gray-800');
    expect(badge).toHaveClass('text-gray-300');
  });

  it('applies locked variant styling', () => {
    const { container } = render(<Badge label="Locked" variant="locked" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-gray-900');
    expect(badge).toHaveClass('opacity-50');
  });

  it('applies small size styling', () => {
    const { container } = render(<Badge label="Small" size="sm" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('px-2');
    expect(badge).toHaveClass('text-xs');
  });

  it('applies medium size styling (default)', () => {
    const { container } = render(<Badge label="Medium" size="md" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('px-3');
    expect(badge).toHaveClass('text-sm');
  });

  it('applies large size styling', () => {
    const { container } = render(<Badge label="Large" size="lg" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('px-4');
    expect(badge).toHaveClass('text-base');
  });

  it('applies pulse animation when pulse is true', () => {
    const { container } = render(<Badge label="Pulse" pulse={true} />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('beacon-flare');
  });

  it('does not apply pulse animation by default', () => {
    const { container } = render(<Badge label="No Pulse" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).not.toHaveClass('beacon-flare');
  });

  it('renders with all props combined', () => {
    const { container } = render(
      <Badge label="Full Badge" icon={Flame} variant="hot" size="lg" pulse={true} />
    );
    const badge = container.firstChild as HTMLElement;
    
    expect(screen.getByText('Full Badge')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(badge).toHaveClass('neon-border');
    expect(badge).toHaveClass('px-4');
    expect(badge).toHaveClass('beacon-flare');
  });

  it('transforms label to uppercase', () => {
    const { container } = render(<Badge label="test" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('uppercase');
  });
});
