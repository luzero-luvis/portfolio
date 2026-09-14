export type WorkCategory = 'Platform' | 'Infrastructure' | 'Backend' | 'Tooling'

export interface Work {
  slug: string
  title: string
  category: WorkCategory
  summary: string
  preview: {
    title: string
    description: string
    contribution: string
    steps: { label: string; icon: string }[]
  }
  stack: string[]
  repo?: string
  kind: string
  layers: string[]
  role: string
  problem: string
  decisions: string[]
  outcome: string
  next: string
}

export const featuredWork: Work[] = [
  {
    slug: 'hetzner-gitops-platform',
    title: 'WindVista platform on Hetzner',
    preview: {
      title: 'WindVista on Hetzner',
      description: 'A shared Kubernetes platform with GitOps delivery across development and beta environments.',
      contribution: 'Workload tuning, monitoring fixes, and operational runbooks.',
      steps: [{ label: 'Git', icon: 'Git' }, { label: 'Kubernetes', icon: 'Kubernetes' }, { label: 'Hetzner', icon: 'Hetzner' }],
    },
    category: 'Platform',
    summary: 'Contributing to the WindVista platform on Hetzner: Flux delivery, workload tuning, and observability across development and beta.',
    stack: ['Hetzner', 'FluxCD', 'Kubernetes', 'Grafana'],
    kind: 'Team project · WindVista',
    layers: ['Workloads · KEDA autoscaling', 'Flux delivery · dev + beta', 'Hetzner nodes · Cilium · Longhorn'],
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
    slug: 'aws-gitops-platform',
    title: 'Production GitOps platform on AWS',
    preview: {
      title: 'AWS GitOps platform',
      description: 'Cluster services, applications, and observability brought together in a versioned GitOps workflow.',
      contribution: 'Platform configuration, delivery layers, and service integration.',
      steps: [{ label: 'Git', icon: 'Git' }, { label: 'Kubernetes', icon: 'Kubernetes' }, { label: 'AWS EKS', icon: 'AWS' }],
    },
    category: 'Platform',
    summary: 'A production-style EKS platform where Git commits reconcile cluster services, applications, secrets, storage, and observability.',
    stack: ['AWS EKS', 'FluxCD', 'Terraform', 'Istio'],
    repo: 'luzero-luvis/aws-fluxcd',
    kind: 'Personal project · GitOps',
    layers: ['Applications · Kustomize overlays', 'Flux reconciliation · ordered layers', 'EKS · Istio · Longhorn · Vault'],
    role: 'Infrastructure design and GitOps configuration across cluster services, platform components, and application delivery.',
    problem: 'A Kubernetes cluster becomes difficult to operate when platform services, applications, secrets, storage, and monitoring are changed independently. The repository needs an explicit delivery order and clear ownership boundaries.',
    decisions: [
      'Use Flux Kustomizations to separate cluster services, infrastructure, configuration, applications, and monitoring into reviewable layers.',
      'Express reconciliation dependencies so controllers and shared services exist before workloads that depend on them.',
      'Combine Istio Gateway API, cert-manager, External Secrets, Longhorn, Velero, Prometheus, Loki, and Alloy as platform building blocks.',
      'Keep environment-specific overlays in Git so changes are reviewable, repeatable, and reversible.',
    ],
    outcome: 'A reviewable GitOps platform layout covering cluster services, delivery, secrets, storage, and observability. The repository makes the intended reconciliation order visible instead of hiding it in manual steps.',
    next: 'Validate recovery and upgrade paths in a running environment, then document the operational evidence for backups, storage, and progressive delivery.',
  },
  {
    slug: 'aws-eks-foundation',
    title: 'EKS platform foundation',
    preview: {
      title: 'EKS infrastructure',
      description: 'A Terraform foundation for private Kubernetes nodes, workload identity, and elastic capacity.',
      contribution: 'Networking, cluster modules, and Karpenter configuration.',
      steps: [{ label: 'Terraform', icon: 'Terraform' }, { label: 'AWS EKS', icon: 'AWS' }, { label: 'Kubernetes', icon: 'Kubernetes' }],
    },
    category: 'Infrastructure',
    summary: 'A modular EKS foundation with private worker nodes, workload IAM, and demand-driven capacity through Karpenter.',
    stack: ['AWS', 'Terraform', 'EKS', 'Karpenter'],
    repo: 'luzero-luvis/eks',
    kind: 'Personal project · Terraform',
    layers: ['Karpenter capacity', 'EKS control plane · add-ons', 'VPC · private subnets · 3 AZ'],
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
  { number: '02', title: 'Delivery & orchestration', description: 'Git commit to running workload, with an explicit reconciliation order across clusters.', tools: ['Kubernetes', 'Argo CD', 'FluxCD', 'Docker'], repo: 'luzero-luvis/argo-k8s-gitops' },
  { number: '03', title: 'Observability & reliability', description: 'Metrics, logs, and operational signals for understanding why a system is behaving as it is.', tools: ['Prometheus', 'Grafana', 'Loki', 'Go'], repo: 'luzero-luvis/aws-fluxcd' },
]
