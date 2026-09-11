export type WorkCategory = 'Platform' | 'Infrastructure' | 'Backend' | 'Tooling'

export interface Work {
  slug: string
  title: string
  category: WorkCategory
  summary: string
  stack: string[]
  repo?: string
  kind: string
  role: string
  problem: string
  decisions: string[]
  outcome: string
  next: string
}

export const featuredWork: Work[] = [
  {
    slug: 'hetzner-gitops-platform',
    title: 'Keeping a multi-environment platform in sync.',
    category: 'Platform',
    summary: 'Contributing to the WindVista platform on Hetzner: Flux delivery, workload tuning, and observability across development and beta.',
    stack: ['Hetzner', 'FluxCD', 'Kubernetes', 'Grafana'],
    kind: 'Team project · WindVista',
    role: 'Platform contributor. My contributions include memory tuning, monitoring fixes, scaling configuration, and operational documentation within a shared team repository.',
    problem: 'A shared Kubernetes platform needs repeatable deployments, environment-specific configuration, and monitoring that helps distinguish a current issue from stale signals.',
    decisions: [
      'The platform separates infrastructure controllers, configuration, applications, and monitoring. Flux dependencies express reconciliation order across development and beta clusters.',
      'My workload changes address both over-provisioned memory limits and services or jobs experiencing out-of-memory failures, alongside worker replica and autoscaler adjustments.',
      'My monitoring changes refine memory-headroom reporting, distinguish workloads from pods, and correct stale OOM events and misleading timestamps.',
      'I contribute operational documentation, including Flux token rotation and clearer migration runbooks. The platform combines Cilium, Envoy Gateway, Flagger, KEDA, and Longhorn with Prometheus, Loki, and Alloy.',
    ],
    outcome: 'A contribution to the day-to-day operation of a shared platform: more specific resource configuration, clearer memory diagnostics, and documented maintenance procedures. These are repository-backed changes, without a claimed uptime or cost-saving figure.',
    next: 'Continue validating resource changes against workload behavior and rehearsing recovery. The repository uses prune: false in key Flux layers, so removing a manifest also requires deliberate resource cleanup. Rook Ceph configuration exists but is documented as not currently serving either cluster.',
  },
  {
    slug: 'kubernetes-sre-platform',
    title: 'An SRE copilot. With a human in control.',
    category: 'Platform',
    summary: 'From a cluster question to live diagnostics and an approved fix. A Kubernetes investigation workflow built with Go and React.',
    stack: ['Go', 'Kubernetes', 'Prometheus', 'React'],
    repo: 'luzero-luvis/k8s-sre-agent',
    kind: 'Application · in development',
    role: 'Application development across the Go backend, diagnostic workflow, and React interface.',
    problem: 'Investigating Kubernetes incidents means moving between metrics, logs, and cluster state. An assistant can connect that evidence, but changes to a cluster need a deliberate approval boundary.',
    decisions: [
      'Separate guardrail, triage, and diagnostic stages so investigations follow an explicit workflow.',
      'Query Prometheus, Loki, and the Kubernetes API for live evidence.',
      'Require approval before diagnostics and again before remediation, with a streaming conversation between a Go backend and React interface.',
      'Keep browser requests on the same origin with an nginx API proxy, and persist incidents and sessions using PostgreSQL and Redis.',
    ],
    outcome: 'The repository brings chat, incident records, diagnostic tools, and approval gates into one application. A companion checkout fault lab provides reproducible latency and CPU scenarios.',
    next: 'Measure diagnostic accuracy against repeatable faults and complete token-usage metering. The AI observability view is documented as a placeholder.',
  },
  {
    slug: 'aws-eks-foundation',
    title: 'A Kubernetes foundation, from the network up.',
    category: 'Infrastructure',
    summary: 'A modular EKS foundation with private worker nodes, workload IAM, and demand-driven capacity through Karpenter.',
    stack: ['AWS', 'Terraform', 'EKS', 'Karpenter'],
    repo: 'luzero-luvis/eks',
    kind: 'Infrastructure project',
    role: 'Infrastructure configuration and documentation, using Terraform modules to connect networking, cluster services, and workload capacity.',
    problem: 'A useful Kubernetes foundation needs more than a control plane. Networking, workload permissions, node capacity, and storage need to fit together and remain understandable.',
    decisions: [
      'Separate public, private, and intra subnet tiers across three availability zones, with worker nodes in private subnets.',
      'Configure workload IAM, encrypted EBS volumes, and IMDSv2 as explicit infrastructure controls.',
      'Keep system workloads on a managed node group and configure Karpenter for application capacity.',
      'Document NAT gateway choices, VPC endpoints, and network paths alongside the Terraform modules.',
    ],
    outcome: 'A reviewable Terraform foundation covering the network, EKS, add-ons, storage, and autoscaling. Documentation explains the operational purpose of its components.',
    next: 'Validate workload-specific scaling, recovery, and cost assumptions in a running environment. Configuration alone does not demonstrate production uptime.',
  },
]

