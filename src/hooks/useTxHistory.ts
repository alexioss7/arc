import { useState, useCallback } from 'react'

export interface TxRecord {
  hash: string
  items: string // comma-joined product names
  total: string // human-readable USDC
  timestamp: number
}

const KEY = 'arc-store-tx-history'

function load(): TxRecord[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as TxRecord[]) : []
  } catch {
    return []
  }
}

function save(records: TxRecord[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(records))
  } catch {
    // storage full — silently ignore
  }
}

export function useTxHistory() {
  const [records, setRecords] = useState<TxRecord[]>(load)

  const addRecord = useCallback((record: TxRecord) => {
    setRecords(prev => {
      const next = [record, ...prev].slice(0, 50) // keep last 50
      save(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setRecords([])
    localStorage.removeItem(KEY)
  }, [])

  return { records, addRecord, clearHistory }
}
