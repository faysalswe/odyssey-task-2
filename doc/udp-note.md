# mediasoup UDP Port Strategy in Kubernetes

## The Problem

mediasoup's WebRTC Worker binds a range of UDP ports (default 40000–40100) for RTP/RTCP
media traffic. Kubernetes Services do not support port ranges — each port must be declared
individually — making the standard Service approach impractical for a 100-port UDP range.

## Strategy Used: `hostNetwork: true`

The mediasoup pod is configured with `hostNetwork: true` in its Deployment spec:

```yaml
spec:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

With `hostNetwork: true`, the pod shares the node's network namespace directly. The
mediasoup Worker binds ports 40000–40100/UDP straight to the node's network interface,
bypassing the normal pod overlay network. No Service port mapping is needed for the UDP
range — clients connect to the node IP on those ports directly.

The HTTP signalling port (3001) is still exposed via a NodePort Service for in-cluster
DNS resolution and stable addressing.

## Trade-offs

| | `hostNetwork: true` | Service with individual UDP ports |
|---|---|---|
| Config effort | Minimal | One entry per port (100 lines) |
| Port isolation | None — pod shares all node ports | Full — only declared ports exposed |
| Multiple replicas | Conflicts (two pods can't bind same port) | Works normally |
| Security posture | Weaker — pod can see all node traffic | Stronger |

## When to Use Each

- **Local cluster / single-node / dev**: `hostNetwork: true` is the pragmatic choice.
- **Production multi-node**: Declare each UDP port in the Service, or use a TURN server
  to front all media traffic on a single predictable port (443/UDP), eliminating the
  need for a port range entirely.
