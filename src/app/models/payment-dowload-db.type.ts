export type UserPercentage = {
    user: string;
    value: number;
    percentage: number;
};

export type Collector = {
    beforeVal: number;
    user: string;
    afterVal: number;
    value: number;
    percentage: number;
};

export type Worker = {
    beforeVal: string;
    user: string;
    afterVal: number;
    value: number;
    percentage: number;
};

export type LeadWorker = {
    beforeVal: number;
    user: string;
    afterVal: number;
    value: number;
    percentage: number;
};

export type OfficeLead = {
    beforeVal: number;
    percentage: number;
    value: number;
    usersPercentage: UserPercentage[];
    afterVal: number;
    users: string[];
};

export type Subleads = {
    beforeVal: number;
    percentage: number;
    value: number;
    usersPercentage: UserPercentage[];
    afterVal: number;
    users: string[];
};

export type Partners = {
    beforeVal: number;
    percentage: number;
    value: number;
    usersPercentage: UserPercentage[];
    afterVal: number;
    users: string[];
};

export type Admin = {
    user: string;
    value: number;
    percentage: number;
};

export type PaymentDownloadedDb = {
    _id: string;
    userId: string;
    payment: string;
    campaign: string;
    collector: Collector;
    copValue: number;
    usdPrice: number;
    worker: Worker;
    leadWorker: LeadWorker;
    officeLead: OfficeLead;
    subleads: Subleads;
    partners: Partners;
    admins: Admin[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};