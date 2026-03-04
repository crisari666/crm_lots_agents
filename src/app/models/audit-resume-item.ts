export type Call = {
	status: number;
	checked: boolean;
	n: number;
};

export type User = {
	_id: string;
	name: string;
	lastName: string;
};

export type AuditResumeItem = {
	_id: string;
	calls: Call[];
	callLogs: CallLog[]
	user: User[];
};

export type CallLogId = {
	user: string;
	checked: boolean;
};

export type CallLog = {
	_id: CallLogId;
	n: number;
};