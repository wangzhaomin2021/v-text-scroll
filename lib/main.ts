import { Directive, DirectiveBinding, App } from 'vue';
import type { TextScrollOption, TextScrollPulginOption, ElState } from '../index';

function handleTextScroll(el: any, binding: DirectiveBinding<TextScrollOption>) {
    const { value } = binding;
    const {
        direction = 'x',
        speed,
        duration,
        iterations = Infinity,
        easing = 'linear',
        setScrollHeightBegin,
        setScrollHeightEnd,
        setScrollWidthBegin,
        setScrollWidthEnd,
    } = value;
    if (speed === undefined && duration === undefined) {
        console.warn('v-text-scroll: speed or duration is required')
        return;
    }
    el.state.animationObject?.cancel();
    switch (direction) {
        case 'y':
            const { clientHeight } = el;
            const { clientHeight: parentElementClientHeight } = el.parentElement as HTMLElement;
            if (clientHeight > parentElementClientHeight) {
                el.state.animationObject = el.animate([
                    {
                        transform: `translateY(${setScrollHeightBegin ? setScrollHeightBegin(clientHeight, parentElementClientHeight) : parentElementClientHeight
                            }px)`
                    },
                    {
                        transform: `translateY(${setScrollHeightEnd ? setScrollHeightEnd(clientHeight, parentElementClientHeight) : -clientHeight
                            }px)`
                    }
                ], {
                    duration: speed ? (clientHeight / speed) * 1000 : duration,
                    iterations,
                    easing,
                })


            }
            break;
        case 'x':
            const { clientWidth } = el;
            const { clientWidth: parentElementClientWidth } = el.parentElement as HTMLElement;
            if (clientWidth > parentElementClientWidth) {
                el.state.animationObject = el.animate([
                    {
                        transform: `translateX(${setScrollWidthBegin ? setScrollWidthBegin(clientWidth, parentElementClientWidth) : parentElementClientWidth
                            }px)`
                    },
                    {
                        transform: `translateX(${setScrollWidthEnd ? setScrollWidthEnd(clientWidth, parentElementClientWidth) : -clientWidth
                            }px)`
                    }
                ], {
                    duration: speed ? ((clientWidth - parentElementClientWidth) / speed) * 1000 : duration,
                    iterations,
                    easing,
                })
            }
            break;
    }
    el.state.animationObject.play();
}

function run(el: any, binding: DirectiveBinding<TextScrollOption>) {
    el.state.observer?.disconnect();

    el.state.observer = new ResizeObserver(() => {
        handleTextScroll(el, binding);
    })

    el.state.observer.observe(el);
    el.state.observer.observe(el.parentElement as HTMLElement);
}

export const textScrollDirective: Directive = {
    mounted(el, binding) {
        el.state = {
            observer: null,
            animationObject: null,
        } as ElState;
        run(el, binding);
    },

    updated(el, binding) {
        run(el, binding);
    },

    beforeUnmount(el) {
        el.state.observer?.disconnect();
        el.state.animationObject?.cancel();
    },
}

export default {
    install(app: App, option?: TextScrollPulginOption) {
        const name = option?.name || 'text-scroll';
        app.directive(name, textScrollDirective);
    }
}