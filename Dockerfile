FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install

COPY . .

# Receive build arguments
ARG SUPABASE_TARGET_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Make them available during build
ENV SUPABASE_TARGET_URL=$SUPABASE_TARGET_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN bun run build

EXPOSE 4173

CMD ["bun", "run", "preview", "--", "--host"]
