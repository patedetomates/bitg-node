# welcome info 
echo "*** Welcome to the Bitgreen Cache Server Installer ***"
echo "This will configure your server to cache the Bitgreen blockchain data in a local Postgres database and serrve the data via public API"
echo 

read -n 1 -s -r -p "Press any key to continue"

# root privileges check
if [ "$EUID" -ne 0 ]
  then echo "Please run this script with root privileges"
  exit
fi

# install Rust
echo "installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup install nightly
rustup default nightly
rustup target add wasm32-unknown-unknown
apt install clang
echo "Rust install and configuration successful"
echo

# install Bitgreen node
echo "cloning Bitgreen Github repository..."
git clone https://github.com/bitgreen/bitg-node.git
echo "Bitgreen Github repository successfully cloned"
echo
echo "building Bitgreen node..."
cd bitg-node
cargo build --release
echo "Bitgreen node build successful"
echo

# launch Bitgreen node
echo "launching Bitgreen node"
screen -d -m ./target/release/bitg-node
echo "Bitgreen node launched in detached screen environment"
echo

# install Postgresql
echo "installing Postgresql..."
apt install postgresql
echo "Postgresql install successful"
echo 

echo "The Bitgreen installer will now open you environment file. Please input your relevant settings."
read -n 1 -s -r -p "Press any key to continue."
cp env.example .env
nano .env

cat .env
>.env
echo '# this file was auto-generated by the Bitgreen installer'>.env
echo 'NODE_ENV=production'>>.env
echo '# postgresql config'>>.env
echo 'PGHOST=localhost'>>.env
echo 'PGUSER=postgresql'>>.env
echo 'PGDATABASE=cache-engine'>>.env
PGPASSWORD=
PGPORT=5432
# rpc node provider
RPC_PROVIDER=ws://127.0.0.1:9944
# api endpoint port
API_PORT=3000

# configure Postgres
echo "configuring Postres"
cd cache-engine
npm install
npm run migrate up
echo "Postgres config complete"
echo 

# run crawler to download blocks and save to Postgres
screen -d -m npm run node
echo "Block crawler launched in detached screen environment"

# run api server to provide public endpoints
screen -d -m npm run api
echo "API service launched in detached screen environment"
echo
echo "Installation complete. Your Bitgreen node is up and running."
echo "Our bits are greener :)"

:'
echo "Enter Your Name: "
read input_name
echo "Welcome ${input_name}!"

while true; do
    read -p "Is this server a master or a slave? (if unsure, select master)" yn
    case $yn in
        [Mm]* ) echo "master"; break;;
        [Ss]* ) echo "slave"; exit;;
        * ) echo "Please select 'm' for master or 's' for slave.";;
    esac
done
'


