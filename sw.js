/* Service worker del reloj.

   Estrategia: cache-first. Para una app que no consume datos de
   ningún servidor, la red solo aporta latencia y puntos de falla.
   Si el archivo está en caché, se sirve de ahí y punto.

   Al cambiar index.html hay que subir el número de VERSION, si no
   los equipos que ya lo instalaron seguirán viendo la versión vieja. */

const VERSION = 'reloj-v7';

const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* Instalación: descargar todo el shell de una vez. */
self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())   // no esperar a que cierren las pestañas viejas
  );
});

/* Activación: borrar las cachés de versiones anteriores. */
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(claves => Promise.all(
        claves.filter(k => k !== VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())  // tomar control de las pestañas abiertas
  );
});

/* Intercepción: caché primero, red como respaldo. */
self.addEventListener('fetch', evento => {
  const peticion = evento.request;

  // Solo GET del mismo origen: no tiene sentido cachear otra cosa.
  if (peticion.method !== 'GET') return;
  if (new URL(peticion.url).origin !== self.location.origin) return;

  evento.respondWith(
    caches.match(peticion).then(guardado => {
      if (guardado) return guardado;

      return fetch(peticion).then(respuesta => {
        // Guardar lo nuevo para la próxima, si la respuesta sirve.
        if (respuesta.ok){
          const copia = respuesta.clone();   // el body solo se puede leer una vez
          caches.open(VERSION).then(cache => cache.put(peticion, copia));
        }
        return respuesta;
      }).catch(() => caches.match('./index.html'));   // sin red y sin caché
    })
  );
});
