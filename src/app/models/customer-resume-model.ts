export type CustomerResume = {
  customer: {
    _id: string;
    name: string;
    phone: string;
    codeId: string;
    email: string;
    status: number;
    userCreator: string;
    lead: string;
    userAssigned: {
      _id: string;
      lastName: string;
      email: string;
      office: string;
    }[];
    answered: boolean;
    dateAsnwered: string;
    lastLog: string;
    dateAssigned: string;
    situation: any[];
    situationDate: string;
    code: string;
    step: {
      _id: string;
      title: string;
    }[];
    __v: number;
    calls: {
      _id: number;
      count: number;
    }[];
    calls_logs?: CustomerResumeCallLog[];
    historicalAssignations: CustomerResumeHistorialAssignation[];
    historicalDisables: CustomerResumeHistorialDisabled[];
  }[];
  situations: CustomerResumeSituation[];
  payments: CustomerResumePaymenType[];
};

export type CustomerResumeCallLog = {
  _id: string;
  user: string;
  date: string;
  callSId: string;
  phone: string;
  customer: string;
  event: "incoming" | "outgoing";
  duration: number | null;
  events?: CustomerResumeCallLogEvent[];
  transcription?: string;
  analysis?: CallLogAnalysis | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CallLogAnalysis = {
  cliente_interesado: boolean;
  envio_documentacion: boolean;
  informacion_situacion_migratoria: boolean;
  solicito_llamada: boolean;
};

export type CustomerResumeCallLogEvent = {
  event: string;
  duration: number;
  callerId: string;
  date: string;
  _id: string;
};

export type CustomerResumeHistorialAssignation = {
  _id: string;
  customer: string
  lead: string
  campaign: string
  officeCampaign: string
  date: string
  createdAt: string
  updatedAt: string
  user: UserSingleType[]
}

export type UserSingleType = {
  _id: string
  name: string
  email: string
  lastName: string
}

export type CustomerResumeHistorialDisabled = {
  user: UserSingleType[]
  _id: string
  customer: string
  motive: string
  date: string
  createdAt: string
  updatedAt: string
}

export type CustomerResumeSituation  = {
  _id: string;
  name: string;
  user: {_id: string, name: string, lastName: string};
  customer: string;
  note: string;
  image: string;
  confirmed: boolean;
  situation: {
    _id: string;
    description: string;
    title: string;
  };
  date: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type CustomerResumePaymenType = {
  _id: string;
  name: string;
  valueExpected: number;
  valuePayed: number;
  dateExpected: string;
  dateDone: string | null;
  customer: string;
  user: string;
  fees: {
    _id: string;
    name: string;
    image: string;
    value: number;
    trusted: boolean;
    confirmed: boolean;
    received: boolean;
    date: string;
    paymentRequest: string;
    customer: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}