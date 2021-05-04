# Locations API

<p>
Operations included :
<li>Create a new Location(POST '/')</li>
<li>View all locations(GET '/')</li> 
<li>View a particular locations(GET '/:locationId')</li>
<li>Update a location(PATCH '/:locationId')</li>
<li>Delete a location(DELETE '/:locationId')</li> 
</p>
<p>
Use the POST '/login' route to login and use the endpoints using the following exact request body for the test user to generate the JWT:<br>
{
    "name" : "user",
    "password" : "password"
}

<br>

Copy the token into the authorization section of the request header as :

"Bearer {tokenID}" 

To create a new entry in the DB use the following format for the request body along with the POST '/' route: <br>
{
    name : "Hyderabad",
    latitude : "161668",
    longitude : "16486",
    city : "Hyderabad",
    country : "India",
    locationImage : {image},
    timeToVisit : ["June to July","November to January"]

}

<li>Use the command : <strong> npm install  </strong> to install the dependencies</li>
<li> Use the command : <strong> npm run dev </strong> to run the project with nodemon</li>

</p>
