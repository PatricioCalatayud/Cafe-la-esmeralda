export const sendEmailPassword = (link) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="x-apple-disable-message-reformatting">

    <title>Información de Restablecimiento de Contraseña</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Trebuchet MS', Arial, sans-serif;
            background-color: #EDEEEF;
            color: #0a080b;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 0 auto;
            background-color: #f8f9fc;
        }
        h1, p {
            margin: 0;
            padding: 0;
            color: #0a080b;
        }
        h1 {
            font-size: 36px;
            line-height: 46px;
        }
        p {
            font-size: 18px;
            line-height: 28px;
        }
        a {
            color: #028383;
            text-decoration: none;
            font-weight: bold;
        }
        .container {
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            border: 1px solid #DADDDE;
            margin: 0 auto;
            padding: 30px;
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding: 30px 0;
        }
        .header img {
            width: 150px;
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .content {
            text-align: center; /* Cambiado a center para centrar todo el contenido */
            padding-top: 30px;
        }
        .cta-button {
            display: inline-block;
            padding: 14px 20px;
            margin-top: 30px;
            font-size: 18px;
            color: #ffffff;
            background-color: #028383;
            border-radius: 5px;
            text-align: center;
            text-decoration: none;
        }
        .cta-button:hover {
            background-color: #004265;
        }
        .footer {
            text-align: center;
            padding-top: 30px;
            font-size: 14px;
            color: #4B525D;
        }
        @media screen and (max-width: 600px) {
            .container {
                width: 95% !important;
                padding: 20px !important;
            }
            h1 {
                font-size: 28px !important;
                line-height: 36px !important;
            }
            p {
                font-size: 16px !important;
                line-height: 24px !important;
            }
        }
    </style>
</head>

<body>
    <table role="presentation">
        <tr>
            <td class="header">
                <img src="https://i.imgur.com/2kR27Kw.jpg" alt="La Esmeralda Cafe" />
            </td>
        </tr>
        <tr>
            <td align="center" valign="top" style="padding-top: 20px;">
                <div class="container">
                    <h1>Información de Restablecimiento de Contraseña</h1>
                    <div class="content">
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, por favor ignora este correo.</p>
                        <p>Para restablecer tu contraseña, haz clic en el botón a continuación:</p>
                        <a href="${link}" class="cta-button">Restablecer Contraseña</a>
                        <p style="padding-top: 20px;"><strong>Este enlace expirará en 24 horas.</strong> Si no solicitaste una nueva contraseña, por favor ignora este mensaje.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 La Esmeralda Cafe. Todos los derechos reservados.</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
}