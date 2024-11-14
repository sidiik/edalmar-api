declare const authErrors: {
    invalidCredentials: string;
    account_temporarily_disabled: string;
    accout_suspended: string;
    otp_already_sent: string;
    otp_invalid: string;
};
declare const agencyErrors: {
    agencyExists: string;
    agencyNotFound: string;
    agencyDisabled: string;
    agentAlreadyLinked: string;
    agentNotFound: string;
    maxAgentsReached: string;
    agentInsufficientPermissions: string;
};
declare const userErrors: {
    userExists: string;
    userNotFound: string;
    emailExists: string;
    cannotModifyOwnStatus: string;
};
declare const travelerErrors: {
    travelerExists: string;
    travelerNotFound: string;
    newTravelerContentExists: string;
    bookingNotFound: string;
    ticketNotFound: string;
    ticketNotInRecycleBin: string;
    invalidOperation: string;
    ticketInRecycleBin: string;
};
export { authErrors, agencyErrors, userErrors, travelerErrors };
