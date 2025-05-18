export const USER_KNOWLEDGE_COLLECTION = ({ userId }:{
    userId: string,
}) => `CUSTOMER_${userId}_KNOWLEDGE`;

export const PERSON_KNOWLEDGE_COLLECTION = ({ personId }:{
    personId: string,
}) => `PERSON_${personId}_KNOWLEDGE`;

export const PERSON_DIALOGS_COLLECTION = ({ personId }:{
    personId: string,
}) => `PERSON_${personId}_DIALOG`;