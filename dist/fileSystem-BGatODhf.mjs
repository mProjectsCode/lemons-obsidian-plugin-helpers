import { readFileSync } from "node:fs";
import path from "node:path";
//#region packages/repo-automation/src/utils/fileSystem.ts
const defaultFileSystem = {
	cwd: () => process.cwd(),
	join: (...parts) => path.join(...parts),
	resolve: (...parts) => path.resolve(...parts),
	exists: async (filePath) => Bun.file(filePath).exists(),
	readText: async (filePath) => Bun.file(filePath).text(),
	readTextSync: (filePath) => readFileSync(filePath, "utf8"),
	writeText: async (filePath, content) => {
		await Bun.write(filePath, content);
	}
};
//#endregion
export { defaultFileSystem as t };
