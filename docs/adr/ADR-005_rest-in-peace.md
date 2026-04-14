# ADR-005: REST In Peace

| Field   | Value       |
| ------- | ----------- |
| Status  | Accepted    |
| Created | 2026-04-14  |

## Context

We are building a microservice architecture. Services need a way to communicate with each other.

Available options:

- HTTP APIs (REST)
- gRPC
- Message brokers (Kafka, RabbitMQ, etc.)
- HTTP-based abstractions (GraphQL)

Message brokers provide the highest reliability and decoupling, but introduce significant infrastructure and operational complexity. At the current stage, such reliability is not required.

gRPC is an attractive middle ground: more structured and efficient than plain HTTP. We may adopt it in the future, at least experimentally, but for now it adds unnecessary complexity and slows down prototyping.

GraphQL is particularly appealing for microservices, as it naturally composes data across service boundaries. However, it introduces its own architectural constraints and ecosystem overhead, which is currently premature.

Plain HTTP, specifically REST-style APIs, remains the most pragmatic baseline. This decision is not final and may evolve in the future, both for internal service communication and external APIs. At this stage, REST provides a reasonable minimum that allows us to move quickly.

## Decision

Use HTTP APIs following REST conventions for communication between services.

## Consequences

### Drawbacks

- lower reliability compared to message brokers
- less efficient than gRPC
- limited native support for flexible resource projections
- composition of data across services requires additional coordination

### Benefits

- simple and widely understood
- mature ecosystem and tooling
- well-established conventions for structuring APIs
- enables fast prototyping and iteration
