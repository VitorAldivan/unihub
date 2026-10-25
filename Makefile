.PHONY: up down build test logs clean

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

test:
	pytest apps/api/tests

logs:
	docker compose logs -f

clean:
	docker compose down -v
