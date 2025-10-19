FROM postgres:13

ENV POSTGRES_DB=username_availability
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123

COPY init.sql /docker-entrypoint-initdb.d/