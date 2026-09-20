/**
 * Connection Discovery & Scoring Engine
 */

/**
 * Calculates relationship score between two receipt items
 */
export function scoreConnection(r1, r2) {
  if (r1.id === r2.id) return null

  let score = 0
  const reasons = []

  const diffMs = Math.abs(r1.timestampMs - r2.timestampMs)
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  const isSameDate = r1.date === r2.date

  // 1. Time proximity rules
  if (diffMinutes <= 15) {
    score += 4
    reasons.push(`Happened within ${diffMinutes === 0 ? 'the same minute' : `${diffMinutes} minutes`} of each other`)
  } else if (diffMinutes <= 30) {
    score += 2
    reasons.push(`Happened within ${diffMinutes} minutes of each other`)
  } else if (diffMinutes <= 120) {
    score += 1
    reasons.push(`Occurred within ${Math.round(diffMinutes / 60)} hour(s) of each other`)
  }

  // 2. Same date rule
  if (isSameDate) {
    score += 2
    if (!reasons.some(r => r.includes('minutes'))) {
      reasons.push(`Occurred on the exact same date (${r1.date})`)
    }
  }

  // 3. Location proximity / match
  if (r1.location && r2.location) {
    if (r1.location.name && r2.location.name && (r1.location.name.includes(r2.location.name) || r2.location.name.includes(r1.location.name))) {
      score += 4
      reasons.push(`Happened at the exact same location (${r1.location.name})`)
    } else if (r1.location.city && r1.location.city === r2.location.city) {
      score += 1
      reasons.push(`Both took place in ${r1.location.city}`)
    }
  }

  // 4. Keyword & Tag matching
  const tags1 = r1.tags || []
  const tags2 = r2.tags || []
  const matchingTags = tags1.filter(t => tags2.includes(t))

  if (matchingTags.length > 0) {
    score += 3
    reasons.push(`Shared thematic context: ${matchingTags.join(', ')}`)
  }

  // 5. Cross-category synergy (e.g. Music + Food, Music + Note, Place + Purchase)
  const typePair = [r1.type, r2.type].sort().join('+')
  if (typePair === 'music+purchase' || typePair === 'music+note' || typePair === 'place+purchase') {
    score += 2
    reasons.push(`Cross-activity relationship between ${r1.type} and ${r2.type}`)
  }

  if (score < 2) return null

  let strength = 'Same-day relationship'
  let color = '#9CA3AF' // gray
  if (score >= 6) {
    strength = 'Strong connection'
    color = '#10B981' // emerald
  } else if (score >= 4) {
    strength = 'Possible connection'
    color = '#F59E0B' // amber
  }

  return {
    source: r1.id,
    target: r2.id,
    score,
    strength,
    color,
    reasons,
    diffMinutes,
    r1,
    r2
  }
}

/**
 * Generates all unique connections across receipts
 */
export function getAllConnections(receipts) {
  const connections = []
  const seenPairs = new Set()

  for (let i = 0; i < receipts.length; i++) {
    for (let j = i + 1; j < receipts.length; j++) {
      const conn = scoreConnection(receipts[i], receipts[j])
      if (conn && conn.score >= 2) {
        const pairKey = [receipts[i].id, receipts[j].id].sort().join('---')
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey)
          connections.push(conn)
        }
      }
    }
  }

  return connections.sort((a, b) => b.score - a.score)
}

/**
 * Groups connected receipts into cohesive "Life Moments"
 */
export function getLifeMoments(receipts, connections) {
  // Find clusters where 3+ receipts occur within a short window on the same date
  const dateGroups = {}
  receipts.forEach(r => {
    if (!dateGroups[r.date]) dateGroups[r.date] = []
    dateGroups[r.date].push(r)
  })

  const moments = []

  Object.entries(dateGroups).forEach(([date, items]) => {
    if (items.length < 2) return

    // Group items close in time
    let currentCluster = [items[0]]

    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1]
      const curr = items[i]
      const diffMins = Math.abs(curr.timestampMs - prev.timestampMs) / (1000 * 60)

      if (diffMins <= 90) { // within 90 mins window
        currentCluster.push(curr)
      } else {
        if (currentCluster.length >= 2) {
          moments.push(buildMomentObject(currentCluster, date, connections))
        }
        currentCluster = [curr]
      }
    }

    if (currentCluster.length >= 2) {
      moments.push(buildMomentObject(currentCluster, date, connections))
    }
  })

  return moments.sort((a, b) => b.receipts.length - a.receipts.length)
}

function buildMomentObject(cluster, date, allConnections) {
  const first = cluster[0]
  const last = cluster[cluster.length - 1]
  const totalDurationMins = Math.round((last.timestampMs - first.timestampMs) / (1000 * 60))

  // Determine moment title based on contents & time
  const hour = new Date(first.datetime).getHours()
  let timeOfDay = 'Late Night'
  if (hour >= 5 && hour < 12) timeOfDay = 'Morning'
  else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon'
  else if (hour >= 17 && hour < 22) timeOfDay = 'Evening'

  const hasMusic = cluster.some(c => c.type === 'music')
  const hasNote = cluster.some(c => c.type === 'note')
  const hasFood = cluster.some(c => c.type === 'purchase' && c.category.includes('Food'))
  const hasCoffee = cluster.some(c => c.type === 'purchase' && c.category.includes('Coffee'))

  let title = `${timeOfDay} Moment`
  if (timeOfDay === 'Late Night' && hasNote) title = 'The Midnight Architecture Epiphany'
  else if (timeOfDay === 'Late Night' && hasFood) title = 'Midnight Fuel & Chill Tracks'
  else if (hasCoffee && hasMusic) title = 'Morning Coffee & Soundtrack'
  else if (hasNote && hasMusic) title = 'Creative Flow Session'
  else if (timeOfDay === 'Evening') title = 'Evening Metropolitan Wind-Down'

  // Extract connection notes for this cluster
  const clusterIds = new Set(cluster.map(c => c.id))
  const relevantConns = allConnections.filter(conn => clusterIds.has(conn.source) && clusterIds.has(conn.target))

  return {
    id: `moment-${date}-${first.id}`,
    title,
    date,
    startTime: first.time,
    endTime: last.time,
    durationMins: totalDurationMins === 0 ? 15 : totalDurationMins,
    receipts: cluster,
    connections: relevantConns,
    summary: `${cluster.length} connected receipts unfolded over ${totalDurationMins === 0 ? 'a few' : totalDurationMins} minutes.`,
    revelation: buildRevelationText(cluster, timeOfDay)
  }
}

function buildRevelationText(cluster, timeOfDay) {
  const music = cluster.find(c => c.type === 'music')
  const note = cluster.find(c => c.type === 'note')
  const purchase = cluster.find(c => c.type === 'purchase')

  if (music && purchase && note) {
    return `During this ${timeOfDay.toLowerCase()} session, listening to "${music.title}" accompanied a ${purchase.title} purchase while capturing thought: "${note.title}".`
  }
  if (music && purchase) {
    return `Playing "${music.title}" coincided within minutes of visiting/purchasing from ${purchase.title}.`
  }
  if (purchase && note) {
    return `A transaction at ${purchase.title} sparked immediate notes on project ideas.`
  }
  return `Multiple digital touchpoints lined up synchronously during this ${timeOfDay.toLowerCase()} window.`
}
