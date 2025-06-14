#!/bin/bash

# Script untuk membuat user baru jika login sebagai root
# Jalankan script ini HANYA jika Anda login sebagai root

echo "🔧 SiPaling.pro User Setup Script"
echo "================================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script should ONLY be run as root!"
   echo "If you're not root, you don't need this script."
   echo "Run the main installation script instead."
   exit 1
fi

echo "✅ Running as root - creating user for SiPaling.pro"

# Get username
read -p "Enter username for SiPaling.pro (default: sipaling): " USERNAME
USERNAME=${USERNAME:-sipaling}

# Check if user already exists
if id "$USERNAME" &>/dev/null; then
    echo "⚠️  User $USERNAME already exists"
    read -p "Do you want to use this existing user? (y/n): " USE_EXISTING
    if [[ $USE_EXISTING != "y" ]]; then
        echo "❌ Aborted"
        exit 1
    fi
else
    # Create user
    echo "📝 Creating user: $USERNAME"
    adduser $USERNAME
fi

# Add to sudo group
echo "🔑 Adding $USERNAME to sudo group"
usermod -aG sudo $USERNAME

# Verify sudo access
echo "✅ User $USERNAME created and added to sudo group"

echo ""
echo "🚀 Next steps:"
echo "1. Switch to the new user:"
echo "   su - $USERNAME"
echo ""
echo "2. Download and run the installation script:"
echo "   wget https://raw.githubusercontent.com/your-repo/sipaling-pro/main/server/scripts/user-install.sh"
echo "   chmod +x user-install.sh"
echo "   ./user-install.sh"
echo ""
echo "⚠️  DO NOT run the installation script as root!"