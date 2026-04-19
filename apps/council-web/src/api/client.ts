import ky, { type KyInstance } from 'ky';

import type { SuccessEnvelope } from '@dod/api-contract';

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
  },
});

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
