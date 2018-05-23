# eternal-tested

## Dependencies

### Key Dependencies
NodeJS ([installation instruction](https://nodejs.org/en/download/))

### Node Dependencies

Truffle and Ganache are need to compile and test this project

```sh
npm install -g truffle
npm install -g ganache-cli
```

## Build and Test

Once the proper global dependencies have been added, run a personal blockchain through Ganache with the following command. Alternatively, the Ganache application can be downloaded [here](https://github.com/trufflesuite/ganache/releases).

```sh
ganache-cli
```

 Finally, navigate to the project and use the following commands to initialize, compile, migrate, and test the project:

```sh
npm install
truffle compile
truffle migrate
truffle test
```
