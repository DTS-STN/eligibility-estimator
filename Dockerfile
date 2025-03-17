# FROM node:16-alpine AS base

# RUN apk add --no-cache libc6-compat

# WORKDIR /base
# COPY package.json yarn.lock ./
# COPY . .

# # 
# # 

# FROM base AS build

# ENV NODE_ENV=production
# WORKDIR /build
# COPY --from=base /base ./
# RUN yarn install
# RUN yarn build

# # 
# # 

# FROM node:16-alpine AS production

# ENV NODE_ENV=production
# SHELL ["/bin/sh", "-c"]
# RUN apk add --no-cache bash

# ARG user=joker
# ARG home=/home/node
# ARG group=thejokers
# RUN addgroup -S $group
# RUN adduser \
#   --disabled-password \
#   --gecos "" \
#   --home $home \
#   --ingroup $group \
#   $user

# ENV NODE_ENV=production
# WORKDIR $home
# COPY --from=build --chown=55:$group /build/next.config.js ./
# COPY --from=build --chown=55:$group /build/package.json   ./
# COPY --from=build --chown=55:$group /build/yarn.lock      ./yarn.lock
# COPY --from=build --chown=55:$group /build/.yarn          ./.yarn
# COPY --from=build --chown=55:$group /build/.next          ./.next
# COPY --from=build --chown=55:$group /build/public         ./public

# RUN VERSION_NEXT=`node -p -e "require('./package.json').dependencies.next"`&& yarn add next@"$VERSION_NEXT"
# USER $user

# CMD [ "yarn", "start" ]

FROM node:16.15.1-alpine AS production
ENV NODE_ENV=production
SHELL ["/bin/sh", "-c"]
RUN apk add --no-cache bash
ARG user=joker
ARG home=/home/node
ARG group=thejokers
ARG ADOBE_ANALYTICS_URL
ARG LOGGING_LEVEL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG NEXT_AUTH_USERNAME
ARG NEXT_AUTH_PASSWORD
ARG APP_ENV
ARG NEXT_BUILD_DATE

RUN addgroup -S $group
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home $home \
  --ingroup $group \
  $user

ENV APP_ENV=$APP_ENV
ENV ADOBE_ANALYTICS_URL=$ADOBE_ANALYTICS_URL
ENV LOGGING_LEVEL=$LOGGING_LEVEL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_AUTH_USERNAME=$NEXT_AUTH_USERNAME
ENV NEXT_AUTH_PASSWORD=$NEXT_AUTH_PASSWORD
ENV NEXT_BUILD_DATE=$NEXT_BUILD_DATE

WORKDIR $home
COPY --chown=55:$group . . 
RUN yarn install --immutable

RUN yarn build
RUN mkdir -p /app/.next/cache/images
COPY --chown=55:$group public ./public

RUN VERSION_NEXT=`node -p -e "require('./package.json').dependencies.next"`&& yarn add next@"$VERSION_NEXT"
USER $user

EXPOSE 3000

CMD [ "yarn", "start" ]