FROM postgres:latest
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root
EXPOSE 5432:5432
COPY ./init_db.sql /scripts/
COPY ./sample_dev_data.sql /scripts/
