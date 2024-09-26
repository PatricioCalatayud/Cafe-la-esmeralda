import { Order } from "src/entities/order.entity"
const API_URL = process.env.NEXT_PUBLIC_API_URLF
export const sendEmailPassword = (link: string) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="x-apple-disable-message-reformatting">

    <title>Restablecimiento de Contraseña</title>

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
                    <h1>Restablecimiento de Contraseña</h1>
                    <div class="content">
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, por favor ignora este correo.</p>
                        <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
                        <a href="${link}" class="cta-button">Restablecer contraseña</a>
                        <p style="padding-top: 20px;"><strong>Este enlace expirará en 24 horas.</strong> Si no solicitaste una nueva contraseña, por favor ignora este mensaje.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 La Esmeralda Cafe - Todos los derechos reservados.</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
}

export const sendEmailOrderExpired = (orderId: string) => {
    return `
<!DOCTYPE html>
<html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css"/><!--<![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			line-height: 0;
			font-size: 75%;
		}

		@media (max-width:700px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block div.fullWidth {
				max-width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.reverse {
				display: table;
				width: 100%;
			}

			.reverse .column.first {
				display: table-footer-group !important;
			}

			.reverse .column.last {
				display: table-header-group !important;
			}

			.row-11 td.column.first .border,
			.row-11 td.column.last .border,
			.row-3 td.column.first .border,
			.row-3 td.column.last .border,
			.row-6 td.column.first .border,
			.row-6 td.column.last .border {
				padding: 5px 0;
				border-top: 0;
				border-right: 0px;
				border-bottom: 0;
				border-left: 0;
			}
		}
	</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>
<body class="body" style="margin: 0; background-color: #efd3b6; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efd3b6;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efd3b6; background-image: url('https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/7ade0731-2ef0-477f-bf04-0bf2b8336b23-bg_section_coffee.jpg'); background-position: center top; background-repeat: no-repeat;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="16.666666666666668%">
<div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;"> </div>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="66.66666666666667%">
<div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;"> </div>
<div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="text-align:center;width:100%;">
<h1 style="margin: 0; color: #000000; direction: ltr; font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace; font-size: 42px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 50.4px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Orden Expirada</span></h1>
</td>
</tr>
</table>
<div class="spacer_block block-4" style="height:10px;line-height:10px;font-size:1px;"> </div>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#393d47;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
<p style="margin: 0;"><strong>¡Lamentamos informarte!</strong></p>
<p style="margin: 0;">Tu pedido Numero:${orderId} en Café La Esmeralda ha expirado. Pero no te preocupes, puedes volver a tu carrito para terminar tu compra y disfrutar de tu café favorito.</p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;"> </span></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<div style="background-color:#1a1423;border-bottom:1px solid #1A1423;border-left:1px solid #1A1423;border-radius:4px;border-right:1px solid #1A1423;border-top:1px solid #1A1423;color:#ffffff;display:inline-block;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:undefined;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;"><a href="${API_URL}/cart" style="color:#ffffff;text-decoration:none;"><span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">Ir al Carrito</span></span></a></div>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-7" style="height:35px;line-height:35px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 385.333px;"><img alt="Coffee Mug" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/18c6e180-77ff-4c38-b3a6-02b98de3f7d9-coco_coffee.png" style="display: block; height: auto; border: 0; width: 100%;" title="Coffee Mug" width="385.333"/></div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 453.3333333333333px;"><img height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/5a07410e-e306-4be7-922f-44ba0d0ba20a-logoblanco.png" style="display: block; height: auto; border: 0; width: 100%;" width="453.3333333333333"/></div>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-10" style="height:60px;line-height:60px;font-size:1px;"> </div>
</td>
<td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="16.666666666666668%">
<div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1a1423;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr class="reverse">
<td class="column column-1 first" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<div class="border">
<div class="spacer_block block-1" style="height:45px;line-height:45px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace; font-size: 37px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 44.4px;"><strong>Prepara tu Café Favorito en Casa</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#b6b6b6;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;">Descubre el fascinante viaje de tu café, desde la semilla hasta tu taza. Aprende cómo se cultiva, se cosecha y se transforma en ese delicioso café que disfrutas en casa.</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="left" class="alignment"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:43px;width:164px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#1A1423" fillcolor="#efd3b6">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#000000;font-family:Arial, sans-serif;font-size:16px">
<![endif]--><a href="${API_URL}/" style="background-color:#efd3b6;border-bottom:1px solid #1A1423;border-left:1px solid #1A1423;border-radius:4px;border-right:1px solid #1A1423;border-top:1px solid #1A1423;color:#000000;display:inline-block;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:undefined;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;" target="_blank"><span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">COMIENZA TU DÍA</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
</td>
</tr>
</table>
</div>
</td>
<td class="column column-2 last" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<div class="border">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 340px;"><img height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/d9e310ee-4ea0-483e-8070-5a85e9690512-Captura%20de%20pantalla%202024-07-09%20113008.png" style="display: block; height: auto; border: 0; width: 100%;" width="340"/></div>
</div>
</td>
</tr>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1a1423;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:45px;line-height:45px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:45px;line-height:45px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr class="reverse">
<td class="column column-1 first" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">
<div class="border">
<table border="0" cellpadding="5" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 160px;"><img alt="Coffee Powder" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/7bbf522a-4867-42a0-ab27-93609c8bcb04-coffee_powder.jpg" style="display: block; height: auto; border: 0; width: 100%;" title="Coffee Powder" width="160"/></div>
</div>
</td>
</tr>
</table>
</div>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">
<table border="0" cellpadding="10" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 150px;"><img alt="coffee beans" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/31955fc3-37bd-472c-9636-2f65816f99f1-coffee_bean.jpg" style="display: block; height: auto; border: 0; width: 100%;" title="coffee beans" width="150"/></div>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;"> </div>
<table border="0" cellpadding="10" cellspacing="0" class="image_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 150px;"><img alt="Dripping Coffee" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/27b7b708-6d04-4d4b-9fa0-7500b5282115-coffee_filter.jpg" style="display: block; height: auto; border: 0; width: 100%;" title="Dripping Coffee" width="150"/></div>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-3 last" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<div class="border">
<div class="spacer_block block-1" style="height:45px;line-height:45px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #000000; direction: ltr; font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace; font-size: 37px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 44.4px;"><strong>Cómo Obtener Diferentes Sabores</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#393d47;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;">Dependiendo de cómo prepares tu café, puedes descubrir una variedad de sabores únicos. Desde afrutados hasta más amargos, cada método de preparación revela algo especial en cada grano.</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="left" class="alignment"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.youtube.com/watch?v=vCY-m4fMs8g" style="height:43px;width:121px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#1A1423" fillcolor="#1a1423">
<w:anchorlock/>
<v:textbox inset="0px,0px,0px,0px">
<center dir="false" style="color:#ffffff;font-family:Arial, sans-serif;font-size:16px">
<![endif]--><a href="https://www.youtube.com/watch?v=vCY-m4fMs8g" style="background-color:#1a1423;border-bottom:1px solid #1A1423;border-left:1px solid #1A1423;border-radius:4px;border-right:1px solid #1A1423;border-top:1px solid #1A1423;color:#ffffff;display:inline-block;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:undefined;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;" target="_blank"><span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;"><span style="word-break: break-word; line-height: 32px;">VER AHORA</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
</td>
</tr>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/2137849b-00da-4566-8ced-d731bf926a6e-seperator_bg_2.jpg'); background-position: center top; background-repeat: repeat;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="16.666666666666668%">
<div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;"> </div>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #f9f0e8; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">
<div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="text-align:center;width:100%;">
<h1 style="margin: 0; color: #000000; direction: ltr; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 19px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 22.8px;"><strong>Tu Café</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#000000;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #000000;" target="_blank">Elegi a tu gusto</a></p>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-4" style="height:30px;line-height:30px;font-size:1px;"> </div>
</td>
<td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #aca591; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">
<div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="text-align:center;width:100%;">
<h1 style="margin: 0; color: #000000; direction: ltr; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 19px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 22.8px;"><strong>Tienda en Línea</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#000000;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #000000;" target="_blank">Nuevos productos</a></p>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-4" style="height:30px;line-height:30px;font-size:1px;"> </div>
</td>
<td class="column column-4" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #393d47; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
<div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="text-align:center;width:100%;">
<h1 style="margin: 0; color: #fffefe; direction: ltr; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 19px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 22.8px;"><strong>Encuentra Diferentes Cafés</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#ffffff;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #ffffff;" target="_blank">Compra ahora con 20% de descuento</a></p>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-4" style="height:30px;line-height:30px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:20px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><span class="tinyMce-placeholder" style="word-break: break-word;">Sobre Nosotros</span></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="color:#ffffff;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:200%;text-align:left;mso-line-height-alt:28px;">
<p style="margin: 0;">Café La Esmeralda, con más de 40 años en Argentina, es un referente en la tostación de café. Con una mezcla de tradición e innovación, transforma granos seleccionados en una experiencia única. Cada taza refleja su compromiso con la calidad y pasión por ofrecer un café excepcional.</p>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:20px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>Contacto</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="color:#ffffff;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
<p style="margin: 0;">info@cafelaesmeralda.com.ar</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="social_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
<div align="left" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="72px">
<tr>
<td style="padding:0 4px 0 0;"><a href="https://www.facebook.com/cafelaesmeralda10" target="_blank"><img alt="Facebook" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/70b1ac3d-9ffa-4dc4-9366-d85552849045-facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"/></a></td>
<td style="padding:0 4px 0 0;"><a href="https://www.instagram.com/cafelaesmeralda/" target="_blank"><img alt="Instagram" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/35b916f5-9c67-4074-be98-031f323d7dfb-instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><!-- End -->
</body>
</html>
    `
}

