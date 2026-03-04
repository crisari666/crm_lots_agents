export type CallUserResume = {
  status: number;
  checked: boolean;
  n: number;
};

export type Customer = {
  _id: string;
  name: string;
  lastName: string;
};

export type AuditUserResume = {
  _id: string;
  calls: CallUserResume[];
  callNotes: CallNoteUserAudit[]; // Assuming callNotes can be of any type, adjust if you have a specific type
  customer: Customer[];
};

export type CallNoteUserAudit = {
  _id: {
    checked: boolean;
  };
  n: number;
};


