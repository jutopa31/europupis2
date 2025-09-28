export const citiesMock = [
  {
    id: 'c1',
    name: 'Paris',
    from: 'CDG',
    arrivalDateTime: '2025-05-12T10:30:00+02:00',
    transfers: ['CDG → RER B → Gare du Nord'],
    notes: ['Reservar franja horaria del Louvre']
  },
  {
    id: 'c2',
    name: 'Brussels',
    from: 'Paris',
    arrivalDateTime: '2025-05-15T14:05:00+02:00',
    transfers: ['Thalys/Eurostar París → Bruselas Midi'],
    notes: []
  },
  {
    id: 'c3',
    name: 'Amsterdam',
    from: 'Brussels',
    arrivalDateTime: '2025-05-18T12:20:00+02:00',
    transfers: ['IC/Thalys Bruselas → Amsterdam Centraal'],
    notes: ['Entradas Casa de Ana Frank']
  }
];

