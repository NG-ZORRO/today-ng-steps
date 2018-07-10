import { trigger, style, animate, transition, group, query } from '@angular/animations';


export const pageSwitchTransition = trigger('pageSwitchTransition', [
  transition(':enter',
    query('nz-layout.full-screen', [
      style({ transform: 'translate3d(0, 15%, 0)', opacity: 0 }),
      animate('200ms 200ms')
    ])
  ),
  transition(':leave',
    query('nz-layout.full-screen', [
      animate('200ms', style({ opacity: 0, transform: 'translate3d(0, 15%, 0)' }))
    ])
  )
]);
