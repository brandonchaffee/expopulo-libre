# eternal-tested

## Key Dependencies
NodeJS ([installation instruction](https://nodejs.org/en/download/))

## Global Dependencies

Truffle and Ganache are need to compile and test this project

```sh
npm install -g truffle
npm install -g ganache-cli
```

## Initializing project

Once the proper dependencies have been added, install the project dependencies and run a personal blockchain:

```sh
npm install
ganache-cli
```

Ensure Ganache is running. Finally, in a separate terminal, use the following commands to compile, migrate and test the project:

```sh
truffle compile
truffle migrate
truffle test
```
