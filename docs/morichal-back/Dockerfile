# Etapa 1: compilar el jar con Gradle (el runner no necesita tener Java instalado)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /src
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
# Descargar dependencias en una capa aparte: si solo cambia el código, no se vuelven a descargar
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies > /dev/null
COPY src src
# bootJar sin tests: el único test (contextLoads) necesita la base de datos
RUN ./gradlew --no-daemon bootJar \
    && find build/libs -name '*.jar' ! -name '*-plain.jar' -exec cp {} /app.jar \;

# Etapa 2: solo el JRE y el jar
FROM eclipse-temurin:21-jre-alpine
# Usuario sin privilegios y carpeta para las evidencias (ahí se monta el volumen persistente)
RUN addgroup -S app && adduser -S appuser -G app \
    && mkdir -p /data/evidencias && chown -R appuser:app /data
WORKDIR /app
COPY --from=build /app.jar app.jar
ENV JAVA_OPTS="-XX:MaxRAMPercentage=70 -Djava.security.egd=file:/dev/./urandom"
USER appuser
EXPOSE 8080
ENTRYPOINT [ "/bin/sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar" ]
