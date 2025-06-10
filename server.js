const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');
const app = express();
const path = require('path');

// Базовая конфигурация
app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:3002', 'http://95.46.96.94:8080', 'http://placeandplay.uz', 'https://placeandplay.uz'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'accessToken', 'refreshToken', 'language', 'isUser'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Поддержка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Логирование запросов
app.use((req, res, next) => {
    console.log('Incoming request details:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.method === 'POST' ? req.body : undefined
    });
    next();
});

// Создаем прокси с расширенной конфигурацией
const proxy = httpProxy.createProxyServer({
    target: 'http://95.46.96.94:8080',
    changeOrigin: true,
    secure: false,
    proxyTimeout: 30000,
    timeout: 30000,
    ws: true,
    xfwd: true,
    followRedirects: true
});

// Обработка ошибок прокси
proxy.on('error', (err, req, res) => {
    console.error('Proxy error details:', {
        error: err.message,
        code: err.code,
        url: req.url,
        method: req.method,
        headers: req.headers,
        target: proxy.options.target,
        stack: err.stack
    });
    
    if (!res.headersSent) {
        res.status(500).json({ 
            error: 'Proxy Error', 
            message: err.message,
            details: {
                code: err.code,
                url: req.url,
                target: proxy.options.target
            }
        });
    }
});

// Логирование прокси событий
proxy.on('proxyReq', (proxyReq, req, res, options) => {
    console.log('Proxy request details:', {
        url: req.url,
        method: req.method,
        headers: proxyReq.headers,
        target: options.target,
        body: req.body
    });

    // Обработка тела запроса для POST/PUT
    if (['POST', 'PUT'].includes(req.method) && req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
});

proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('Proxy response:', {
        url: req.url,
        status: proxyRes.statusCode,
        headers: proxyRes.headers,
        method: req.method
    });
});

// Специальная обработка для авторизации
app.all('/PlaceAndPlay/api/auth/*', (req, res) => {
    console.log('Auth request:', {
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body
    });

    const proxyOptions = {
        target: 'http://95.46.96.94:8080',
        changeOrigin: true,
        secure: false,
        ws: false,
        xfwd: true,
        headers: {
            'User-Agent': 'insomnia/10.3.1',
            'language': req.headers.language || 'ru',
            'Content-Type': 'application/json',
            'Origin': req.headers.origin || 'http://placeandplay.uz',
            'Accept': 'application/json',
            'Connection': 'keep-alive',
            'Host': '95.46.96.94:8080'
        },
        proxyTimeout: 30000,
        timeout: 30000
    };

    // Сохраняем оригинальные заголовки авторизации
    if (req.headers.accesstoken) {
        proxyOptions.headers.accessToken = req.headers.accesstoken;
    }
    if (req.headers.refreshtoken) {
        proxyOptions.headers.refreshToken = req.headers.refreshtoken;
    }

    // Для POST запросов добавляем обработку тела
    if (req.method === 'POST' && req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyOptions.headers['Content-Length'] = Buffer.byteLength(bodyData);
        proxyOptions.body = bodyData;
    }

    proxy.web(req, res, proxyOptions, (err) => {
        if (err) {
            console.error('Auth proxy error:', {
                url: req.url,
                error: err.message,
                code: err.code,
                target: proxyOptions.target,
                headers: req.headers,
                body: req.body,
                stack: err.stack
            });

            if (!res.headersSent) {
                res.status(502).json({
                    error: 'Auth Service Error',
                    message: err.message,
                    details: {
                        code: err.code,
                        url: req.url,
                        target: proxyOptions.target
                    }
                });
            }
        }
    });
});

// WebSocket прокси
app.all('/PlaceAndPlay/ws/*', (req, res) => {
    console.log('WebSocket request:', req.url);
    proxy.web(req, res, {
        target: 'http://95.46.96.94:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
        xfwd: true,
        headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket',
            'Host': '95.46.96.94:8080',
            'Origin': 'http://placeandplay.uz'
        },
        proxyTimeout: 30000,
        timeout: 30000
    });
});

// Общая настройка прокси для всех API запросов
app.all('/PlaceAndPlay/api/*', (req, res) => {
    console.log('Processing API request:', {
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body
    });

    const proxyOptions = {
        target: 'http://95.46.96.94:8080',
        changeOrigin: true,
        secure: false,
        ws: false,
        xfwd: true,
        headers: {
            'User-Agent': 'insomnia/10.3.1',
            'language': req.headers.language || 'ru',
            'Content-Type': 'application/json',
            'Origin': req.headers.origin || 'http://placeandplay.uz',
            'Accept': 'application/json',
            'Connection': 'keep-alive'
        },
        proxyTimeout: 30000,
        timeout: 30000
    };

    // Сохраняем оригинальные заголовки авторизации
    if (req.headers.accesstoken) {
        proxyOptions.headers.accessToken = req.headers.accesstoken;
    }
    if (req.headers.refreshtoken) {
        proxyOptions.headers.refreshToken = req.headers.refreshtoken;
    }

    proxy.web(req, res, proxyOptions);
});

// Маршрут для главной страницы и корневого URL
app.get(['/', '/index.html'], (req, res) => {
    res.redirect('/welcome.html');
});

// Добавьте эти маршруты после существующих app.get маршрутов
app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/business.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'business.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});

// Создаем HTTP сервер
const server = require('http').createServer(app);

// Настраиваем WebSocket прокси
server.on('upgrade', (req, socket, head) => {
    console.log('WebSocket upgrade request:', req.url);
    
    // Добавляем обработку ошибок
    socket.on('error', (error) => {
        console.error('WebSocket socket error:', error);
    });

    // Добавляем необходимые заголовки
    req.headers['connection'] = 'upgrade';
    req.headers['upgrade'] = 'websocket';
    req.headers['host'] = '95.46.96.94:8080';
    req.headers['origin'] = 'http://placeandplay.uz';

    const proxyOptions = {
        target: 'http://95.46.96.94:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
        xfwd: true,
        followRedirects: true,
        proxyTimeout: 30000,
        timeout: 30000,
        headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket',
            'Host': '95.46.96.94:8080',
            'Origin': 'http://placeandplay.uz'
        }
    };

    proxy.ws(req, socket, head, proxyOptions, (err) => {
        if (err) {
            console.error('WebSocket upgrade error:', err);
            // Пытаемся отправить ответ клиенту
            try {
                socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
                           'Upgrade: websocket\r\n' +
                           'Connection: Upgrade\r\n\r\n');
            } catch (e) {
                console.error('Error sending upgrade response:', e);
            }
        }
    });
});

// Запускаем сервер
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});