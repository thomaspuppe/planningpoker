/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var CACHE_NAME = 'planningpoker';
var CACHE_VERSION = '1.0';

self.oninstall = function(event) {

  var urls = [

    '/',
    '/index.html',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/shake.js',
    '/styles.css',
    '/favicon.ico',
    '/manifest.json'

  ];

  urls = urls.map(function(url) {
    return new Request(url);
  });

  event.waitUntil(
    caches
      .open(CACHE_NAME + '-v' + CACHE_VERSION)
      .then(function(cache) {
        return cache.addAll(urls);
      })
  );

};

self.onactivate = function(event) {

  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {

    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName.indexOf(CACHE_NAME) == -1) {
          return;
        }

        if (cacheName != currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });

};

self.onfetch = function(event) {

  var request = event.request;
  var url = new URL(request.url);

  event.respondWith(

    // Check the cache for a hit.
    caches.match(request).then(function(response) {

      // If we have a response return it.
      if (response)
        return response;

      // And worst case we fire out a not found.
      return new Response('Sorry, not found');
    })
  );
};
