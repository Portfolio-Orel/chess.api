# Chess App Rating API Documentation
This documentation provides detailed information about the expectedRating, new, undo, and reset endpoints of the Chess App API.

# new:

## Purpose
 This function calculates the new rating of a player based on their current rating, the rating of their opponents, and the result of the games.
## Method:
 POST
## Endpoint: 
 expectedRating/new
## Parameters:
 *Request Headers (JSON)*:
    `UserId`: The unique ID of the user.
*Request Body (JSON)*:
`rating`: The player's current rating.
`games`: Array of game objects:
    `opponentRating`: The rating of the opponent.
    `timeControl`: The time control of the game.
    `opponentPoints`: The result of the game for the opponent (0 - loss, 0.5 - draw, 1 - win).
## Returns:
 A JSON object representing the newly calculated rating:
## result:
 The calculated new rating.

# undo:

## Purpose:
 This function undoes the latest rating calculation for a user, restoring their previous rating.
## Method:
 POST
## Endpoint:
 expectedRating/undo
## Parameters:
 *Request Headers (JSON)*:
    `UserId`: The unique ID of the user.
## Returns:
 The previous rating of the user.

# resetExpectedRating:

## Purpose:
 This function resets the expected rating of a user to their current rating.
## Method:
 POST
## Endpoint:
 expectedRating/reset
## Parameters:
 *Request Headers (JSON)*:
    `UserId`: The unique ID of the user.
## Returns:
 The user's current rating.