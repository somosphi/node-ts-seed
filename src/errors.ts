export class CodedError extends Error {
  constructor(
    public code: string,
  ) {
    super(code);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export class ResourceNotFoundError extends CodedError {
  constructor() {
    super('RESOURCE_NOT_FOUND');
  }
}
