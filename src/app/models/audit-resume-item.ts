export type Call = {
	status: number;
	checked: boolean;
	n: number;
};

export type CallLogId = {
	user: string;
	checked: boolean;
};

export type CallLog = {
	_id: CallLogId;
	n: number;
};