01) Rename .env_sample as .env
02) Create a db in local mongo as "persystance"
03) Test sample APIs

* NOTE
* Duration of access tocken is 15 minutes 
* Duration of refresh tocken tocken is 1 year
* Default post 3001

==============================================================================

SAMPLE API UNTILL SWAGGER INTEGRATE

POST => http://localhost:3001/api/users/signup
{
    "email": "tharu@gmail.com",
    "password": "123456",
    "newpassword": "12345",
    "name": "Tharu",
    "profilepic": "profic pic url will change with molter"
}

POST => http://localhost:3001/api/users/login   // use accesstocken, refreshtocken and id when necessory
{
    "email": "tharu@gmail.com",
    "password": "123456",
}

PATCH => http://localhost:3001/api/details/:userId  // currently name is the only functional according to my approach
[
    { "propertyName" : "name", "value": "Tharuka Ruwan"}
]

GET => http://localhost:3001/api/details/:userId  

PATCH => http://localhost:3001/api/password/:userId
{
    "password": "123456",
    "newpassword": "12345",
}

POST => http://localhost:3001/api/profilepic/:userId // uncomplete

GET => http://localhost:3001/api/tocken             // uncomplete
{
    "refreshtocken": "given refresh tocken"
}
