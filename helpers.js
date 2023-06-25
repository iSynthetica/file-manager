const validCommands = {
    up: {
        args: 0,
        controller: 'fs',
    },
    cd: {
        args: 1,
        controller: 'fs',
    },
    ls: {
        args: 0,
        controller: 'fs',
    },
    cat: {
        args: 1,
        controller: 'fs',
    },
    add: {
        args: 1,
        controller: 'fs',
    },
    rn: {
        args: 2,
        controller: 'fs',
    },
    cp: {
        args: 2,
        controller: 'fs',
    },
    mv: {
        args: 2,
        controller: 'fs',
    },
    rm: {
        args: 1,
        controller: 'fs',
    },
    os: {
        args: 1,
        controller: 'os',
    },
    hash: {
        args: 1,
        controller: 'hash',
    },
    compress: {
        args: 2,
        controller: 'zip',
    },
    decompress: {
        args: 2,
        controller: 'zip',
    },
};

const parseArgs = input => {
    const pattern = /"([^"]+)"|'([^']+)'|(\S+)/g;
    const args = [];
    var match;

    while ((match = pattern.exec(input)) !== null) {
        const [, doubleQuoted, singleQuoted, unquoted] = match;
        const arg = doubleQuoted || singleQuoted || unquoted;
        args.push(arg.trim());
    }

    return args;
};

export const validateArgs = input => {
    const [command, ...args] = parseArgs(input);

    if (!validCommands[command] || validCommands[command].args !== args.length) {
        throw new Error('Wrong request');
    }

    return { controller: validCommands[command].controller, command, args };
};

export const getUsername = () => {
    const args = process.argv.slice(2);
    const usernameArg = args.find(arg => arg.startsWith('--username='));

    return usernameArg ? usernameArg.split('=')[1] : 'Guest';
}