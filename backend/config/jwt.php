<?php

return [

    /*
    |--------------------------------------------------------------------------
    | JWT Secret
    |--------------------------------------------------------------------------
    |
    | This secret is used to sign your tokens, make sure to change it before
    | using this package in production.
    |
    */

    'secret' => env('JWT_SECRET', 'secret'),

    /*
    |--------------------------------------------------------------------------
    | JWT Time to Live
    |--------------------------------------------------------------------------
    |
    | This is the time of life (in minutes) of a token.
    |
    */

    'ttl' => env('JWT_TTL', 60),

    /*
    |--------------------------------------------------------------------------
    | JWT Refresh Time to Live
    |--------------------------------------------------------------------------
    |
    | This is the time of life (in minutes) of a token that can be refreshed.
    |
    */

    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),

    /*
    |--------------------------------------------------------------------------
    | JWT Algorithm
    |--------------------------------------------------------------------------
    |
    | The algorithm that should be used for signing the token.
    | Should be one of the algorithms supported by `firebase/php-jwt`.
    | See: https://github.com/firebase/php-jwt#algorithms
    |
    Supported: 'HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'
    */

    'algo' => env('JWT_ALGO', 'HS256'),

    /*
    |--------------------------------------------------------------------------
    | JWT Required Claims
    |--------------------------------------------------------------------------
    |
    | Array with the required claims both on encoding and decoding.
    |
    */

    'required' => ['iss', 'iat', 'exp', 'nbf', 'sub', 'jti'],

    /*
    |--------------------------------------------------------------------------
    | JWT Audience
    |--------------------------------------------------------------------------
    |
    | Audience that should be used when creating JWT.
    |
    */

    'aud' => [

        'aud' => env('JWT_AUD', null),

    ],

    /*
    |--------------------------------------------------------------------------
    | JWT Issuer
    |--------------------------------------------------------------------------
    |
    | Issuer that should be used when creating JWT.
    |
    */

    'iss' => [

        'iss' => env('JWT_ISS', null),

    ],

    /*
    |--------------------------------------------------------------------------
    | JWT Custom User Claims
    |--------------------------------------------------------------------------
    |
    | Array with custom user claims to be added to the JWT.
    |
    */

    'user' => [

        'user' => 'id',

    ],

    /*
    |--------------------------------------------------------------------------
    | JWT Provider
    |--------------------------------------------------------------------------
    |
    | Used when decoding and validating tokens, by default we use Eloquent.
    |
    */

    'provider' => Illuminate\Auth\EloquentUserProvider::class,

    /*
    |--------------------------------------------------------------------------
    | JWT Custom Reponse
    |--------------------------------------------------------------------------
    |
    | When we respond with a token we can transform the data before we
    | actually return it to the user.
    |
    */

    'response' => [

        /*
         * Add the token to the response under this key.
         */
        'token' => 'token',

        /*
         * Add the token type to the response under this key.
         */
        'type' => 'bearer',

        /*
         * Add the amount of seconds (int) until the token expires to the
         * response under this key.
         */
        'expires_in' => 'expires_in',

    ],

    /*
    |--------------------------------------------------------------------------
    | JWT Blacklist Grace Period
    |--------------------------------------------------------------------------
    |
    | When a user logs out, we want to blacklist their token for the TTL plus
    | the grace period so routes protected with auth.refresh still work.
    |
    */

    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 60),

    /*
    |--------------------------------------------------------------------------
    | JWT Provider Flags
    |--------------------------------------------------------------------------
    |
    | Some providers need to be initialized with certain flags to work properly.
    |
    */

    'provider_flags' => [

        /*
         * Mark tokens that have had their sub claim modified.
         */
        \PDO::FETCH_ASSOC => false,

        /*
         * Explicitly specify fetching the row ID as well as the row object.
         */
        Illuminate\Database\Eloquent\Model::class => true,

    ],

    /*
    |--------------------------------------------------------------------------
    | JWT Log
    |--------------------------------------------------------------------------
    |
    | Log any exceptions thrown by the JWT Manager.
    |
    */

    'log' => env('JWT_LOGGING', false),

];