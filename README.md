# ICP-Ambassador-Program

Welcome to your new ICP-Ambassador-Program project and to the Internet Computer development community. 

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with ICP-Ambassador-Program, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

## Local development setup

To start working on your project, you need to clone the project and install the required dependencies:

```bash
git clone https://github.com/ICP-hub/Ambassador-Program.git
cd ICP-Ambassador-Program/
npm install
```
## Configuration Instructions

**Create a `authdata.js` file in following path :**
```bash
/src/ICP-Ambassador-Program-frontend/src/Components/auth/authdata.js
```

Put your Discord `Client ID` and `Client Secret` in the `authdata.js` file as follows : 
```bash
export const DISCORD_CLIENT_ID="sample_client_id"
export const DISCORD_CLIENT_SECRET="sample_client_secret"
```
Replace `sample_client_id` and `sample_client_secret` with your Discord `Client ID` and `Client Secret` respectively.

Before running the project, you must update the configuration files with your own values.

*Open the configuration file `(e.g., DevelopmentConfig.js)`.*

Replace the placeholder values with your actual values for `BASE_URL`, `DISCORD_CLIENT_ID`, and any other constants:

## Ledger Canister Integration

This section explains how to integrate the Ledger canister into your project. Follow the steps below to set up the necessary files and configurations.

To integrate the Ledger canister, you need to include specific files inside the `/src/declarations/ledger` directory. These files are critical for interacting with the Ledger canister.

**Directory Structure:**

```plaintext
/src/declarations/ledger/
    ├── index.js
    ├── ledger.did.js
```

Copy the `/ledger-files/ledger.did.js` and `ledger-files/index.js` files and paste it to the `/src/declarations/ledger` directory.

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Build your project
./build.sh

# Deploy pulled dependencies on the local replica
dfx deps deploy

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```
> [!NOTE]  
> If `dfx deploy` fails with an error, you may need to run `dfx deploy` again. This error occurs because the declaration files are not generated before the canister is deployed. Running `dfx deploy` again will resolve the issue.

Once the job completes successfully, you will see output similar to the following:

```plaintext
Deployed canisters.
URLs:
  Frontend canister via browser
    ICP-Ambassador-Program-builder:
      - http://127.0.0.1:4943/?canisterId=<your_canister_id>
      - http://<your_canister_id>.localhost:4943/
    ICP-Ambassador-Program-frontend:
      - http://127.0.0.1:4943/?canisterId=<your_canister_id>
      - http://<your_canister_id>.localhost:4943/
  Backend canister via Candid interface:
    ICP_Ambassador_Program_backend: http://127.0.0.1:4943/?canisterId=bw4dl-smaaa-aaaaa-qaacq-cai&id=<your_canister_id>
    ic_asset_handler: http://127.0.0.1:4943/?canisterId=bw4dl-smaaa-aaaaa-qaacq-cai&id=<your_canister_id>
    internet_identity: http://127.0.0.1:4943/?canisterId=bw4dl-smaaa-aaaaa-qaacq-cai&id=rdmx6-jaaaa-aaaaa-aaadq-cai

```
If you have made changes to your backend canister, you need to generate a new candid interface and deploy the canister again. To do this, run the following commands:

```bash
./build.sh

dfx deploy
```

If you are making frontend changes, you can start a development server with

```bash
# Run Ambassador-Program-frontend on http://localhost:3000
npm run start:frontend
```
```bash
# Run ICP-Ambassador-Program-builder on http://localhost:3001
npm run start:builder
```

## Deploying the project to the Internet Computer

To deploy your project to the Internet Computer, you need to run the following commands:

```bash
# Deploys your canisters to the Internet Computer and generates your candid interface
dfx deploy --network ic
```

> [!NOTE]
## Granting Permissions for Canister Calls
If you encounter a permission error while calling a canister from the command line, you can grant the necessary permissions to the principal using the following commands:

```bash
# Grant "Prepare" permission to the principal
dfx canister --network ic call <canister_id> grant_permission '(record { permission = variant { Prepare }; to_principal = principal "<principal_id>" })'

# Grant "Commit" permission to the principal
dfx canister --network ic call <canister_id> grant_permission '(record { permission = variant { Commit }; to_principal = principal "<principal_id>" })'
```
**Notes:**
- Replace <canister_id> with the ID of the target canister.
- Replace <principal_id> with the principal ID you want to grant permissions to.