export const sendEmailOrderCreated = (order: Order) => {
  if (order.user.role === 'Usuario') {
    return (
      `<!DOCTYPE html>
      <html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
      <title>Confirmación de Pedido</title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
      <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/>
      <style>
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }

        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }

        p {
          line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }

        .image_block img+div {
          display: none;
        }

        sup,
        sub {
          line-height: 0;
          font-size: 75%;
        }

        @media (max-width:660px) {

          .desktop_hide table.icons-inner,
          .social_block.desktop_hide .social-table {
            display: inline-block !important;
          }

          .icons-inner {
            text-align: center;
          }

          .icons-inner td {
            margin: 0 auto;
          }

          .image_block div.fullWidth {
            max-width: 100% !important;
          }

          .mobile_hide {
            display: none;
          }

          .row-content {
            width: 100% !important;
          }

          .stack .column {
            width: 100%;
            display: block;
          }

          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }

          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
      </style>
      </head>
      <body class="body" style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c; color: #000000; width: 640px; margin: 0 auto;" width="640">
      <tbody>
      <tr>
      <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
      <table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td class="pad">
      <div></div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 100%; margin: 0 auto;" width="640">
      <tbody>
      <tr>
      <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
      <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td class="pad" style="padding-left:40px;padding-right:40px;width:100%;">
      <div align="center" class="alignment" style="line-height:10px">
      <div class="fullWidth" style="max-width: 640px;"><img alt="La Esmeralda Café" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/213e1063-b081-4f90-a3b6-6524320ea386-esmeralda6.png" style="display: block; height: auto; border: 0; width: 100%;" title="La Esmeralda Café" width="640"/></div>
      </div>
      </td>
      </tr>
      </table>
      <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
      <tr>
      <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:30px;line-height:120%;text-align:center;mso-line-height-alt:36px;">
      <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #2b303a;"><strong>Gracias por tu pedido</strong></span></p>
      </div>
      </td>
      </tr>
      </table>
      <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
      <tr>
      <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:center;mso-line-height-alt:22.5px;">
      <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #808389;">¡Tu pedido ha sido procesado exitosamente! Aquí tienes los detalles:</span></p>
      </div>
      </td>
      </tr>
      </table>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
      <tbody>
      <!-- Detalle de la Reserva -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-top:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><strong>DETALLE DE LA RESERVA</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:left;">
                        <p style="margin: 0;"><strong>ID Reserva:</strong> ${order.id}</p>
                        <p style="margin: 0;"><strong>Nombre:</strong> ${order.user.name}</p>
                        <p style="margin: 0;"><strong>Email:</strong> ${order.user.email}</p>
                        <p style="margin: 0;"><strong>Teléfono:</strong> ${order.user.phone}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-3" role="presentation" width="100%">
                  <tr>
                    <td class="pad">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tr>
                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #F0F0F0;"> </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

      <!-- Producto 1 -->
      <tr>
        <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" width="100%" style="text-align: center;">
            <tr>
              <td style="width: 25%;">
                <img alt="${order.productsOrder[0].subproduct.product.description}" height="auto" src="${order.productsOrder[0].subproduct.product.imgUrl}" style="display: block; height: auto; border: 0; width: 100%;" title="${order.productsOrder[0].subproduct.product.description}" width="260"/>
              </td>
              <td style="width: 75%; padding-left: 10px;">
                <div style="color:#2b303a;font-family:Montserrat, sans-serif;font-size:16px;line-height:150%;">
                  <strong>${order.productsOrder[0].subproduct.product.description}</strong><br/>
                  <span style="font-size:14px;">Cantidad: ${order.productsOrder[0].quantity}</span><br/>
                  <span style="font-size:14px;">Descuento: ${order.productsOrder[0].subproduct.discount}%</span><br/>
                  <span style="font-size:16px;"><strong>$${order.productsOrder[0].subproduct.price}</strong></span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Producto 2 -->
      <tr>
        <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" width="100%" style="text-align: center;">
            <tr>
              <td style="width: 25%;">
                <img alt="${order.productsOrder[1].subproduct.product.description}" height="auto" src="${order.productsOrder[1].subproduct.product.imgUrl}" style="display: block; height: auto; border: 0; width: 100%;" title="${order.productsOrder[1].subproduct.product.description}" width="260"/>
              </td>
              <td style="width: 75%; padding-left: 10px;">
                <div style="color:#2b303a;font-family:Montserrat, sans-serif;font-size:16px;line-height:150%;">
                  <strong>${order.productsOrder[1].subproduct.product.description}</strong><br/>
                  <span style="font-size:14px;">Cantidad: ${order.productsOrder[1].quantity}</span><br/>
                  <span style="font-size:14px;">Descuento: ${order.productsOrder[1].subproduct.discount}%</span><br/>
                  <span style="font-size:16px;"><strong>$${order.productsOrder[1].subproduct.price}</strong></span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Producto 3 -->
      <tr>
        <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" width="100%" style="text-align: center;">
            <tr>
              <td style="width: 25%;">
                <img alt="${order.productsOrder[2].subproduct.product.description}" height="auto" src="${order.productsOrder[2].subproduct.product.imgUrl}" style="display: block; height: auto; border: 0; width: 100%;" title="${order.productsOrder[2].subproduct.product.description}" width="260"/>
              </td>
              <td style="width: 75%; padding-left: 10px;">
                <div style="color:#2b303a;font-family:Montserrat, sans-serif;font-size:16px;line-height:150%;">
                  <strong>${order.productsOrder[2].subproduct.product.description}</strong><br/>
                  <span style="font-size:14px;">Cantidad: ${order.productsOrder[2].quantity}</span><br/>
                  <span style="font-size:14px;">Descuento: ${order.productsOrder[2].subproduct.discount}%</span><br/>
                  <span style="font-size:16px;"><strong>$${order.productsOrder[2].subproduct.price}</strong></span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Producto 4 -->
      <tr>
        <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" width="100%" style="text-align: center;">
            <tr>
              <td style="width: 25%;">
                <img alt="${order.productsOrder[3].subproduct.product.description}" height="auto" src="${order.productsOrder[3].subproduct.product.imgUrl}" style="display: block; height: auto; border: 0; width: 100%;" title="${order.productsOrder[3].subproduct.product.description}" width="260"/>
              </td>
              <td style="width: 75%; padding-left: 10px;">
                <div style="color:#2b303a;font-family:Montserrat, sans-serif;font-size:16px;line-height:150%;">
                  <strong>${order.productsOrder[3].subproduct.product.description}</strong><br/>
                  <span style="font-size:14px;">Cantidad: ${order.productsOrder[3].quantity}</span><br/>
                  <span style="font-size:14px;">Descuento: ${order.productsOrder[3].subproduct.discount}%</span><br/>
                  <span style="font-size:16px;"><strong>$${order.productsOrder[3].subproduct.price}</strong></span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Total a Pagar -->
      <tr>
        <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" width="100%" style="text-align: center;">
            <tr>
              <td style="width: 100%; padding-left: 10px;">
                <div style="color:#2b303a;font-family:Montserrat, sans-serif;font-size:20px;line-height:150%;">
                  <strong>Total a pagar: $${order.orderDetail.totalPrice}</strong>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Detalle del Envío -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-top:35px;">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tr>
                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #F0F0F0;"> </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:15px;padding-top:35px;">
                      <div style="color:#555555;font-family:Montserrat, sans-serif;font-size:12px;line-height:150%;text-align:left;">
                        <p style="margin: 0;"><strong>DETALLE DEL ENVÍO</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" width="100%">
                  <tr>
                    <td class="pad">
                      <div style="color:#555555;font-family:Montserrat, sans-serif;font-size:13px;line-height:180%;text-align:left;">
                        <p style="margin: 0;">Dirección de envío: ${order.orderDetail.addressDelivery}</p>
                        <p style="margin: 0;">Fecha de entrega: ${new Date(order.orderDetail.deliveryDate).toLocaleDateString()}</p>
                        <p style="margin: 0;">Estado: ${order.orderDetail.transactions.status}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<!-- Pie de página -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://images.unsplash.com/photo-1690983330558-2e55b37e0449?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center; color: #ffffff; width: 640px; margin: 0 auto; padding-top: 50px;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; padding: 40px 0;" width="100%">
                
                <table border="0" cellpadding="0" cellspacing="0" class="social_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                  <tr>
                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:28px;text-align:center;">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                          <tr>
                            <td style="padding:0 10px 0 10px;"><a href="https://www.facebook.com/cafelaesmeralda10" target="_blank"><img alt="Facebook" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/3166120c-b0e6-4238-bec2-ed7752f11977-facebook2x.png" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>

                            <td style="padding:0 10px 0 10px;"><a href="https://www.instagram.com/cafelaesmeralda/" target="_blank"><img alt="Instagram" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/5caefc1b-a72f-498e-8217-cca11d15d0b1-instagram2x.png" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:15px;">
                      <div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;mso-line-height-alt:18px;">
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">La Esmeralda Café es una empresa tostadora de café con más de 40 años en la industria, dedicada a ofrecer el mejor café con la más alta calidad y pasión. Nuestro compromiso es llevar el sabor único y auténtico del café a cada rincón.</span></p>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tr>
                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #ffffff;"><span style="word-break: break-word;"> </span></td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;">
                      <div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">La Esmeralda Café Copyright © 2024</span></p>
                      </div>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </body>
      </html>`
    );

} 
return `<!DOCTYPE html>
<html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title>Confirmación de Pedido</title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/>
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			line-height: 0;
			font-size: 75%;
		}

		@media (max-width:660px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block div.fullWidth {
				max-width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
</style>
</head>
<body class="body" style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c; color: #000000; width: 640px; margin: 0 auto;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 100%; margin: 0 auto;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:40px;padding-right:40px;width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 640px;"><img alt="La Esmeralda Café" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/213e1063-b081-4f90-a3b6-6524320ea386-esmeralda6.png" style="display: block; height: auto; border: 0; width: 100%;" title="La Esmeralda Café" width="640"/></div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-top:50px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span style="word-break: break-word;"> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:30px;line-height:120%;text-align:center;mso-line-height-alt:36px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #2b303a;"><strong>Gracias por tu pedido</strong></span></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:center;mso-line-height-alt:22.5px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #808389;">¡Tu pedido ha sido procesado exitosamente! Aquí tienes los detalles:</span></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-top:60px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span style="word-break: break-word;"> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<!-- Detalle de la Reserva -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                  <tr>
                    <td class="pad" style="padding-top:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #aaacb0;"><strong><span style="word-break: break-word;">DETALLE DE LA RESERVA</span></strong></span></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #2b303a;"><strong>ID Reserva: ${order.id}</strong></span></p>
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #2b303a;"><strong>Nombre: ${order.user.name}</strong></span></p>
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #2b303a;"><strong>Email: ${order.user.email}</strong></span></p>
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #2b303a;"><strong>Teléfono: ${order.user.phone}</strong></span></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                  <tr>
                    <td class="pad">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tr>
                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #F0F0F0;"> </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- Detalle del Pedido -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <!-- Tarjeta para Café Mezcla -->
            <tr>
              <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="width: 100%; text-align: center;">
                  <tr>
                    <td style="width: 25%;">
                      <img alt="${order.productsOrder[0].subproduct.product.description}" height="auto" src="${order.productsOrder[0].subproduct.product.imgUrl}" style="display: block; height: auto; border: 0; width: 100%;" title="${order.productsOrder[0].subproduct.product.description}" width="260"/>
                    </td>
                    <td style="width: 75%; padding-left: 10px;">
                      <div style="color:#2b303a;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:150%;">
                        <strong>${order.productsOrder[0].subproduct.product.description}</strong><br/>
                        <span style="font-size:14px;">Cantidad: ${order.productsOrder[0].quantity}</span><br/>
                        <span style="font-size:14px;">Descuento: ${order.productsOrder[0].subproduct.discount}%</span><br/>
                        <span style="font-size:16px;"><strong>$${order.productsOrder[0].subproduct.price}</strong></span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Tarjeta para Portasobres -->
            <tr>
              <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="width: 100%; text-align: center;">
                  <tr>
                    <td style="width: 25%;">
                      <img alt="${order.productsOrder[1].subproduct.product.description}" height="auto" src="${order.productsOrder[1].subproduct.product.imgUrl}" style="display: block; height: auto; border: 0; width: 100%;" title="${order.productsOrder[1].subproduct.product.description}" width="260"/>
                    </td>
                    <td style="width: 75%; padding-left: 10px;">
                      <div style="color:#2b303a;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:150%;">
                        <strong>${order.productsOrder[1].subproduct.product.description}</strong><br/>
                        <span style="font-size:14px;">Cantidad: ${order.productsOrder[1].quantity}</span><br/>
                        <span style="font-size:14px;">Descuento: ${order.productsOrder[1].subproduct.discount}%</span><br/>
                        <span style="font-size:16px;"><strong>$${order.productsOrder[1].subproduct.price}</strong></span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Total a Pagar -->
            <tr>
              <td class="column" style="text-align: center; padding: 10px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="width: 100%; text-align: center;">
                  <tr>
                    <td style="width: 100%; padding-left: 10px;">
                      <div style="color:#2b303a;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:20px;line-height:150%;">
                        <strong>Total a pagar: $${order.orderDetail.totalPrice}</strong>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- Detalle de pago por transferencia -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="font-weight: 400; text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-top:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><strong>DETALLE DE PAGO POR TRANSFERENCIA</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><strong>Número de cuenta: 0011776-4 006-9</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>CUIT: 30-69917035-2</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>Razón Social: INTERCAFE SA</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>CBU: 0070006120000011776499</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>Alias: CAFELAESMERALDA</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-top:15px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><strong>Pago con Mercado Pago</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><strong>INTERCAFE S A</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>CVU: 0000003100037751602197</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>Alias: cafelaesmeralda.mp</strong></p>
                        <p style="margin: 0; word-break: break-word;"><strong>CUIT/CUIL: 30699170352</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Botón de Cargar Comprobante -->
                <table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="text-align:left;">
                      <div align="center" class="alignment">
                        <a href="${API_URL}/transfer/${order.id}" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#38B2AC;border-radius:4px;width:auto;border-top:1px solid #38B2AC;border-right:1px solid #38B2AC;border-bottom:1px solid #38B2AC;border-left:1px solid #38B2AC;padding-top:10px;padding-bottom:10px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;text-align:center;mso-border-alt:none;word-break:break-word;" target="_blank">
                          <span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;">
                            <span style="word-break: break-word;line-height: 32px;"><strong>Cargar Comprobante</strong></span>
                          </span>
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<!-- Detalle del Envío -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #fff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="font-weight: 400; text-align: left; padding-left: 30px; padding-right: 30px; vertical-align: top;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-top:35px;">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                          <tr>
                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #F0F0F0;"> </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:15px;padding-top:35px;">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;"><strong>DETALLE DEL ENVÍO</strong></p>
                      </div>
                    </td>
                  </tr>
                </table>

                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" width="100%">
                  <tr>
                    <td class="pad">
                      <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:13px;line-height:180%;text-align:left;">
                        <p style="margin: 0; word-break: break-word;">Dirección de envío: ${order.orderDetail.addressDelivery}</p>
                        <p style="margin: 0; word-break: break-word;">Fecha de entrega: ${new Date(order.orderDetail.deliveryDate).toLocaleDateString()}</p>
                        <p style="margin: 0; word-break: break-word;">Estado: ${order.orderDetail.transactions.status}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<!-- Pie de página -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; margin-top: 50px;">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://images.unsplash.com/photo-1690983330558-2e55b37e0449?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center; color: #ffffff; width: 640px; margin: 0 auto; padding-top: 50px;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; padding: 40px 0;" width="100%">
                
                <table border="0" cellpadding="0" cellspacing="0" class="social_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                  <tr>
                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:28px;text-align:center;">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                          <tr>
                            <td style="padding:0 10px 0 10px;"><a href="https://www.facebook.com/cafelaesmeralda10" target="_blank"><img alt="Facebook" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/3166120c-b0e6-4238-bec2-ed7752f11977-facebook2x.png" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>

                            <td style="padding:0 10px 0 10px;"><a href="https://www.instagram.com/cafelaesmeralda/" target="_blank"><img alt="Instagram" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/5caefc1b-a72f-498e-8217-cca11d15d0b1-instagram2x.png" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:15px;">
                      <div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;mso-line-height-alt:18px;">
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">La Esmeralda Café es una empresa tostadora de café con más de 40 años en la industria, dedicada a ofrecer el mejor café con la más alta calidad y pasión. Nuestro compromiso es llevar el sabor único y auténtico del café a cada rincón.</span></p>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
                      <div align="center" class="alignment">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                          <tr>
                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #ffffff;"><span style="word-break: break-word;"> </span></td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                  <tr>
                    <td class="pad" style="padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;">
                      <div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                        <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">La Esmeralda Café Copyright © 2024</span></p>
                      </div>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
  <tbody>
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 640px; margin: 0 auto;" width="640">
          <tbody>
            <tr>
              <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center; line-height: 0;" width="100%">
                  <tr>
                    <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                      <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; padding-left: 0px; padding-right: 0px;">
                        <tr>
                          <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;">
                          </td>
                          <td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center; line-height: normal;">
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<!-- End -->
</body>
</html>` }

