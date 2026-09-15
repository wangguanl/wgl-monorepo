import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import http from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "dist", "cli.js"); // 由 tsup 构建（pnpm test 会先 build）

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "down-img-cli-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));

const JPG = Buffer.concat([
	Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
	Buffer.alloc(100, 7),
	Buffer.from([0xff, 0xd9]),
]);

function serve(routes) {
	const server = http.createServer((req, res) => {
		const key = req.url.split("?")[0];
		const route = routes[key];
		if (!route) {
			res.writeHead(404, { "content-type": "text/plain" });
			res.end("not found");
			return;
		}
		route.count && route.count.n++;
		res.writeHead(200, { "content-type": route.type });
		res.end(route.data);
	});
	return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// 注意：必须用异步 execFile——同步执行会阻塞本进程事件循环，
// 本进程里的 HTTP 服务将无法响应子进程的下载请求（表现为全部超时）。
test("CLI：单 URL 下载 + 输出统计", async () => {
	const counter = { n: 0 };
	const server = await serve({ "/a.jpg": { type: "image/jpeg", data: JPG, count: counter } });
	const port = server.address().port;
	const out = path.join(tmp, "t1");

	const { stdout } = await execFileAsync("node", [cli, `http://127.0.0.1:${port}/a.jpg`, "-o", out]);
	assert.match(stdout, /1\/1 张成功/);
	assert.ok(fs.existsSync(path.join(out, "a.jpg")));
	server.close();
});

test("CLI：--file 批量 + 幂等跳过", async () => {
	const counter = { n: 0 };
	const server = await serve({
		"/1.jpg": { type: "image/jpeg", data: JPG, count: counter },
		"/2.jpg": { type: "image/jpeg", data: JPG },
	});
	const port = server.address().port;
	const out = path.join(tmp, "t2");
	const listFile = path.join(tmp, "urls.json");
	fs.writeFileSync(listFile, JSON.stringify([`http://127.0.0.1:${port}/1.jpg`, `http://127.0.0.1:${port}/2.jpg`]));

	await execFileAsync("node", [cli, "--file", listFile, "-o", out]);
	const { stdout: second } = await execFileAsync("node", [cli, "--file", listFile, "-o", out]);

	assert.equal(counter.n, 1); // 1.jpg 只在第一次被请求；第二次全跳过，未发新请求
	assert.match(second, /跳过/);
	assert.match(second, /2\/2 张成功/);
	server.close();
});

test("CLI：部分失败 → 退出码 1，失败行可见", async () => {
	const server = await serve({ "/ok.jpg": { type: "image/jpeg", data: JPG } });
	const port = server.address().port;
	const out = path.join(tmp, "t3");

	let stderr = "", code = 0;
	try {
		await execFileAsync("node", [
			cli,
			`http://127.0.0.1:${port}/ok.jpg`,
			`http://127.0.0.1:${port}/404.jpg`,
			"-o",
			out,
			"--retries",
			"0",
		]);
	} catch (err) {
		code = err.code;
		stderr = err.stderr;
	}
	assert.equal(code, 1);
	assert.match(stderr, /HTTP 404/);
	assert.ok(fs.existsSync(path.join(out, "ok.jpg"))); // 成功的不受影响
	server.close();
});

test("CLI：非 URL 参数 → 报错退出", async () => {
	let stderr = "", code = 0;
	try {
		await execFileAsync("node", [cli, "./local.jpg", "-o", path.join(tmp, "t4")]);
	} catch (err) {
		code = err.code;
		stderr = err.stderr;
	}
	assert.equal(code, 1);
	assert.match(stderr, /仅支持 http\/https/);
});
