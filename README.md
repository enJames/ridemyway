<h1>Ride-My-Way</h1>

[![Build Status](https://www.travis-ci.org/enJames/ridemyway.svg?branch=develop)](https://www.travis-ci.org/enJames/ridemyway)
[![Coverage Status](https://coveralls.io/repos/github/enJames/ridemyway/badge.svg?branch=develop)](https://coveralls.io/github/enJames/ridemyway?branch=develop)

Ride-My-Way is a carpooling application that connects people who wish to share their spare seats with others headed in their direction of travel.

Ride-My-Way is currently under active development.

<h2>Front-end</h2>

The proposed views for Ride-My-Way is hosted on <a href="https://enjames.github.io/ridemyway/UI">github pages</a>. The pages/views currently being hosted are:
<li><a href="https://enjames.github.io/ridemyway/UI">Home</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/login.html">Login</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/sign-up.html">Sign up</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/dashboard.html">Dashboard</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/profile.html">Profile</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/edit.html">Edit profile</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/all-offers.html">All ride offers</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/ride-offer.html">Ride offer</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/create.html">Create offer</a></li>
<li><a href="https://enjames.github.io/ridemyway/UI/responses.html">Response to offer</a></li>

<h2>Backend</h2>

The backend implement is currently hosted on heroku on <a href="https://enjames-ridemyway.herokuapp.com">Heroku</a>. The following endpoints have been implemented:
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/rides">Get all ride offers</a> [GET: /api/v1/rides]</li>
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/rides/1">Get a ride offer</a>[GET: /api/v1/rides/:rideId]</li>
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/rides/1/requests">Get all join requests for a ride offer</a>[POST: /api/v1/rides/:rideId/requests]</li>
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/rides">Create a ride offer</a> [POST: /api/v1/rides]</li>
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/rides/1/requests">Request to Join a ride</a>[POST: /api/v1/rides/:rideId/requests]</li>
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/auth/signup">Sign up</a>[POST: /api/v1/auth/signup]</li>
<li><a href="https://enjames-ridemyway.herokuapp.com/api/v1/auth/login">Login</a>[POST: /api/v1/auth/login]</li>

<h2>Technologies used</h2>


The following technologies are currently being used in the development of the application:

<h3>Front-end</h3>
<li>HTML</li>
<li>CSS</li>
<li>Javascript</li>

<h3>Backend</h3>
<li>NodeJs</li>
<li>Express</li>
<li>Babel</li>
<li>Body-parser</li>
<li>Mocha, Chai and Nyc (for testing)</li>

This is would grow as the project progesses.
