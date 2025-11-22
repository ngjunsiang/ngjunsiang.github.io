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
 community is up to date
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

[Timestamp: 2025-11-21]

_... one long month later ..._

```
Manjaro Linux 6.6.33--2-MANJARO-RPI5 (tty1)

little-pi login: rpi
Password:

Welcome to Manjaro ARM
""Website: https://manjaro.org""
""Forum: https://forum.manjaro.org/c/arm""
""Matrix: manjaro-arm-public:matrix.org""
Last login: Fri Jan 26 09:01:55 on tty1
[rpi@little-pi]$
```

Clearly some setup is needed.

First, connect to WiFi. There aren't many options for connecting to a WPA network, I'm using [`wpa_supplicant`](https://wiki.archlinux.org/title/Wpa_supplicant) here.

```bash
[rpi@little-pi]$ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

/etc/wpa_supplicant/wpa_supplicant.conf

ctrl_interface=/run/wpa_supplicant
update_config=1

[rpi@little-pi]$ sudo wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
Successfully initialized wpa_supplicant
...

[rpi@little-pi]$ sudo wpa_cli
wpa_cli v2.10
...

Selected interface 'wlan0'

Interactive mode

> add_network
0
<3>CTRL-EVENT-NETWORK-ADDED 0
> set_network 0 ssid "Your_SSID"
OK
> set_network 0 psk "Your_PASSWORD"
OK
> enable_network 0
OK
<3>CTRL-EVENT-SCAN-STARTED
<3>CTRL-EVENT-SCAN-RESULTS
<3>WPS-AP-AVAILABLE
<3>Trying to associate with SSID 'Your_SSID'
<3>Associated with xx:xx:xx:xx:xx:xx
<3>CTRL-EVENT-CONNECTED - Connection to xx:xx:xx:xx:xx:xx completed [id=0 id_str=]
<3>CTRL-EVENT-SUBNET-STATUS-UPDATE status=0
> save_config
OK
> quit
```

Now I need an IP address: https://wiki.archlinux.org/title/Network_configuration#Network_management

```bash
[rpi@little-pi]$ sudo dhcpcd wlan0
sending commands to dhcpcd process
```

Finally, time to update packages:

```bash
[rpi@little-pi]$ sudo pacman -Syu
:: Synchronizing package databases...
 core is up to date
 extra is up to date
 community is up to date
:: Starting full system upgrade...
 there is nothing to do
```

Hmm. Fine then. Let's install an AUR helper to make life easier:

```bash
[rpi@little-pi]$ sudo pacman -S --needed base-devel git
resolving dependencies...
looking for conflicting packages...

Packages (23) autoconf-2.72-1  automake-1.16.5-1  bison-3.8.2-1  debugedit-5.0-5
              fakeroot-1.33-2  flex-2.6.4-5  gc-8.2.6-1  gcc-12.1.0-2.1
              guile-3.0.9-1  libisl-0.26-1  libmpc-1.3.1-1  libtool-2.4.7-2
              m4-1.4.19-3  make-4.4.1-2  patch-2.7.6-10  perl-error-0.17029-5
              perl-mailtools-2.21-7  perl-timedate-2.33-5  pkgconf-2.1.0-2
              texinfo-7.1-2  which-2.21-6  base-devel-1-1  git-2.44.0-1

Total Download Size:    53.25 MiB
Total Installed Size:  266.90 MiB

:: Proceed with installation? [Y/n]
:: Retrieving packages...
...

[rpi@little-pi]$ git clone https://aur.archlinux.org/yay.git
[rpi@little-pi]$ cd yay
[rpi@little-pi]$ makepkg -si
==> Making package: yay 12.5.2-2 (Fri 21 Nov 2025 09:56:28 PM +08)
==> Checking runtime dependencies...
==> Installing missing dependencies...
error: target not found: pacman>6.1
```

Hmm, `base-devel` only provides `pacman 6.0.2-2`. Apparently the reason it's so old is because Manjaro ARM on the `arm-stable` mirrors hasn't been updated in quite a while. I switched to `arm-unstable`:

```bash
[rpi@little-pi]$ sudo pacman-mirrors -aS unstable
::INFO Branch in config is changed
::INFO Downloading mirrors from Manjaro
::INFO => Mirror pool: https://repo.manjaro.org/mirrors.json
::INFO => Mirror status: https://repo.manjaro.org/mirrorstatus.json
::INFO Using default mirror file
::INFO Querying mirrors - This may take some time

... many minutes later ...

::INFO Mirror list generated and saved to /etc/pacman.d/mirrorlist
```

This added a whole list of mirrors to `/etc/pacman.d/mirrorlist`. I only want the fastest ones.

From https://wiki.manjaro.org/index.php?title=Pacman-mirrors:

```bash
[rpi@little-pi]$ sudo pacman-mirrors --fasttrack && sudo pacman -Syu
::INFO Downloading mirrors from Manjaro
::INFO => Mirror pool: https://repo.manjaro.org/mirrors.json
::INFO => Mirror status: https://repo.manjaro.org/mirrorstatus.json
::INFO Using default mirror file
::INFO Querying mirrors - This may take some time

... many minutes later ...

::INFO Mirror list generated and saved to /etc/pacman.d/mirrorlist
: : Synchronizing package databases...
 core is up to date
 extra is up to date
 community is up to date
:: Some packages should be upgraded first...
::Resolving dependencies...
::Looking for conflicting packages...

Packages (2)  archlinux-keyring-20250807.1-1  archlinuxarm-keyring-20240419-1

... many updates/upgrades and some package conflict resolving later ...

... handling pacnew and pacsave files from the upgrade ...
```

We finally have `pacman-7.0`. Back to installing `yay`:

```bash
[rpi@little-pi]$ makepkg -si
==> Making package: yay 12.5.2-2 (Fri 21 Nov 2025 09:56:28 PM +08)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
  -> Downloading yay-12.5.2.tar.gz...
  ...

==> Installing package yay with pacman -U ...
loading packages...
resolving dependencies...
looking for conflicting packages...

Packages (1) yay-12.5.2-2

Total Installed Size:  8.70 MiB

:: Proceed with installation? [Y/n]
...
```

Done. Let's make sure we didn't break anything; quick reboot first:

```bash
[rpi@little-pi]$ sudo reboot
```

## Troubleshooting wifi

... Phew. But, wifi didn't connect. I configured `wpa_supplicant earlier` but not DHCP client to run on boot. I usually configure with NetworkManager, but since this is a server setup I'm going to ask ChatGPT.

Some back-and-forth later, I uninstalled `iwd` which was fighting for the wifi, and have a `/etc/systemd/network/20-wlan0.network` file:

```ini
[Match]
Name=wlan0

[Network]
DHCP=yes
```

Still not connecting. `ip link` shows `wlan0` is up. `iw dev wlan0 link` shows it's not connected. `wpa_supplicant -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf` shows that authentication is timing out. ChatGPT found in a search that on Broadcom `brcmfmac` (especially BCM4345 / 43455), there are known issues around offloaded authentication (SWSUP) or WPA3/SAE handshake. The fix is to disable those offloads through `modprobe` by creating a modprove config file `/etc/modprobe.d/brcmfmac.conf` with the following content:

```conf
# Disable SWSUP + SAE to resolve wlan0 authentication failure
options brcmfmac roamoff=1 feature_disable=0x82000
```

Reboot again. Still not working.

From ChatGPT's suggestion to `dmesg | grep brcmfmac` (searching for Broadcom-related messages), I saw:

```
brcmfmac mmc1:0001:1: loading /lib/firmware/6.12.41-1-MANJARO-RPI5/brcm/brcmfmac43455-sdio.raspberrypi,500.bin failed with error -20
```

It seems the drivers were being loaded from `/lib/firmware/6.12.41-1-MANJARO-RPI5` which was ... empty. Oops, somehow the system upgrade earlier had not installed `linux-firmware` for the RPi5?

Since I'm going to need to dig up a LAN cable, that's it for today.

[Timestamp: 2025-11-22]

With a LAN cable, and searching `pacman` for the requisite packages again, it appears they are all installed: `firmware-raspberrypi`, `linux-firmware`, even `linux-rpi5`. Back to ChatGPT again. Apparently the above error message indicate that the kernel may be searching in a prefixed directory before searching in a fallback directory. It recommended `dmesg | grep -i brcmfmac`:

```bash
[rpi@little-pi]$ dmesg | grep -i brcmfmac
brcmfmac mmc1:0001:1: loading /lib/firmware/6.12.41-1-MANJARO-RPI5/brcm/brcmfmac43455-sdio.raspberrypi,500.bin failed with error -20
... other similar error -20 messages ...
usbcore: registered new interface driver brcmfmac
brcmfmac mmc1:0001:1: brcmf_c_preinit_dcmds: Firmware: BCM4345/6 wl0: Apr 15 2021 03:03:20 version 7.45.234 (4ca95bb CY) FWID 01-996384e2
```

So it was loaded after all. ChatGPT suggested checking the driver parameters:

```bash
[rpi@little-pi]$ ls /sys/module/brcmfmac/parameters/
alternative_fw_path  debug  roamoff
[rpi@little-pi]$ cat /sys/module/brcmfmac/parameters/roamoff
1
```

Odd, `feature_disable` is not listed. ChatGPT suggested the module might not support that parameter, but we can check:

```bash
[rpi@little-pi]$ modinfo brcmfmac | grep parm
... selected parameters shown here only ...
parm:    debug:Level of debug output (int)
parm:    feature_disable:Disable features (int)
parm:    roamoff:Do not use internal roaming engine (int)
```

Hmm, it does suppport. ChatGPT suggests it might not be exposed. Anyway, I don't care if it's supported I care about working wifi.

Back to checking link status:

```bash
[rpi@little-pi]$ ip link show wlan0
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DORMANT group default qlen 1000
    link/ether b8:27:eb:xx:xx:xx brd ff:ff:ff:ff:ff:ff
[rpi@little-pi]$ iw dev wlan0 link
Connected to xx:xx:xx:xx:xx:xx (on wlan0)
  SSID: Your_SSID
  freq: 5180.0
  RX: 4346 bytes (32 packets)
  TX: 2854 bytes (24 packets)
  signal: -17 dBm
  rx bitrate: 6.0 MBit/s
  tx bitrate: 24.0 MBit/s
  bss flags: short-slot-time
  dtim period: 4
  beacon int: 200
```

Ooh, surprise, the fix worked! I don't like setting parameters unnecessarily since it might complicate future issues, so let's remove `feature_disable=0x82000` from `/etc/modprobe.d/brcmfmac.conf` and reboot again. Nope, no connectivity. Put it back, reboot, and wifi is back. A very strange issue with the driver not exposing `feature_disable` and yet it is still needed.

Anyway, working Arch Linux on a Raspberry Pi 5! Next, to have wifi issues handled automatically; time to install NetworkManager. And not forgetting to disable `wpa_supplicant` to avoid wifi-fighting (NetworkManager already uses `wpa_supplicant`).

```bash
[rpi@little-pi]$ yay -S networkmanager
...
[rpi@little-pi]$ sudo systemctl enable NetworkManager
... 3 symlinks created ...
[rpi@little-pi]$ sudo systemctl disable wpa_supplicant.service
...
[rpi@little-pi]$ sudo systemctl disable wpa_supplicant@wlan0.service
...
```

Connect to wifi using NetworkManager so it can manage reconnections automatically:

```bash
[rpi@little-pi]$ nmcli device wifi connect "SSID" password "PASSWORD"
Device 'wlan0' successfully activated with 'xxxx-xxxx-xxxx-xxxx'.
```

Reboot: wifi still works 🙏

# SSH

Next, to set up SSH so I can access the Pi headlessly. `openssh` is already installed so I'm skipping that.

```bash
[rpi@little-pi]$ sudo systemctl enable sshd
[rpi@little-pi]$ sudo systemctl start sshd
```

Basic security: disable root login and password authentication. Edit `/etc/ssh/sshd_config`:

```conf
PermitRootLogin no
PasswordAuthentication yes
```

SSH authentication not set up here since I don't plan to connect remotely yet.

Following other security recommendations from ChatGPT:

1. Install `fail2ban` to protect against brute-force attacks.

```bash
[rpi@little-pi]$ yay -S fail2ban
...
[rpi@little-pi]$ sudo systemctl enable fail2ban
Created symlink /etc/systemd/system/multi-user.target.wants/fail2ban.service → /usr/lib/systemd/system/fail2ban.service.
[rpi@little-pi]$ sudo systemctl start fail2ban
```

2. Set up a basic firewall using `ufw` (Uncomplicated Firewall).

```bash
[rpi@little-pi]$ yay -S ufw
...
[rpi@little-pi]$ sudo ufw allow 22/tcp
Rules updated
Rules updated (v6)
[rpi@little-pi]$ sudo ufw enable
Firewall is active and enabled on system startup
```

Now I can connect to the RPi through VSCode (after instaling the Remote - SSH extension) using the username and password set during installation.
