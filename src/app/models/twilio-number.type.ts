export type TwilioNumberPurpose = 'voice_agent' | 'user';

export type TwilioNumberType = {
    _id: string;
    name: string;
    user: {
        _id: string;
        name: string;
        email: string;
        office: string;
    } | null;
    PNID: string;
    number: string;
    friendlyNumber: string;
    /** From API; legacy rows may omit (treat as user line). */
    numberPurpose?: TwilioNumberPurpose;
    createdAt: string;
    updatedAt: string;
};