export type TwilioNumberType = {
    _id: string;
    name: string;
    user: {
        _id: string;
        name: string;
        email: string;
        office: string;
    };
    PNID: string;
    number: string;
    friendlyNumber: string;
    createdAt: string;
    updatedAt: string;
};