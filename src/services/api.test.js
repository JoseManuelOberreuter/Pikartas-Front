import { describe, it, expect } from 'vitest';
import { formatApiError } from './api';

describe('formatApiError', () => {
  it('marks verification required responses and keeps message', () => {
    const apiError = {
      response: {
        status: 403,
        data: {
          error: 'Debes verificar tu cuenta antes de acceder a este recurso.',
          code: 'VERIFICATION_REQUIRED'
        }
      }
    };

    const result = formatApiError(apiError);

    expect(result).toMatchObject({
      error: 'Debes verificar tu cuenta antes de acceder a este recurso.',
      code: 'VERIFICATION_REQUIRED',
      verificationRequired: true,
      status: 403,
      statusCode: 403
    });
  });

  it('falls back to generic error message when response data is missing', () => {
    const err = new Error('Network down');
    const result = formatApiError(err);

    expect(result).toMatchObject({
      error: 'Network down',
      message: 'Network down',
      status: undefined,
      statusCode: undefined
    });
  });
});

