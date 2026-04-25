import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'gitops-on-aws-with-fluxcd',
    title: 'Running Kubernetes the GitOps Way on AWS with FluxCD',
    category: 'GitOps',
    repo: 'aws-fluxcd',
    readTime: '7 min read',
    accentColor: '#00D9FF',
    summary:
      'A walkthrough of structuring a production-minded AWS Kubernetes platform where cluster add-ons, apps, secrets, ingress, storage, backups, and monitoring are all reconciled from Git.',
    highlight:
      'The biggest shift was treating the repository as the operational source of truth, not just a place to store manifests.',
    stack: ['FluxCD', 'AWS', 'Kubernetes', 'Istio', 'Vault', 'Longhorn', 'Velero', 'Prometheus', 'Loki'],
    takeaways: [
      'Split infrastructure, configs, monitoring, and apps into separate reconciliation layers.',
      'Use Flux dependencies to express deployment order instead of relying on operator memory.',
      'Bundle backups, secrets, ingress, and observability into the platform baseline from day one.',
    ],
    githubUrl: 'https://github.com/luzero-luvis/aws-fluxcd',
    sections: [
      {
        heading: 'Why this repo exists',
        paragraphs: [
          'This repository is my answer to a common Kubernetes problem: clusters start clean, then drift into a pile of one-off kubectl commands, half-documented Helm installs, and tribal knowledge. I wanted a layout where the cluster could be rebuilt from Git and understood by reading the repo tree.',
          'The result is a GitOps structure that separates platform responsibilities clearly. Infrastructure controllers live in one area, configuration overlays in another, monitoring in its own layer, and applications in a dedicated path. That separation makes it easier to reason about blast radius and deployment order.',
        ],
      },
      {
        heading: 'What made the platform feel production ready',
        paragraphs: [
          'The interesting part is not just deploying apps with Flux. The repo wires in cert-manager for wildcard TLS, Istio with Gateway API support, External Secrets pulling from Vault, Velero backups to S3, Longhorn for persistent volumes, and autoscaling-aware cluster services. That combination moves the cluster closer to an actual platform rather than a demo installation.',
          'I also treated observability as a first-class concern. Kube Prometheus Stack, Loki, and Grafana Alloy are managed in the same GitOps flow, which means monitoring is versioned and repeatable instead of being bolted on after the cluster is already busy.',
        ],
      },
      {
        heading: 'What I learned building it',
        paragraphs: [
          'GitOps gets easier once the repo mirrors the way you think operationally. When infrastructure, configs, and applications are grouped by lifecycle, debugging becomes simpler because you know where a change belongs before you even open a file.',
          'I also learned that platform maturity comes from the boring pieces: backups, secret delivery, DNS, certificate renewal, and reliable storage. Those are the things that decide whether a cluster survives real workloads, and this repo forced me to design around them explicitly.',
        ],
      },
    ],
  },
  {
    slug: 'terraform-vpc-lab-lessons',
    title: 'What Finally Clicked About AWS Networking After Building a Terraform VPC Lab',
    category: 'Infrastructure',
    repo: 'terraform-aws-vpc-lab',
    readTime: '6 min read',
    accentColor: '#00FF41',
    summary:
      'A hands-on write-up on learning VPC design by building two peered networks with public and private subnets, NAT, route tables, NACLs, and security groups.',
    highlight:
      'Networking stopped feeling abstract once every route had a visible packet path and a reason to exist.',
    stack: ['Terraform', 'AWS VPC', 'Route Tables', 'NAT Gateway', 'NACLs', 'Security Groups', 'VPC Peering'],
    takeaways: [
      'Route tables matter as much as subnet design because they define what traffic can actually move.',
      'Private subnet internet access is really a NAT design problem, not a subnet checkbox.',
      'Peering only works when both sides have the right routes and security rules.',
    ],
    githubUrl: 'https://github.com/luzero-luvis/terraform-aws-vpc-lab',
    sections: [
      {
        heading: 'Learning by modeling the packet path',
        paragraphs: [
          'I built this lab to move beyond memorizing AWS networking terms. Instead of reading isolated definitions for internet gateways, NAT gateways, route tables, and peering, I wanted a topology where each component had a concrete role in end-to-end traffic flow.',
          'The repo uses two VPCs with public and private subnets, separate route tables, and peering routes on both sides. That makes it a good environment for understanding how outbound internet access, east-west traffic, and isolation policies actually work together.',
        ],
      },
      {
        heading: 'Why the diagrams matter',
        paragraphs: [
          'One of the strongest parts of this project is the emphasis on packet flow diagrams. They force you to answer simple but critical questions: where does a packet leave, which route matches first, and what device forwards it next. Those questions reveal mistakes much faster than staring at Terraform alone.',
          'The lab also makes the difference between public and private subnets intuitive. Public subnets are not just subnets with a label; they are subnets whose route tables send default traffic to an internet gateway. Private subnets become useful when they send outbound traffic through NAT without exposing instances directly.',
        ],
      },
      {
        heading: 'What this changed in my Terraform work',
        paragraphs: [
          'After building this lab, I became more careful about designing networking modules around intent instead of just resource creation. I now think in terms of traffic classes, trusted boundaries, and failure modes before I declare CIDRs and subnets.',
          'It also reinforced a broader lesson: infrastructure code is easier to maintain when the documentation explains behavior, not just resources. A diagram that shows why a route exists is often more valuable than another block of variable descriptions.',
        ],
      },
    ],
  },
  {
    slug: 'production-minded-go-weather-api',
    title: 'Building a Small Go Weather API That Still Feels Production Ready',
    category: 'Backend',
    repo: 'weather-api',
    readTime: '5 min read',
    accentColor: '#FF6B35',
    summary:
      'A case study in keeping a simple Go service simple while still adding the operational pieces that matter: structured logs, health checks, caching, Docker hardening, and CI automation.',
    highlight:
      'The service is intentionally small, but the delivery discipline around it is what makes it useful.',
    stack: ['Go', 'Chi', 'Redis', 'Docker', 'GitHub Actions', 'slog', 'REST API'],
    takeaways: [
      'Small APIs benefit from the same operational discipline as larger services.',
      'Caching is often the cheapest performance win when you wrap an upstream API.',
      'Logs, health endpoints, and image hardening should not be postponed until later.',
    ],
    githubUrl: 'https://github.com/luzero-luvis/weather-api',
    sections: [
      {
        heading: 'Keeping the core API narrow',
        paragraphs: [
          'This project wraps a third-party weather provider behind a clean Go REST API. The surface area is intentionally small: one health endpoint and one endpoint for weather data by city. That narrow scope is useful because it keeps the code focused on request flow, upstream integration, and response handling.',
          'Using Chi and standard Go packages keeps the project approachable. There is no large framework doing hidden work, which makes the request lifecycle easier to trace and easier to improve.',
        ],
      },
      {
        heading: 'Operational choices that matter',
        paragraphs: [
          'The most useful decision in this repo is the Redis cache with a six-hour TTL. Weather data does not need to be fetched from the upstream provider on every request, so caching cuts external calls, improves latency, and reduces the impact of provider instability.',
          'I paired that with structured slog logging, a health check endpoint, and a multi-stage Docker build that runs as a non-root user. None of those choices are flashy, but together they make the service easier to run, observe, and trust.',
        ],
      },
      {
        heading: 'What I would carry into larger services',
        paragraphs: [
          'This repo reminded me that production readiness is mostly about consistent basics. You do not need a large system to justify health checks, container hardening, or CI pipelines. Those habits scale down just as well as they scale up.',
          'It also reinforced that clean boundaries help even in a beginner-friendly project. Configuration, caching, client logic, and middleware are easier to evolve when they are separated from the HTTP entry point from the start.',
        ],
      },
    ],
  },
  {
    slug: 'designing-a-go-blog-api',
    title: 'Designing a Blog API in Go Without Hiding Behind Framework Magic',
    category: 'Backend',
    repo: 'blogging-platform-api',
    readTime: '5 min read',
    accentColor: '#FFB800',
    summary:
      'An article about building a straightforward CRUD API for blog posts with Go, PostgreSQL, Chi, and a layered structure that stays easy to follow.',
    highlight:
      'The point of this repo is not scale yet; it is clarity in how data moves from HTTP request to storage and back.',
    stack: ['Go', 'PostgreSQL', 'Chi', 'Docker Compose', 'slog', 'REST API'],
    takeaways: [
      'A small layered architecture pays off early because handlers, services, and repositories evolve at different speeds.',
      'Schema setup and migrations should be treated as part of the product, not a manual afterthought.',
      'Minimal APIs become stronger when validation and error design are explicit.',
    ],
    githubUrl: 'https://github.com/luzero-luvis/blogging-platform-api',
    sections: [
      {
        heading: 'Why build this instead of using a bigger stack',
        paragraphs: [
          'I built this project to understand the fundamentals of a CRUD backend without relying on a large framework to hide the moving parts. The API supports creating posts, listing them, fetching by ID, and updating existing content, which is enough to exercise the core patterns of a content service.',
          'Go plus Chi keeps the transport layer readable, while PostgreSQL gives the project a real persistence layer instead of an in-memory shortcut. That makes the repo a good baseline for learning practical backend design.',
        ],
      },
      {
        heading: 'The value of the layered structure',
        paragraphs: [
          'The handler, service, and repository split is the main design choice worth preserving. Handlers deal with HTTP concerns, services own validation and business rules, and repositories own database queries. That boundary makes it easier to change one part without dragging the rest of the code with it.',
          'Docker Compose also helps here because it gives the API and database a repeatable local environment. For backend projects, that kind of consistency matters more than people expect because debugging becomes much easier when everyone runs the same setup.',
        ],
      },
      {
        heading: 'Where I would take it next',
        paragraphs: [
          'The current repo is honest about its limitations: no migrations, no delete endpoint, no pagination, and no automated tests yet. That is useful because it clearly shows what maturity work is still missing instead of pretending the project is finished.',
          'If I extend it, the next improvements would be migrations first, standardized error responses second, and test coverage across handlers and repositories right after that. Those changes would turn a good learning API into a sturdier service foundation.',
        ],
      },
    ],
  },
  {
    slug: 'blocking-secrets-before-github',
    title: 'Blocking Secrets Before They Reach GitHub with Global Git Hooks',
    category: 'Security',
    repo: 'git-secret-scanner',
    readTime: '4 min read',
    accentColor: '#C084FC',
    summary:
      'A practical write-up on using Gitleaks as a global Git hook so secret scanning happens before every commit across every repository on a machine.',
    highlight:
      'The best secret leak is the one that never leaves a developer laptop in the first place.',
    stack: ['Git Hooks', 'Gitleaks', 'Security', 'Developer Tooling'],
    takeaways: [
      'Local guardrails catch mistakes earlier than CI and with far less cleanup cost.',
      'A global hook is more reliable than asking every repo to remember secret scanning.',
      'Security tooling works best when it is boring, automatic, and difficult to bypass by accident.',
    ],
    githubUrl: 'https://github.com/luzero-luvis/git-secret-scanner',
    sections: [
      {
        heading: 'Why I built a machine-wide guardrail',
        paragraphs: [
          'Developers do not usually leak secrets because they intend to. They leak them because a test key, connection string, or token slipped into staged files during normal work. Once that commit is pushed, cleanup becomes expensive and sometimes public.',
          'This repo solves that at the earliest useful checkpoint: the local commit itself. By wiring Gitleaks into a global hooks path, every repository on the machine benefits from the same pre-commit secret scan without needing project-specific setup.',
        ],
      },
      {
        heading: 'What makes the approach practical',
        paragraphs: [
          'The repo does not just run a scanner. It also ships a rule configuration that covers common cloud credentials, database URLs, tokens, JWT secrets, and other high-risk patterns while keeping obvious placeholders out of the way. That balance matters because security tooling that produces constant noise gets ignored quickly.',
          'I like this approach because it treats secure defaults as developer experience. Set it up once, let it run everywhere, and make the safe path the easiest one.',
        ],
      },
      {
        heading: 'The real lesson',
        paragraphs: [
          'Most teams talk about secret management only after a leak. This project is a reminder that prevention belongs inside the daily workflow, not just in platform policy documents.',
          'It also shows how useful small tooling repos can be. Not every strong project needs to be a full application; sometimes a narrow utility that removes a repeated failure mode is the more valuable piece of engineering.',
        ],
      },
    ],
  },
]
