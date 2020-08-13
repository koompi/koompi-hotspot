require("dotenv").config();
module.exports = {
  aws: {
    key: process.env.AWS_SES_ACCESS_KEY_ID,
    secret: process.env.AWS_SES_SECRET_ACCESS_KEY,
    ses: {
      from: {
        //  actual email address
        default: '"loeb.kalin79@gmail.com"'
      },
      region: process.env.AWS_SES_REGION
    }
  }
};
