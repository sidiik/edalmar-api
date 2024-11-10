const authErrors = {
  invalidCredentials: 'Invalid email or password, please try again',
  account_temporarily_disabled: 'Your account has been temporarily disabled.',
  accout_suspended: 'Your account has been suspended, please contact support',
  otp_already_sent: 'An OTP has already been sent to your whatsapp number.',
  otp_invalid: 'Invalid OTP, please try again',
};

const agencyErrors = {
  agencyExists: 'Agency already exists',
  agencyNotFound:
    'This agency is either disabled or does not exist, Please contact support',
  agencyDisabled: 'Agency is disabled',
  agentAlreadyLinked: 'Agent is already linked to this agency',
  agentNotFound: 'Agent not found',
  maxAgentsReached: 'Maximum number of agents reached',
  agentInsufficientPermissions:
    'You do not have the required permissions to perform this operation',
};

const userErrors = {
  userExists: 'User already exists',
  userNotFound: 'User not found',
  emailExists: 'Email is already taken, please use another email',
  cannotModifyOwnStatus: 'You cannot modify your own status',
};

const travelerErrors = {
  travelerExists: 'Traveler already exists',
  travelerNotFound: 'Traveler not found',
  newTravelerContentExists:
    'Another traveler with the same phone number, email or whatsapp number already exists',
  bookingNotFound: 'Booking not found',
  ticketNotFound: 'Ticket not found',
  ticketNotInRecycleBin: 'Ticket is not in the recycle bin',
  invalidOperation: 'Invalid operation',
  ticketInRecycleBin: 'Ticket is already in the recycle bin',
};

export { authErrors, agencyErrors, userErrors, travelerErrors };