export const archiveWork = [
  { title: 'Cloud infrastructure delivery', category: 'Infrastructure', description: 'Terraform PR workflows with OIDC, TFLint, Checkov, and separate environments.', repo: 'luzero-luvis/cloud-infra', stack: ['Terraform', 'GitHub Actions', 'AWS'] },
  { title: 'GKE foundation', category: 'Infrastructure', description: 'Regional GKE modules and workload templates. Configuration only; not deployed.', repo: 'luzero-luvis/gke', stack: ['GCP', 'Terraform', 'GKE'] },
  { title: 'Argo CD cluster platform', category: 'Platform', description: 'An app-of-apps layout with ordered controller, configuration, application, and monitoring layers.', repo: 'luzero-luvis/argo-k8s-gitops', stack: ['Argo CD', 'Helm', 'Istio'] },
  { title: 'EKS staging & autoscaling labs', category: 'Infrastructure', description: 'Private cluster access, a Packer-built CI runner, and Kubernetes scaling examples.', repo: 'luzero-luvis/terraform-eks', stack: ['EKS', 'Packer', 'KEDA'] },
  { title: 'FluxCD cluster platform', category: 'Platform', description: 'Layered GitOps configuration for cluster services, applications, and observability.', repo: 'luzero-luvis/aws-fluxcd', stack: ['FluxCD', 'Istio', 'Loki'] },
  { title: 'Kubernetes installation', category: 'Platform', description: 'Ansible playbooks for Kubernetes and Cilium on cloud and on-premises hosts.', repo: 'luzero-luvis/k8s-install', stack: ['Ansible', 'Cilium', 'Linux'] },
  { title: 'Talos on AWS', category: 'Infrastructure', description: 'Cluster configuration using Talos, Cilium, and AWS cloud integration.', repo: 'luzero-luvis/aws-infra', stack: ['Talos', 'Cilium', 'Terraform'] },
  { title: 'Weather API', category: 'Backend', description: 'A Go weather service with Redis caching, health checks, and container delivery.', repo: 'luzero-luvis/weather-api', stack: ['Go', 'Redis', 'Docker'] },
  { title: 'Blogging platform API', category: 'Backend', description: 'A layered Go service for creating, reading, and updating PostgreSQL-backed posts.', repo: 'luzero-luvis/blogging-platform-api', stack: ['Go', 'Chi', 'PostgreSQL'] },
  { title: 'CloudFront delivery lab', category: 'Infrastructure', description: 'Static delivery from a private S3 origin using CloudFront Origin Access Control.', repo: 'luzero-luvis/cdn-demo', stack: ['CloudFront', 'S3', 'Terraform'] },
  { title: 'ECS Fargate lab', category: 'Infrastructure', description: 'Container publishing to ECR and a Fargate service provisioned with Terraform.', repo: 'luzero-luvis/ecs-demo', stack: ['ECS', 'ECR', 'Docker'] },
  { title: 'Terraform drift & recovery', category: 'Infrastructure', description: 'A hands-on lab for state drift, EBS snapshots, and restoring persistent data.', repo: 'luzero-luvis/terraform-drift-lab', stack: ['Terraform', 'EBS', 'AWS'] },
  { title: 'VPC networking lab', category: 'Infrastructure', description: 'Two peered VPCs with documented packet paths, NAT, routes, and security boundaries.', repo: 'luzero-luvis/terraform-aws-vpc-lab', stack: ['VPC', 'Networking', 'Terraform'] },
  { title: 'Multi-cloud VPN', category: 'Infrastructure', description: 'Pritunl and OpenVPN configuration on AWS or DigitalOcean.', repo: 'luzero-luvis/vpn', stack: ['Ansible', 'Terraform', 'OpenVPN'] },
  { title: 'Environment separation lab', category: 'Infrastructure', description: 'Explore Terraform workspaces and directory-based environment separation.', repo: 'luzero-luvis/terraform-workspaces-demo', stack: ['Terraform', 'State'] },
  { title: 'Serverless request path', category: 'Infrastructure', description: 'An API Gateway, private VPC Link, ALB, and Lambda infrastructure challenge.', repo: 'luzero-luvis/terraform-aws-lamda', stack: ['Lambda', 'API Gateway', 'WAF'] },
  { title: 'Elastic Beanstalk lab', category: 'Infrastructure', description: 'Application delivery configuration with autoscaling, HTTPS, and managed DNS.', repo: 'luzero-luvis/ebs-demo', stack: ['AWS', 'Terraform', 'Cloudflare'] },
  { title: 'Task tracker CLI', category: 'Tooling', description: 'A command-line task tracker built as a backend learning exercise.', repo: 'luzero-luvis/tasktraker-cli', stack: ['CLI', 'Learning project'] },
] satisfies { title: string; category: WorkCategory; description: string; repo: string; stack: string[] }[]

export const capabilities = [
  { number: '01', title: 'Infrastructure as code', description: 'Networks, clusters, and cloud resources with explicit boundaries and repeatable configuration.', tools: ['AWS', 'GCP', 'Terraform', 'Ansible'], repo: 'luzero-luvis/cloud-infra' },
  { number: '02', title: 'Delivery & orchestration', description: 'From a change in Git to a running workload, with a deployment order you can understand.', tools: ['Kubernetes', 'Argo CD', 'FluxCD', 'Docker'], repo: 'luzero-luvis/argo-k8s-gitops' },
  { number: '03', title: 'Observability & reliability', description: 'Metrics, logs, and diagnostic workflows that help explain what a system is doing.', tools: ['Prometheus', 'Grafana', 'Loki', 'Go'], repo: 'luzero-luvis/k8s-sre-agent' },
]
