import {
  trigger,
  style,
  animate,
  transition,
  query,
  group
} from '@angular/animations';


export const detailTransition = trigger('detailTransition', [
  transition(
    ':enter',
    group([
      query('div.mask', [ style({ opacity: 0 }), animate('400ms linear') ]),
      query('div.container', [
        style({ transform: 'translate3d(100%, 0, 0)' }),
        animate('400ms ease')
      ])
    ])
  ),
  transition(
    ':leave',
    group([
      query('div.mask', animate('400ms linear', style({ opacity: 0 }))),
      query(
        'div.container',
        animate('400ms ease', style({ transform: 'translate3d(100%, 0, 0)' }))
      )
    ])
  )
]);
