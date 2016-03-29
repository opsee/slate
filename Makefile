# CONTAINER_TAG is git revision unless overriden by SLATE_VERSION
CONTAINER_TAG := $(shell git rev-parse HEAD)
ifeq ($(SLATE_VERSION), "")
	CONTAINER_TAG := $(SLATE_VERSION)
endif
CONTAINER_NAME := "quay.io/opsee/slate"
CONTAINER_PORTS := "7000:7000"

all: clean build

clean:
	$(MAKE) -i docker-clean
	npm run lint

build:
	docker build --build-arg CONTAINER_TAG=${CONTAINER_TAG} -t ${CONTAINER_NAME}:${CONTAINER_TAG} . 

run:
	docker run -l "${CONTAINER_NAME}:${CONTAINER_TAG}" -p ${CONTAINER_PORTS} ${CONTAINER_NAME}:${CONTAINER_TAG}

stop: 
	docker stop `docker ps --filter label="${CONTAINER_NAME}:${CONTAINER_TAG}" --format "{{.ID}}"`

docker-clean:
	docker rmi -f ${CONTAINER_NAME}:${CONTAINER_TAG}

docker-push:
	docker push ${CONTAINER_NAME}:${CONTAINER_TAG} 

.PHONY: clean all
