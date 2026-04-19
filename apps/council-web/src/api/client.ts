import ky from 'ky';

export const client = ky.create({
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
