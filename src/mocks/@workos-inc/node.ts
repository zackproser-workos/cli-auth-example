export const mockWorkOS = {
    userManagement: {
      authenticateWithCode: jest.fn(),
      getAuthorizationUrl: jest.fn()
    }
  };
  
  export class WorkOS {
    constructor() {
      return mockWorkOS;
    }
  }