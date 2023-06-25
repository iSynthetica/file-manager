import os from 'os';

export class OperatingSystem {
    constructor() {}

    async os([arg]) {
        if (!arg.startsWith('--') || !this[arg.replace('--', '')]) {
            throw new Error('Wrong os args');
        }
        await this[arg.replace('--', '')]();
    }

    // os --EOL
    // os --cpus
    // os --homedir
    // os --username
    // os --architecture

    async EOL() {
        process.stdout.write(os.EOL);
    }
    async cpus() {
        let cpus = os.cpus();
        console.log('Overall amount of CPUs:', cpus.length);

        for (let cpu of cpus) {
            console.log(`  -${cpu.model}`);
        }

        console.log(os.EOL);
    }
    async homedir() {
        console.log(os.homedir());
    }
    async username() {
        console.log(os.userInfo().username);
    }
    async architecture() {
        console.log(os.arch());
    }
}