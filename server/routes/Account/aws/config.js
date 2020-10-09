require("dotenv").config();
module.exports = {
  aws: {
    key: process.env.AWS_SES_ACCESS_KEY_ID,
    secret: process.env.AWS_SES_SECRET_ACCESS_KEY,
    ses: {
      from: {
        //  actual email address
        default: '"KOOMPI Wi-Fi Hotspot" <no-reply@koompi.org>',
      },
      region: process.env.AWS_SES_REGION,
    },
  },
};
