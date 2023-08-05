# MetaMask Login Demo

## How to Run

### Using docker

1. Install docker and docker-compose

2. Run `docker compose up -d --build`

3. Create database schema by running,
   ```bash
    docker compose exec metamask_db psql -d metamask_login -f /scripts/schema.sql
    docker compose exec metamask_db psql -d metamask_login -f /scripts/data.sql
   ```
   
4. Open http://localhost:8080 in your browser or API can be accessed at http://localhost:3000/api

