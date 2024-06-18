export interface TextScrollOption {
    direction: 'x' | 'y';
    speed?: number;
    duration?: number;
    iterations?: number;
    easing?: string;
    setScrollHeightBegin?: (height: number, parentHeight: number) => number;
    setScrollHeightEnd?: (height: number, parentHeight: number) => number;
    setScrollWidthBegin?: (width: number, parentWidth: number) => number;
    setScrollWidthEnd?: (width: number, parentWidth: number) => number;
}

export interface TextScrollPulginOption {
    name: string;
}

export interface ElState {
    observer: ResizeObserver | null;
    animationObject: Animation | null;
}