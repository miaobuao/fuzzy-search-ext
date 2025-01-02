import Dexie, { type EntityTable } from 'dexie'

export interface RecentlyClosedHistoryTable {
	id: number
	url: string
	title?: string
	ctime: number
}

export const db = new Dexie('history') as Dexie & {
	RecentlyClosedHistory: EntityTable<RecentlyClosedHistoryTable, 'id'>
}

db.version(1).stores({
	RecentlyClosedHistory: '++id, url, title, ctime',
})
