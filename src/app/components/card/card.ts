import { Component, input } from '@angular/core';
import { ColorVariante } from '../button/button';

@Component({
    selector: 'Card',
    template: ` <ng-content></ng-content> `,
    host: {
        '[attr.card-color]': 'color()',
    },
    styles: `
        :host {
            display: block;
            padding: 1rem;
            border-radius: 0.5rem;
            background-color: var(--card-background);
            box-shadow: 0 4px 0 var(--card-shadow);
            color: var(--card-text);

            &[card-color='primary'] {
                --card-background: var(--primary);
                --card-shadow: var(--primary-dark);
                --card-text: var(--text-on-primary);
            }
            &[card-color='secondary'] {
                --card-background: var(--secondary);
                --card-shadow: var(--secondary-dark);
                --card-text: var(--text-on-secondary);
            }
            &[card-color='success'] {
                --card-background: var(--success);
                --card-shadow: var(--success-dark);
                --card-text: var(--text-on-primary);
            }
            &[card-color='danger'] {
                --card-background: var(--danger);
                --card-shadow: var(--danger-dark);
                --card-text: var(--text-on-primary);
            }
            &[card-color='warning'] {
                --card-background: var(--warning);
                --card-shadow: var(--warning-dark);
                --card-text: var(--text-on-primary);
            }
            &[card-color='info'] {
                --card-background: var(--info);
                --card-shadow: var(--info-dark);
                --card-text: var(--text-on-primary);
            }
        }
    `,
})
export class CardComponent {
    readonly color = input<ColorVariante>('primary');
}
