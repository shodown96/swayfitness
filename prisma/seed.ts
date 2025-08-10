import { SeedingService } from "./seed.service";

const runScript = async () => {
    // Seed individual items
    // const admin = await SeedingService.seedAdmin({
    //     email: 'admin@gym.com',
    //     password: 'admin123',
    //     name: 'John Admin'
    // });

    const plans = await SeedingService.seedBasicPlans();
}

runScript()