export const sendEmailOrderPaid = (order: Order) => {
  
        return `<!DOCTYPE html>
<html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			line-height: 0;
			font-size: 75%;
		}

		@media (max-width:700px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>
<body class="body" style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="empty_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div></div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:70px;line-height:70px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 93px;"><img alt="Check Icon" height="auto" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4971/check-icon.png" style="display: block; height: auto; border: 0; width: 100%;" title="Check Icon" width="93"/></div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:25px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="color:#2f2f2f;font-family:Georgia,Times,'Times New Roman',serif;font-size:42px;line-height:120%;text-align:center;mso-line-height-alt:50.4px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Pago recibido</span></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:30px;padding-right:30px;padding-top:10px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Hola <strong><u>${order.user.name}</u></strong>,</span></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:30px;padding-right:30px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;"> </p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:30px;padding-right:30px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">Gracias por tu pago de $ <strong><span style="word-break: break-word;">${ order.orderDetail.totalPrice }</span></strong> el <strong><span style="word-break: break-word;">${new Date(order.orderDetail.transactions.timestamp).toLocaleDateString('es-ES', { dateStyle: 'long' })} a las ${new Date(order.orderDetail.transactions.timestamp).toLocaleTimeString('es-ES', { timeStyle: 'short' })}</span></strong></span></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
<p style="margin: 0; word-break: break-word;"> </p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;">Café La Esmeralda es una empresa tostadora de café con más de 40 años de experiencia.</span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;">Gracias por tu confianza.</span></p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; border-bottom: 20px solid #449674; border-left: 20px solid #449674; border-right: 20px solid #449674; border-top: 20px solid #449674; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:50px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:18px;letter-spacing:1px;line-height:120%;text-align:center;mso-line-height-alt:21.599999999999998px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>DETALLES DE LA ORDEN</strong></span></p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:20px;padding-top:10px;">
<div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:200%;text-align:right;mso-line-height-alt:32px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>ID de la Orden</strong></span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>Dirección de Entrega</strong></span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>Fecha de Entrega</strong></span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>Precio Total</strong></span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>Estado del Pago</strong></span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #000000;"><strong>ID de Confirmación</strong></span></p>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:200%;text-align:left;mso-line-height-alt:32px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${ order.id }</span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${order.orderDetail.addressDelivery}</span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${new Date(order.orderDetail.deliveryDate).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${ order.orderDetail.totalPrice }</span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${ order.orderDetail.transactions.status }</span></p>
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">${ order.orderDetail.transactions.id }</span></p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; border-radius: 0; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 340px;"><img height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/71ac2d6d-1070-4bf5-9d40-45ef63baa8a1-Captura%20de%20pantalla%202024-07-09%20151704.png" style="display: block; height: auto; border: 0; width: 100%;" width="340"/></div>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 340px;"><img height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/238e3379-bcab-4cbf-bb3b-412639bc57e4-esmeralda3.png" style="display: block; height: auto; border: 0; width: 100%;" width="340"/></div>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:20px;">
<div style="color:#2f2f2f;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:18px;line-height:120%;text-align:center;">
<p style="margin: 0;"><strong>Valoramos tu calificación de nuestros productos</strong></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="text-align:center;padding-bottom:20px;">
<a href="${API_URL}/dashboard/cliente/order/${order.id}" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#257453;border-radius:4px;width:auto;border-top:1px solid #257453;font-weight:400;border-right:1px solid #257453;border-bottom:1px solid #257453;border-left:1px solid #257453;padding-top:10px;padding-bottom:10px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-align:center;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break:break-word;line-height:32px;">Califícanos</span></span></a>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!-- Footer Section -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #449674; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 204px;"><img alt="Yourlogo Light" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/5a07410e-e306-4be7-922f-44ba0d0ba20a-logoblanco.png" style="display: block; height: auto; border: 0; width: 100%;" title="Yourlogo Light" width="204"/></div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="social_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="72px">
<tr>
<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/cafelaesmeralda10" target="_blank"><img alt="Facebook" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/e53a2db1-d5b9-4d9d-8fd8-81d240f6735c-facebook2x.png" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>
<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/cafelaesmeralda/" target="_blank"><img alt="Instagram" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/684583c8-d96e-4593-894e-e6e846809bb8-instagram2x.png" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#f9f9f9;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:12px;line-height:150%;text-align:center;mso-line-height-alt:18px;">
<p style="margin: 0; word-break: break-word;">C. Dr. Juan Felipe Aranguren 1528, C1406FWB Cdad. Autónoma de Buenos Aires, Argentina</p>
<p style="margin: 0; word-break: break-word;">info@cafelaesmeralda.com.ar</p>
<p style="margin: 0; word-break: break-word;"> </p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#cfceca;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
<p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">2024 © Todos los derechos reservados</span></p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><!-- End -->
</body>
</html> `
}

