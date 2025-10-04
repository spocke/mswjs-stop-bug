import { http, passthrough } from 'msw';
import { HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

const run = async () => {
  const worker1 = setupWorker(...[
    http.get('/foo', async ({ request }) => HttpResponse.text('hello 1', { status: 200 }))
  ]);

  await worker1.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });

  await fetch('/foo').then(res => res.text()).then(console.log);

  worker1.stop();

  const worker2 = setupWorker(...[
    http.get('/foo', async ({ request }) => HttpResponse.text('hello 2', { status: 200 }))
  ]);

  await worker2.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });

  await fetch('/foo').then(res => res.text()).then(console.log); // This will produce a 404

  worker2.stop();
};

run().then(() => console.log('Done'));
