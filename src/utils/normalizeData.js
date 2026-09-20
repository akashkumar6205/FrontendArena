import spotifyData from '../data/spotify.json'
import transactionsData from '../data/transactions.json'
import expensesData from '../data/expenses.json'
import locationsData from '../data/locations.json'
import notesData from '../data/notes.json'

/**
 * Normalizes all raw datasets into a unified receipt schema
 */
export function getNormalizedReceipts() {
  const receipts = []

  // 1. Spotify Music Listening History
  spotifyData.forEach((item) => {
    const dt = new Date(item.timestamp)
    receipts.push({
      id: item.id,
      type: 'music',
      title: item.track_name,
      description: `${item.artist} — ${item.album}`,
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      datetime: dt.toISOString(),
      timestampMs: dt.getTime(),
      location: null,
      amount: null,
      currency: null,
      category: 'Music',
      metadata: {
        artist: item.artist,
        album: item.album,
        platform: item.platform,
        device: item.device,
        duration_ms: item.duration_ms
      },
      icon: 'Music',
      tags: ['audio', 'listening', item.artist.toLowerCase()]
    })
  })

  // 2. Financial Transactions
  transactionsData.forEach((item) => {
    const dt = new Date(item.timestamp)
    receipts.push({
      id: item.id,
      type: 'purchase',
      title: item.merchant,
      description: `${item.category} purchase via ${item.payment_method}`,
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      datetime: dt.toISOString(),
      timestampMs: dt.getTime(),
      location: item.location ? {
        name: item.location.name,
        address: item.location.address,
        city: item.location.city
      } : null,
      amount: item.amount,
      currency: item.currency || 'USD',
      category: item.category,
      metadata: {
        payment_method: item.payment_method,
        merchant: item.merchant,
        category: item.category
      },
      icon: 'CreditCard',
      tags: ['spending', item.category.toLowerCase()]
    })
  })

  // 3. Household & Business Expenses
  expensesData.forEach((item) => {
    const dt = new Date(item.timestamp)
    receipts.push({
      id: item.id,
      type: 'expense',
      title: item.title,
      description: `${item.frequency} ${item.category} to ${item.vendor}`,
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      datetime: dt.toISOString(),
      timestampMs: dt.getTime(),
      location: null,
      amount: item.amount,
      currency: item.currency || 'USD',
      category: item.category,
      metadata: {
        recurring: item.recurring,
        frequency: item.frequency,
        vendor: item.vendor
      },
      icon: 'Receipt',
      tags: ['expense', item.category.toLowerCase(), item.frequency.toLowerCase()]
    })
  })

  // 4. GPS Check-ins & Places
  locationsData.forEach((item) => {
    const dt = new Date(item.timestamp)
    receipts.push({
      id: item.id,
      type: 'place',
      title: item.name,
      description: `${item.category} at ${item.address}`,
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      datetime: dt.toISOString(),
      timestampMs: dt.getTime(),
      location: {
        name: item.name,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude
      },
      amount: null,
      currency: null,
      category: 'Places',
      metadata: {
        category: item.category,
        accuracy_meters: item.accuracy_meters
      },
      icon: 'MapPin',
      tags: ['location', item.category.toLowerCase()]
    })
  })

  // 5. Personal Digital Notes
  notesData.forEach((item) => {
    const dt = new Date(item.timestamp)
    receipts.push({
      id: item.id,
      type: 'note',
      title: item.title,
      description: item.content,
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      datetime: dt.toISOString(),
      timestampMs: dt.getTime(),
      location: null,
      amount: null,
      currency: null,
      category: 'Notes',
      metadata: {
        tags: item.tags,
        mood: item.mood
      },
      icon: 'FileText',
      tags: item.tags.map(t => t.toLowerCase())
    })
  })

  // Sort by date/time ascending
  return receipts.sort((a, b) => a.timestampMs - b.timestampMs)
}

export function getCategories(receipts) {
  const set = new Set(receipts.map(r => r.type))
  return ['all', ...Array.from(set)]
}
