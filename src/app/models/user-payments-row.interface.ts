export type UserPaymentRowI = {
    _id: string;
    name: string;
    image: string;
    value: number;
    trusted: boolean;
    confirmed: boolean;
    received: boolean;
    date: string;
    paymentRequest: string;
    customer: {
        _id: string;
        name: string;
        userAssigned: string;
    }[];
    __v: number;
}