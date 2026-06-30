export interface RegistrationData {
    ownerName: string;
    businessName: string;
    businessType: string;
    currency: string;
    bankName: string;
    matchMethod: 'automatic' | 'manual';
}