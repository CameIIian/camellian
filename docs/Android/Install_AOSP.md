---
title: AOSPで遊ぼ
description: 旧端末に色んなAOSPを入れて遊ぶ
date: 2026-01-02
tags:
  - Android
---
## 使用端末
Zenfone max pro m1 (3+32GB)  
[https://www.asus.com/jp/mobile-handhelds/phones/zenfone/zenfone-max-pro-m1/](https://www.asus.com/jp/mobile-handhelds/phones/zenfone/zenfone-max-pro-m1/)

※USB2.0を明示しないとCFWがインストール不可能なので注意

## 事前準備
1. adb/fastbootが使える  
2. GSIを準備する  
[https://smartasw.com/archives/4816](https://smartasw.com/archives/4816)

### install fastboot
```sh
adb reboot bootloader

# if after A10, into fastbootd
# fastboot reboot fastboot

fastboot erase system
fastboot flash system

fastboot erase userdata
fastboot erase metadata

fastboot reboot
```

### install orangefox
```
fastboot flash recovery "${path2orangefox_recovery.img}"
fastboot reboot recovery

# wipe -> format_data
# reboot recovery

# install from rom.zip
# reboot system
```

### install AOSP
- matrixx_10.5.2_unofficial_A14(a-crDroid_based_ROM)  
[https://xdaforums.com/t/rom-project-matrixx-10-5-2-unofficial-x00td-android-14-u.4673987/](https://xdaforums.com/t/rom-project-matrixx-10-5-2-unofficial-x00td-android-14-u.4673987/)

## 参考
orangefox: [https://orangefox.download/](https://orangefox.download/)
cfw情報: [https://t.me/s/Asus_X00TD](https://t.me/s/Asus_X00TD)
