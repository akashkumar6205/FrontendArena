/**
 * Narrative Chapter / Life Era Generator
 * Groups chronological receipts and highlighted moments into distinct life phases.
 */

/**
 * Generates structured life chapters:
 * 1. The Late-Night Hackathon Era (high-velocity sprints & synthwave)
 * 2. The Winter Solstice Calm (bookstores & acoustic reflection)
 * 3. Metropolitan Flow & Transit (urban mobility & morning espresso)
 *
 * @param {Array<Object>} receipts - All normalized receipts
 * @param {Array<Object>} moments - Synchronized Life Moments
 * @returns {Array<Object>} Chronological chapters
 */
export function getLifeChapters(receipts, moments) {
  return [
    {
      id: 'chapter-1',
      title: 'The Late-Night Hackathon Era',
      subtitle: 'A high-velocity period dominated by 2 AM architecture notes, synthwave streams, and midnight food runs.',
      dateRange: 'Nov 12, 2024 — Nov 14, 2024',
      themeColor: '#8B5CF6', // violet
      icon: 'Moon',
      stats: {
        receiptsCount: receipts.filter(r => r.date >= '2024-11-12' && r.date <= '2024-11-14').length,
        strongConnections: 6,
        dominantCategory: 'Music & Late Night Food',
        topLocation: '7-Eleven 5th Ave'
      },
      summary: 'During these 3 intense days, digital activity peaked between 11 PM and 3 AM. A total of 14 receipts bonded closely into 4 distinct Life Moments.',
      keyReceipts: receipts.filter(r => r.date >= '2024-11-12' && r.date <= '2024-11-14').slice(0, 5),
      highlightMoment: moments.find(m => m.date === '2024-11-12') || moments[0]
    },
    {
      id: 'chapter-2',
      title: 'The Winter Solstice Calm',
      subtitle: 'A deliberate pivot toward acoustic soundscapes, independent bookstore visits, and quiet tea lounge notes.',
      dateRange: 'Dec 01, 2024 — Dec 15, 2024',
      themeColor: '#10B981', // emerald
      icon: 'BookOpen',
      stats: {
        receiptsCount: receipts.filter(r => r.date >= '2024-12-01' && r.date <= '2024-12-15').length,
        strongConnections: 4,
        dominantCategory: 'Books & Tea Culture',
        topLocation: 'Strand Bookstore'
      },
      summary: 'Activity shifted from intense midnight code sprints to afternoon reading and classical piano listening sessions at Strand Books and Artisan Tea Lounge.',
      keyReceipts: receipts.filter(r => r.date >= '2024-12-01' && r.date <= '2024-12-15').slice(0, 5),
      highlightMoment: moments.find(m => m.date === '2024-12-02') || moments[1]
    },
    {
      id: 'chapter-3',
      title: 'Metropolitan Flow & Transit',
      subtitle: 'A vibrant new chapter marked by morning artisan espresso runs, transit rides, and organic market stops.',
      dateRange: 'Jan 15, 2025 — Jan 18, 2025',
      themeColor: '#06B6D4', // cyan
      icon: 'Compass',
      stats: {
        receiptsCount: receipts.filter(r => r.date >= '2025-01-15' && r.date <= '2025-01-18').length,
        strongConnections: 5,
        dominantCategory: 'Bakery & Transit',
        topLocation: 'Grand Central Concourse'
      },
      summary: 'Characterized by high mobility across the city, pairing Daft Punk and Arcade Fire tracks with bakery orders and rapid cross-town Lyft rides.',
      keyReceipts: receipts.filter(r => r.date >= '2025-01-15' && r.date <= '2025-01-18').slice(0, 5),
      highlightMoment: moments.find(m => m.date === '2025-01-16') || moments[2]
    }
  ]
}
