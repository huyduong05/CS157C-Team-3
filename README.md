# Shopkepper

CS 157C Final Project - Huy Duong, Tanisha Damle, Patrick Le

## Set Up

1. Install prerequisites

   - [Docker](https://www.docker.com/)

2. Run Docker

   ```
   docker-compose up --build
   ```
  
   - In the rare case of an error, try re-running the command or running #4 to clean up before re-running

3. Visit the website at http://localhost:5173/

4. Clean Up Docker files

   ```
   docker-compose down -v --rmi all
   ```