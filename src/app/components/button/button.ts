import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type ColorVariante = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
@Component({
    selector: 'app-button',
    host: {
        '[attr.color]': 'color()',
    },
    imports: [],
    template: ` <ng-content></ng-content> `,
    styles: `
        :host {
            display: inline-block;
            --background-color: var(--primary);
            --background-color-hover: var(--primary-dark);
            --text-color: var(--text-on-primary);
            --border: none;
            padding: 0.5rem 1rem;
            font-size: var(--font-size-base);
            font-family: var(--font-family);
            border-radius: 0.375rem; /* Rounded corners */
            cursor: pointer;
            text-align: center;
            &:hover {
                background-color: var(--background-color-hover);
            }
            &[color='secondary'] {
                --background-color: var(--secondary);
                --background-color-hover: var(--secondary-dark);
                --text-color: var(--text-on-secondary);
            }
            &[color='success'] {
                --background-color: var(--success);
                --background-color-hover: var(--primary-dark);
                --text-color: var(--text-on-primary);
            }
            &[color='danger'] {
                --background-color: var(--danger);
                --background-color-hover: var(--danger-dark);
                --text-color: var(--text-on-primary);
            }
            &[color='warning'] {
                --background-color: var(--warning);
                --background-color-hover: var(--warning-dark);
                --text-color: var(--text-on-primary);
            }
            &[color='info'] {
                --background-color: var(--info);
                --background-color-hover: var(--info-dark);
                --text-color: var(--text-on-primary);
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    color = input<ColorVariante>('primary');
    disabled = input<boolean>(false);
}
