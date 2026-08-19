export type ProjectLotStatusLogType = {
  _id: string
  projectId: string
  lotId: string
  number: string
  fromStatus: string
  toStatus: string
  action: string
  actorUserId: string
  actorLevel: string
  note: string
  evidenceFiles: string[]
  createdAt?: string
}