export const orderReminder = () => {
  return `<!DOCTYPE html>
<html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title>Recordatorio de Pedido Semanal</title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css"/>
<style>
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		padding: 0;
		background-color: #efd3b6;
		-webkit-text-size-adjust: none;
		text-size-adjust: none;
		color: #ffffff !important; /* Todas las letras son blancas */
	}

	a[x-apple-data-detectors] {
		color: inherit !important;
		text-decoration: inherit !important;
	}

	#MessageViewBody a {
		color: inherit;
		text-decoration: none;
	}

	p {
		line-height: inherit;
		color: #ffffff !important; /* Letras blancas en todos los párrafos */
	}

	.desktop_hide,
	.desktop_hide table {
		mso-hide: all;
		display: none;
		max-height: 0px;
		overflow: hidden;
	}

	.image_block img+div {
		display: none;
	}

	sup,
	sub {
		line-height: 0;
		font-size: 75%;
	}

	/* Color blanco para todo el texto */
	h1, h2, h3, h4, h5, h6, p, span, div {
		color: #ffffff !important;
	}

	/* Color blanco para el texto de los botones */
	.button a {
		color: #ffffff !important;
	}

	@media (max-width:700px) {
		.desktop_hide table.icons-inner,
		.social_block.desktop_hide .social-table {
			display: inline-block !important;
		}

		.icons-inner {
			text-align: center;
		}

		.icons-inner td {
			margin: 0 auto;
		}

		.image_block div.fullWidth {
			max-width: 100% !important;
		}

		.mobile_hide {
			display: none;
		}

		.row-content {
			width: 100% !important;
		}

		.stack .column {
			width: 100%;
			display: block;
		}

		.mobile_hide {
			min-height: 0;
			max-height: 0;
			max-width: 0;
			overflow: hidden;
			font-size: 0px;
		}

		.desktop_hide,
		.desktop_hide table {
			display: table !important;
			max-height: none !important;
		}

		.reverse {
			display: table;
			width: 100%;
		}

		.reverse .column.first {
			display: table-footer-group !important;
		}

		.reverse .column.last {
			display: table-header-group !important;
		}

		.row-11 td.column.first .border,
		.row-11 td.column.last .border,
		.row-3 td.column.first .border,
		.row-3 td.column.last .border,
		.row-6 td.column.first .border,
		.row-6 td.column.last .border {
			padding: 5px 0;
			border-top: 0;
			border-right: 0px;
			border-bottom: 0;
			border-left: 0;
		}
	}
</style>
</head>
<body class="body">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="background-color: #efd3b6;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="background-image: url('https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/7ade0731-2ef0-477f-bf04-0bf2b8336b23-bg_section_coffee.jpg'); background-position: center top; background-repeat: no-repeat;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="color: #ffffff; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="16.666666666666668%">
<div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;"> </div>
</td>
<td class="column column-2" style="padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="66.66666666666667%">
<div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;"> </div>
<div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" width="100%">
<tr>
<td class="pad" style="text-align:center;width:100%;">
<h1 style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">Hace tu Pedido Semanal</h1>
</td>
</tr>
</table>
<div class="spacer_block block-4" style="height:10px;line-height:10px;font-size:1px;"> </div>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-5" role="presentation" width="100%">
<tr>
<td class="pad">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:center;">
<p style="margin: 0;"><strong>¡Querido cliente!</strong></p>
<p style="margin: 0;">Te recordamos que esta semana puedes hacer tu pedido semanal en Café La Esmeralda. Seguí estos pasos:</p>
<p style="margin: 0;"> </p>
</div> 
</td> 
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-6" role="presentation" width="100%">
<tr>
<td class="pad">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:left;">
<p style="margin: 0;"><strong>1. Identifícate:</strong> Hace clic en el botón para iniciar sesión en tu cuenta.</p>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-8" role="presentation" width="100%">
<tr>
<td class="pad">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:left;">
<p style="margin: 0;"><strong>2. Hace tu pedido:</strong> Elige tu café favorito en nuestra tienda online.</p>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-10" role="presentation" width="100%">
<tr>
<td class="pad">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:left;">
<p style="margin: 0;"><strong>3. Realiza tu pago:</strong> Puedes pagar mediante transferencia bancaria, Mercado Pago o utilizando tu saldo en cuenta corriente.</p>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-11" role="presentation" width="100%">
<tr>
<td class="pad">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;line-height:150%;text-align:left;">
<p style="margin: 0;"><strong>4. Seguí el estado de tu pedido:</strong> Revisa tu cuenta para estar al tanto del estado de tu pedido.</p>
</div>
</td>
</tr>
</table>

<!-- Botón debajo del paso 4 -->
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-7" role="presentation" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<div style="background-color:#1a1423;border:1px solid #1A1423;border-radius:4px;display:inline-block;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;padding-bottom:5px;padding-top:5px;text-align:center;width:auto;">
  <a href="${API_URL}/login" style="color:#ffffff;text-decoration:none;">
    <span style="padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; line-height: 32px;">Iniciar Sesión</span>
  </a>
</div>
</div>
</td>
</tr>
</table>

<div class="spacer_block block-12" style="height:35px;line-height:35px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-13" role="presentation" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 385.333px;"><img alt="Coffee Mug" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/18c6e180-77ff-4c38-b3a6-02b98de3f7d9-coco_coffee.png" style="display: block; height: auto; border: 0; width: 100%;" title="Coffee Mug" width="385.333"/></div>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="0" cellspacing="0" class="image_block block-14" role="presentation" width="100%">
<tr>
<td class="pad" style="width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 453.3333333333333px;"><img height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/5a07410e-e306-4be7-922f-44ba0d0ba20a-logoblanco.png" style="display: block; height: auto; border: 0; width: 100%;" width="453.3333333333333"/></div>
</div>
</td>
</tr>
</table>

<div class="spacer_block block-15" style="height:60px;line-height:60px;font-size:1px;"> </div>

<!-- Pie de email -->
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="background-color: #000000;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-left:20px;text-align:center;width:100%;">
<h1 style="margin: 0; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;">Sobre Nosotros</h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:200%;text-align:left;">
<p style="margin: 0;">Café La Esmeralda, con más de 40 años en Argentina, es un referente en la tostación de café. Con una mezcla de tradición e innovación, transforma granos seleccionados en una experiencia única. Cada taza refleja su compromiso con la calidad y pasión por ofrecer un café excepcional.</p>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="50%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-left:20px;text-align:center;width:100%;">
<h1 style="margin: 0; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Contacto</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
<div style="font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;line-height:120%;text-align:left;">
<p style="margin: 0;">info@cafelaesmeralda.com.ar</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="social_block block-3" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
<div align="left" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" width="72px">
<tr>
<td style="padding:0 4px 0 0;"><a href="https://www.facebook.com/cafelaesmeralda10" target="_blank"><img alt="Facebook" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/70b1ac3d-9ffa-4dc4-9366-d85552849045-facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"/></a></td>
<td style="padding:0 4px 0 0;"><a href="https://www.instagram.com/cafelaesmeralda/" target="_blank"><img alt="Instagram" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/35b916f5-9c67-4074-be98-031f323d7dfb-instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

</body>
</html>
  `
}

