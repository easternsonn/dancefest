/**
 * Node.js Express Server for Dance Festival Website
 * Alternative to PHP backend - handles form submission with MP3 file upload
 * 
 * INSTALLATION:
 * npm install express multer nodemailer cors dotenv
 * 
 * RUN:
 * node server.js
 */

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ====================================
// CONFIGURATION
// ====================================

const app = express();
const PORT = process.env.PORT || 3000;

// Email configuration (use environment variables for security)
const EMAIL_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
    }
};

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'your-email@example.com';

// ====================================
// MIDDLEWARE
// ====================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// ====================================
// FILE UPLOAD CONFIGURATION
// ====================================

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'music-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only MP3 files
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || 
        path.extname(file.originalname).toLowerCase() === '.mp3') {
        cb(null, true);
    } else {
        cb(new Error('Разрешены только MP3 файлы'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
});

// ====================================
// VALIDATION FUNCTIONS
// ====================================

function validateName(name) {
    return name && name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

function validateProject(project) {
    const validProjects = ['korni', 'escalera', 'mango', 'futurum'];
    return validProjects.includes(project);
}

// ====================================
// EMAIL SENDING FUNCTION
// ====================================

async function sendEmail(formData, filePath, fileName) {
    // Create transporter
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    // Project names mapping
    const projectNames = {
        'korni': 'Корни',
        'escalera': 'Escalera',
        'mango': 'Mango Fest',
        'futurum': 'Futurum'
    };
    const projectName = projectNames[formData.project] || formData.project;

    // Email HTML template
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0;
                padding: 0;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .header { 
                background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
                color: white; 
                padding: 30px 20px; 
                border-radius: 8px 8px 0 0; 
                text-align: center;
            }
            .header h2 {
                margin: 0;
                font-size: 24px;
            }
            .content { 
                background: #f9f9f9; 
                padding: 30px; 
                border-radius: 0 0 8px 8px; 
            }
            .field { 
                margin-bottom: 20px;
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #9c27b0;
            }
            .label { 
                font-weight: bold; 
                color: #9c27b0; 
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            .value { 
                color: #333;
                font-size: 16px;
            }
            .footer { 
                text-align: center; 
                margin-top: 20px; 
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px; 
                color: #999; 
            }
            a {
                color: #9c27b0;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🎭 Новая заявка на участие</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Арт-портал</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">Имя</div>
                    <div class="value">${formData.name}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
                </div>
                
                <div class="field">
                    <div class="label">Телефон</div>
                    <div class="value">${formData.phone}</div>
                </div>
                
                <div class="field">
                    <div class="label">Проект</div>
                    <div class="value">${projectName}</div>
                </div>
                
                ${formData.message ? `
                <div class="field">
                    <div class="label">Сообщение</div>
                    <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
                
                <div class="field">
                    <div class="label">Музыкальный файл</div>
                    <div class="value">📎 ${fileName}</div>
                </div>
                
                <div class="footer">
                    <p>Это сообщение было отправлено с сайта Арт-портал</p>
                    <p>Дата: ${new Date().toLocaleString('ru-RU')}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // Email options
    const mailOptions = {
        from: `"Арт-портал" <${EMAIL_CONFIG.auth.user}>`,
        to: RECIPIENT_EMAIL,
        replyTo: formData.email,
        subject: `Новая заявка на участие — ${projectName}`,
        html: emailHTML,
        attachments: [
            {
                filename: fileName,
                path: filePath
            }
        ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    
    return info;
}

// ====================================
// ROUTES
// ====================================

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Form submission route
app.post('/submit', upload.single('mp3file'), async (req, res) => {
    try {
        // Extract form data
        const { name, email, phone, project, message } = req.body;
        
        // Validation
        const errors = [];
        
        if (!validateName(name)) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        if (!validateEmail(email)) {
            errors.push('Введите корректный email адрес');
        }
        
        if (!validatePhone(phone)) {
            errors.push('Введите корректный номер телефона');
        }
        
        if (!validateProject(project)) {
            errors.push('Выберите корректный проект');
        }
        
        if (!req.file) {
            errors.push('Пожалуйста, прикрепите MP3 файл');
        }
        
        // If validation errors exist, return error response
        if (errors.length > 0) {
            // Delete uploaded file if exists
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            
            return res.status(400).json({
                success: false,
                message: errors.join('. ')
            });
        }
        
        // Prepare form data
        const formData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            project: project.trim(),
            message: message ? message.trim() : ''
        };
        
        // Send email with attachment
        await sendEmail(formData, req.file.path, req.file.originalname);
        
        // Delete uploaded file after sending email
        fs.unlinkSync(req.file.path);
        
        // Send success response
        res.json({
            success: true,
            message: 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
            data: {
                name: formData.name,
                email: formData.email
            }
        });
        
    } catch (error) {
        console.error('Error processing form submission:', error);
        
        // Delete uploaded file if exists
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.'
        });
    }
});

// Error handling for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Размер файла превышает 50MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Ошибка при загрузке файла'
        });
    }
    
    if (error.message === 'Разрешены только MP3 файлы') {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
});

// ====================================
// START SERVER
// ====================================

app.listen(PORT, () => {
    console.log(`\n🎭 Арт-портал Server`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Ready to receive form submissions`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
