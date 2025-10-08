import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingOverlay, Skeleton, CardSkeleton, ListSkeleton } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-6', 'h-6', 'border-2', 'border-blue-500')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    let spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4', 'h-4', 'border-2')

    rerender(<LoadingSpinner size="lg" />)
    spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-8', 'h-8', 'border-3')

    rerender(<LoadingSpinner size="xl" />)
    spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-12', 'h-12', 'border-4')
  })

  it('applies correct color classes', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />)
    let spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('border-blue-500')

    rerender(<LoadingSpinner color="secondary" />)
    spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('border-gray-500')

    rerender(<LoadingSpinner color="white" />)
    spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('border-white')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-spinner')
  })

  it('has correct accessibility attributes', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Cargando')
  })
})

describe('LoadingOverlay', () => {
  it('renders when visible', () => {
    render(<LoadingOverlay isVisible={true} />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    render(<LoadingOverlay isVisible={false} />)
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  it('displays custom message', () => {
    render(<LoadingOverlay isVisible={true} message="Processing..." />)
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LoadingOverlay isVisible={true} className="custom-overlay" />)
    const overlay = screen.getByText('Cargando...').closest('.fixed')
    expect(overlay).toHaveClass('custom-overlay')
  })
})

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('bg-gray-200', 'rounded', 'animate-pulse')
  })

  it('applies custom dimensions', () => {
    render(<Skeleton width="200px" height="50px" />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '50px'
    })
  })

  it('applies numeric dimensions', () => {
    render(<Skeleton width={100} height={20} />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveStyle({
      width: '100px',
      height: '20px'
    })
  })

  it('can disable animation', () => {
    render(<Skeleton animate={false} />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).not.toHaveClass('animate-pulse')
  })

  it('applies custom className', () => {
    render(<Skeleton className="custom-skeleton" />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('custom-skeleton')
  })

  it('has correct accessibility attributes', () => {
    render(<Skeleton />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveAttribute('aria-label', 'Cargando contenido')
  })
})

describe('CardSkeleton', () => {
  it('renders card skeleton structure', () => {
    const { container } = render(<CardSkeleton />)
    
    // Should have multiple skeleton elements
    const skeletons = screen.getAllByRole('status')
    expect(skeletons.length).toBeGreaterThan(1)
    
    // Should have animate-pulse class on container
    const animateContainer = container.querySelector('.animate-pulse')
    expect(animateContainer).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CardSkeleton className="custom-card" />)
    const card = container.querySelector('.bg-white')
    expect(card).toHaveClass('custom-card')
  })
})

describe('ListSkeleton', () => {
  it('renders default number of items', () => {
    const { container } = render(<ListSkeleton />)
    
    // Should render 3 card skeletons by default
    const cards = container.querySelectorAll('.bg-white.rounded-lg')
    expect(cards).toHaveLength(3)
  })

  it('renders custom number of items', () => {
    const { container } = render(<ListSkeleton items={5} />)
    
    const cards = container.querySelectorAll('.bg-white.rounded-lg')
    expect(cards).toHaveLength(5)
  })

  it('applies custom className', () => {
    const { container } = render(<ListSkeleton className="custom-list" />)
    const list = container.firstChild
    expect(list).toHaveClass('custom-list')
  })
})