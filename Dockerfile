FROM node:16-alpine AS production
ENV NODE_ENV=production
SHELL ["/bin/sh", "-c"]
RUN apk add --no-cache bash
ARG user=joker
ARG home=/home/node
ARG group=thejokers
RUN addgroup -S $group
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home $home \
  --ingroup $group \
  $user

ENV NODE_ENV=production
WORKDIR $home
COPY --chown=55:$group . . 
RUN yarn install --immutable
RUN yarn build
COPY --chown=55:$group public ./public

RUN VERSION_NEXT=`node -p -e "require('./package.json').dependencies.next"`&& yarn add next@"$VERSION_NEXT"
USER $user

CMD [ "yarn", "start" ]