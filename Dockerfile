FROM traefik/whoami:v1.10.4@sha256:1699d99cb4b9acc17f74ca670b3d8d0b7ba27c948b3445f0593b58ebece92f04

ENTRYPOINT ["/whoami"]
EXPOSE 80
