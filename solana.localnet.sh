ARCH="$(uname -m)"
if [[ "$OSTYPE" == "darwin"* ]]; then
    BINARY="solana-test-validator"
    if [[ $ARCH == 'arm64' ]]; then
        echo "Running on Mac OS X 64-bit Apple Silicon"
        FILENAME="solana-release-aarch64-apple-darwin.tar.bz2"
    elif [[ $ARCH == 'x86_64' ]]; then
        echo "Running on Mac OS X 64-bit Intel"
        FILENAME="solana-release-x86_64-apple-darwin.tar.bz2"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    BINARY="solana-test-validator"
    FILENAME="solana-release-x86_64-unknown-linux-gnu.tar.bz2"
elif [[ "$OSTYPE" == "cygwin" ]]; then
    echo "Running on Emulated linux in a Windows environment"
    # POSIX compatibility layer and Linux environment emulation for Windows
    BINARY="solana-test-validator"
    FILENAME="solana-release-x86_64-unknown-linux-gnu.tar.bz2"
elif [[ "$OSTYPE" == "msys" ]]; then
    echo "Running on Emulated linux in a Windows environment"
    # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
    BINARY="solana-test-validator"
    FILENAME="solana-release-x86_64-unknown-linux-gnu.tar.bz2"
fi

FULLPATH="$(pwd)/solana-localnet/solana-release/bin/$BINARY"

if [ -f "$FULLPATH" ]; then
    echo "Found $FULLPATH"
else
    if [ -f "$FILENAME" ]; then
        echo "Found $FILENAME"
    else 
        echo "Downloading $FILENAME"
        mkdir -p solana-localnet
        wget "https://github.com/solana-labs/solana/releases/download/v1.9.21/$FILENAME" -O "./solana-localnet/$FILENAME"
    fi
    echo "Unpacking $FILENAME"
    (cd solana-localnet && tar jxf "$FILENAME")
fi

if [ -f "$(pwd)/solana-localnet/programs-binaries/users.so" ] && \
   [ -f "$(pwd)/solana-localnet/programs-binaries/friends.so" ] && \
   [ -f "$(pwd)/solana-localnet/programs-binaries/groupchats.so" ]; then
    echo "Found solana-localnet/programs-binaries"
else
    echo "Downloading programs-binaries for localnet"
    wget "https://github.com/Satellite-im/solana-programs/releases/download/v0.5.0/satellite-program-binaries-0.5.0.tar.bz2" -O "./solana-localnet/satellite-program-binaries-0.5.0.tar.bz2"
    (cd solana-localnet && tar jxf "satellite-program-binaries-0.5.0.tar.bz2")
fi

# Start local testnet
./solana-localnet/solana-release/bin/solana-test-validator \
--ledger solana-localnet/test-ledger \
--bpf-program 7MaC2xrAmmFsuRBEkD6BEL3eJpXCmaikYhLM3eKBPhAH ./solana-localnet/programs-binaries/users.so \
--bpf-program GjS6t1gK9nktqDJBTjobm9Fdepxg2FGb4vifRDEQ8hXL ./solana-localnet/programs-binaries/friends.so \
--bpf-program bJhvwTYCkQceANgeShZ4xaxUqEBPsV8e1NgRnLRymxs ./solana-localnet/programs-binaries/groupchats.so \