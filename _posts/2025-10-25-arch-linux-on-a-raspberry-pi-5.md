---
title: "Arch Linux on a Raspberry Pi 5"
categories: computers
layout: post
date: 2025-10-25
description: "Notes on setting up Arch Linux on a Raspbery Pi 5."
permalink: arch-linux-on-a-raspberry-pi-5
---

ARch Linux is my go-to Linux distribution for its simplicity and ease of build (through AUR). I was aware it had ARM support (through [Arch Linux ARM](https://archlinuxarm.org/)), but it turns out official Raspberry Pi 5 support is, at the time of writing, not yet available. Guides for getting the Pi 5 up and running are sparse and rather contradictory, and I'm not quite willing to go down a rabbithole for this project; I want to *do things* with the Pi, not tinker with OS installation for days on end.

It turns out Manjaro ARM has official Raspberry Pi 5 support, and since Manjaro is based on Arch Linux, I decided to give that a try instead, through the official [manjaro-arm-installer](https://gitlab.manjaro.org/manjaro-arm/applications/manjaro-arm-installer).

The rest of this post are my notes on the process.

## Installation

[Timestamp: 2025-10-21]

Using the steps from [Installing and using from gitlab](https://gitlab.manjaro.org/manjaro-arm/applications/manjaro-arm-installer#installing-and-using-from-gitlab):

```bash
git clone https://gitlab.manjaro.org/manjaro-arm/applications/manjaro-arm-installer
cd manjaro-arm-installer
chmod +x manjaro-arm-installer
sudo bash ./manjaro-arm-installer (Use Default stable branch)
```

1. Pick `rpi4` as the device (Raspberry Pi 5 uses the same image as Pi 4)
2. Pick your Manjaro edition (I picked `minimal` since this is for a server that I'll SSH into)
3. Pick your username and additional groups (default: wheel,sys,audio,input,video,storage,lp,network,users,power)
4. Enter full name
5. Set user password and root password
6. (Insert the device before this step! There is no refresh button, so you'll have to restart the installer if you insert the device later)
6. Pick your SD card device
7. Pick your filesystem (I picked `ext4`)
8. Choose your locale
9. Choose your keyboard layout
10. Enter desired hostname

Take a picture of your config before you click Yes.

```
==> Proceeding....
  -> Getting package lists ready for rpi4 minimal edition...
==> Getting <device> ready with ext4 for rpi4...
==> Creating install for rpi4...
  -> Used device is /dev/sda
  -> Downloading latest aarch64 rootfs...
Manjaro-ARM-aarch64-latest.tar.gz   100%[=============>] 201.71M  9.62MB/s in 22s     
  -> Extracting aarch64 rootfs...
  -> Setting up keyrings...
  -> Waiting for pacman gnupg to settle...
  -> Populating pacman gnupg...
  -> Setting target branch arm-stable...
  -> Generating mirrorlist...
  -> Installing packages for minimal on rpi4...
:: Synchronizing package databases...
 core is up to date
 extra is up to date
 community                                                                               29.0   B  23.0   B/s 00:01 [#####################################################################] 100%
warning: systemd-libs-255.3-1 is up to date -- reinstalling
:: Starting full system upgrade...
resolving dependencies...

... package installation filler ...

... system setup logs ...
```

`archlinux-keyring` setup took a long time
- `archlinux.gpg` adding keys
- signing trusted keys locally
- disabling revoked keys
- updating trust database

all the while, `gpg` kept warning about insecure memory.

You probably want to go do something else for the next 30-45 minutes while this is happening. I was installing to a microSD card via a USB reader, it might be faster with an SSD or faster disk over USB 3.

```
  -> Setting up system settings...
<scary message in red>
System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down
</scary message>
...
===> Installing default ext4 RPi cmdline.txt /boot...
===> Installing default /boot/config.txt file...
  -> If you get an error stating 'failed to preserve ownership ... Operation not permitted', it's expected, since the boot partition is FAT32 and does not support ownership permissions...
==> Time : 18.92 minutes...
```

Finally it's done. I could swear it felt longer than 19 minutes.

Time to see if it boots.

## First boot and system setup

While the disk was intended for use in a Raspberry Pi 5, I happened to have a Raspberry Pi 500 (bundled with keyboard), which made booting easier since I didn't have to plug in a monitor as well.

```
Manjaro Linux 6.6.33--2-MANJARO-RPI5 (tty1)

little-pi login:
```

Sweet.

[Timestamp: 2025-10-??]