import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import http from "node:http";
// Node 22.6+ 原生剥离 TS 类型，可直接跑 src 源码
import { downloadImage, downloadImages, urlFileName } from "../src/index.ts";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "down-img-test-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));

/** 起本地 HTTP 服务：routes = { "/a.jpg": { type, data, count? } } */
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

const JPG = Buffer.concat([
	Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
	Buffer.alloc(100, 7),
	Buffer.from([0xff, 0xd9]),
]);
const PNG = Buffer.concat([
	Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
	Buffer.alloc(80, 3),
]);

test("urlFileName：路径提取 / query 去除 / @ 处理参数", () => {
	assert.equal(urlFileName("https://a.com/b/photo.jpg?v=2"), "photo.jpg");
	assert.equal(urlFileName("https://a.com/b/photo.jpg@759w_140h.webp"), "photo.jpg@759w_140h.webp");
	assert.equal(urlFileName("https://a.com/b/photo.jpg@759w_140h"), "photo.jpg");
	assert.equal(urlFileName("https://a.com/"), "");
});

test("单张下载：落盘、字节数一致、目录自动创建", async () => {
	const server = await serve({ "/a.jpg": { type: "image/jpeg", data: JPG } });
	const port = server.address().port;
	const out = path.join(tmp, "t1", "nested"); // 不存在的多级目录
	const r = await downloadImage(`http://127.0.0.1:${port}/a.jpg`, { output: out });
	assert.equal(r.skipped, false);
	assert.equal(fs.readFileSync(r.path).length, JPG.length);
	assert.equal(path.basename(r.path), "a.jpg");
	server.close();
});

test("无扩展名 URL：按 content-type 补全扩展名", async () => {
	const server = await serve({
		"/img": { type: "image/png", data: PNG },
		"/img2": { type: "image/webp", data: PNG },
	});
	const port = server.address().port;
	const out = path.join(tmp, "t2");
	assert.equal(path.basename((await downloadImage(`http://127.0.0.1:${port}/img`, { output: out })).path), "img.png");
	assert.equal(path.basename((await downloadImage(`http://127.0.0.1:${port}/img2`, { output: out })).path), "img2.webp");
	server.close();
});

test("幂等：已存在默认跳过且不再发请求，--overwrite 强制重下", async () => {
	const counter = { n: 0 };
	const server = await serve({ "/b.jpg": { type: "image/jpeg", data: JPG, count: counter } });
	const port = server.address().port;
	const out = path.join(tmp, "t3");

	const r1 = await downloadImage(`http://127.0.0.1:${port}/b.jpg`, { output: out });
	const r2 = await downloadImage(`http://127.0.0.1:${port}/b.jpg`, { output: out });
	assert.equal(r1.skipped, false);
	assert.equal(r2.skipped, true);
	assert.equal(counter.n, 1);

	const r3 = await downloadImage(`http://127.0.0.1:${port}/b.jpg`, { output: out, overwrite: true });
	assert.equal(r3.skipped, false);
	assert.equal(counter.n, 2);
	server.close();
});

test("name / prefix：自定义文件名与前缀", async () => {
	const server = await serve({ "/c.jpg": { type: "image/jpeg", data: JPG } });
	const port = server.address().port;
	const out = path.join(tmp, "t4");
	await downloadImage(`http://127.0.0.1:${port}/c.jpg`, { output: out, name: "cover" });
	await downloadImage(`http://127.0.0.1:${port}/c.jpg`, { output: out, prefix: "s1" });
	// 无扩展名的自定义 name 按 content-type 补全为 .jpg；prefix 作用于 URL 文件名
	assert.ok(fs.existsSync(path.join(out, "cover.jpg")));
	assert.ok(fs.existsSync(path.join(out, "s1-c.jpg")));
	server.close();
});

test("404：重试后失败并抛出 HTTP 状态", async () => {
	const server = await serve({});
	const port = server.address().port;
	await assert.rejects(
		() => downloadImage(`http://127.0.0.1:${port}/nope.jpg`, { output: path.join(tmp, "t5"), retries: 1 }),
		/HTTP 404/
	);
	server.close();
});

test("非 http(s) 输入：直接报错", async () => {
	await assert.rejects(
		() => downloadImage("ftp://a.com/1.jpg", { output: path.join(tmp, "t6") }),
		/仅支持 http\/https/
	);
});

test("批量：并发下载 + 失败聚合，结果保持传入顺序", async () => {
	const server = await serve({
		"/1.jpg": { type: "image/jpeg", data: JPG },
		"/2.jpg": { type: "image/jpeg", data: JPG },
		"/3.png": { type: "image/png", data: PNG },
	});
	const port = server.address().port;
	const out = path.join(tmp, "t7");
	const results = await downloadImages(
		[
			`http://127.0.0.1:${port}/1.jpg`,
			`http://127.0.0.1:${port}/404.jpg`,
			`http://127.0.0.1:${port}/2.jpg`,
			`http://127.0.0.1:${port}/3.png`,
		],
		{ output: out },
		{ concurrency: 2, retries: 0 }
	);
	assert.equal(results.filter((r) => r.ok).length, 3);
	assert.equal(results.filter((r) => !r.ok).length, 1);
	assert.match(results[1].error, /HTTP 404/);
	assert.ok(fs.existsSync(path.join(out, "1.jpg")));
	assert.ok(fs.existsSync(path.join(out, "2.jpg")));
	assert.ok(fs.existsSync(path.join(out, "3.png")));
	server.close();
});
