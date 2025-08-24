const jwt = require("jsonwebtoken");
const { ClientError } = require("../../utils/err/errors");

const { connectDB } = require("../../controllers/utils");

const authenticateToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new ClientError("Authorization token missing", 401);
    }



    const decodedToken = jwt.verify(token, "your-secret-key"); 


    const query = {
      selector: {
        _id: decodedToken.userId,
      },
    };

    let db_account = await connectDB(`db_accounts`);
    const resp = await db_account.find(query);


    if (resp.docs.length == 0) {
      throw new ClientError("User not found", 404);
    }

    const user = resp.docs[0];
    req.user = user;

    next();
  } catch (error) {
    return res.status(501).send("Invalid token");
  }
};

module.exports = { authenticateToken: authenticateToken };

const detectIAMMiddleware = (req, res, next, iam) => {
  const method = req.method;
  const reqPath = req.path;

};


