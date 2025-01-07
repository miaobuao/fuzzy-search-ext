import Dexie, { type EntityTable } from 'dexie'
import { HistoryItem } from './procedure'

export interface RecentlyClosedHistoryTable {
	id: number
	url: string
	history: HistoryItem
	ctime: number
}

export const db = new Dexie('history') as Dexie & {
	RecentlyClosedHistory: EntityTable<RecentlyClosedHistoryTable, 'id'>
}

function initDB() {
	db.version(1).stores({
		RecentlyClosedHistory: '++id, url, history, ctime',
	})
}

try {
	initDB()
} catch {
	db.delete().then(initDB)
}
