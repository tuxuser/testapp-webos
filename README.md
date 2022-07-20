# Testapp for WebOS

## Requirements

* Linux host system
* WebOS buildroot toolchain - arm-webos-linux-gnueabi_sdk-buildroot (https://github.com/openlgtv/buildroot-nc4/releases)
* git
* CMake
* npm

## Build

Build webOS frontend/service: `./build.sh`

Both scripts take an environment variable `TOOLCHAIN_DIR`, defaulting to: `$HOME/arm-webos-linux-gnueabi_sdk-buildroot`

To provide an individual path, call `export TOOLCHAIN_DIR=/your/toolchain/path` before executing respective scripts.
