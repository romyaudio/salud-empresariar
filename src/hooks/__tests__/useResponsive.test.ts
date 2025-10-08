import { renderHook } from '@testing-library/react'
import { useResponsive } from '../useResponsive'

// Mock window.innerWidth and window.innerHeight
const mockWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

describe('useResponsive', () => {
  beforeEach(() => {
    // Reset to default mobile size
    mockWindowSize(375, 667)
  })

  it('detects mobile breakpoint correctly', () => {
    mockWindowSize(375, 667) // iPhone size
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.breakpoint).toBe('xs')
  })

  it('detects tablet breakpoint correctly', () => {
    mockWindowSize(768, 1024) // iPad size
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(true)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.breakpoint).toBe('md')
  })

  it('detects desktop breakpoint correctly', () => {
    mockWindowSize(1440, 900) // Desktop size
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(true)
    expect(result.current.breakpoint).toBe('xl')
  })

  it('detects orientation correctly', () => {
    // Portrait
    mockWindowSize(375, 667)
    const { result: portraitResult } = renderHook(() => useResponsive())
    expect(portraitResult.current.isPortrait).toBe(true)
    expect(portraitResult.current.isLandscape).toBe(false)

    // Landscape
    mockWindowSize(667, 375)
    const { result: landscapeResult } = renderHook(() => useResponsive())
    expect(landscapeResult.current.isPortrait).toBe(false)
    expect(landscapeResult.current.isLandscape).toBe(true)
  })

  it('provides utility functions', () => {
    mockWindowSize(1024, 768)
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isBreakpoint('lg')).toBe(true)
    expect(result.current.isBreakpointUp('md')).toBe(true)
    expect(result.current.isBreakpointDown('xl')).toBe(true)
    expect(result.current.isBreakpointBetween('md', 'xl')).toBe(true)
  })
})