import { animate, query, style, transition, trigger } from '@angular/animations';

export const setupTransition = trigger('setupTransition', [
  transition(':enter', [
    query('div.wrapper', [
      style({ opacity: 0, transform: 'translate3d(0, 10px, 0)' }),
      animate('400ms 200ms')
    ])
  ]),
  transition(':leave', [
    animate('200ms', style({ opacity: 0 }))
  ])
]);
