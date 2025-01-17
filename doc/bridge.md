# Bridge

The purpose of the bridge is to allow the cross-chain movement of tokens.

"Bridge" allows to:

- Create/Destroy setting
- Mint/Burn the tokens as assetid in Bitgreen Blockchain accordingly to the request.
- Set lockdown to allow transactions


The pallet is called "Bridge" and below you can find the "Extrinsics" and queries available, ordered by logic of use:  

## Create  Settings

This function allows to create settings of the bridge. It's accessible by SUDO only.
```rust
create_settings(key: Vec<u8>, data: Vec<u8>)
```

This function checks -
1) Lockdown mode is off

where:
- key is the token symbol
- data is JSON object

for example data is:  
{
"chainid":1,
"description":"xxxxxxxxxx",
"address":"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
"assetid":1,
"internalthreshold":2,
"externathreshold":2,
"internalkeepers":["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
"externalkeepers":["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
"internalwatchdogs":["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
"externalwatchdogs":["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
"internalwatchcats":["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
"externalwatchcats":["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"]
}

        
## Query Settings
You can query the settings above calling the function:  
```rust
Settings(key: Vec<u8>)
```
where key is one the key used in the storage.

## Destroy Settings  

This function destroys settings with the given key. It's accessible by SUDO only.

```rust
destroy_settings(key: Vec<u8>)
```
This function checks -
1) Lockdown mode is off

## Mint Tokens

Mint the tokens as assetid in Bitgreen Blockchain accordingly to the request.

```rust
mint(token:Vec<u8>,recipient: T::AccountId, transaction_id:Vec<u8>, amount: Balance)
```

This function checks -
1) Lockdown mode is off
2) Token must be present in the settings
3) The signer must be one of the internalkeepers
4) The signer can confirm only one time
5) The Minting cannot be done 2 times

This function also -
- Stores the mint request
- Stores the mint counter
- Store the minting confirmation when reached the threshold
- Finally, Mint the tokens as assetid in Bitgreen Blockchain accordingly to the request.

## Burn Tokens

Burn the tokens as assetid in Bitgreen Blockchain accordingly to the request.

```rust
burn(token:Vec<u8>,recipient: T::AccountId, transaction_id:Vec<u8>, amount: Balance)
```

This function checks -
1) Lockdown mode is off
2) Token must be present in the settings
3) The signer must be one of the internalkeepers
4) The signer can confirm only one time
5) The Burning cannot be done 2 times

This function also -
- Stores the burn request
- Stores the burn counter
- Store the burning confirmation when reached the threshold
- Finally, Burn the tokens as assetid in Bitgreen Blockchain accordingly to the request.

## Set Lockdown

This function sets lockdown to true. It's accessible by watchdogs and watch cats only.

```rust
set_lockdown(key: Vec<u8>)
```
This function checks -
1) Setting with given key exists or not

## Set UnLockdown

This function sets lockdown to false. It's accessible by Sudo only.

```rust
set_unlockdown()
```