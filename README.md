# GREDDIIT - DASS Assignment 1

This is submission for DASS Assignment 1. This website is a MERN app 
created using create-react-app. 

- Name : Arnav Negi
- Roll : 2021101112

## Dependencies

- Tailwind
- MUI Core
- npm v9 and node v19

## Directory structure
- 2021101112/
  - backend/
    - server.js
    - Dockerfile
  - frontend/
    - src
      - App.js
    - Dockerfile
  - docker-compose.yml
  - README.md <- You are here

## How to run

Use the following npm command to run the dockerized container for the website.
From the root directory: 
To build the frontend image:

```bash
 sudo docker build -t 'react-app' frontend/
 ```

And then backend image:
```bash
 sudo docker build -t 'api-server' backend/
 ```

And then `docker-compose`:
```bash
 sudo docker-compose up --build
 ```

This will run the conatinerized application.

## Notes

- Instead of number being clickable, there is a clickable button that says `view`
    next to the follower and following count.
- LocalStorage is used to persist user login, so it will be cleared if cache is cleared.