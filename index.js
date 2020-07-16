const express = require('express');
const app = express();
const axios = require('axios');
const crypto = require('crypto');
const url = require("url");

const service_url = 'https://orchard-api.anmgw.com/check_wallet_balance';
const { quotaguardUrl, quotaguardUsername, quotaguardPassword } = require('./env');
const { service_id, secret_key, client_key } = require('./appsnmobile-env');

app.get('/', async(req, res) => {
    const { chargeData, signature } = getAppsNMobileSignature({ 
        service_id,
        trans_type: 'BLC'
    });

    const axiosOptions = createAxiosOptions(signature);
    const axiosInstance = axios.create(axiosOptions);
    try {
        const axiosResponse = await axiosInstance.post(service_url, chargeData);
        const responseData = axiosResponse.data;
        console.log({responseData});
        res.send(responseData);
    } catch (error) {
        console.log({err: JSON.stringify(error)})
        res.status(500).send(error);
    }

});

function getAppsNMobileSignature({service_id, trans_type}) {
    const ts = getDateString();
    const signature = crypto.createHmac('sha256', secret_key)
        .update(`service_id=${service_id}&trans_type=${trans_type}&ts=${ts}`)
        .digest('hex');

    const chargeData = {
            service_id,
            trans_type,
            ts
    }

    return { chargeData, signature }
}

function createAxiosOptions(signature) {
    const proxy = url.parse(quotaguardUrl);
    const options = {
        proxy: {
            host: proxy.hostname,
            port: proxy.port,
            auth: {
                username: quotaguardUsername,
                password: quotaguardPassword
            }
          },
          headers: {
            "Authorization": `${client_key}:${signature}`
        }
    };
    return options;
}

function getDateString() {
  var currentDate = new Date().toISOString();
  const dateEnd = currentDate.length- 5;
  
  const datePart = currentDate.slice(0, 10);
  const timePart = currentDate.slice(11, dateEnd);
  return `${datePart} ${timePart}`;
}



const port = 5400;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});