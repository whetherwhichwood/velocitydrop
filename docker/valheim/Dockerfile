FROM lloesche/valheim-server:latest

# This image already has Valheim server installed
# We just need to ensure proper configuration

WORKDIR /config

EXPOSE 2456/udp 2457/udp

CMD ["/bin/bash", "/entrypoint.sh"]

