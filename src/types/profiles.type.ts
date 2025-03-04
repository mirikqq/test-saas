export interface Profile {
    mark?: string;
    type: 'local' | 'ldap';
    login: string;
    password?: string;
    parsedMarks?: Array<{ text: string }>
}
