# Scoreboard Update Module Specification

## Original Software requirements

The **Scoreboard Update Module** provides secure and real-time score updates for users on our platform.  
It enables user's scores to increase after completing authorized actions, and broadcasts live updates to all connected clients viewing the leaderboard.

1. We have a website with a score board, which shows the top 10 user’s scores.
2. We want live update of the score board.
3. User can do an action (which we do not need to care what the action is), completing this action will increase the user’s score.
4. Upon completion the action will dispatch an API call to the application server to update the score.
5. We want to prevent malicious users from increasing scores without authorisation.

> Let's say the action is completing a lesson on a course. An amount of points is awarded to the user for completing the lesson (just like Duolingo). And the leaderboard shows the top 10 users with the most points. Once user completes the Lesson service will reward him with a token that he can use to redeem points (where the Scoreboard Update Module will be come in to play). We use PostgreSQL as the database for the project at this moment, and the solution architect wants to use simple socket to broadcast the updates to all the connected clients.

> Since we already have the leaderboard, and it's ordered and takes only 10 users so I assume the database schema won't need to change. Even the rank column is not needed, we can calculate it on the fly.
---

## Table of Contents

1. [User stories](#user-stories)
2. [Execution Flow Diagram](#execution-flow-diagram)

---

## User stories

### Epic: Scoreboard Update Module
#### Description:
As a user of the learning platform, I want my score on the global leaderboard to automatically update in real-time when I complete a lesson, so that I can see my progress and compare it with others in an engaging and transparent way.

#### Business Value:
This module promotes user engagement, competitiveness, and retention by rewarding progress instantly while ensuring secure and authorized score updates.

### List of User Stories

| ID   | User Story | INVEST Principle | Priority | Story Points | Acceptance Criteria (AC) | Test Cases |
|------|------------|----------------|----------|--------------|-------------------------|------------|
| US1  | As a user, I want my score to increase securely when I redeem a reward token after completing a lesson, so that I get recognized for my achievements. | Independent, Valuable, Testable | High | 5 | 1. User submits reward token via `/api/v1/score/redeem`. <br>2. API validates JWT. <br>3. Reward token is validated (signature, expiry, usage). <br>4. User’s score in DB is incremented by the token points. <br>5. API responds with 200 OK and new total score. | 1. Submit valid reward token → expect 200 OK and correct new score. <br>2. Submit expired token → expect 400 error. <br>3. Submit token twice → expect 400 error (duplicate). |
| US2  | As a user, I want my updated score to appear on the leaderboard in real-time, so that I can see my ranking instantly. | Independent, Valuable, Small, Testable | High | 5 | 1. When user score changes, `SCOREBOARD_UPDATED` event is published. <br>2. All connected clients receive the updated leaderboard with new scores and ranks. | 1. Connect multiple clients → redeem token → all clients receive updated leaderboard. <br>2. Verify updated rank matches new score order. |
| US3  | As a system, I want to prevent unauthorized score updates, so that users cannot cheat or manipulate the leaderboard. | Independent, Valuable, Testable | High | 3 | 1. Only valid JWT and reward tokens are accepted. <br>2. Invalid or tampered tokens are rejected with 401/400. <br>3. Score is not incremented for invalid requests. | 1. Submit request without JWT → expect 401 Unauthorized. <br>2. Submit request with tampered token → expect 400 Bad Request. <br>3. Score remains unchanged after invalid submission. |
| US4  | As a system, I want to validate reward tokens for expiry and single-use, so that points cannot be redeemed multiple times. | Independent, Valuable, Small, Testable | Medium | 3 | 1. Reward token includes timestamp/expiry and usage status. <br>2. Token is rejected if expired or already redeemed. <br>3. Score is incremented only once per token. | 1. Submit expired token → expect 400 error. <br>2. Submit already redeemed token → expect 400 error. <br>3. Submit valid token → score incremented once. |
| US5  | As a system, I want to increment scores and calculate leaderboard ranks efficiently, so that the top 10 leaderboard is always accurate. | Independent, Valuable, Estimable, Testable | Medium | 5 | 1. DB increments user score atomically. <br>2. Leaderboard ranks recalculated after each update. <br>3. Top 10 users displayed correctly on leaderboard API. | 1. Increment multiple users → verify top 10 leaderboard order. <br>2. Check new rank after score increment matches expected order. |

## Execution Flow Diagram
```mermaid
sequenceDiagram
    participant User
    participant Lesson Service
    participant API Server
    participant Auth Service
    participant DB/Cache
    participant WebSocket Gateway

    %% Step 1: Lesson completion
    User->>Lesson Service: Complete Lesson
    Lesson Service-->>User: Reward Token (signed, includes lessonId, userId, points)

    %% Step 2: Score update request
    User->>API Server: POST /api/v1/score/redeem (JWT, rewardToken)
    API Server->>Auth Service: Validate JWT (user authentication)
    Auth Service-->>API Server: Authorized

    %% Step 3: Token validation & score update
    API Server->>Lesson Service: Validate rewardToken (signature, expiry, usage)
    Lesson Service-->>API Server: Token valid (points = X)
    API Server->>DB/Cache: Increment user score by X points
    DB/Cache-->>API Server: Updated total score + new rank

    %% Step 4: Broadcast update
    API Server->>WebSocket Gateway: Publish SCOREBOARD_UPDATED event (userId, newScore, newRank)
    WebSocket Gateway-->>All Clients: Broadcast updated leaderboard
    API Server-->>User: 200 OK (newScore, newRank)

```
## Comments on the User Stories regarding technical aspects

### Questions a Developer Might Ask During Refinement

| Question | Answer / Clarification |
|----------|-----------------------|
| **Q1:** What format should the reward token take? | JWT or signed JSON object containing `userId`, `lessonId`, `points`, `expiry`, and a unique `tokenId`. Must be verifiable by Lesson Service. |
| **Q2:** How do we ensure a token is single-use? | Maintain a `redeemed_tokens` table in DB with `tokenId`, `userId`, `redeemedAt`. When redeeming, atomically insert into this table; if already exists, reject. |
| **Q3:** Should the leaderboard include users tied in points? | Yes. Users with the same points can share rank, or tie-breaking can be done by earliest score achievement timestamp. |
| **Q4:** Can the leaderboard scale beyond top 10 in the future? | The current design focuses on top 10. For scaling, consider caching leaderboard in Redis and updating top N only. Current DB schema supports full user scores if needed. |
| **Q5:** Should we use PostgreSQL transactions for score updates? | Yes, atomic increment and token redemption check should be wrapped in a transaction to avoid race conditions. |
| **Q6:** What if a user redeems a token but the WebSocket broadcast fails? | The score update should still persist. Broadcast can retry or clients can fetch latest leaderboard periodically as fallback. |
| **Q7:** Are WebSocket connections authenticated? | Yes, clients must provide valid JWT to subscribe to leaderboard updates. Unauthorized clients should be rejected. |
| **Q8:** Should we validate token points server-side or trust the token? | Always validate server-side: verify signature, expiry, and that `points` match expected value for that lesson. |
| **Q9:** Should we let the Lesson Service call the Scoreboard Update Module to update the score? | Yes, in the future we may want to let the Lesson Service call the Scoreboard Update Module to update the score, but for now we split the responsibilities, steps for easier testing, once each step is implemented we can automate the integration. |
---

### Implementation Notes

#### 1. Separation of Concerns
- JWT authentication logic in one module (`auth`).
- Reward token logic in one module (`reward_token`): validation, expiry, single-use check.
- Score updating and leaderboard logic in one module (`scoreboard`).

#### 2. SRP (Single Responsibility Principle)
- Each function/method should do one thing:
  - `validate_jwt()`
  - `validate_reward_token()`
  - `increment_user_score()`
  - `broadcast_leaderboard_update()`

#### 3. Atomicity & Concurrency
- DB operations must be atomic: increment score **and** mark token as redeemed within a single transaction.
- Use row-level locking (`SELECT ... FOR UPDATE`) or UPSERTs for token redemption to avoid race conditions.

#### 4. Leaderboard Calculation
- Calculate ranks on-the-fly when retrieving top 10 from DB.
- Keep leaderboard query simple:  
  ```sql
  SELECT user_id, score
  FROM users
  ORDER BY score DESC, updated_at ASC
  LIMIT 10;

#### 5. Constants
- Hardcode must-have values in constants.ts (API routes, JWT settings, leaderboard size, event types, retry counts).

#### 6. Configurable Variable
- Use config.yaml, .env or environment variables for leaderboard size, token expiry, broadcast toggles, etc.

#### 7. Feature Flags
- Allow toggling features like scoreboard updates, WebSocket broadcasts, or token validation per client.

---
#atomic #srp #coverage #prevent-malicious #prevent-replay-attack #live-updates #testing