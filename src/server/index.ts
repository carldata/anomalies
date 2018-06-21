// tslint:disable-next-line:no-var-requires
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Idę do domu !'));

app.listen(3000, () => console.log('Idę do domu !'));