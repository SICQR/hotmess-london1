/**
 * Performance Monitoring Type Definitions
 * Defines types for Web Vitals and performance metrics
 */

/**
 * Performance metric rating
 */
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Performance metric interface
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: PerformanceRating;
  delta?: number;
  id?: string;
  entries?: PerformanceEntry[];
}

/**
 * Performance entry interface (extends browser PerformanceEntry)
 */
export interface PerformanceEntryExtended extends PerformanceEntry {
  renderTime?: number;
  loadTime?: number;
  processingStart?: number;
  hadRecentInput?: boolean;
  duration: number;
}

/**
 * Paint timing entry
 */
export interface PerformancePaintTiming extends PerformanceEntry {
  readonly entryType: 'paint';
  readonly startTime: number;
  readonly duration: 0;
}

/**
 * Largest Contentful Paint entry
 */
export interface PerformanceLCPEntry extends PerformanceEntry {
  readonly entryType: 'largest-contentful-paint';
  readonly renderTime: number;
  readonly loadTime: number;
  readonly size: number;
  readonly id: string;
  readonly url: string;
  readonly element: Element | null;
}

/**
 * First Input Delay entry
 */
export interface PerformanceFIDEntry extends PerformanceEntry {
  readonly entryType: 'first-input';
  readonly processingStart: number;
  readonly processingEnd: number;
  readonly cancelable: boolean;
}

/**
 * Layout Shift entry
 */
export interface PerformanceCLSEntry extends PerformanceEntry {
  readonly entryType: 'layout-shift';
  readonly value: number;
  readonly hadRecentInput: boolean;
  readonly sources: Array<{
    node: Node | null;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }>;
}

/**
 * Event timing entry (for INP)
 */
export interface PerformanceEventTiming extends PerformanceEntry {
  readonly entryType: 'event';
  readonly processingStart: number;
  readonly processingEnd: number;
  readonly duration: number;
  readonly cancelable: boolean;
  readonly target: Node | null;
}

/**
 * Long task entry
 */
export interface PerformanceLongTaskTiming extends PerformanceEntry {
  readonly entryType: 'longtask';
  readonly duration: number;
  readonly attribution: ReadonlyArray<TaskAttributionTiming>;
}

/**
 * Task attribution timing
 */
export interface TaskAttributionTiming extends PerformanceEntry {
  readonly containerType: string;
  readonly containerSrc: string;
  readonly containerId: string;
  readonly containerName: string;
}
