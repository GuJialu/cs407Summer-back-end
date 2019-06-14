const Controller = require("../controller/accountController");

exports.register = async (ctx, next) => {
    let buf = ctx.request.body.buf;

    let controller = new Controller();
    let result = await controller.reg(buf);
    ctx.body = result;

    await next();
}