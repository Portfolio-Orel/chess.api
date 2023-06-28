# Chess App API Documentation
This documentation provides detailed information about the getUser, createUser, and updateUser endpoints of the Chess App API.

## `getUser` 
## Purpose
This function retrieves the details of an active user from the application's database based on their user ID. It fetches user details, their role from a joined table, and returns the information in a JSON format.


## Method
GET

## Endpoint
`/users/:user_id`

## Parameters
`user_id`: Path parameter, representing the user's unique ID.
## Returns
A JSON object containing the following user properties:

- `id` - The unique identifier of the user.
- `first_name` - The first name of the user.
- `last_name` - The last name of the user.
- `gender` - The gender of the user.
- `email` - The email address of the user.
- `phone_number` - The phone number of the user.
- `player_number` - The player number of the user.
- `rating_israel` - The Israeli rating of the user.
- `rating_fide` - The FIDE rating of the user.
- `rating_rapid` - The rapid rating of the user.
- `rating_blitz` - The blitz rating of the user.
- `date_of_birth` - The date of birth of the user.
- `profile_expiration_date` - The expiration date of the user's profile.
- `role` - The role of the user.

## `createUser`
## Purpose
This function creates a new user in the application's database. It validates the club based on the player's number, inserts the new user into the users table, and inserts the user's additional data into the chess_user_data table if they are associated with a club and have a player number.

## Method
POST

## Endpoint
`/users`

## Parameters
Request Body (JSON):

- `email`: The user's email address.
- `phone_number`: The user's phone number.
- `player_number`: The user's unique player number.
- `gender`: The user's gender.
- `date_of_birth`: The user's date of birth.
## Returns
A JSON object representing the newly created user:

- `id`: The user's unique identifier.
- `gender`: The user's gender.
- `email`: The user's email.
- `phone_number`: The user's phone number.
- `player_number`: The user's unique player number.
- `club`: The user's associated club, if any.
- `first_name`: The user's first name.
- `last_name`: The user's last name.
- `rating_israel`: The user's Israel rating.
- `rating_fide`: The user's FIDE rating.
- `rating_fide_rapid`: The user's FIDE rapid rating.
- `rating_fide_blitz`: The user's FIDE blitz rating.
- `profile_expiration_date`: The expiration date of the user's profile.
- `full_name`: The user's full name.

## updateUser
## Purpose
This function updates an existing user's first name, last name, date of birth, and gender in the users table.

## Method
PUT

## Endpoint
`/users/:user_id`

## Parameters
`user_id`: Path parameter, representing the user's unique ID.
Request Body (JSON):

`first_name`: The user's updated first name.
`last_name`: The user's updated last name.
`date_of_birth`: The user's updated date of birth.
`gender`: The user's updated gender.

## Calculate new rating
## Purpose
This function calculates the new rating of a player based on their current rating, the rating of their opponents, and the result of the games.

## Method
POST

## Endpoint
`/newRating`

## Parameters
Request Body (JSON):

- `player`: { 
    `rating`: number,
}
- `games`: [{ 
    `opponentRating`: number,
    `timeControl`: string,
    `opponentPoints`: number, 0 - loss, 0.5 - draw, 1 - win (opponent's result),
}]

## Returns
A JSON object representing the newly calculated rating:

`result`: number