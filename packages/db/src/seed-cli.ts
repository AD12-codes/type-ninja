import { closeDB, initializeDB } from "./index";
import { seedContent } from "./seed";

await initializeDB();
await seedContent();
await closeDB();
