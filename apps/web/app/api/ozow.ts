import crypto from 'crypto';

interface OzowPaymentPayload {
    siteCode: string;
    countryCode: string;
    currencyCode: string;
    amount: number;
    transactionReference: string;
    bankReference: string;
    successUrl: string;
    cancelUrl: string;
    errorUrl: string;
    isTest: boolean;
}

export function generateOzowHash(data: OzowPaymentPayload, privateKey: string): string {
    // Concatenate values according to Ozow's specific string-building rules 
    // (usually lowercase and ordered string concatenation ending with the private key)
    const rawString = `${data.siteCode}${data.countryCode}${data.currencyCode}${data.amount}${data.transactionReference}${data.bankReference}${data.successUrl}${data.cancelUrl}${data.errorUrl}${data.isTest}${privateKey}`;
    
    return crypto.createHash('sha512').update(rawString).digest('hex').toLowerCase();
}
