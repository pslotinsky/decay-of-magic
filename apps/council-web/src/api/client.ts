import ky, { HTTPError, type KyInstance } from 'ky';

import type { ErrorEnvelope, SuccessEnvelope } from '@dod/api-contract';

import { ApiError } from './error';

const instance: KyInstance = ky.create({
  credentials: 'include',
  hooks: {
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('unauthorized'));
        }
      },
    ],
    beforeError: [
      ({ error }) => {
        if (error instanceof HTTPError && isErrorEnvelope(error.data)) {
          return new ApiError(error.response.status, error.data);
        }
        return error;
      },
    ],
  },
});

function isErrorEnvelope(data: unknown): data is ErrorEnvelope {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'object'
  );
}

export const client = {
  get: <TData>(url: string): Promise<SuccessEnvelope<TData>> =>
    instance.get(url).json<SuccessEnvelope<TData>>(),

  post: <TData>(url: string, body?: unknown): Promise<SuccessEnvelope<TData>> =>
    instance
      .post(url, body === undefined ? undefined : { json: body })
      .json<SuccessEnvelope<TData>>(),

  patch: <TData>(
    url: string,
    body?: unknown,
  ): Promise<SuccessEnvelope<TData>> =>
    instance
      .patch(url, body === undefined ? undefined : { json: body })
      .json<SuccessEnvelope<TData>>(),

  upload: <TData>(
    url: string,
    form: FormData,
  ): Promise<SuccessEnvelope<TData>> =>
    instance.post(url, { body: form }).json<SuccessEnvelope<TData>>(),

  postEmpty: (url: string, body?: unknown): Promise<void> =>
    instance
      .post(url, body === undefined ? undefined : { json: body })
      .then(() => undefined),

  delete: (url: string): Promise<void> =>
    instance.delete(url).then(() => undefined),
};
