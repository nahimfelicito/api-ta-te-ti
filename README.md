# API Ta-Te-Ti

## Setup of the project

1. Install docker [GET DOCKER](https://docs.docker.com/engine/install/ubuntu/)

2. Download mongo image 

`$ docker pull mongo`

3. Run a mongo image for the database, ta-te-ti can be changed for amy name you want but do not forget to change .env file with the new name

`$ docker run -d -p 27017-27019:27017-27019 --name ta-te-ti mongo`

4. Enter the container and create de database 

`$ docker exec -it ta-te-ti mongo`

`# mongo`

`> use (db_name)`

5. Download the proyect and run it

`$ git clone https://github.com/nahimfelicito/api-ta-te-ti.git`
 
`$ cd api-ta-te-ti`
 
`$ npm install`

`$ npm start`

## Endpoints

### v1/room/create :arrow_right: POST 

    {
        "name": "room_name"
    }

### v1/room/join :arrow_right: POST 

    {
        "id_room': "id_room"
    }

### v1/room/show-info :arrow_right: GET 

    {
        "id_room': "id_room"
    }

### v1/board/:id :arrow_right: GET {id_room in url}

### v1/board/move :arrow_right: PUT 

    {
        "move": "index", 
        "user_id": "user_id",
        "room_id": "room_id"
    }