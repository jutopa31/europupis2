export const citiesMock = [
  {
    id: 'c1',
    name: 'Paris',
    from: 'CDG',
    arrivalDateTime: '2025-05-12T10:30:00+02:00',
    transfers: [
      { id: 't1', info: 'CDG → RER B → Gare du Nord' }
    ],
    notes: [
      { id: 'n1', body: 'Reservar franja horaria del Louvre' }
    ],
    accommodations: [
      {
        id: 'a1',
        name: 'Le Montclair Hostel',
        address: '62 Rue Rambuteau, 75003 Paris',
        checkInDate: '2025-05-12',
        checkOutDate: '2025-05-15',
        price: 45.00,
        bookingUrl: 'https://booking.com/le-montclair',
        notes: 'Cerca del metro Rambuteau, desayuno incluido'
      }
    ]
  },
  {
    id: 'c2',
    name: 'Brussels',
    from: 'Paris',
    arrivalDateTime: '2025-05-15T14:05:00+02:00',
    transfers: [
      { id: 't2', info: 'Thalys/Eurostar París → Bruselas Midi' }
    ],
    notes: [],
    accommodations: [
      {
        id: 'a2',
        name: 'Sleep Well Youth Hostel',
        address: 'Rue du Damier 23, 1000 Brussels',
        checkInDate: '2025-05-15',
        checkOutDate: '2025-05-18',
        price: 38.50,
        bookingUrl: 'https://sleep-well.be',
        notes: 'Metro Rogier, cocina compartida'
      }
    ]
  },
  {
    id: 'c3',
    name: 'Amsterdam',
    from: 'Brussels',
    arrivalDateTime: '2025-05-18T12:20:00+02:00',
    transfers: [
      { id: 't3', info: 'IC/Thalys Bruselas → Amsterdam Centraal' }
    ],
    notes: [
      { id: 'n2', body: 'Entradas Casa de Ana Frank' }
    ],
    accommodations: [
      {
        id: 'a3',
        name: 'ClinkNOORD Hostel',
        address: 'Badhuiskade 3, 1031 KV Amsterdam',
        checkInDate: '2025-05-18',
        checkOutDate: '2025-05-22',
        price: 52.00,
        bookingUrl: 'https://clinkhostels.com/amsterdam',
        notes: 'Ferry gratuito al centro, muy moderno'
      }
    ]
  }
];

