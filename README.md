# `@surfskip/surferhead`

A powerful web-proxy forked from [`testcafe-hammerhead@31.4.11`](https://github.com/DevExpress/testcafe-hammerhead/tree/ba7819884c7b228ee9c50c047ad348e91970cfe3) used in SurfSkip.

Some modifications will be applied on this fork to provide full control over the proxy.

## Core Concepts

Surferhead is a URL-rewriting proxy. This means that it rewrites all properties of the appropriate JavaScript objects that contain a URL value (`Location`, `HTMLLinkElement.href`, etc). You can see it if you open a proxied page, invoke the browser's DevTools and inspect any element.

In addition, the proxied web page does not know that it is opened under a proxy. The proxy intercepts access attempts to all URL-containing properties and provides the original values.

## Features

* HTTP/HTTPS requests
* WebSockets, EventSource
* file upload
* request events (`onRequest`, `onResponse`)
* bypassing requests

## Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) to learn how to contribute to the project.
