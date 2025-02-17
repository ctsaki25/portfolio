# Portfolio

Portfolio repo by Constantine Tsakiris

### Please read the [Collaborating](#collab) section before starting!

## How to use - Docker
Run docker-compose and it shall build everything for you.  
You can work on the frontend and the container will automatically reload the React application.  
However you will still need to re-run docker-compose everytime you change something in the backend.

```
docker compose up --build
```

## How to use - Manual
If you prefer, you can also run manually, given that you have Mongo installed and set up properly.

### Frontend
We are going to use yarn as the package manager.
Here is the procedure to install yarn:
```
npm install --global yarn
```
Whenever you are working on the frontend, make sure you are inside the frontend folder
```
cd portfolio-fe
```
Afterwards, run yarn to install/update dependencies
```
yarn
```

### Backend
Straight forward, just build & run using gradle or use IntelliJ.
