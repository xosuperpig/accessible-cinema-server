const Koa = require("koa");
const Router = require("koa-router");

let app = new Koa;
let router = new Router({
	prefix: (process.env.DEBUGPREFIX || '') + '/bullet'
});
let parseBody = require("body-parser").json({
	type: 'application/json',
	limit: '2mb'
});

let dataBullet = require("./data/bullet");
router
	.get('/', async(ctx, next)=> {
		let vid = ctx.query.vid;
		let result = await dataBullet.get(vid);

		ctx.body = result.map(item=> {
			let {content, time, vid} = item
			return {content, time, vid};
		})
	})
	.post('/', async(ctx, next)=> {
		await new Promise((resolve, reject)=> {
			parseBody(ctx.req, ctx.res, function (err, body) {
				ctx.body = ctx.req.body;
				resolve();
			});
		});
		await next();
	})
	.post('/', async(ctx, next)=> {
		try {
			await dataBullet.set(ctx.body.vid, ctx.body.time, ctx.body.content)
			ctx.status = 200;
		} catch(e) {
			ctx.status = 500;
			ctx.body = e.stack;
		}
	});

app.use(router.routes());

app.listen(80);