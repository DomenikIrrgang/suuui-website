#!/bin/sh
# Installed on the droplet as /usr/local/bin/suuui-deploy-ssh and set as the
# forced command for CI's key in ~deploy/.ssh/authorized_keys. Whatever the
# client asks to run is passed as a single argument and validated there.
exec sudo -n /usr/local/bin/suuui-deploy "${SSH_ORIGINAL_COMMAND:-}"