export const sendPaymentBill = (imgUrl: string) => {
  return `<!DOCTYPE html>
<html lang="es" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/>
<style>
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
    }

    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
    }

    #MessageViewBody a {
        color: inherit;
        text-decoration: none;
    }

    p {
        line-height: inherit;
    }

    .desktop_hide,
    .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
    }

    .image_block img+div {
        display: none;
    }

    sup,
    sub {
        line-height: 0;
        font-size: 75%;
    }

    @media (max-width:660px) {

        .desktop_hide table.icons-inner,
        .social_block.desktop_hide .social-table {
            display: inline-block !important;
        }

        .icons-inner {
            text-align: center;
        }

        .icons-inner td {
            margin: 0 auto;
        }

        .image_block div.fullWidth {
            max-width: 100% !important;
        }

        .mobile_hide {
            display: none;
        }

        .row-content {
            width: 100% !important;
        }

        .stack .column {
            width: 100%;
            display: block;
        }

        .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
        }

        .desktop_hide,
        .desktop_hide table {
            display: table !important;
            max-height: none !important;
        }
    }
</style>
</head>
<body class="body" style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="background-color: #f8f8f9;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="background-color: #1aa19c;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #1aa19c; width: 640px; margin: 0 auto;" width="640">
<tbody>
<tr>
<td class="column column-1" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;"></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #f8f8f9; color: #000000; width: 640px; margin: 0 auto;" width="640">
<tbody>
<tr>
<td class="column column-1" width="100%">
<table border="0" cellpadding="20" cellspacing="0" class="divider_block block-1" role="presentation" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #fff; width: 640px; margin: 0 auto;" width="640">
<tbody>
<tr>
<td class="column column-1" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"></td>
</tr>
</table>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-left:40px;padding-right:40px;width:100%;">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 352px;"><img alt="I'm an image" height="auto" src="https://storage.googleapis.com/la-esmeralda-dc654.appspot.com/2f00ff3e-a7a3-4e88-b879-c9ee64663d4a-Img5_2x.jpg" style="display: block; height: auto; border: 0; width: 100%;" title="I'm an image" width="352"/></div>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-3" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-top:50px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"></td>
</tr>
</table>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:30px;line-height:120%;text-align:center;">
<p style="margin: 0; word-break: break-word;"><span style="color: #2b303a;"><strong>Gracias por su pago</strong></span></p>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-5" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:15px;line-height:150%;text-align:center;">
<p style="margin: 0;">Gracias por su compra. Adjunto encontrará su factura detallada. Si tiene alguna consulta o necesita asistencia, no dude en contactarnos. Apreciamos su confianza en nuestros productos y servicios.</p>
</div>
</td>
</tr>
</table>

<!-- Aquí va el botón reemplazado con el estilo del archivo -->
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-1" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;padding-top:40px;text-align:center;">
<div align="center" class="alignment">
<div style="background-color:#1aa19c;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:60px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;padding-bottom:15px;padding-top:15px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;">
<a href="${imgUrl}" style="color:#ffffff;text-decoration:none;padding-left:30px;padding-right:30px;" title="Descargar Factura"><strong>Descargar Factura</strong></a>
</div>
</div>
</td>
</tr>
</table>

<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-6" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-top:50px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"></td>
</tr>
</table>
</div>
</td>
</tr>
</table>

</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="background-color: #2b303a; width: 640px; margin: 0 auto;" width="640">
<tbody>
<tr>
<td class="column column-1" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-5" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:15px;">
<div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:150%;text-align:left;">
<p>Con más de 40 años de dedicación al arte de la tostación, Café La Esmeralda es el proveedor de confianza para los bares más reconocidos de Buenos Aires. Nuestra pasión por el café se refleja en cada grano, seleccionado de las mejores fincas de Colombia y Brasil, y tostado con precisión para ofrecer una experiencia única. Apostamos por la calidad y la tradición, convirtiendo cada taza en un viaje al corazón del café de especialidad.</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-6" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #555961;"></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-7" role="presentation" width="100%">
<tr>
<td class="pad" style="padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;">
<div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:12px;line-height:120%;text-align:left;">
<p>La Esmeralda Café © 2024</p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

</td>
</tr>
</tbody>
</table>
</body>
</html> `
}