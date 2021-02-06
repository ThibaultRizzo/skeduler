FROM node:latest as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN npm install --silent

COPY . /usr/src/app
RUN npm run build-prod

FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY ../../../../../etc/letsencrypt/live/skeduler.eu /etc/nginx/certs

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]