# API adapter

`client.ts` owns authenticated HTTPS requests, cancellation/timeouts, card search, private page writes, protected images, ownership and PNG/CSV downloads. DTOs come from `src/shared`. HTTP status is preserved for conflict recovery. Never add provider keys or runtime sibling imports.
