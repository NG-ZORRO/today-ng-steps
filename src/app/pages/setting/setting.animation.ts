import { trigger, style, animate, transition, query } from '@angular/animations';


export const pageSwitchTransition = trigger('pageSwitchTransition', [
  transition(':enter',
    query('div.full-screen', [
      style({ transform: 'translate3d(0, 15%, 0)', opacity: 0 }),
      animate('200ms 200ms')
    ])
  ),
  transition(':leave',
    query('div.full-screen', [
      animate('200ms', style({ transform: 'translate3d(0, 15%, 0)', opacity: 0 }))
    ])
  )
]);
