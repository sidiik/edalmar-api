const authErrors = {
  invalidCredentials: 'Invalid email or password, please try again',
  account_temporarily_disabled: 'Your account has been temporarily disabled.',
  accout_suspended: 'Your account has been suspended, please contact support',
  otp_already_sent: 'An OTP has already been sent to your whatsapp number.',
  otp_invalid: 'Invalid OTP, please try again',
};

const agencyErrors = {
  agencyExists: 'Agency already exists',
  agencyNotFound: 'Agency not found',
  agencyDisabled: 'Agency is disabled',
  agentAlreadyLinked: 'Agent is already linked to this agency',
  agentNotFound: 'Agent not found',
  maxAgentsReached: 'Maximum number of agents reached',
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
};

export { authErrors, agencyErrors, userErrors, travelerErrors };
