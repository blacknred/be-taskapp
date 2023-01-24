# Taskapp(caplan)

<img src="services/web/static/images/logo.svg" width="75" alt="Taskapp Logo"/>

Sample app for agile project management

[![CI](https://github.com/blacknred/full-taskapp/workflows/Build%20and%20release/badge.svg)](https://github.com/blacknred/full-taskapp/actions)

## Architecture

> for a real world scenario you definitely need an easily sharded nosql db for read DB

| Services           | Container                  | Stack                   | Ports      |
| ------------------ | -------------------------- | ----------------------- | ---------- |
| Redis              | redis                      | Redis stack             | 6379       |
| Queue              | rabbitmq                   | RabbitMQ                | 5672/15672 |
| Read DB            | postgres                   | Postgres                | 5432       |
| Write DB           | eventstore                 | EventStoreDB            | 1113/2113  |
| Object storage(s3) | minio                      | Minio                   | 9000       |
| -                  | -                          | -                       | -          |
| Project Query      | project-query-service      | NodeJs, HTTP1.1, AMQP   | 8001       |
| Project Command    | project-command-service    | NodeJs, HTTP1.1, AMQP   | 8002       |
| Issue Query        | issue-query-service        | NodeJs, HTTP1.1, AMQP   | 8003       |
| Issue Command      | issue-command-service      | NodeJs, HTTP1.1, AMQP   | 8004       |
| Member Query       | member-query-service       | NodeJs, HTTP1.1, AMQP   | 8005       |
| Member Command     | member-command-service     | NodeJs, HTTP1.1, AMQP   | 8006       |
| Search Query       | search-query-service       | NodeJs, HTTP1.1, AMQP   | 8007       |
| Report             | report-service             | NodeJs, HTTP1.1         | 8008       |
| Account            | account-service            | NodeJs, HTTP1.1, AMQP   | 8009       |
| Notification       | notification-service       | NodeJs, HTTP1.1, AMQP   | 8010       |
| Billing            | billing-service            | NodeJs, HTTP1.1, AMQP   | 8011       |
| Auth               | auth-service               | NodeJs, HTTP1.1         | 8012       |
| Api Gateway        | gateway                    | Nginx, HTTP1.1, Swagger | 80/443     |
| -                  | -                          | -                       | -          |
| Tracing            | jaeger                     | Jaeger                  | 9411/16686 |
| Prometheus         | prometheus                 | Prometheus              | 9090       |
| Container metrics  | cadvisor                   | Prom cadvisor           | 8081       |
| Unix metrics       | node-exporter              | Prom node exporter      | 9100       |
| Nginx metrics      | nginx-exporter             | Prom nginx exporter     | 9113       |
| Postgres metrics   | postgres-exporter          | Prom postgres exporter  | 9187       |
| Redis metrics      | redis-exporter             | Prom redis exporter     | 9121       |
| Logs storage       | loki                       | Grafana Loki            | 3100       |
| Logs aggregator    | fluent-bit                 | Fluent Bit              | 24224      |
| Grafana            | grafana                    | Grafana                 | 3003       |
| Alerts             | alertmanager               | Alertmanager            | 9093       |

## Features

- **User**

  - Email based jwt auth
  - Locale & currency tracking
  - Web/email/phone notifications of projects events

- **Project**

  - Can be created by anyone in any number.
  - Can be a canban or scrum. Scrum projects are typically related to isolated teams for scheduled releases within sprints. Canban projects may be imlemented at department or whole organization level for non scheduled visual tracking. A project can be switched to canban/scrum type anytyme.
  - Has user roles with privileges. Default roles are Product Owner(PO), Worker(W) and Scrum Master(SM) which is only for scrum projects. Alike others a PO can be the only one and project author has a PO role by default. A PO also is the only role that has the _project_deletion_ privilege. Default roles cannot be changed but can be extended e.g. admin or specified worker like qa, dev etc.
  - Users can be added to project with an email address directly or via invitation link. To have more than 5 users the project needs to be switched to paid plan. Invoices monthly charge the PO.
  - Has a three issue types: epic, story, task.
  - Has a workflow with an issue status model. Defaults statuses are todo, in_progress and done. A workflow can be changed anytime with new statuses e.g. requirements, design, development, review, unit testing, integration testing, bug fixes, deployment etc.
  - Has an issue priorities set. Default priorities are low, medium and high. Issue priorities can changed anytime: routine, urgent etc.
  - Has an issue tags set which is empty by default. Issue tags can be used for example for tagging task issue type: bug, idea etc.
  - Has a boards set. Default board is the "main" board with only one col with product/sprint backlog. The main board can be extended with workflow statuses as well as new boards added to project e.g. testing board, designers board etc.

- **Work**

  1. A PO(or role with _project-management_ privilege) adds a users to project.
  1. Roadmap. PO(or role with _roadmap-access & epic-management_ privileges) creates a roadmap of the project with epic issues. Epic is a big story issue which takes up 1-2 month to implement usually. Epic may have a version tag. Roadmap describes approximate timeframe and links between epics.
  1. Backlog. PO(or role with _backlog-access & story-management_ privileges) creates a product backlog by breaking epics to story issues. Story is a product feature("as a user/customer/manager i want"). Scrum projects add concept of spring - a time-boxed work period which have a meeting lifecycle:
     - _planning meeting_ where SM(or role with _sprint-access_ privilege) and Workers planning a new sprint and a sprint backlog together. Sprint backlog is a chunk of product backlog stories that have to be executed together. Every story from sprint backlog has to have a difficult point which is estimated by Workers themselves. After the difficult pointing the team can define the sprint duration which is usually 2-3 weeks. At the end the SM starts a sprint.
     - _daily standup meeting_ where Workers discuss a sprint progress.
     - _demo meeting_ where Workers demonstrate a product progress to PO after sprint completing.
     - _retro meeting_ where SM(or role with _sprint-access_ privilege) and Workers discuss technical debt with a help of analytics from project reports.
  1. Boards. Used to observe the visual progress of product/sprint. The main board includes only the stories from product backlog in canban and stories from current spring in scrum projects. To fulfilm a story Workers(or role with _task-management_ privilege) split it to tasks and process them with workflow status model.
   - Anyone can comment task, change task status or assignee
   - , star an issue or 
   - track/watch the task changes.
   -  Every status update is tracked in task history.
   -  Tasks can have one of relation: relate, block, duplicate, cause.
  1. Reports. Used to analyze progress on a project, identify bottlenecks and predict future performance.

## Todo

- tenancy
- billing(+stripe)
- teams?
- automation?
- shared boards?

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

### Build and Run the App

1. Set the Environment variables in .env.dev

1. Fire up the Containers

   ```sh
   make network
   make dev-check
   make dev
   ```

### Release

1. Build and push images to the hub

```sh
$ make release
# will ask you for a version tag or fallback to branchname-commithash
QUEST:   Version tag?:[master-87265e6] -> 1.0.0
INFO:    Starting build for version 1.0.0
```

### Production

1. Set the Environment variables in .env

1. Run the containers:

   ```sh
   make network
   make prod-build
   make prod
   ```

Configure alerting on grafana




## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
