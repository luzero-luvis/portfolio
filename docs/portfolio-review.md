# Portfolio review — September 2026

## Direction

Lead with the actual engineering work: a clear DevOps identity, three detailed projects, implementation decisions, and accessible contact links. The new site presents selected work directly on the homepage and gives each featured project its own URL. A searchable archive preserves breadth without overwhelming the introduction.

The content is based on the local repositories available during the review, not inferred commercial outcomes.

## Online references

- [GreatFrontEnd: Frontend Developer Portfolio](https://www.greatfrontend.com/blog/frontend-developer-portfolio): make strong projects easy to find, explain scope and decisions, include honest limitations, and avoid invented impact. These presentation principles also apply to infrastructure work.
- [W3C WAI: Designing for Web Accessibility](https://www.w3.org/WAI/tips/designing/): clear navigation, sufficient contrast, labels, and designs that work at different viewport sizes.
- [web.dev: Web Vitals](https://web.dev/articles/vitals): assess loading, interactivity, and layout stability. This redesign removes the artificial loading screen and automatically animated content; it does not claim a measured Lighthouse or field performance score.

## Featured work and evidence

| Case study | Local evidence | Presentation |
| --- | --- | --- |
| Hetzner GitOps / WindVista | `sirpi-in/wv-hetzner-gitops/README.md`, development cluster Flux configuration, disaster recovery documentation, and commits by Luvis authors | Team platform contribution. Attribute memory tuning, OOM/headroom monitoring corrections, scaling adjustments, and operational docs to Luvis; describe the broader architecture as shared work. |
| Kubernetes SRE application | `luvis-in/sre/README.md`, `internal/agents/diagnostic.go`, approval handlers, and application file structure | Application in development; live diagnostic tools and approval workflow, with metering and validation still to complete. |
| EKS foundation | `luvis-in/eks/README.md` and Terraform module structure | Infrastructure project with private worker nodes, workload IAM, and Karpenter. No measured production uptime or savings claimed. |

The Hetzner repository documents development and beta environments. It includes Rook Ceph configuration that is not currently serving either cluster and `prune: false` in key Flux layers. The case study retains these limits rather than implying every declared component is live.

## Broader repository review

Reviewed the top-level folder inventory and available README introductions across `/home/luvistect/luvis-in`, with deeper reads of the selected projects and their configuration/code.

Included in the archive:
- `cloud-infra`, `gke`, `terraform-eks`
- `k8s-gitops`, `aws-fluxcd`, `k8s-install`, `aws-infra`
- `weather-api`, `blogging-platform-api`
- `cdn-demo`, `ecs-demo`, `ebs-demo`
- `terraform-drift-lab`, `terraform-aws-vpc-lab`, `terraform-workspaces-demo`
- `terraform-aws-lamda`, `vpn`, `tasktraker-cli`

Other reviewed folders:
- `checkout-api`: fault injection learning app; used as context for the SRE case study. No Git remote was available for a repository link.
- `cnpg`: database manifests; no README or Git remote was available for a standalone case study.
- `git-secret-scanner`: global Gitleaks hook tooling under a work account; omitted from the public-facing archive pending ownership/public-access clarity.
- `terraform-aws-talos`: upstream Isovalent checkout. Not presented as original work.
- `terraform-aws-talos-module`: upstream-derived module; the portfolio instead highlights the user's concrete `aws-infra` configuration.
- `Domain-Management-Saas-backend`: another author's remote; no unsupported ownership claim.
- `first-api`, `small-go-webserver`, `k8s-upgrade`, `terraform`, `terraform-modules`, and `runbook`: sparse entry documentation; kept out of the curated archive.
- `til`: linked as an architecture reading notebook, not as systems personally built.
- `blogs`, `go-learning-roadmaps`, `luzero-luvis`, `english-learning-time-table`, and `my-timetable`: writing, profile, or learning material rather than featured engineering deliverables.
- `portfolio`: the site itself.

Repository links were derived from local Git remotes where available. In particular, `sre` maps to `k8s-sre-agent` and `k8s-gitops` maps to `argo-k8s-gitops`. Remote existence, visibility, and deployed service health are not established by a local checkout.

## Validation

- Production build and TypeScript checks pass with `npm run build`.
- Browser checks cover 10 routes at 320, 390, 768, 1024, and 1440 pixels, including image loading and horizontal overflow.
- Interaction checks cover project categories and search, empty-state recovery, case studies, article navigation, direct reloads, browser history, mobile menu and Escape, clipboard success and failure, reduced motion, and missing routes.
- Keyboard verification confirms that the skip link is first in the tab order and moves focus to the main content.
- Desktop and mobile screenshots were inspected; inherited Tailwind container padding was corrected during mobile review.

## Ongoing content maintenance

Keep the distinction between professional team contributions, personal projects, labs, and undeployed configuration. Add measured outcomes only when the supporting experiment or operational record is available. If a resume or approved project screenshot becomes available, link the actual asset rather than adding a placeholder download.
