# Vulkanは全てを解決するって行ったじゃんね
Tag: Linux, VRChat, 改変
data: 2026/03/15
## 結論
- Resizable BARが必要
- CSMを無効にする必要がありEFIが必要
- vulkanは2022.3.22f1は非動作、新しいBuildは動く(62f3で改変→22f1でupload)
## 調べた/やったこと
1. そもそもUbuntuのMesaDriverは、**種類ごとに分けられていない**
	`mesa-vulkan-drivers`を取得すると、Intel/Nvidia/Radeon向け**全部入る**
	CPU向けVulkanDriverの`llvmpipe`を利用しようとしていた
	→内蔵GPUの無いRyzen5X00シリーズではエラー？

2. mangohudが悪さをしているとか
	過剰にVulkanのレイヤーを増やしているようでUnityのCrashに繋がるらしい？

3. VulkanにはResizable BARという機能が必要
	BIOSから有効化すること(その際にCSMが必要でGRUBでは有効化出来ない)

- ドライバの修正
```sh
# 不要なCPU向けの設定を削除
sudo mv /usr/share/vulkan/icd.d/lvp_icd.json{,.disabled}
```
- shell作成
```sh
#!/usr/bin/zsh
# layerの読み込みを無効化, クラッシュ回避など
rm -rf ~/.cache/unity
rm -rf ~/.cache/Unity
rm -rf ~/.cache/unity3d
rm -rf ~/.cache/nvidia
rm -rf ~/.nv
rm -rf ~/.cache/vulkan

export MESA_VK_VERSION_OVERRIDE=1.3
export SDL_VIDEODRIVER=x11

export UNITY_GFX_DEVICE_INDEX=0
export UNITY_VULKAN_DISABLE_VALIDATION=1
export UNITY_VULKAN_DISABLE_EXTENSIONS=1
export UNITY_SHADER_COMPILER_THREADS=2
export UNITY_DISABLE_VULKAN_MEMORY_MANAGER=1

export VK_LOADER_LAYERS_DISABLE=all
export VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/nvidia_icd.json
export VK_INSTANCE_LAYERS= 
export VK_XCB_SURFACE=1
export VK_PIPELINE_CACHE_PATH=/dev/null

export MONO_GC_PARAMS=nursery-size=64m

export __GL_THREADED_OPTIMIZATIONS=0
export __GLX_VENDOR_LIBRARY_NAME=nvidia
export __GL_SHADER_DISK_CACHE=0

# 任意のVulkanが動作するバージョンを実行
~/Unity/Hub/Editor/2022.3.62f3/Editor/Unity -force-vulkan
```
- UEFIブートへ切り替え
```sh
# MBR to GPT
sudo gdisk /dev/nvme0n1
r
g
w
# make EFI partition
sudo gdisk /dev/nvme0n1
n
(enter)  
(enter)  
+512M  
ef00  
w
y
# format
sudo mkfs.fat -F32 /dev/nvme0n1p3
# mount
sudo mkdir /boot/efi
sudo mount /dev/nvme0n1p3 /boot/efi
# install efi
sudo apt install grub-efi-amd64
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
sudo update-grub
# check UUID
blkid
sudo vi /etc/fstab
# UUID=XXXX /boot/efi vfat defaults 0 1
reboot
# gnu GRUB settings 
insmod part_gpt
insmod fat
set root=(hd0,gpt3)
set prefix=(hd0,gpt3)/EFI/pop
insmod normal
normal
# after booting
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=pop
sudo update-grub
sudo efibootmgr -c -d /dev/nvme0n1 -p 3 -L "Pop!_OS" -l '\EFI\pop\grubx64.efi'
sudo cp /boot/efi/EFI/pop/grubx64.efi /boot/efi/EFI/BOOT/BOOTX64.EFI
sudo bootctl install
sudo kernelstub -v
```
- 2環境の管理
```sh
# 1. 初回作業
# 1.1. 共通Repoの作成, Assetsディレクトリの作成
mkdir AvatarAssets  
cd AvatarAssets  
git init
cp path2vrcItems/ ./AvatarAssets
git add .
git commit -m "initial avatar assets"

# 1.2. 62f3環境の作成
cd Avatar_Work
git init
git submodule add ../AvatarAssets Assets/Avatar

# 1.3. 22f1環境の作成
cd Avatar_Upload
git init
git submodule add ../AvatarAssets Assets/Avatar

# 1.4. .gitignore記述
Library/
Temp/
Obj/
Build/
Logs/
UserSettings/

# 2. 作業
# 62f3で改変

# 3. commit
cd AvatarAssets
git add .
git commit -m "update avatar"

# 4. 作業の反映
cd Avatar_Upload
git submodule update --remote

# 5. Upload
# 22f1でVRCにアップロード
```