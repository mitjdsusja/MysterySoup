const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
};

http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            // AI 구동을 위한 필수 보안 헤더 추가
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT);

console.log(`🚀 Mystery Soup 로컬 보안 서버가 실행되었습니다!`);
console.log(`👉 접속 주소: http://localhost:${PORT}`);
console.log(`[주의] AI 모델 다운로드 시 브라우저 콘솔(F12)을 확인하세요.`);
