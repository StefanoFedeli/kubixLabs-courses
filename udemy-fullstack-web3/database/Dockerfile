# Base image
FROM postgres:15

# Set environment variables
ENV POSTGRES_USER root
ENV POSTGRES_PASSWORD root
ENV POSTGRES_DB metamask_login

# Set the working directory in the container
WORKDIR /docker-entrypoint-initdb.d/

# Add SQL files
ADD schema.sql /scripts/
ADD data.sql /scripts/

# Default command to run
CMD ["postgres"]
