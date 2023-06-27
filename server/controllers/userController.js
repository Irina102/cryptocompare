const ApiErrors = require("../errors/user/ApiErrors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../dao/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;

    if (!password && !email) {
      return next(ApiErrors.badRequest("Email or Password its not correct"));
    }

    const loggedUser = await User.findOne({ where: { email } });
    if (loggedUser) {
      return next(ApiErrors.badRequest("User email is already exists"));
    }

    const hasPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, password: hasPassword, role });

    const token = generateJwt(user.id, user.email, user.role);

    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiErrors.internal("This User is not defined"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiErrors.internal("Password in not a correct"));
    }

    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async checkAuthentication(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    res.json({ token });
  }
}

module.exports = new UserController();
