const nodeMailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const database = require('./database');

sgMail.setApiKey(database.emailApiKey);

const emailHost = database.masterEmail;

module.exports = {
    setup: sgMail,
    emailHost : emailHost
}
