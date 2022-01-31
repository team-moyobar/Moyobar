# Dockerfile

FROM java:8
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=build/libs/moyobar-backend-server-1.0-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata